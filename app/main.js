import Vue from 'nativescript-vue'
import App from './components/App'
const http = require('http');

// import VueDevtools from 'nativescript-vue-devtools';

if(TNS_ENV !== 'production') {
  // Vue.use(VueDevtools, { host: '10.1.1.204:8098' });
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');
Vue.prototype.$http = http;

Vue.registerElement('VideoPlayer', () => require('nativescript-videoplayer').Video);
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);

new Vue({
  render: h => h('frame', [h(App)]),
}).$start();
