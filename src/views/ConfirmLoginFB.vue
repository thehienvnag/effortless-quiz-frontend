<template>
  <a-card
    :style="{ width: '350px', margin: '0 auto', marginTop: '30px' }"
    title="One more step to complete"
  >
    <p>
      <a-icon
        type="check"
        :style="{ fontSize: '1.5em', color: '#285d70', marginRight: '5px' }"
      />Specifies your role to continue:
    </p>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item class="text-center">
        <a-radio-group
          button-style="solid"
          v-decorator="[
            'roleId',
            {
              rules: [
                { required: true, message: 'Choose one role to complete' },
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
      <a-form-item>
        <a-button
          icon=""
          :loading="loading"
          :block="true"
          type="primary"
          html-type="submit"
        >
          Continue
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import Vue from "vue";
import { Form, Radio, Card, Button } from "ant-design-vue";
Vue.use(Form)
  .use(Radio)
  .use(Card)
  .use(Button);
import { actionTypes } from "../store/actions/userAction";

export default {
  name: "confirmFbLogin",
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: "confirmFbLogin" }),
    };
  },
  created(){
    console.log(document.cookie);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          try {
            await this.$store.dispatch(actionTypes.updateUserRoles, values);
          } catch (error) {
            console.log(error);
          }
          this.loading = false;
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>

<style></style>
