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
      <v-icon>mdi-battery-60</v-icon>60%
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

  data: () => ({
    //
  }),
};
</script>
