<template>
  <div class="height-100">
    <a-menu class="height-100 text-right" theme="light" mode="horizontal">
      <a-menu-item key="mail" v-if="studentAllowed">
        <router-link to="/take-quiz"
          ><a-icon type="select" />Join Quiz Now - For Student</router-link
        >
      </a-menu-item>
      <a-menu-item key="key">
        <user-dropdown
          v-if="currentUser"
          :userLoggedIn="currentUser"
        ></user-dropdown>
        <form-section v-else></form-section>
      </a-menu-item>
      <!-- <a-menu-item key="key">
        <a-button icon="login" type="primary" @click="showModal">
          LOGIN
        </a-button>
        <a-modal
          width="320px"
          v-model="visible"
          :title="modalTitle"
          :footer="modalFooter"
          @ok="handleOk"
        >
          <a-login-form
            v-if="isLoginView"
            :changeView="changeView"
          ></a-login-form>
          <a-register-form v-else :changeView="changeView"></a-register-form>
        </a-modal>
      </a-menu-item> -->
    </a-menu>
  </div>
</template>

<script>
import Vue from "vue";
import { Menu, Icon } from "ant-design-vue";
Vue.use(Menu).use(Icon);

export default {
  data() {
    return {
      studentAllowed: true,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.userStore.currentUser;
    },
  },
  components: {
    "form-section": () => import("./FormSection"),
    "user-dropdown": () => import("./UserDropdown"),
  },
  watch: {
    currentUser: function() {
      if (!this.currentUser) this.studentAllowed = true;
      else
        this.studentAllowed =
          this.currentUser.userRoles[0].role.name === "ROLE_STUDENT";
    },
  },
};
</script>

<style>
.mt-2 {
  margin-top: 1em;
}
.height-100 {
  height: 100%;
}
.text-right {
  text-align: right;
  padding-right: 10px;
}
.ant-menu-item {
  margin-top: 10px !important;
}
.login-modal-width {
  width: 350px;
}
</style>
