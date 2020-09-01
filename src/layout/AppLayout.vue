<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider
      v-if="!isAttemptRoute"
      v-model="collapsed"
      collapsible
      @collapse="handleCollapse"
    >
      <a-side-bar :collapsed="collapsed"></a-side-bar>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header" theme="light">
        <a-header-menu></a-header-menu>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <router-view />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
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
    "a-side-bar": () => import("../layout/SideBar"),
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
