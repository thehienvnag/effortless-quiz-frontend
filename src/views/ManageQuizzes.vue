<template>
  <div class="table-container">
    <h2>Quizzes</h2>
    <div class="d-flex">
      <span class="d-flex">
        <a-input-search
          placeholder="Search"
          style="width: 200px; margin-right: 10px"
          @search="onSearch"
          :loading="searchLoading"
        />
        <a-button
          type="dashed"
          icon="redo"
          class="ml-20"
          style="width: 100px"
          :loading="refreshLoading"
          @click="refreshTableData"
        >
          Refresh
        </a-button>
      </span>
      <a-button
        @click="goQuizDetails"
        class="flex-20"
        type="secondary"
        icon="plus"
        >New Quiz</a-button
      >
    </div>
    <a-table
      class="table-students"
      bordered
      :columns="columns"
      :dataSource="quizStore.quizzes.content"
      :pagination="false"
      :loading="tableLoading"
    >
      <template slot="subjectTag" slot-scope="text, record">
        <a-tag color="geekblue">
          {{ record.subjects.code.toUpperCase() }}
        </a-tag>
        <p>{{ record.subjects.name }}</p>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div :style="{ display: 'flex', marginBottom: '1em' }">
          <a-button
            class="ml-20"
            type="primary"
            icon="play-circle"
            @click="() => setupLaunchQuiz(record.id)"
            >Launch</a-button
          >
          <a-button
            class="ml-20"
            type="default"
            icon="edit"
            @click="() => handleEdit(record.id)"
            >Edit</a-button
          >
          <a-popconfirm
            v-if="quizStore.quizzes.content.length"
            title="Sure to delete?"
            @confirm="() => onDelete(record.id)"
          >
            <a-button type="danger" icon="delete"></a-button>
          </a-popconfirm>
        </div>
        <a-button
          type="default"
          icon="eye"
          @click="() => onViewLaunchedQuizzes(record.id)"
          >Launched</a-button
        >
      </template>
    </a-table>
    <a-pagination
      :total="quizStore.quizzes.totalElements"
      :defaultPageSize="5"
      :defaultCurrent="1"
      :current="currentPage"
      @change="onChangePage"
      style="text-align: right"
    >
    </a-pagination>
    <launch-quiz ref="launchQuiz"></launch-quiz>
  </div>
</template>

<script>
import {
  Table,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Pagination,
  Button,
  TimePicker,
  DatePicker,
  Row,
  Col,
  Tag,
} from "ant-design-vue";
import Vue from "vue";
Vue.use(Table)
  .use(Form)
  .use(Input)
  .use(InputNumber)
  .use(Popconfirm)
  .use(Pagination)
  .use(Button)
  .use(TimePicker)
  .use(DatePicker)
  .use(Row)
  .use(Col)
  .use(Tag);
import { actionTypes } from "../store/actions/quizAction";
const columns = [
  {
    title: "Quiz Code",
    dataIndex: "quizCode",
    key: "quizCode",
  },
  {
    title: "Subject",
    key: "subject",
    scopedSlots: { customRender: "subjectTag" },
  },
  // {
  //   title: "Duration (mins)",
  //   dataIndex: "duration",
  //   key: "duration",
  // },
  {
    title: "Import Date",
    dataIndex: "importDate",
    key: "importDate",
  },
  {
    title: "Operation",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  name: "student-list",
  data: () => {
    return {
      columns: columns,
      currentPage: 1,
      specificStudent: null,
      searchLoading: false,
      refreshLoading: false,
      tableLoading: false,
      deleteLoading: false,
      visible: false,
      loadingLaunchQuiz: false,
    };
  },
  computed: {
    quizStore() {
      return this.$store.state.quizStore;
    },
    userStore() {
      return this.$store.state.userStore;
    },
    currentUser() {
      return this.userStore.currentUser;
    },
  },
  created() {
    this.loadQuizzes();
  },
  watch: {
    currentUser() {
      this.loadQuizzes();
    },
  },
  //async created() {},
  methods: {
    async loadQuizzes() {
      this.tableLoading = true;
      await this.$store.dispatch(actionTypes.loadQuizzes, {
        page: 0,
        size: 5,
        userId: this.userStore.currentUser.id,
      });
      this.tableLoading = false;
    },
    onViewLaunchedQuizzes(quizId) {
      this.$router.push(`/launchedQuizzes/${quizId}`);
    },
    setupLaunchQuiz(quizId) {
      this.$refs.launchQuiz.openModal(quizId);
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    async refreshTableData() {
      this.refreshLoading = true;
      this.tableLoading = true;
      try {
        await this.$store.dispatch(actionTypes.loadQuizzes, {
          size: 5,
          page: this.currentPage - 1,
          userId: this.userStore.currentUser.id,
        });
      } catch (error) {
        console.log(error);
      }
      this.refreshLoading = false;
      this.tableLoading = false;
    },
    // openModal() {
    //   this.$refs.inputModal.showModal();
    // },
    // openModalForEdit(id) {
    //   const studentForEdit = this.$store.getters.getStudentById(id);
    //   this.$refs.inputModal.showModalForEdit(studentForEdit);
    // },
    async onSearch(searchValue) {
      if (searchValue) {
        this.searchLoading = true;
        try {
          console.log(searchValue);
          this.tableLoading = true;
          await this.$store.dispatch(actionTypes.loadQuizzes, {
            page: 0,
            size: 5,
            userId: this.userStore.currentUser.id,
            q: searchValue,
          });
          this.tableLoading = false;
        } catch (error) {
          console.log(error);
        }
        this.searchLoading = false;
      }
    },
    async onDelete(key) {
      console.log(key);
      //await this.$store.dispatch(deleteStudent, key);
      await this.refreshTableData();
    },
    async onChangePage(page) {
      this.tableLoading = true;
      this.currentPage = page;
      try {
        await this.$store.dispatch(actionTypes.loadQuizzes, {
          page: this.currentPage - 1,
          size: 5,
          userId: this.userStore.currentUser.id,
        });
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    handleSubmit() {},
    goQuizDetails() {
      this.$router.push("/quizzes/new");
    },
    handleEdit(id) {
      this.$router.push(`/quizzes/${id}`);
    },
  },
  components: {
    "launch-quiz": () => import("../components/content/forms/LaunchQuizForm"),
  },
};
</script>

<style>
.table-container {
  width: 70%;
  background-color: white;
  border-radius: 5px;
  margin: 0 auto;
  margin-top: 25px;
  padding: 4%;
}
.table-students {
  margin: 10px 0;
}
.d-flex {
  display: flex;
  justify-content: space-between;
}
.ant-spin-dot {
  width: 40px;
}
.ant-btn {
  margin-right: 10px;
}
</style>
