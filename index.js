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
let isLocked = false;
let countdown = 0;


// ========== Init express and socket.io ==========
const app = express();
const server = http.Server(app);
const io = socketio(server);

// Set static folder for frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Listen on a port
const PORT = process.env.PORT || 5020;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const WSPORT = process.env.WSPORT || 5001;
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
const rosGoToCharge = nh.advertise(rosConfig.goToCharge[0], rosConfig.goToCharge[1]);
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
const rosMissionComplete = nh.subscribe(rosConfig.missionComplete[0], rosConfig.missionComplete[1], (data) => {
  broadcastMissionComplete(data.data);
});


// ========== Socket.io ==========
io.on('connection', (socket) => {
  io.emit('station-names', names);
  io.emit('timer', timer);
  io.emit('lock', isLocked);
  io.emit('status-message', 'Starting up...');

  socket.on('client-station', station => newClient(socket.id, station));
  socket.on('to-station', station => toStation(station));
  socket.on('pause', () => pauseRobot());
  socket.on('resume', () => resumeRobot());
  socket.on('charge', () => toCharge());
  socket.on('cancel', () => cancelRobot());
  socket.on('disconnect', () => clientDisconnected(socket.id));
});
setInterval(() => {
  io.emit('battery', battery);
}, 2000);


// ========== Functions ==========
function broadcastStatusMessage(msg) {
  io.emit('status-message', msg);
}

function broadcastRobotPosition(pos) {
  io.emit('robot-pos', pos);
}

function broadcastBatteryLevel(bat) {
  battery = bat;
}

function broadcastMissionComplete(state) {
  isLocked = state === 1 ? true : false;
  io.emit('lock', isLocked);
  setTimeout(() => {
    isLocked = false;
    io.emit('lock', isLocked);
  }, timer.destination);
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
    } else {
      logger.error('Invalid station number requested.');
    }
  }
}

function pauseRobot() {
  ROS_UINT8.data = 1;
  rosPauseResumeRobot.publish(ROS_UINT8);
  isLocked = true;
  io.emit('lock', isLocked);
  setTimeout(() => {
    isLocked = false;
    io.emit('lock', isLocked);
  }, timer.pause);
}

function resumeRobot() {
  ROS_UINT8.data = 2;
  rosPauseResumeRobot.publish(ROS_UINT8);
  isLocked = false;
  io.emit('lock', isLocked);
}

function cancelRobot() {
  ROS_UINT8.data = 1;
  rosCancelRobot.publish(ROS_UNIT8);
}

function toCharge() {
  ROS_UINT8.data = 1;
  rosGoToCharge.publish(ROS_UINT8);
}

function clientDisconnected(id) {
  clients.filter(client => client.id !== id);
  io.emit('clients', clients);
}
