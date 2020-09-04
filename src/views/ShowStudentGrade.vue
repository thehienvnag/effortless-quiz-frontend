<template>
  <div
    :style="{
      width: '70%',
      margin: '2em auto',
      backgroundColor: 'white',
      padding: '2% 5% 2em 5%',
    }"
  >
    <h2>Student Attempts's Result</h2>
    <a-table
      bordered
      :columns="columns"
      :dataSource="studentAttemptList"
      :pagination="false"
      :loading="tableLoading"
    >
      <template
        slot="showPointEarned"
        slot-scope="pointEarned, { questionCount }"
      >
        {{ pointEarned }} / {{ questionCount }}
      </template>
      <template slot="operation" slot-scope="reviewable, { id, questionCount }">
        <div v-if="reviewable" :style="{ display: 'flex' }">
          <router-link
            :to="{ name: 'ReviewQuiz', params: { attemptId: id } }"
            @click="() => handleClickLink(questionCount)"
            >Review</router-link
          >
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { Table, Button, Popconfirm } from "ant-design-vue";
import Vue from "vue";
import { actionTypes } from "../store/actions/quizAction";
Vue.use(Table)
  .use(Button)
  .use(Popconfirm);
const columns = [
  {
    title: "Quiz Info",
    dataIndex: "quizInfo",
    key: "quizInfo",
  },
  {
    title: "Duration (mins)",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Attempt time",
    dataIndex: "startTime",
    key: "startTime",
  },
  {
    title: "Point Earned",
    dataIndex: "pointsEarned",
    key: "id",
    scopedSlots: { customRender: "showPointEarned" },
  },
  {
    title: "Quiz Grade",
    dataIndex: "quizGrade",
    key: "quizGrade",
  },
  {
    title: "Operation",
    key: "operation",
    dataIndex: "reviewable",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  data() {
    return {
      tableLoading: false,
      columns: columns,
    };
  },
  created() {
    if (this.stagingQuizzesId && this.options) {
      const studentName = this.columns[this.columns.length - 2];
      if (studentName.title !== "Student Name") {
        this.columns.push({});
        this.columns[this.columns.length - 1] = this.columns[
          this.columns.length - 2
        ];
        this.columns[this.columns.length - 2] = this.options;
      }

      this.viewStudentAttempt();
    } else {
      this.loadStudentAttemptList();
    }
  },
  props: ["options"],
  computed: {
    studentAttemptList() {
      const studentAttemptList = this.$store.state.quizStore.studentAttemptList;
      if (studentAttemptList && studentAttemptList.content) {
        return studentAttemptList.content.map((attempt, i) =>
          Object.assign(attempt, { key: i })
        );
      }
      return null;
    },
    currentUser() {
      console.log("hello");
      return this.$store.state.userStore.currentUser;
    },
    userId() {
      return this.currentUser && this.currentUser.id;
    },
    stagingQuizzesId() {
      return this.$route.params.stagingQuizzesId;
    },
  },
  watch: {
    currentUser() {
      if (this.stagingQuizzesId && this.options) {
        this.viewStudentAttempt();
      } else {
        this.loadStudentAttemptList();
      }
    },
  },
  methods: {
    handleClickLink(questionCount) {
      console.log(`Show question count: ${questionCount}`);
      this.$store.dispatch(actionTypes.saveNumberOfQuestion, questionCount);
    },
    async loadStudentAttemptList() {
      if (!this.studentAttemptList) {
        this.tableLoading = true;
        await this.$store.dispatch(actionTypes.loadStudentAttemptList, {
          userId: this.userId,
        });
        this.tableLoading = false;
      }
    },
    async viewStudentAttempt() {
      if (this.userId && this.stagingQuizzesId) {
        this.tableLoading = true;
        await this.$store.dispatch(actionTypes.loadStudentAttemptListOfQuiz, {
          stagingQuizzesId: this.stagingQuizzesId,
          userId: this.userId,
        });
        this.tableLoading = false;
      }
    },
  },
};
</script>

<style></style>
