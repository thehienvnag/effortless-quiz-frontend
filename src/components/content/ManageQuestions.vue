<template>
  <div :style="{ width: '70%', margin: '0 auto' }">
    <a-button
      v-if="!loadingQuestions"
      @click="handleClick"
      icon="plus-circle"
      :style="{ width: '170px', margin: '10px 0' }"
      >Add more question</a-button
    >
    <a-button
      v-if="!loadingQuestions"
      :loading="saveAllLoading"
      type="primary"
      @click="handleSaveAllQuestion"
      icon="save"
      :style="{ marginLeft: '10px' }"
      >Save All</a-button
    >
    <div v-if="loadingQuestions" :style="skeletonStyle">
      <a-skeleton active />
    </div>
    <div v-if="loadingQuestions" :style="skeletonStyle">
      <a-skeleton active />
    </div>
    <div v-if="loadingQuestions" :style="skeletonStyle">
      <a-skeleton active />
    </div>
    <div v-if="!loadingQuestions">
      <question-details
        v-for="ques in questionList"
        :key="ques.quizPos"
        :question="ques.question || ques"
        @saveQuestion="handleSave"
      ></question-details>
    </div>
    <a-divider
      v-if="questionList && questionList.length"
      :style="{ height: '2px', borderColor: 'black' }"
      >END</a-divider
    >
  </div>
</template>

<script>
import { actionTypes } from "../../store/actions/questionAction";
import Vue from "vue";
import { Collapse, Modal, Skeleton, Divider } from "ant-design-vue";
Vue.use(Collapse)
  .use(Modal)
  .use(Skeleton)
  .use(Divider);
export default {
  data() {
    return {
      quizId: null,
      saveAllLoading: false,
      loadingQuestions: false,
      skeletonStyle: {
        backgroundColor: "white",
        padding: "0.5em 3em",
        marginTop: "25px",
      },
    };
  },
  components: {
    "question-details": () =>
      import("../content/forms/QuestionDetails"),
  },
  computed: {
    questionList() {
      return this.$store.state.questionStore.questionList;
    },
    userId() {
      return this.$store.state.userStore.currentUser.id;
    },
    currentUser(){
      return this.$store.state.userStore.currentUser;
    }
  },
  created(){
    this.loadQuestions();
  },
  watch: {
    currentUser(){
      this.loadQuestions();
    }
  },
  methods: {
    async loadQuestions() {
      this.quizId = this.$route.params.id;
      const type = this.$route.params.type;
      if (this.userId && !type || type !== "new" ) {
        this.loadingQuestions = true;
        await this.$store.dispatch(actionTypes.loadQuestionsByQuizId, {
          userId: this.userId,
          quizId: this.quizId,
        });
        console.log(this.questionList);
        this.loadingQuestions = false;
      }
    },
    async handleClick() {
      await this.$store.dispatch(actionTypes.saveQuestion, {
        quizId: this.quizId,
        question: {
          contentValue: "",
          options: [],
          value: [],
        },
      });
    },
    handleSave(ques) {
      this.$store.dispatch(actionTypes.updatePartOfQuestion, ques);
    },
    async handleSaveAllQuestion() {
      const requestData = this.questionList.map(
        ({
          contentValue,
          code,
          options,
          value,
          imageLink,
          quizPos,
          //quizQuestionId, id
        }) => ({
          content: contentValue,
          codeContent: code,
          answerList: options.map((opt) => ({
            content: opt.value,
            correct: value.includes(opt.value),
          })),
          questionTypeId: value.length > 1 ? 1 : 2,
          imageLink,
          quizPos: quizPos,
          statusId: 1,
          // quizQuestionId: quizQuestionId,
          // id: id
        })
      );
      this.saveAllLoading = true;
      const data = await this.$store.dispatch(actionTypes.saveQuizQuestions, {
        userId: this.userId,
        quizId: this.quizId,
        questions: requestData,
      });
      console.log(data);
      this.saveAllLoading = false;
    },
  },
};
</script>

<style></style>
