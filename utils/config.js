const rosConfig = {
  rosNode: 'nodename',
  goToStation: ['/mission', 'std_msgs/UInt8'],
  goToCharge: ['/charge', 'std_msgs/Bool'],
  pauseResumeRobot: ['/pause', 'std_msgs/Bool'],
  statusMessage: ['/mission_status', 'std_msgs/String'],
  robotPosition: ['/tf_pose', 'geometry_msgs/Pose'],
  batteryLevel: ['/battery', 'std_msgs/UInt8'],
  missionComplete: ['/mission_complete', 'std_msgs/Bool']
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
