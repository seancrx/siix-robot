<template>
  <div>
    <v-banner single-line>
      <v-icon slot="icon" color="success" size="36">mdi-access-point</v-icon>
      Status messages
    </v-banner>
    <div class="d-flex justify-space-around pt-8 pb-4">
      <v-btn x-large color="red lighten-2">Station 1</v-btn>
      <v-btn x-large color="red lighten-2">Station 2</v-btn>
    </div>
    <div class="d-flex justify-space-around pb-8 pt-4">
      <v-btn x-large color="red lighten-2">Station 3</v-btn>
      <v-btn x-large color="red lighten-2">Station 4</v-btn>
    </div>
    <div class="d-flex justify-space-around pb-8 pt-4">
      <v-btn fab x-large color="blue lighten-2" dark><v-icon>mdi-power-plug-outline</v-icon></v-btn>
      <v-btn fab x-large color="yellow lighten-1" dark><v-icon>mdi-pause</v-icon></v-btn>
      <v-btn fab x-large color="green lighten-2" dark><v-icon>mdi-play</v-icon></v-btn>
    </div>
    <div class="pa-8">
      <v-card color="black" height="300" dark class="d-flex justify-center align-center">Map</v-card>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>