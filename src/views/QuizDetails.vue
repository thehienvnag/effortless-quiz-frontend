<template>
  <div>
    <a-card :style="{ width: '80%', margin: '0 auto', marginTop: '1.5em' }">
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
      quizCodeValue: "Your Quiz Code",
      quizCodeError: false,
      cardLoading: true,
      value: [],
      quizDuration: null,
      idParam: null,
      isNewQuiz: true,
      collapseDisabled: false,
    };
  },

  computed: {
    userId() {
      return this.currentUser.id;
    },
    currentUser() {
      return this.$store.state.userStore.currentUser;
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
      this.idParam = this.$route.params.id;
      if (this.idParam === "new") {
        this.cardLoading = false;
      } else {
        const { data } = await this.$store.dispatch(actionTypes.loadQuizById, {
          userId: this.userId,
          quizId: this.idParam,
        });
        console.log(data);
        const { subjects, quizCode, countQuestionInQuiz } = data;
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
      this.$refs.quizInfo.onSubmit();
    },
  },
  components: {
    "quiz-info": () => import("../components/content/forms/QuizInfo"),
    "manage-questions": () => import("../components/content/ManageQuestions"),
  },
};
</script>

<style></style>
