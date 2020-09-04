<template>
  <div
    :style="{
      width: '40%',
      margin: '0 auto',
      padding: '2em 0',
      marginBottom: '2em',
    }"
  >
    <h2 :style="{ color: 'white' }">{{ quizInfo }}</h2>
    <div v-if="isLoading">
      <div v-for="item in skeletonArray" :key="item" :style="{backgroundColor: 'white', padding: '1em'}">
        <a-skeleton active />
      </div>
    </div>
    <div v-if="!isLoading">
      <question-card
        v-for="ques in questionList"
        :key="ques.id"
        :questionArg="ques"
        :questionDisabled="true"
      ></question-card>
    </div>
  </div>
</template>

<script>
import { actionTypes } from "../store/actions/quizAction";
import { Skeleton } from "ant-design-vue";
import Vue from "vue";
Vue.use(Skeleton);
export default {
  created() {
    this.loadStudentQuestion();
  },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    attemptId() {
      return this.$route.params.attemptId;
    },
    currentUser(){
      return this.$store.state.userStore.currentUser;
    },
    userId() {
      return this.currentUser && this.currentUser.id;
    },
    studentAttempt() {
      return this.$store.state.quizStore.studentAttempt;
    },
    questionList() {
      return this.studentAttempt && this.studentAttempt.studentQuestionList;
    },
    quizInfo() {
      if (!this.studentAttempt) {
        return null;
      }
      return (
        this.studentAttempt.quizCode + " - " + this.studentAttempt.description
      );
    },
    skeletonArray() {
      const numberOfQuestion = this.$store.state.quizStore.numberOfQuestion;
      return Array.from(Array(numberOfQuestion).keys(), (n) => n + 1);
    },
  },
  watch: {
    attemptId() {
      this.loadStudentQuestion();
    },
    currentUser(){
      this.loadStudentQuestion();
    }
  },
  components: {
    "question-card": () => import("../components/content/QuestionCard"),
  },
  methods: {
    async loadStudentQuestion() {
      if (this.attemptId && this.userId) {
        await this.$store.dispatch(actionTypes.loadStudentAttempt, {
          userId: this.userId,
          attemptId: this.attemptId,
          pos: -1,
        });
        this.isLoading = false;
      }
    },
  },
};
</script>

<style></style>
