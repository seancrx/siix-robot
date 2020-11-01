// ========== NPM Package ==========
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const rosnodejs = require('rosnodejs');


// ========== ROS Package ==========
const std_msgs = rosnodejs.require('std_msgs').msg;


// ========== Utils ==========
global.appRoot = path.resolve(__dirname);
const { logger, getLogs } = require('./utils/logger');
const {rosConfig, names, timer} = require('./utils/config');


// ========== Variables ==========
let clients = []; // {id: '', station: 'station1'}
let battery = 100;
let locks = {
  opIsLocked: false, // true = locked, false = unlock
  opIsPaused: false, // true = show paused, false = show resume
  robotIsLocked: true,
  robotIsPaused: true,
  stationsIsLocked: false
};
let countdown = 0;
let timeoutEvent = undefined;
let countdownEvent = undefined;


// ========== Init express and socket.io ==========
const app = express();
const server = http.Server(app);
const io = socketio(server);

// Set static folder for frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Listen on a port
const PORT = process.env.PORT || 5020;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const WSPORT = process.env.WSPORT || 5021;
server.listen(WSPORT, () => console.log(`WS started on port ${WSPORT}`));


// ========== Setup ROS ==========
rosnodejs.initNode(rosConfig.rosNode).then(() => {
  console.log('ROS node started');
});
const nh = rosnodejs.nh;

// Create ROS message object
const ROS_BOOL = new std_msgs.Bool();
const ROS_UINT8 = new std_msgs.UInt8();

// Subscriber and advertiser
const rosGoToStation = nh.advertise(rosConfig.goToStation[0], rosConfig.goToStation[1]);
const rosPauseResumeRobot = nh.advertise(rosConfig.pauseResumeRobot[0], rosConfig.pauseResumeRobot[1]);
const rosStatusMessage = nh.subscribe(rosConfig.statusMessage[0], rosConfig.statusMessage[1], (data) => {
  broadcastStatusMessage(data.data);
});
const rosRobotPosition = nh.subscribe(rosConfig.robotPosition[0], rosConfig.robotPosition[1], (data) => {
  broadcastRobotPosition(data.data);
});
const rosBatteryLevel = nh.subscribe(rosConfig.batteryLevel[0], rosConfig.batteryLevel[1], (data) => {
  broadcastBatteryLevel(data.data);
});
const rosMission = nh.subscribe(rosConfig.mission[0], rosConfig.mission[1], (data) => {
  handleMissionStatus(data.data);
});


// ========== Socket.io ==========
io.on('connection', (socket) => {
  io.emit('station-names', names);
  io.emit('timer', timer);
  io.emit('locks', {locks: locks, timer: true});
  io.emit('status-message', 'Hello humans.');

  socket.on('client-station', station => newClient(socket.id, station));
  socket.on('to-station', station => toStation(station));
  socket.on('pause', () => pauseOperation());
  socket.on('resume', () => resumeOperation());
  socket.on('pause-robot', () => pauseRobot());
  socket.on('resume-robot', () => resumeRobot());
  socket.on('abort-robot', () => abortRobot());
  socket.on('charge', () => toCharge());
  socket.on('disconnect', () => clientDisconnected(socket.id));
});
setInterval(() => {
  io.emit('battery', battery);
}, 2000);


// ========== Functions ==========
function handleMissionStatus(data) {
  switch (data) {
    case 0:
      broadcastMissionCompleted();
      break;
    case 2:
      broadcastMissionPaused();
      break;
    case 3:
      broadcastMissionRunning();
      break;
    case 4:
      broadcastMissionIdle();
      break;
    default:
      console.error('Invalid mission code.')
      break;
  }
}

function broadcastStatusMessage(msg) {
  io.emit('status-message', msg);
}

function broadcastRobotPosition(pos) {
  io.emit('robot-pos', pos);
}

function broadcastBatteryLevel(bat) {
  battery = bat;
}

function broadcastMissionCompleted() {
  locks = {
    opIsLocked: false,
    opIsPaused: false,
    robotIsLocked: true,
    robotIsPaused: true,
    stationsIsLocked: true
  };
  io.emit('locks', {locks: locks, timer: true});
  startLockTimer();
}

function broadcastMissionPaused() {
  locks = {
    opIsLocked: true,
    opIsPaused: false,
    robotIsLocked: false,
    robotIsPaused: false,
    stationsIsLocked: true
  };
  io.emit('locks', {locks: locks, timer: false});
}

function broadcastMissionRunning() {
  locks = {
    opIsLocked: true,
    opIsPaused: false,
    robotIsLocked: false,
    robotIsPaused: true,
    stationsIsLocked: true
  };
  io.emit('locks', {locks: locks, timer: false});
}

function broadcastMissionIdle() {

}

function newClient(id, station) {
  clients.push({ id: id, station: station });
  io.emit('clients', clients);
}

function toStation(station) {
  if (!isLocked) {
    if (names.filter(name => name.id === station).length !== 0) {
      ROS_UINT8.data = station;
      rosGoToStation.publish(ROS_UINT8);
      isLocked = true;
      io.emit('lock', {lockState: isLocked, time: 0});
    } else {
      logger.error('Invalid station number requested.');
    }
  }
}

function pauseOperation() {
  locks = {
    ...locks,
    opIsPaused: false
  };
  io.emit('locks', {locks: locks, timer: true});
  startLockTimer();
}

function resumeOperation() {
  clearInterval(countdownEvent);
  clearTimeout(timeoutEvent);
  locks = {
    ...locks,
    opIsPaused: true
  };
  io.emit('locks', {locks: locks, timer: false});
}

function pauseRobot() {
  ROS_UINT8.data = 2;
  rosPauseResumeRobot.publish(ROS_UINT8);
}

function resumeRobot() {
  ROS_UINT8.data = 3;
  rosPauseResumeRobot.publish(ROS_UINT8);
}

function abortRobot() {
  ROS_UINT8.data = 4;
  rosPauseResumeRobot.publish(ROS_UINT8);
}

function toCharge() {
  ROS_UINT8.data = 5;
  rosGoToStation.publish(ROS_UINT8);
}

function clientDisconnected(id) {
  clients.filter(client => client.id !== id);
  io.emit('clients', clients);
}

function startLockTimer() {
  countdownEvent = setInterval(() => {
    countdown--;
    io.emit('countdown', countdown);
  }, 1000);
  timeoutEvent = setTimeout(() => {
    locks = {
      ...locks,
      opIsPaused: true,
      stationsIsLocked: false
    };
    io.emit('locks', {locks: locks, timer: false});
    countdown = 0;
    io.emit('countdown', countdown);
  }, timer);
}