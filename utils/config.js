const rosConfig = {
  rosNode: 'nodename',
  goToStation: ['/goal', 'std_msgs/UInt8'],
  pauseResumeRobot: ['/ui_robot_pra', 'std_msgs/UInt8'],
  statusMessage: ['/mission_status', 'std_msgs/String'],
  batteryLevel: ['/merlin/battery_voltage', 'std_msgs/Float64'],
  mission: ['/mrccc_status_ui', 'std_msgs/UInt8']
};

const names = [
  {
    id: 1,
    name: '1. Micro Lab',
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
    name: '4. Special Lab',
    color: 'red'
  }
];

const timer = 6000000;

module.exports = {rosConfig, names, timer};
