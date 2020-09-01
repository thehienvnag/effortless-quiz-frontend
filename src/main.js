import Vue from "vue";
import App from "./App.vue";
import "./plugins/ant-design-vue.js";
import router from "./router";
import Store from "./store/Store";

Vue.config.productionTip = false;

new Vue({
  router,
  store: Store,
  render: (h) => h(App),
}).$mount("#app");
