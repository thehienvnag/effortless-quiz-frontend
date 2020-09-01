<template>
  <div>
    <div
      :style="{
        maxWidth: '600px',
        minWidth: '350px',
        margin: '0 auto',
        marginTop: '2em',
      }"
    >
      <h2 :style="{ marginBottom: 0 }">{{ quizCode }} - {{ description }}</h2>
      <div :style="{ display: 'flex' }">
        <a-button icon="clock-circle">Remainings </a-button>
        <span :style="{ marginTop: '5px' }"
          ><a-icon type="arrow-right" /> {{ timerDisplay }}</span
        >
        <a-button
          :loading="submitLoading"
          @click="handleSubmit"
          type="primary"
          icon="file-done"
          :style="{ marginLeft: 'auto' }"
          >Submit now</a-button
        >
      </div>
    </div>
    <question-card></question-card>
  </div>
</template>

<script>
import { Button } from "ant-design-vue";
import QuestionCard from "../components/content/QuestionCard";
import Vue from "vue";
import { actionTypes } from "../store/actions/quizAction";
Vue.use(Button);
export default {
  data() {
    return {
      quizDuration: null,
      timerDisplay: null,
      submitLoading: false
    };
  },
  computed: {
    userId() {
      return this.$store.state.userStore.currentUser.id;
    },
    attemptId() {
      return this.$route.params.id;
    },
    studentAttempt() {
      return this.$store.state.quizStore.studentAttempt;
    },
    quizCode() {
      return this.studentAttempt && this.studentAttempt.quizCode;
    },
    description() {
      return this.studentAttempt && this.studentAttempt.description;
    },
  },
  watch: {
    studentAttempt() {
      this.quizDuration = this.studentAttempt.remainingTime;
      this.startTimer();
    },
  },
  methods: {
    startTimer() {
      const interval = setInterval(() => {
        if (this.quizDuration <= 0) {
          clearInterval(interval);
        }
        this.quizDuration--;
        this.changeTimerDisplay();
      }, 1000);
    },
    changeTimerDisplay() {
      if (this.quizDuration <= 0) {
        return null;
      }
      const minutes = Math.floor(this.quizDuration / 60);
      const seconds = this.quizDuration % 60;
      this.timerDisplay =
        (minutes < 10 ? "0" + minutes : minutes) +
        " : " +
        (seconds < 10 ? "0" + seconds : seconds);
    },
    async handleSubmit() {
      this.submitLoading = true;
      const data = await this.$store.dispatch(actionTypes.submitAttempt, {
        userId: this.userId,
        attemptId: this.attemptId,
      });
      this.submitLoading = false;
      console.log(data);
    },
  },
  components: {
    "question-card": QuestionCard,
  },
};
</script>

<style></style>
