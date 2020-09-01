<template>
  <a-card
    title="Join Quiz"
    :bordered="false"
    :style="{ width: '50%', margin: '0 auto', marginTop: '15px' }"
  >
    <a-form-item label="Quiz Code">
      <a-input @change="onChangeQuizCode" />
    </a-form-item>

    <a-button
      :loading="findLoading"
      type="primary"
      icon="search"
      @click="handleSubmit"
      >Find Quiz</a-button
    >
    <a-table
      :style="{ marginTop: '2em' }"
      :columns="columns"
      :dataSource="launchQuizzes"
      :pagination="false"
      :loading="tableLoading"
    >
      <template slot="operation" slot-scope="id">
        <div :style="{ display: 'flex' }">
          <a-popconfirm
            placement="topLeft"
            ok-text="JOIN"
            @confirm="(e) => onJoinQuiz(id, e)"
          >
            <div slot="title">
              <h3>Join this Quiz</h3>
              <a-input type="password" placeholder="Enter quiz password" />
            </div>
            <a-button>
              Join Now
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { actionTypes } from "../store/actions/quizAction";
import { Form, Button, Table, Popover } from "ant-design-vue";
import Vue from "vue";
Vue.use(Form)
  .use(Button)
  .use(Table)
  .use(Popover);

const columns = [
  {
    title: "Quiz Description",
    dataIndex: "description",
    key: "description",
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
    title: "Operation",
    key: "operation",
    dataIndex: "id",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      joinLoading: false,
      columns: columns,
      tableLoading: false,
      findLoading: false,
      quizCode: null,
      visible: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "takeQuiz" });
  },
  computed: {
    currentUser() {
      return this.$store.state.userStore.currentUser;
    },
    userId() {
      return this.currentUser.id;
    },
    quizzes() {
      return this.$store.state.quizStore.launchQuizzes;
    },
    launchQuizzes() {
      return this.quizzes ? this.quizzes.content : null;
    },
  },
  methods: {
    onChangeQuizCode(e) {
      this.quizCode = e.target.value;
    },
    async handleSubmit() {
      this.findLoading = true;
      this.tableLoading = true;
      await this.$store.dispatch(actionTypes.loadLaunchingQuizzes, {
        userId: this.userId,
        quizCode: this.quizCode,
      });

      this.findLoading = false;
      this.tableLoading = false;
    },
    async onJoinQuiz(id, e) {
      const inputEle = e.target.parentElement.parentElement.querySelector(
        "input[type='password']"
      );
      const data = await this.$store.dispatch(actionTypes.takeQuiz, {
        userId: this.userId,
        quizCred: {
          stagingQuizzesId: id,
          quizPassword: inputEle.value,
        },
      });
      if (data) {
        console.log("redirect");
        this.$router.push(`/attempts/${data.id}/1`);
      }
    },
  },
};
</script>

<style></style>
