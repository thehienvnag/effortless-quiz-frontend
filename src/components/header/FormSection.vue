<template>
  <div>
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
      <a-login-form v-if="isLoginView" :changeView="changeView" :hideModal="hideModal"></a-login-form>
      <a-register-form v-show="!isLoginView" :changeView="changeView" :hideModal="hideModal"></a-register-form>
    </a-modal>
  </div>
</template>

<script>
import { Button, Modal } from "ant-design-vue";
import Vue from "vue";

Vue.use(Button).use(Modal);
export default {
  data() {
    return {
      visible: false,
      modalTitle: null,
      modalFooter: null,
      isLoginView: true,
    };
  },
  methods: {
    changeView() {
      this.isLoginView = !this.isLoginView;
    },
    hideModal(){
      this.visible = false;
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  },
  components: {
    "a-login-form": () => import("./forms/LoginForm"),
    "a-register-form": () => import("./forms/RegisterForm"),
  },
};
</script>

<style></style>
