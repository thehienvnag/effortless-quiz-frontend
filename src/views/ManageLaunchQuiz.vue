<template>
  <div
    :style="{
      backgroundColor: 'white',
      width: '80%',
      padding: '3%',
      margin: '0 auto',
      marginTop: '1.5em',
    }"
  >
    <h2>Launched Quizzes</h2>
    <a-table
      bordered
      :columns="columns"
      :dataSource="launchQuizzes"
      :pagination="false"
      :loading="tableLoading"
    >
      <template slot="status" slot-scope="statusId, { statusName }">
        <a-tag :color="statusColor[statusId]">
          {{ statusName }}
        </a-tag>
      </template>
      <template slot="operation" slot-scope="id, { reviewable }">
        <div :style="{ display: 'flex' }">
          <a-button
            :loading="loading"
            type="default"
            @click="() => changeReviewStatus(id, reviewable)"
          >
            <span v-if="!reviewable">Enable review</span>
            <span v-if="reviewable">Disable review</span>
          </a-button>
          <a-button icon="eye"
            ><router-link
              :to="{ name: 'StudentAttempt', params: { stagingQuizzesId: id } }"
              replace
              >Student attempts</router-link
            >
          </a-button>

          <a-popconfirm
            title="Sure to cancel this quiz?"
            @confirm="() => handleCancel(id)"
          >
            <a-button type="danger" icon="delete"></a-button>
          </a-popconfirm>
        </div>
        <!-- <a-button
          @click="() => handleExport(id)"
          icon="download"
          :style="{ marginTop: '1em' }"
          >Export student's attempts to excel
        </a-button> -->
      </template>
    </a-table>
    <a-pagination
      :total="totalElements"
      :defaultPageSize="5"
      :defaultCurrent="1"
      :current="currentPage"
      @change="onChangePage"
      style="text-align: right"
    >
    </a-pagination>
  </div>
</template>

<script>
import { actionTypes } from "../store/actions/quizAction";
import { saveAs } from "file-saver";
import {
  Table,
  Tag,
  Pagination,
  Popconfirm,
  Button,
  message,
} from "ant-design-vue";
import Vue from "vue";
Vue.use(Table)
  .use(Tag)
  .use(Pagination)
  .use(Popconfirm)
  .use(Button);

const statusColor = {
  4: "geekblue",
  5: "green",
  6: "red",
};

const columns = [
  {
    title: "Quiz Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Password",
    key: "quizPassword",
    dataIndex: "quizPassword",
  },
  {
    title: "Duration (mins)",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Start time",
    dataIndex: "startTime",
    key: "startTime",
  },
  {
    title: "End time",
    dataIndex: "endTime",
    key: "endTime",
  },
  {
    title: "Status",
    key: "statusId",
    dataIndex: "statusId",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Operation",
    key: "operation",
    dataIndex: "id",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  data() {
    return {
      tableLoading: true,
      currentPage: 0,
      statusColor: statusColor,
      columns: columns,
      loading: false,
      launchQuizzes: null,
    };
  },
  computed: {
    quizzes() {
      return this.$store.state.quizStore.launchQuizzes;
    },
    totalElements() {
      return this.quizzes ? this.quizzes.totalElements : 0;
    },
    currentUser() {
      return this.$store.state.userStore.currentUser;
    },
    userId() {
      return this.currentUser ? this.currentUser.id : null;
    },
    quizId() {
      return this.$route.params.quizId;
    },
  },
  created() {
    this.loadLaunchQuiz();
  },
  watch: {
    currentUser() {
      this.loadLaunchQuiz();
    },
    quizzes() {
      if (this.quizzes) {
        this.launchQuizzes = this.quizzes.content.map((quiz, i) =>
          Object.assign(quiz, { key: i })
        );
      }
    },
  },
  methods: {
    async loadLaunchQuiz() {
      const data = await this.$store.dispatch(actionTypes.loadLaunchQuizzes, {
        quizId: this.quizId,
        userId: this.userId,
      });
      this.launchQuizzes = data.content.map((quiz, i) =>
        Object.assign(quiz, { key: i })
      );
      this.tableLoading = false;
    },
    onChangePage() {},
    async changeReviewStatus(id, reviewable) {
      message.loading({
        content: reviewable ? "Disabling..." : "Enabling...",
        key: "changing",
      });
      await this.$store.dispatch(actionTypes.enableReview, {
        userId: this.userId,
        stagingQuizzesId: id,
      });
      message.success({
        content: "Successfully changed!",
        duration: 3,
        key: "changing",
      });
      this.loadLaunchQuiz();
    },
    async handleCancel(stagingQuizzesId) {
      message.loading({ content: "Cancelling", key: "cancel" });
      await this.$store.dispatch(actionTypes.cancelQuiz, {
        userId: this.userId,
        stagingQuizzesId,
      });
      message.success({
        content: "Successfully canceled!",
        key: "cancel",
        duration: 3,
      });
      this.loadLaunchQuiz();
    },
    async handleExport(stagingQuizzesId) {
      message.loading({ content: "Generating file...", key: "generate" });
      const data = await this.$store.dispatch(actionTypes.exportToExcel, {
        userId: this.userId,
        stagingQuizzesId,
      });
      message.success({
        content: "Successfully generated!",
        key: "generate",
        duration: 3,
      });
      saveAs(data, "file.xlsx");
    },
  },
};
</script>

<style></style>
