<template>
  <div>
    <loading-section
      v-if="loginWithFacebookLoading"
      :iconTitle="{ type: 'login' }"
      :iconLoading="{ type: 'loading', fontSize: '2.5em', color: '#1890ff' }"
      title="Login using facebook account"
      content="This may take a few momments!"
    ></loading-section>
    <a-form v-else :form="form" @submit="handleSubmit">
      <p v-if="incorrectLogin" :style="{ color: 'red' }">
        Incorrect username or password!!
      </p>
      <h2 class="mb-30">Login Form</h2>
      <a-form-item>
        <a-input
          v-decorator="[
            'username',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ],
            },
          ]"
          placeholder="Username"
        >
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ],
            },
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loginLoading"
          :block="true"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider v-if="!loginWithFacebookLoading">Social Login</a-divider>
    <v-facebook-login
      v-if="!loginWithFacebookLoading"
      @login="handleLogin"
      class="btn-fb mb-2"
      app-id="794203911348905"
    ></v-facebook-login>
    <p v-if="!loginWithFacebookLoading" style="text-align: center" class="p-0">
      Not having an account? Register
      <a @click="changeView">here</a>
    </p>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import VFacebookLogin from "vue-facebook-login-component";
import { Form, Input, Button, Icon, Divider } from "ant-design-vue";
import { actionTypes } from "../../../store/actions/userAction";
Vue.use(Form)
  .use(Input)
  .use(Button)
  .use(Icon)
  .use(Divider);
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}
export default {
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: "loginForm" }),
      loginLoading: false,
      loginWithFacebookLoading: false,
      incorrectLogin: false,
    };
  },
  props: ["changeView", "hideModal"],
  computed: mapState(["userStore"]),
  /*mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },*/
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loginLoading = true;
          this.incorrectLogin = false;
          try {
            await this.$store.dispatch(actionTypes.logUserIn, values);
          } catch (error) {
            this.incorrectLogin = true;
          }
          this.loginLoading = false;
        }
      });
    },
    async handleLogin({ authResponse }) {
      try {
        this.loginWithFacebookLoading = true;
        await this.$store.dispatch(
          actionTypes.logUserInWithFacebook,
          authResponse.accessToken
        );
        this.hideModal();
        this.$router.push("/confirm-login");
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    "v-facebook-login": VFacebookLogin,
    "loading-section": () => import("../../utils/LoadingSection"),
  },
};
</script>

<style>
.v-facebook-login {
  height: 40px;
  width: 250px;
}
.btn-fb {
  margin-left: 10px;
}
.p-0 {
  margin: 0;
}
.mb-2 {
  margin-bottom: 1em;
}
.text-center {
  text-align: center;
}
</style>
