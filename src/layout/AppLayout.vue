<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <!-- <a-layout-sider
      v-if="!isAttemptRoute"
      v-model="collapsed"
      collapsible
      @collapse="handleCollapse"
    >
      <a-side-bar :collapsed="collapsed"></a-side-bar>
    </a-layout-sider>
    <a-layout> </a-layout> -->
    <a-layout-header
      class="header"
      theme="light"
      :style="{ position: 'fixed', top: 0, width: '100%', zIndex: 6 }"
    >
      <a-header-menu></a-header-menu>
    </a-layout-header>
    <a-layout-content
      :style="{ backgroundColor: '#1abc9c', marginTop: '60px' }"
    >
      <router-view />
    </a-layout-content>
    <a-layout-footer
      :style="{
        textAlign: 'center',
        backgroundColor: 'white',
        borderTop: '1px solid #e8e8e8',
      }"
    >
      Effortless Quiz ©2018 Created by HienHT
    </a-layout-footer>
  </a-layout>
</template>

<script>
import Vue from "vue";
import { Layout, Menu, Icon, Breadcrumb } from "ant-design-vue";
Vue.use(Layout)
  .use(Icon)
  .use(Menu)
  .use(Breadcrumb);
export default {
  data() {
    return {
      collapsed: false,
      logoutLoading: false,
    };
  },
  computed: {
    userLoggedIn: function() {
      return this.$store.state.userStore.currentUser;
    },
    isAttemptRoute() {
      return this.$route.name.toString() === "TakeQuiz";
    },
  },
  components: {
    //"a-side-bar": () => import("../layout/SideBar"),
    "a-header-menu": () => import("../components/header/HeaderMenu"),
  },
  watch: {
    userLoggedIn: function() {
      if (this.userLoggedIn) {
        this.userDropdown = () => import("../components/header/UserDropdown");
      } else {
        this.userDropdown = () => import("../components/header/HeaderMenu");
      }
    },
  },
  methods: {
    handleCollapse() {},
  },
};
</script>

<style lang="less">
.logo {
  margin: 1.5em 0.6em;
  font-size: 1.2em;
  color: white;
  text-align: center;
  img {
    width: 40px;
  }
  span {
    margin-left: 5px;
    padding-top: 7px;
  }
}
.header {
  padding: 0;
}
</style>
