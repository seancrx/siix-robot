const rosConfig = {
  rosNode: 'nodename',
  goToStation: ['topic/name', 'msg/type'],
  goToCharge: ['topic/name', 'msg/type'],
  pauseResumeRobot: ['topic/name', 'msg/type'],
  statusMessage: ['topic/name', 'msg/type'],
  robotPosition: ['topic/name', 'msg/type'],
  batteryLevel: ['topic/name', 'msg/type'],
  missionComplete: ['topic/name', 'msg/type']
};

const names = [
  {
    id: 1,
    name: 'Station 1',
    color: 'red'
  },
  {
    id: 2,
    name: 'Station 2',
    color: 'red'
  },
  {
    id: 3,
    name: 'Station 3',
    color: 'red'
  },
  {
    id: 4,
    name: 'Station 4',
    color: 'red'
  }
];

const timer = {
  pause: 6000000,
  destination: 30000
};

module.exports = {rosConfig, names, timer};