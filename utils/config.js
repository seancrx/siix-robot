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
    name: '1. Micro.b Lab',
    color: 'red'
  },
  {
    id: 2,
    name: '2. Reception',
    color: 'red'
  },
  {
    id: 3,
    name: '3. Blood Bank',
    color: 'red'
  },
  {
    id: 4,
    name: '4. Anatomic.p Lab',
    color: 'red'
  }
];

const timer = 600000;

module.exports = {rosConfig, names, timer};
