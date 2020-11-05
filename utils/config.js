const rosConfig = {
  rosNode: 'KTPH_AIV',
  goToStation: ['/goal', 'std_msgs/UInt8'],
  pauseResumeRobot: ['/ui_robot_pra', 'std_msgs/UInt8'],
  statusMessage: ['/mission_status', 'std_msgs/String'],
  batteryLevel: ['/robot_battery_percent', 'std_msgs/Float64'],
  mission: ['/mrccc_status_ui', 'std_msgs/UInt8']
};

const names = [
  {
    id: 1,
    name: 'Micro.b Lab',
    color: 'red'
  },
  {
    id: 3,
    name: 'Reception',
    color: 'red'
  },
  {
    id: 4,
    name: 'Blood Bank',
    color: 'red'
  },
  {
    id: 6,
    name: 'Anatomic.p Lab',
    color: 'red'
  },
  {
    id: 5,
    name: 'Charge',
    color: 'blue'
  },
  {
    id: 2,
    name: 'Stand By',
    color: 'blue'
  }
];

const timer = 600000;

module.exports = {rosConfig, names, timer};
