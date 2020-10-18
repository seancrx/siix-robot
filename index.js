// ========== NPM Package ==========
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
// const rosnodejs = require('rosnodejs');


// ========== ROS Package ==========
// const std_msgs = rosnodejs.require('std_msgs').msg;


// ========== Utils ==========
global.appRoot = path.resolve(__dirname);
const rosConfig = require('./utils/rosConfig');
const { logger, getLogs } = require('./utils/logger');
const names = require('./utils/stationConfig');


// ========== Variables ==========
let clients = []; // {id: '', station: 'station1'}
let battery = 100;
let isLocked = false;


// ========== Init express and socket.io ==========
const app = express();
const server = http.Server(app);
const io = socketio(server);

// Set static folder for frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const WSPORT = process.env.WSPORT || 5001;
server.listen(WSPORT, () => console.log(`WS started on port ${WSPORT}`));


// ========== Setup ROS ==========
// rosnodejs.initNode(rosConfig.rosNode).then(() => {
//   console.log('ROS node started');
// });
// const nh = rosnodejs.nh;

// Create ROS message object
// const ROS_BOOL = new std_msgs.Bool();
// const ROS_UINT8 = new std_msgs.UInt8();

// Subscriber and advertiser
// const rosGoToStation = nh.advertise(rosConfig.goToStation[0], rosConfig.goToStation[1]);
// const rosGoToCharge = nh.advertise(rosConfig.goToCharge[0], rosConfig.goToCharge[1]);
// const rosPauseRobot = nh.advertise(rosConfig.pauseRobot[0], rosConfig.pauseRobot[1]);
// const rosResumeRobot = nh.advertise(rosConfig.resumeRobot[0], rosConfig.resumeRobot[1]);
// const rosStatusMessage = nh.subscribe(rosConfig.statusMessage[0], rosConfig.statusMessage[1], (data) => {
//   broadcastStatusMessage(data.data);
// });
// const rosRobotPosition = nh.subscribe(rosConfig.robotPosition[0], rosConfig.robotPosition[1], (data) => {
//   broadcastRobotPosition(data.data);
// });
// const rosBatteryLevel = nh.subscribe(rosConfig.batteryLevel[0], rosConfig.batteryLevel[1], (data) => {
//   broadcastBatteryLevel(data.data);
// });


// ========== Socket.io ==========
io.on('connection', (socket) => {
  io.emit('station-names', names);

  socket.on('client-station', station => newClient(socket.id, station));
  socket.on('to-station', station => toStation(station));
  socket.on('pause', () => pauseRobot());
  socket.on('resume', () => resumeRobot());
  socket.on('charge', () => toCharge());
  socket.on('disconnect', () => clientDisconnected(socket.id));
});


// ========== Functions ==========
function broadcastStatusMessage(msg) {
  io.emit('status-message', msg);
}

function broadcastRobotPosition(pos) {
  io.emit('robot-pos', pos);
}

function broadcastBatteryLevel(bat) {
  io.emit('battery', bat);
}

function newClient(id, station) {
  clients.push({ id: id, station: station });
  io.emit('clients', clients);
}

function toStation(station) {
  // switch (station) {
  //   case station1:
  //     ROS_UINT8.data = 1;
  //     break;
  //   case station2:
  //     ROS_UINT8.data = 2;
  //     break;
  //   case station3:
  //     ROS_UINT8.data = 3;
  //     break;
  //   case station4:
  //     ROS_UINT8.data = 4;
  //     break;
  //   default:
  //     logger.error('Invalid station number requested.');
  //     break;
  // }
  // rosGoToStation.publish(ROS_UINT8);
}

function pauseRobot() {
  // ROS_UINT8.data = 2;
  // rosPauseRobot.publish(ROS_UINT8);
}

function resumeRobot() {
  // ROS_UINT8 = 1;
  // rosResumeRobot.publish(ROS_UINT8);
}

function toCharge() {
  // ROS_UINT8 = 1;
  // rosGoToCharge.publish(ROS_UINT8);
}

function clientDisconnected(id) {
  clients.filter(client => client.id !== id);
  io.emit('clients', clients);
}