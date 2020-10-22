<template>
  <div>
    <v-banner single-line>
      <h2><v-icon slot="icon" :color="connection ? 'success' : 'error'" size="36">mdi-access-point</v-icon>
      {{status}}</h2>
    </v-banner>
    <v-container>
      <v-row class="row-height">
        <v-col v-for="station in stations" :key="station.id" cols="6" class="d-flex justify-center align-center">
          <v-btn :disabled="isLocked" @click="goToStation(station.id)" height="100%" width="100%" :color="station.color+' lighten-2'"><span class="big-text">{{station.name}}</span></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div class="d-flex justify-space-around pb-8 pt-4">
      <v-card v-for="action in actions" :key="action.name" @click="actionHandler(action.method)" height="100px" width="100px" x-large :color="action.color+' lighten-2'" class="d-flex justify-center align-center flex-column action">
        <v-icon style="font-size:2rem;">{{action.icon}}</v-icon>
        {{action.name}}
      </v-card>
    </div>
    <div class="pa-8">
      <v-card color="black" height="300" dark class="d-flex justify-center align-center">Map</v-card>
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
      actions: [
        {
          name: 'Charge',
          icon: 'mdi-power-plug-outline',
          color: 'blue',
          method: 'goToCharge'
        },
        {
          name: 'Pause',
          icon: 'mdi-pause',
          color: 'yellow',
          method: 'pauseRobot'
        },
        {
          name: 'Resume',
          icon: 'mdi-play',
          color: 'green',
          method: 'resumeRobot'
        },
        {
          name: 'Cancel',
          icon: 'mdi-cancel',
          color: 'pink',
          method: 'cancelRobot'
        },
      ]
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
    this.sockets.subscribe('lock', state => {
      this.isLocked = state;
    });
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
</style>