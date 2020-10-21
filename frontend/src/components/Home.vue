<template>
  <div>
    <v-banner single-line>
      <v-icon slot="icon" color="success" size="36">mdi-access-point</v-icon>
      Status messages
    </v-banner>
    <v-container>
      <v-row class="row-height">
        <v-col class="d-flex justify-center align-center">
          <v-btn height="100%" width="100%" :color="stations[0].color+' lighten-2'"><span class="big-text">{{stations[0].name}}</span></v-btn>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <v-btn height="100%" width="100%" :color="stations[1].color+' lighten-2'"><span class="big-text">{{stations[1].name}}</span></v-btn>
        </v-col>
      </v-row>
      <v-row class="row-height">
        <v-col class="d-flex justify-center align-center">
          <v-btn height="100%" width="100%" :color="stations[2].color+' lighten-2'"><span class="big-text">{{stations[2].name}}</span></v-btn>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <v-btn height="100%" width="100%" :color="stations[3].color+' lighten-2'"><span class="big-text">{{stations[3].name}}</span></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div class="d-flex justify-space-around pb-8 pt-4">
      <v-btn height="100px" width="100px" x-large color="blue lighten-2"><v-icon>mdi-power-plug-outline</v-icon></v-btn>
      <v-btn height="100px" width="100px" x-large color="yellow lighten-1"><v-icon>mdi-pause</v-icon></v-btn>
      <v-btn height="100px" width="100px" x-large color="green lighten-2"><v-icon>mdi-play</v-icon></v-btn>
      <v-btn height="100px" width="100px" x-large color="pink lighten-2"><v-icon>mdi-cancel</v-icon></v-btn>
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
      stations: [
        {
          name: 'Station 1',
          color: 'red'
        },
        {
          name: 'Station 2',
          color: 'red'
        },
        {
          name: 'Station 3',
          color: 'red'
        },
        {
          name: 'Station 4',
          color: 'red'
        }
      ]
    }
  },
  sockets: {
    connect() {

    }
  },
  methods: {

  }
};
</script>

<style scoped>
.big-text {
  font-size: 2.5rem;
}
.row-height {
  height: 150px;
}
</style>