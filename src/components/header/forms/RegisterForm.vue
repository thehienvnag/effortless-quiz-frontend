<template>
  <div>
    <a-form v-if="registerCompleted" :form="form" @submit="handleSubmit">
      <p v-if="userExist" :style="{ color: 'red' }">
        Username already exists!!!
      </p>
      <h2>Register Form</h2>
      <a-form-item>
        <a-input
          v-decorator="[
            'username',
            {
              rules: [
                { required: true, message: 'Please input your username!' },
                { min: 6, message: 'Require at least 6 characters' },
                { max: 30, message: 'Require at most 30 characters' },
              ],
              initialValue: '',
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
            'name',
            {
              rules: [
                { required: true, message: 'Please input your Name!' },
                { min: 6, message: 'Require at least 6 characters' },
                { max: 30, message: 'Require at most 30 characters' },
              ],
              initialValue: '',
            },
          ]"
          type="text"
          placeholder="Name"
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
                { required: true, message: 'Please input your Password!' },
                { min: 8, message: 'Require at least 8 characters' },
                { max: 30, message: 'Require at most 30 characters' },
              ],
              initialValue: '',
            },
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'confirmPass',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input your confirm Password!',
                },
                {
                  validator: this.handleConfirmPass,
                },
              ],
              initialValue: '',
            },
          ]"
          type="password"
          placeholder="Confirm Password"
        >
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-divider>Register as</a-divider>
      <a-form-item class="text-center">
        <a-radio-group
          v-decorator="[
            'roleId',
            {
              rules: [
                { required: true, message: 'Choose one role to continue' },
              ],
            },
          ]"
        >
          <a-radio-button value="1">
            TEACHER
          </a-radio-button>
          <a-radio-button value="2">
            STUDENT
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-divider></a-divider>
      <a-form-item>
        <a-button
          :loading="loading"
          :block="true"
          type="primary"
          html-type="submit"
        >
          Register
        </a-button>
      </a-form-item>
      <p class="text-center">
        Have an account? Log in
        <a @click="changeView">here</a>
      </p>
    </a-form>
    <div v-else>
      <h3>
        <a-icon
          theme="filled"
          type="check-circle"
          :style="{ color: '#285d70', marginRight: '6px' }"
        />
        You have successfully registered!
      </h3>
      <a-button @click="changeView" type="primary">Login to continue</a-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Input, Form, Button, Icon, Radio } from "ant-design-vue";
Vue.use(Input)
  .use(Form)
  .use(Button)
  .use(Icon)
  .use(Radio);
import { actionTypes } from "../../../store/actions/userAction";
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}
export default {
  name: "register-form",
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: "registerForm" }),
      loading: false,
      registerCompleted: true,
      userExist: false,
    };
  },
  props: ["changeView"],
  /*mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },*/
  methods: {
    handleConfirmPass(rule, value, callback) {
      const { getFieldValue } = this.form;
      if (value && value !== getFieldValue("password")) {
        callback("Confirm password is not matched!");
      }
      callback();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        console.log("registering!");
        if (!err) {
          this.loading = true;
          this.userExist = false;
          try {
            await this.$store.dispatch(actionTypes.registerForUser, values);
          } catch (error) {
            this.userExist = true;
          }

          this.loading = false;
          this.registerCompleted = false;
        }
      });
    },
  },
};
</script>

<style>
.text-center {
  text-align: center;
}
</style>
