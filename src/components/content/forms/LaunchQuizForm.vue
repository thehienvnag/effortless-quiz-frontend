<template>
  <a-modal :visible="visible" @cancel="handleCancel">
    <h3 slot="title">
      <a-icon type="thunderbolt" :style="{ marginRight: '5px' }" />
      Setup launched quiz
    </h3>
    <a-form :form="form" @submit="handleLaunch">
      <a-row type="flex" justify="space-between">
        <a-col :span="10">
          <h3>Description <span :style="{ color: 'red' }">(*)</span></h3>
          <a-form-item>
            <a-input
              placeholder="Quiz Description"
              v-decorator="[
                'description',
                {
                  rules: [
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                    {
                      min: 3,
                      message: 'Require at least 3 characters!',
                    },
                    {
                      max: 30,
                      message: 'Require at most 30 characters!',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <h3>Quiz password <span :style="{ color: 'red' }">(*)</span></h3>
          <a-form-item>
            <a-input-password
              v-decorator="[
                'quizPassword',
                {
                  rules: [
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                    {
                      min: 2,
                      message: 'Require at least 2 characters!',
                    },
                    {
                      max: 30,
                      message: 'Require at most 30 characters!',
                    },
                  ],
                },
              ]"
              placeholder="Quiz password"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <h3 :style="{ marginBottom: 0 }">
            Durations (in minutes) <span :style="{ color: 'red' }">(*)</span>
          </h3>
          <a-form-item>
            <a-input-number
              :style="{ width: '70%' }"
              placeholder="Enter quiz's duration"
              :min="5"
              :max="150"
              v-decorator="[
                'duration',
                {
                  rules: [
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                  ],
                },
              ]"
            />
            <span> - (mins)</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <h3 :style="{ marginBottom: 0 }">
          Quiz time's range <span :style="{ color: 'red' }">(*)</span>
        </h3>
        <a-form-item>
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="DD-MM-YYYY - (HH:mm)"
            :placeholder="['Start Time', 'End Time']"
            :disabled-date="disabledDate"
            v-decorator="[
              'quizTimeRange',
              {
                rules: [
                  {
                    required: true,
                    message: 'This field is required!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-row>
    </a-form>
    <div slot="footer">
      <a-button
        :loading="loadingLaunchQuiz"
        type="primary"
        icon="play-circle"
        @click="handleLaunch"
        >Launch</a-button
      >
    </div>
  </a-modal>
</template>

<script>
import moment from "moment";
import {
  Modal,
  Form,
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  message,
} from "ant-design-vue";
import Vue from "vue";
import { actionTypes } from "../../../store/actions/quizAction";
Vue.use(Modal)
  .use(Form)
  .use(DatePicker)
  .use(Input)
  .use(Button)
  .use(Row)
  .use(Col);
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "launchQuizInfo" });
  },
  data() {
    return {
      visible: false,
      quizId: null,
      loadingLaunchQuiz: false,
    };
  },
  methods: {
    handleInput(value, key) {
      Object.assign(this, { [key]: value });
    },
    async handleLaunch() {
      this.form.validateFields(async (err, fieldsValue) => {
        if (!err) {
          console.log(fieldsValue);
          const requestData = {
            ...fieldsValue,
            startTime: fieldsValue["quizTimeRange"][0].format(
              "YYYY-MM-DD HH:mm"
            ),
            endTime: fieldsValue["quizTimeRange"][1].format("YYYY-MM-DD HH:mm"),
          };
          delete requestData["quizTimeRange"];
          this.loadingLaunchQuiz = true;
          message.loading({ content: "Launching quiz", key: "Loading" });
          await this.$store.dispatch(actionTypes.launchQuiz, {
            quizId: this.quizId,
            launchQuizInfo: requestData,
          });
          message.success({ content: "Successfully launched quiz!", key: "Insertable" });
          this.loadingLaunchQuiz = false;
          this.handleCancel();
        }
      });
    },
    openModal(quizId) {
      this.visible = true;
      this.quizId = quizId;
    },
    handleCancel() {
      this.visible = false;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return (
        current <
        moment()
          .subtract(1, "days")
          .endOf("day")
      );
    },
  },
};
</script>

<style></style>
