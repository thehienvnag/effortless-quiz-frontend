<template>
  <a-popover placement="bottom" class="user-section">
    <template slot="content">
      <!-- <p>Content</p> -->
      <a-button icon="logout" @click="handleLogout" :loading="logoutLoading"
        >Log Out</a-button
      >
    </template>
    <template slot="title">
      <span>Account</span>
    </template>
    <a-button type="secondary" class="user-btn" style="height: 40px">
      <div class="user-alias">
        <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
          {{ nameAlias }}
        </a-avatar>
        <h3>{{ userLoggedIn.name }}</h3>
      </div>
    </a-button>
  </a-popover>
</template>

<script>
import Vue from "vue";
import { actionTypes } from "../../store/actions/userAction";
import { Avatar, Button, Popover } from "ant-design-vue";
Vue.use(Popover);
Vue.use(Avatar);
Vue.use(Button);

export default {
  data() {
    return {
      logoutLoading: false,
    };
  },
  props: ["userLoggedIn"],
  computed: {
    nameAlias: function() {
      const name = this.userLoggedIn.name.split(" ");
      return name[name.length - 1].charAt(0);
    },
  },
  methods: {
    async handleLogout() {
      this.logoutLoading = true;
      await this.$store.dispatch(actionTypes.logUserOut);
      this.logoutLoading = true;
      this.$store.replaceState({
        userStore: { currentUser: null, userList: null },
        quizStore: { quizzes: [] },
        questionStore: { questionList: [], currentHighestPos: 0 },
      });
      this.$router.push("/home");
    },
  },
};
</script>

<style lang="less">
.user-section {
  display: block;
  margin-bottom: 5px;
  margin-left: auto;
  .user-alias {
    display: flex;
    align-items: center;
    h3 {
      margin-bottom: 0;
      margin-left: 5px;
    }
  }
}
</style>
