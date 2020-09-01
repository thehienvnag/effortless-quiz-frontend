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
      <template slot="operation">
        <div :style="{ display: 'flex' }">
          <a-button type="default" @click="() => enableReview(record.id)"
            >Enable review</a-button
          >
          <a-popconfirm
            title="Sure to cancel this quiz?"
            @confirm="() => onCancel(record.id)"
          >
            <a-button type="danger" icon="delete"></a-button>
          </a-popconfirm>
        </div>
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
import { Table, Tag, Pagination, Popconfirm, Button } from "ant-design-vue";
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
    };
  },
  computed: {
    quizzes() {
      return this.$store.state.quizStore.launchQuizzes;
    },
    launchQuizzes() {
      return this.quizzes
        ? this.quizzes.content.map((quiz, i) => Object.assign(quiz, { key: i }))
        : null;
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
  },
  methods: {
    async loadLaunchQuiz() {
      await this.$store.dispatch(actionTypes.loadLaunchQuizzes, {
        quizId: this.quizId,
        userId: this.userId,
      });
      this.tableLoading = false;
    },
    onChangePage() {},
    enableReview() {},
    onCancel() {},
  },
};
</script>

<style></style>
