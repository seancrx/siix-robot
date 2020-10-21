import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import socketio from 'socket.io';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false

const socketHost = window.location.protocol + '//' + window.location.hostname + ':5001';
export const SocketInstance = socketio(socketHost);
Vue.use(VueSocketIO, SocketInstance);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
