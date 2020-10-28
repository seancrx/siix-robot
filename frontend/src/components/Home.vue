<template>
  <div>
    <v-banner sticky>
      <h1><v-icon slot="icon" :color="connection ? 'success' : 'error'" size="36">mdi-access-point</v-icon>
      {{status}}</h1>
    </v-banner>
    <v-container>
      <v-row class="row-height">
        <v-col v-for="station in stations" :key="station.id" cols="6" class="d-flex justify-center align-center">
          <v-btn :disabled="isLocked" @click="goToStation(station.id)" height="100%" width="100%" :color="station.color+' lighten-2'"><span class="big-text">{{station.name}}</span></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div class="d-flex justify-space-around pb-8 pt-4">
      <v-card :disabled="isLocked" @click="goToCharge" height="100px" width="200px" x-large :class="{'card-disabled': isLocked}" :color="isLocked ? '' : 'blue lighten-2'" class="d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-power-plug-outline</v-icon>
        Origin/Charge
      </v-card>
      <v-card v-if="isLocked" @click="resumeRobot" height="100px" width="200px" x-large color="green lighten-2" class="d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-play</v-icon>
        {{remainingTime === 0 ? `Resume` : `Resume (${remainingTime})`}}
      </v-card>
      <v-card v-else @click="pauseRobot" height="100px" width="200px" x-large color="yellow lighten-2" class="d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">mdi-pause</v-icon>
        Pause
      </v-card>
    </div>
    <div class="pa-8 d-flex justify-center">
      <div class="mapCanvas" id="map"></div>
      <!-- <v-card color="black" height="300" dark class="d-flex justify-center align-center">Map</v-card> -->
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
      isLocked: false,
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
    this.sockets.subscribe('lock', data => {
      this.isLocked = data.lockState;
      this.remainingTime = data.time;
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
    pauseRobot() {
      this.$socket.emit('pause');
    },
    resumeRobot() {
      this.$socket.emit('resume');
    },
    cancelRobot() {
      this.$socket.emit('cancel');
    },
    actionHandler(method) {
      this[method]();
    },
    unlockButtons() {
      this.isLocked = false;
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
  },
  watch: {
    remainingTime() {
      if (this.remainingTime > 0) {
        setTimeout(() => this.remainingTime--, 1000);
      }
    }
  }
};
</script>

<style scoped>
.big-text {
  font-size: 2.5rem;
}
.row-height {
  height: 300px;
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