const rosConfig = {
  rosNode: 'nodename',
  goToStation: ['topic/name', 'msg/type'],
  goToCharge: ['topic/name', 'msg/type'],
  pauseRobot: ['topic/name', 'msg/type'],
  resumeRobot: ['topic/name', 'msg/type'],
  statusMessage: ['topic/name', 'msg/type'],
  robotPosition: ['topic/name', 'msg/type'],
  batteryLevel: ['topic/name', 'msg/type']
};

module.exports = rosConfig;