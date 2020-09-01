<template>
  <a-row>
    <a-col :span="15">
      <h3>Subject <span :style="{ color: 'red' }">(*)</span></h3>
      <a-select
        :style="{ width: '90%' }"
        mode="multiple"
        label-in-value
        :value="value"
        placeholder="Search subjects for selection"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        @search="fetchSubjects"
        @change="handleChange"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="d in data" :key="d.value">
          {{ d.text }}
        </a-select-option>
      </a-select>
    </a-col>
  </a-row>
</template>

<script>
import debounce from "lodash/debounce";
import { actionTypes } from "../../../store/actions/quizAction";
import {
  Input,
  Button,
  Select,
  Spin,
  Row,
  Col,
  InputNumber,
  message,
} from "ant-design-vue";
import Vue from "vue";
Vue.use(Input)
  .use(Button)
  .use(Select)
  .use(Spin)
  .use(Row)
  .use(Col)
  .use(InputNumber);
export default {
  data() {
    this.lastFetchId = 0;
    this.fetchSubjects = debounce(this.fetchSubjects, 800);
    return {
      quizInfo: {},
      quizInfoDisabled: true,
      data: [],
      value: [],
      fetching: false,
      quizDuration: null,
      submitLoading: false,
    };
  },
  props: ["quizCodeValue", "duration", "quizSubject", "idParam", "isNewQuiz"],
  computed: {
    userId() {
      return this.$store.state.userStore.currentUser.id;
    },
  },
  watch: {
    quizSubject(){
      this.value = this.quizSubject;
    }
  },
  methods: {
    fetchSubjects(value) {
      console.log("fetching user", value);
      this.fetching = true;
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = [];
      fetch("http://localhost:8888/api/subjects?q=" + value)
        .then((response) => response.json())
        .then((body) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = body.map((subject) => ({
            text: `${subject.code} - ${subject.name}`,
            value: subject.id,
          }));
          this.data = data;
          this.fetching = false;
        });
    },
    handleChange(value) {
      console.log(value);
      this.value = value[value.length - 1];
      this.data = [];
      this.fetching = false;
    },
    enableQuizInfoEdit() {
      this.quizInfoDisabled = false;
    },
    diableQuizInfoEdit() {
      this.quizInfoDisabled = true;
    },
    onChange(e) {
      this.quizDuration = e;
    },
    onClickManageQuestion() {
      const quizId = this.$route.params.id;
      let uri = `/quizzes/${quizId}/questions`;
      if (this.isNewQuiz) {
        uri += "/new";
      }
      this.$router.push(uri);
    },
    async onSubmit() {
      if (!this.userId) {
        return;
      }
      if (this.quizCodeValue.length >= 6) {
        Object.assign(this.quizInfo, {
          quizCode: this.quizCodeValue,
          subjectsId: this.value.key,
        });
        const requestData = {
          userId: this.userId,
          quiz: this.quizInfo,
        };
        this.submitLoading = true;
        message.loading({ content: "Creating new quiz", key: "insertable" });
        const { data } = await this.$store.dispatch(
          actionTypes.addQuiz,
          requestData
        );
        console.log(data);
        message.success({
          content: "Successully created new quiz",
          key: "insertable",
          duration: 3
        });
        this.submitLoading = false;
      }
    },
  },
};
</script>

<style></style>
