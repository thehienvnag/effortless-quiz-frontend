<template>
  <div>
    <prepare-quiz v-if="!showContent"></prepare-quiz>
    <a-card
      v-if="showContent"
      title="Join Quiz"
      :bordered="false"
      :style="{
        width: '50%',
        margin: '2em auto',
        marginTop: '15px',
        padding: '2em',
      }"
    >
      <div :style="{ width: '90%', margin: '0 auto' }">
        <a-form-item label="Quiz Code" :style="{ marginBottom: '5px' }">
          <a-input @change="onChangeQuizCode" />
        </a-form-item>
        <a-button
          :loading="findLoading"
          type="primary"
          icon="search"
          @click="handleSubmit"
          >Find Quiz</a-button
        >
      </div>

      <a-table
        v-if="tableAppear"
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
  </div>
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
      tableAppear: false,
      showContent: true,
      launchQuizzes: null,
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
      return this.currentUser && this.currentUser.id;
    },
    quizzes() {
      return this.$store.state.quizStore.launchQuizzes;
    },
  },
  watch: {
    quizzes(){
      this.launchQuizzes = this.quizzes ? this.quizzes.content : null;
    }
  },
  methods: {
    onChangeQuizCode(e) {
      this.quizCode = e.target.value;
    },
    async handleSubmit() {
      this.findLoading = true;
      this.tableLoading = true;
      this.tableAppear = true;
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
      const pass = inputEle.value;
      this.showContent = false;

      try {
        const data = await this.$store.dispatch(actionTypes.takeQuiz, {
          userId: this.userId,
          quizCred: {
            stagingQuizzesId: id,
            quizPassword: pass,
          },
        });
        if (data.id) {
          console.log("redirect");
          await this.loadStudentAttempt(data.id);
          this.$router.push(`/attempts/${data.id}/1`);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async loadStudentAttempt(attemptId) {
      await this.$store.dispatch(actionTypes.loadStudentAttempt, {
        userId: this.userId,
        attemptId: attemptId,
      });
    },
  },
  components: {
    "prepare-quiz": () => import("../components/utils/PrepareQuizSpinner"),
  },
};
</script>

<style></style>
