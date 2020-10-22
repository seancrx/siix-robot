<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      height="60"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Siix Agt"
          class="shrink"
          contain
          min-width="100"
          src="./assets/logo.webp"
          width="200"
        />
      </div>
      <v-spacer></v-spacer>
      <v-icon>{{batteryIcon}}</v-icon>{{battery}}%
    </v-app-bar>

    <v-main>
      <Home/>
    </v-main>
  </v-app>
</template>

<script>
import Home from './components/Home';

export default {
  name: 'App',
  components: {
    Home,
  },
  sockets: {
    connect() {
    },
  },
  mounted() {
    this.sockets.subscribe('battery', bat => {
      this.battery = bat;
    });
  },
  data: () => {
    return {
      battery: 100,
      batteryIcon: 'mdi-battery'
    }
  },
  watch: {
    battery() {
      if (this.battery === 100) {
        this.batteryIcon = 'mdi-battery'
      } else if (this.battery < 10) {
        this.batteryIcon = 'mdi-battery-outline';
      } else {
        this.batteryIcon = `mdi-battery-${Math.floor(this.battery/10)}0`
      }
    }
  }
};
</script>
