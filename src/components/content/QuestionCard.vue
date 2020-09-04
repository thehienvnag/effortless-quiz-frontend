<template>
  <div>
    <a-card
      :title="null"
      :style="{
        maxWidth: '600px',
        minWidth: '350px',
        margin: '0 auto',
        marginTop: '1em',
        fontSize: '1.1em',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0,0,0,.5)',
      }"
      ><a-skeleton v-if="isLoading" active />

      <div v-if="!isLoading">
        <h5 :style="{ display: 'flex', justifyContent: 'space-between' }">
          <span>
            <a-icon
              type="message"
              theme="twoTone"
              :style="{ marginRight: '0.3em', fontSize: '1.2em' }"
            />Question {{ ques.pos }}.
          </span>
          <small :style="{ fontWeight: 'normal' }"
            >{{ ques.pointEarned }} / 1 point</small
          >
        </h5>
        <p>{{ question.content }}</p>
        <img
          v-if="question.imageLink"
          :src="question.imageLink"
          alt=""
          :style="{ borderRadius: '3px', width: '200px' }"
        />
        <prism-editor
          v-if="question.codeContent"
          class="my-editor"
          :code="question.codeContent"
          :highlight="highlighter"
          line-numbers
          :readonly="true"
        ></prism-editor>
        <answer-choice
          :questionDisabled="questionDisabled"
          v-for="(ans, i) in question.answerList"
          :key="i"
          :ans="ans"
          :index="i"
          :chosenAnswerId="chosenAnswerId"
          @checkAnswer="handleCheckAnswer"
          :questionTypeId="question.questionTypeId"
        ></answer-choice>
        <a-pagination
          v-if="!questionDisabled"
          :style="{ textAlign: 'center', marginTop: '1.5em' }"
          :default-current="pos * 1"
          :total="studentAttemptPos.length"
          show-less-items
          :showTitle="false"
          :pageSize="1"
          @change="onChangePage"
        />
      </div>
    </a-card>
  </div>
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import { Card, Divider, Checkbox, Skeleton, Pagination } from "ant-design-vue";
import Vue from "vue";
import { actionTypes } from "../../store/actions/quizAction";
Vue.use(Card)
  .use(Divider)
  .use(Checkbox)
  .use(Skeleton)
  .use(Pagination);

export default {
  data() {
    return {
      isLoading: true,
      code: null,
      charCode: 65,
      radioValue: null,
      checkboxValue: null,
      radioStyle: {
        display: "flex",
        alignItems: "center",
        height: "30px",
        lineHeight: "30px",
      },
    };
  },
  props: ["startTimer", "questionArg", "questionDisabled"],
  computed: {
    question() {
      return this.ques.questionInQuiz.question;
    },
    chosenAnswerId() {
      return this.ques.chosenAnswerId;
    },
    ques() {
      if (this.questionArg) {
        return this.questionArg;
      }
      return this.$store.state.quizStore.currentQuestion;
    },
    studentAttemptPos() {
      return this.studentAttempt
        ? this.studentAttempt.studentQuestionList.map(
            ({ pos, chosenAnswerId }) => ({
              chosenAnswerId: chosenAnswerId,
              pos: pos + "",
            })
          )
        : null;
    },
    studentAttempt() {
      return this.$store.state.quizStore.studentAttempt;
    },
    currentUser() {
      return this.$store.state.userStore.currentUser;
    },
    userId() {
      return this.currentUser ? this.currentUser.id : null;
    },
    pos() {
      return this.$route.params.pos;
    },
    attemptId() {
      return this.$route.params.id;
    },
  },
  created() {
    if (this.studentAttempt && this.startTimer) {
      this.isLoading = false;
      this.startTimer();
    } else {
      this.loadStudentAttempt();
    }
  },
  watch: {
    currentUser() {
      this.loadStudentAttempt();
    },
    ques() {
      this.isLoading = false;
    },
    pos() {
      this.$store.dispatch(actionTypes.changeQuestion, this.pos);
      this.showDoneIcon();
    },
  },
  methods: {
    showDoneIcon() {
      const pageItems = Array.from(document.querySelectorAll("li[title]"));
      pageItems.forEach((item) => {
        const studentAttemptPos = this.studentAttemptPos.find(
          ({ pos }) => item.title === pos
        );
        if (studentAttemptPos) {
          if (
            studentAttemptPos.chosenAnswerId &&
            studentAttemptPos.chosenAnswerId.length > 0
          ) {
            item.children[0].innerHTML =
              item.title +
              '<span style="font-size: 1.5em; color: #66a489;" class="material-icons">done</span>';
          } else {
            item.children[0].innerHTML = item.title;
          }
        }
      });
    },
    onChange(e) {
      this.radioValue = e.target.value;
    },
    highlighter(code) {
      return highlight(code, languages.clike); // languages.<insert language> to return html with markup
    },
    handleCheckAnswer({ answerId, questionTypeId }) {
      this.$store.dispatch(actionTypes.checkAnswer, {
        userId: this.userId,
        attemptId: this.attemptId,
        quesId: this.ques.id,
        answerId: answerId,
        questionTypeId: questionTypeId,
      });
      this.showDoneIcon();
    },
    async loadStudentAttempt() {
      if (this.questionArg) {
        this.isLoading = false;
        return;
      }
      if (
        !this.questionDisabled &&
        !this.studentAttempt &&
        this.userId &&
        this.attemptId
      ) {
        await this.$store.dispatch(actionTypes.loadStudentAttempt, {
          userId: this.userId,
          attemptId: this.attemptId,
          pos: this.$route.params.pos,
        });
        if (this.studentAttempt && this.startTimer) {
          this.isLoading = false;
          this.startTimer();
        }
      }
    },
    onChangePage(e) {
      this.$router.push({ params: { pos: e } });
    },
  },

  components: {
    "prism-editor": PrismEditor,
    "answer-choice": () => import("../content/AnswerChoice"),
  },
};
</script>

<style>
.hasChecked {
  background-color: #69b7ff !important;
  color: white !important;
}
</style>
