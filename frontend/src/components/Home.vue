<template>
  <div>
    <v-banner sticky>
      <h1><v-icon slot="icon" :color="connection ? 'success' : 'error'" size="36">mdi-access-point</v-icon>
      {{status}}</h1>
    </v-banner>
    <v-container>
      <v-row class="row-height">
        <v-col v-for="station in stations" :key="station.id" cols="6" class="d-flex justify-center align-center">
          <v-btn :disabled="locks.stationsIsLocked" @click="goToStation(station.id)" height="100%" width="100%" :color="station.color+' lighten-2'"><span class="big-text">{{station.name}}</span></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div class="d-flex flex-wrap justify-space-around pb-4 pt-4">
      <!-- <v-card :disabled="locks.stationIsLocked" @click="goToStation(5)" height="100px" min-width="200px" x-large :class="{'card-disabled': locks.stationsIsLocked}" :color="locks.stationsIsLocked ? '' : 'blue lighten-2'" class="ma-2 d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-power-plug-outline</v-icon>
        Origin/Charge
      </v-card> -->
      <v-card @click="abortRobot" height="80px" min-width="150px" x-large color="error" class="pa-2 ma-2 d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-cancel</v-icon>
        Abort
      </v-card>
      <v-card :disabled="locks.opIsLocked" v-if="!locks.opIsPaused" @click="resumeOperation" height="80px" min-width="150px" x-large :class="{'card-disabled': locks.opIsLocked}" :color="locks.opIsLocked ? '' : 'green lighten-3'" class="pa-2 ma-2 d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-play</v-icon>
        {{remainingTime === 0 ? `Operation Resume` : `Operation Resume (${fmtMSS(remainingTime)})`}}
      </v-card>
      <v-card :disabled="locks.opIsLocked" v-else @click="pauseOperation" height="80px" min-width="150px" x-large :class="{'card-disabled': locks.opIsLocked}" :color="locks.opIsLocked ? '' : 'yellow lighten-2'" class="pa-2 ma-2 d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-pause</v-icon>
        Operation Pause
      </v-card>
      <v-card :disabled="locks.robotIsLocked" v-if="!locks.robotIsPaused" @click="resumeRobot" height="80px" min-width="150px" x-large :class="{'card-disabled': locks.robotIsLocked}" :color="locks.robotIsLocked ? '' : 'green lighten-3'" class="pa-2 ma-2 d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-play</v-icon>
        Robot Resume
      </v-card>
      <v-card :disabled="locks.robotIsLocked" v-else @click="pauseRobot" height="80px" min-width="150px" x-large :class="{'card-disabled': locks.robotIsLocked}" :color="locks.robotIsLocked ? '' : 'yellow lighten-2'" class="pa-2 ma-2 d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-pause</v-icon>
        Robot Pause
      </v-card>
    </div>
    <div class="d-flex justify-center">
      <div class="mapCanvas" id="map"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      connection: false,
      status: '',
      stations: [],
      timer: {},
      locks: {},
      timerStarts: false,
      remainingTime: 0
    }
  },
  sockets: {
    connect() {
      this.connection = true;
    },
    disconnect() {
      this.connection = false;
    }
  },
  mounted() {
    this.sockets.subscribe('station-names', names => {
      this.stations = names;
    });
    this.sockets.subscribe('timer', timer => {
      this.timer = timer;
    });
    this.sockets.subscribe('status-message', msg => {
      this.status = msg;
    });
    this.sockets.subscribe('locks', data => {
      this.locks = data.locks;
      this.timerStarts = data.timer;
    });
    this.sockets.subscribe('countdown', countdown => {
      this.remainingTime = countdown;
    });
    this.initMap();
  },
  methods: {
    goToStation(station) {
      this.$socket.emit('to-station', station);
    },
    goToCharge() {
      this.$socket.emit('charge');
    },
    pauseOperation() {
      this.$socket.emit('pause');
    },
    resumeOperation() {
      this.$socket.emit('resume');
    },
    pauseRobot() {
      this.$socket.emit('pause-robot');
    },
    resumeRobot() {
      this.$socket.emit('resume-robot');
    },
    abortRobot() {
      this.$socket.emit('abort-robot');
    },
    actionHandler(method) {
      this[method]();
    },
    unlockButtons() {
      this.isLocked = false;
    },
    fmtMSS(s) {
      return(s-(s%=60))/60+(9<s?':':':0')+s;
    },
    initMap() {
      var ros = new ROSLIB.Ros({
          url:  'ws://' + window.location.hostname + ':9090'
      });
      var viewer = new ROS2D.Viewer({
          divID: 'map',
          width: 600,
          height: 500
      });
      var gridClient = new ROS2D.OccupancyGridClient({
          ros: ros,
          rootObject: viewer.scene,
          continuous: true
      });
      gridClient.on('change', function () {
          viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
          viewer.shift(gridClient.currentGrid.pose.position.x * 1, gridClient.currentGrid.pose.position.y);
      });
      var robotMarker = new ROS2D.NavigationArrow({
          size: 0.05,
          strokeSize: 0.5,
          pulse: true,
          strokeColor: createjs.Graphics.getRGB(254, 0, 0),
          fillColor: createjs.Graphics.getRGB(254, 0, 0)
      });
      var poseTopic = new ROSLIB.Topic({
          ros: ros,
          name: '/amcl_pose',
          messageType: 'geometry_msgs/PoseWithCovarianceStamped'
      });
      poseTopic.subscribe(function (posewithc) {
          var pose = posewithc.pose.pose;
          robotMarker.x = pose.position.x;
          robotMarker.y = -pose.position.y;
      });
      gridClient.rootObject.addChild(robotMarker);
    }
  }
};
</script>

<style>
.v-btn__content {
  width: 100%;
}
.big-text {
  font-size: 1.7rem;
  white-space: normal;
}
.row-height {
  height: 250px;
}
.action {
  font-size: 1.5rem;
}
.card-disabled {
  background-color: rgba(0, 0, 0, .12)!important;
  color: rgba(0, 0, 0, .26)!important;
}
.mapCanvas {
  overflow: auto;
}
</style>