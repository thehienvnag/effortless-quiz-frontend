<template>
  <div :style="{ padding: '0.5em' }">
    <launch-quiz ref="launchQuiz"></launch-quiz>
    <a-card
      :style="{
        minWidth: '320px',
        maxWidth: '800px',
        margin: '0 auto',
        marginTop: '1.5em',
      }"
    >
      <div
        slot="title"
        :style="{ display: 'flex', justifyContent: 'space-between' }"
      >
        <div>
          <a-input
            :style="{
              width: '200px',
              height: '40px',
              fontSize: '1.2em',
              marginRight: '10px',
            }"
            placeholder="Your quiz code"
            :disabled="quizCodeDisabled"
            @pressEnter="handleEnterPresses"
            @change="handleChange"
            :value="quizCodeValue"
          >
          </a-input>
          <a-button type="primary" icon="save" @click="saveQuizInfo"></a-button>
          <a-button icon="edit" @click="enableEditQuizCode"></a-button>
          <a-tooltip
            :style="{ marginLeft: '10px', color: 'red' }"
            v-if="quizCodeError"
            slot="suffix"
            title="This field is required! (At least 6 chars)"
          >
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </div>
        <a-button
          block
          :style="{ width: '120px', height: '35px', fontSize: '1.1em' }"
          icon="play-circle"
          type="primary"
          @click="handleLaunchQuiz"
          >Launch</a-button
        >
      </div>
      <quiz-info
        ref="quizInfo"
        :quizCodeValue="quizCodeValue"
        :duration="quizDuration"
        :quizSubject="value"
        :idParam="idParam"
        :isNewQuiz="isNewQuiz"
      ></quiz-info>
      <a-divider></a-divider>
    </a-card>
    <manage-questions></manage-questions>
  </div>
</template>

<script>
import {
  Input,
  Icon,
  Button,
  Tooltip,
  Collapse,
  Divider,
  Card,
  notification,
} from "ant-design-vue";
import Vue from "vue";
Vue.use(Icon)
  .use(Input)
  .use(Button)
  .use(Tooltip)
  .use(Collapse)
  .use(Divider)
  .use(Card);

import { actionTypes } from "../store/actions/quizAction";
export default {
  data() {
    return {
      quizInfo: null,
      quizCodeDisabled: true,
      quizCodeValue: null,
      quizCodeError: false,
      cardLoading: true,
      value: [],
      quizDuration: null,
      idParam: null,
      isNewQuiz: true,
      collapseDisabled: false,
      quizCodeRequired: false,
      countQuestionInQuiz: null,
    };
  },

  computed: {
    userId() {
      return this.currentUser.id;
    },
    currentUser() {
      return this.$store.state.userStore.currentUser;
    },
    quizId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.loadQuizDetails();
  },
  watch: {
    currentUser() {
      this.loadQuizDetails();
    },
  },
  methods: {
    handleEnterPresses() {
      this.quizCodeDisabled = true;
    },
    enableEditQuizCode() {
      this.quizCodeDisabled = false;
    },
    handleChange(e) {
      const { value } = e.target;
      this.quizCodeValue = value;
      if (value && value.length >= 6) {
        this.quizCodeError = false;
      } else {
        this.quizCodeError = true;
      }
    },
    async loadQuizDetails() {
      if (this.quizId === "new") {
        this.cardLoading = false;
      } else {
        const { data } = await this.$store.dispatch(actionTypes.loadQuizById, {
          userId: this.userId,
          quizId: this.quizId,
        });
        const { subjects, quizCode, countQuestionInQuiz } = data;
        this.countQuestionInQuiz = countQuestionInQuiz;
        this.value = [
          {
            key: subjects.id,
            label: `${subjects.code} - ${subjects.name}`,
          },
        ];
        if (countQuestionInQuiz > 0) {
          this.isNewQuiz = false;
        }
        this.quizCodeValue = quizCode;
        this.cardLoading = false;
      }
    },
    saveQuizInfo() {
      if (this.quizCodeValue) {
        this.$refs.quizInfo.onSubmit();
        this.quizCodeRequired = false;
      } else {
        this.quizCodeRequired = true;
      }
    },
    handleLaunchQuiz() {
      if (this.quizId !== "new") {
        this.$refs.launchQuiz.openModal(this.quizId);
      } else {
        let message = "Quiz has not been saved!";
        if (this.quizId && this.countQuestionInQuiz === 0) {
          message = "No questions to launch! Save and try again!";
        }
        notification.open({
          message: "Invalid launch quiz",
          description: message,
          icon: <a-icon type="warning" style="color: red" />,
        });
      }
    },
  },
  components: {
    "quiz-info": () => import("../components/content/forms/QuizInfo"),
    "manage-questions": () => import("../components/content/ManageQuestions"),
    "launch-quiz": () => import("../components/content/forms/LaunchQuizForm"),
  },
};
</script>

<style></style>
