<template>
  <div :style="{ padding: '1em' }">
    <div
      v-if="quizId !== 'new'"
      :style="{
        backgroundColor: 'white',
        padding: '0.5em 0.4em',
        width: '80px',
        borderRadius: '5px',
        fontSize: '1.3em',
        position: 'fixed',
        top: '40%',
        left: '17%',
        border: '2px solid #f6f7f8',
        zIndex: 5,
      }"
    >
      <a-button
        block
        v-if="!loadingQuestions"
        @click="handleClick"
        icon="plus-circle"
        size="large"
        :style="{ marginRight: 0, width: '60px' }"
      ></a-button>
      <a-button
        block
        v-if="!loadingQuestions"
        :loading="saveAllLoading"
        @click="handleSaveAllQuestion"
        type="primary"
        icon="save"
        size="large"
        :style="{ marginTop: '5px', marginRight: 0, width: '60px' }"
      ></a-button>
    </div>

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
        :style="{ minWidth: '300px', maxWidth: '700px' }"
        v-for="ques in questionList"
        :key="ques.quizPos"
        :question="ques.question || ques"
        @saveQuestion="handleSave"
      ></question-details>
    </div>
    <a-divider
      v-if="questionList && questionList.length"
      :style="{ color: 'white' }"
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
    "question-details": () => import("../content/forms/QuestionDetails"),
  },
  computed: {
    questionList() {
      return this.$store.state.questionStore.questionList;
    },
    userId() {
      return this.$store.state.userStore.currentUser.id;
    },
    currentUser() {
      return this.$store.state.userStore.currentUser;
    },
    quizId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.loadQuestions();
  },
  watch: {
    currentUser() {
      this.loadQuestions();
    },
  },
  methods: {
    async loadQuestions() {
      if (this.quizId && this.quizId === "new") {
        console.log(this.$store);
        this.$store.commit("SAVE_ALL_QUESTIONS", null);
      }
      if (this.quizId && this.quizId !== "new") {
        this.loadingQuestions = true;
        await this.$store.dispatch(actionTypes.loadQuestionsByQuizId, {
          userId: this.userId,
          quizId: this.quizId,
        });
        this.questionList;
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
      data;
      this.saveAllLoading = false;
    },
  },
};
</script>

<style></style>
