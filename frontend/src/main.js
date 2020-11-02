import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false

const socketHost = window.location.protocol + '//' + window.location.hostname + ':5021';
Vue.use(new VueSocketIO({
  connection: socketHost
}));

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
