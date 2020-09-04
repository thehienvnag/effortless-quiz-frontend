<template>
  <a-card :style="{ margin: '0 auto', marginTop: '18px' }">
    <template slot="title">
      <h4>Question's Details</h4>
    </template>
    <template slot="extra">
      <a-button
        icon="delete"
        type="danger"
        @click="handleDeleteQuestion"
      ></a-button>
      <a-button
        v-if="!showOptional"
        icon="more"
        @click="
          () => {
            this.showOptional = true;
          }
        "
      ></a-button>
      <a-button
        v-if="showOptional"
        icon="close"
        :style="{ fontSize: '0.8em' }"
        @click="
          () => {
            this.showOptional = false;
          }
        "
      ></a-button>
    </template>
    <div>
      <h4 :style="{ marginBottom: 0 }">
        Content <span :style="{ color: 'red' }">(*)</span>
      </h4>
      <a-textarea
        @change="handleChangeContent"
        placeholder="Enter question content"
        :auto-size="{ maxRows: 10 }"
        :value="contentValue"
      />
      <p v-if="contentRequired" :style="{ color: 'red' }">
        This field is required!
      </p>
      <div v-if="showOptional">
        <a-divider :style="{ height: '1.1px' }"></a-divider>
        <div :style="{ marginTop: '15px' }">
          <a-row>
            <a-col :span="8"
              ><h4>Picture (Optional)</h4>
              <a-upload
                action="https://effortless-quiz-back-end.herokuapp.com/api/uploadFile"
                :tooltip="null"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="handleCancel"
              >
                <img
                  alt="example"
                  style="width: 100%"
                  :src="previewImage"
                /> </a-modal
            ></a-col>
            <a-col :span="2">
              <a-divider
                type="vertical"
                :style="{ height: '10em', width: '1.2px' }"
              />
            </a-col>
            <a-col :span="13">
              <h4>Code Example (Optional):</h4>
              <a-button v-if="!inputCode" icon="plus" @click="provideInputCode"
                >Add Code Section</a-button
              >
              <a-button v-if="inputCode" icon="close" @click="disableInputCode"
                >Remove Code Section</a-button
              >
            </a-col>
          </a-row>
        </div>
        <div :style="{ marginTop: '15px' }" v-if="code && code.length">
          <h4>Code <span :style="{ color: 'red' }">(*)</span></h4>
          <prism-editor
            class="my-editor"
            v-model="code"
            :highlight="highlighter"
            line-numbers
            :readonly="readonly"
            @input="handleCodeInput"
          ></prism-editor>
        </div>
      </div>
    </div>
    <a-divider :style="{ height: '1.1px' }"></a-divider>
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <h3 :style="{ marginBottom: 0 }">
        Answer <span :style="{ color: 'red' }">(*)</span>
      </h3>
      <a-input
        :value="answerInput"
        @change="
          (e) => {
            this.answerInput = e.target.value;
          }
        "
        @pressEnter="addOption"
        :style="{ marginLeft: '10px', maxWidth: '200px' }"
        placeholder="Enter answer"
      />
      <a-button
        icon="plus"
        :style="{ width: '40px', marginLeft: '10px' }"
        block
        @click="addOption"
      ></a-button>
      <div :style="{ paddingTop: '10px' }">
        <p v-if="requiredAnswer" :style="{ color: 'red' }">
          Answer field is required!
        </p>
        <p v-if="duplicateAnswer" :style="{ color: 'red' }">
          Answer field should not be duplicated!
        </p>
      </div>
    </div>
    <p :style="{ marginTop: '10px' }">
      - Specify correct answers by checking!!
    </p>
    <a-checkbox-group
      :style="{ marginTop: '15px' }"
      :value="value"
      @change="onChange"
    >
      <div v-for="opt in options" :key="opt.value" :style="{ display: 'flex' }">
        <a-icon
          class="closeIcon"
          @click="() => removeOption(opt.value)"
          type="close-circle"
          :style="{ fontSize: '0.9em', marginRight: '10px' }"
        ></a-icon>
        <a-checkbox :value="opt.value">
          {{ opt.value }}
        </a-checkbox>
      </div>
    </a-checkbox-group>
  </a-card>
</template>

<script>
import Vue from "vue";
import {
  Card,
  Input,
  Upload,
  Button,
  Icon,
  Row,
  Col,
  Divider,
  Checkbox,
  Tooltip,
} from "ant-design-vue";
Vue.use(Card)
  .use(Input)
  .use(Upload)
  .use(Button)
  .use(Icon)
  .use(Row)
  .use(Col)
  .use(Divider)
  .use(Checkbox)
  .use(Tooltip);
// import Prism Editor
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

import { actionTypes } from "../../../store/actions/questionAction";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
// const options = [
//   { label: "<p>Hello</p>", value: "Apple" },
//   { label: "Pear", value: "Pear" },
//   { label: "Orange", value: "Orange" },
// ];
export default {
  data() {
    return {
      previewVisible: false,
      showOptional: false,
      previewImage: "",
      quizPos: null,
      fileList: [],
      code: null,
      readonly: false,
      inputCode: false,
      options: [],
      value: [],
      answerInput: "",
      contentValue: "",
      imageLink: null,
      requiredAnswer: false,
      duplicateAnswer: false,
      contentRequired: false,
    };
  },
  props: ["question"],
  created() {
    if (this.question && this.question.imageLink) {
      this.showOptional = true;
      console.log(this.question.imageLink);
      this.fileList.push({
        uid: "1",
        name: "yyy.png",
        status: "done",
        url: this.question.imageLink,
      });
    }
    Object.assign(this, this.question);
    if (this.question && this.question.codeContent) {
      this.code = this.question.codeContent;
    }
  },
  watch: {
    question() {},
  },
  methods: {
    provideInputCode() {
      this.code = 'console.log("Hello World")';
      this.$emit("saveQuestion", {
        quizPos: this.quizPos,
        code: this.code,
      });
    },
    disableInputCode() {
      this.code = null;
      this.$emit("saveQuestion", {
        quizPos: this.quizPos,
        code: this.code,
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handleCodeInput(code) {
      this.$emit("saveQuestion", {
        quizPos: this.quizPos,
        code: code,
      });
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
      this.imageLink = this.fileList[0].response;
      this.$emit("saveQuestion", {
        quizPos: this.quizPos,
        imageLink: this.imageLink,
      });
    },
    highlighter(code) {
      return highlight(code, languages.clike); // languages.<insert language> to return html with markup
    },
    onChange(checkedValues) {
      this.value = checkedValues;
      this.$emit("saveQuestion", {
        quizPos: this.quizPos,
        value: this.value,
      });
    },
    onInputAnswerChange(e) {
      const checkbox = e.target.parentElement.parentElement.querySelector(
        "input[type='checkbox']"
      );
      checkbox.value = e.target.value;
    },
    addOption() {
      const ansValue = this.answerInput.trim();
      let isValid = true;
      if (!ansValue.length) {
        this.requiredAnswer = true;
        isValid = false;
      }
      if (
        this.options.length &&
        this.options.findIndex((opt) => opt.value == ansValue) !== -1
      ) {
        this.duplicateAnswer = true;
        isValid = false;
      }

      if (isValid) {
        this.options.push({ value: ansValue });
        this.$emit("saveQuestion", {
          quizPos: this.quizPos,
          options: this.options,
        });
        this.duplicateAnswer = false;
        this.requiredAnswer = false;
      }
    },
    removeOption(value) {
      this.options = this.options.filter((opt) => opt.value !== value);
      this.$emit("saveQuestion", {
        quizPos: this.quizPos,
        options: this.options,
      });
    },
    handleChangeContent(e) {
      this.contentValue = e.target.value.trim();
      if (!this.contentValue.length) {
        this.contentRequired = true;
      } else {
        this.$emit("saveQuestion", {
          quizPos: this.quizPos,
          contentValue: this.contentValue,
        });
        this.contentRequired = false;
      }
    },
    handleDeleteQuestion() {
      this.$store.dispatch(actionTypes.removeQuestion, this.quizPos);
    },
  },
  components: {
    PrismEditor,
  },
};
</script>

<style>
.ant-card-head {
  background-color: #fafafa;
}
.ant-card-body {
  padding-bottom: 0;
}
.closeIcon:hover {
  color: #f76d47;
}
.ant-checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.1em;
  margin-left: 0 !important;
}
code[class*="language-"],
pre[class*="language-"] {
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  color: #90a4ae;
  background: #fafafa;
  font-family: Roboto Mono, monospace;
  font-size: 1em;
  line-height: 1.5em;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

code[class*="language-"]::-moz-selection,
pre[class*="language-"]::-moz-selection,
code[class*="language-"] ::-moz-selection,
pre[class*="language-"] ::-moz-selection {
  background: #cceae7;
  color: #263238;
}

code[class*="language-"]::selection,
pre[class*="language-"]::selection,
code[class*="language-"] ::selection,
pre[class*="language-"] ::selection {
  background: #cceae7;
  color: #263238;
}

:not(pre) > code[class*="language-"] {
  white-space: normal;
  border-radius: 0.2em;
  padding: 0.1em;
}

pre[class*="language-"] {
  overflow: auto;
  position: relative;
  margin: 0.5em 0;
  padding: 1.25em 1em;
}

.language-css > code,
.language-sass > code,
.language-scss > code {
  color: #f76d47;
}

[class*="language-"] .namespace {
  opacity: 0.7;
}

.token.atrule {
  color: #7c4dff;
}

.token.attr-name {
  color: #39adb5;
}

.token.attr-value {
  color: #f6a434;
}

.token.attribute {
  color: #f6a434;
}

.token.boolean {
  color: #7c4dff;
}

.token.builtin {
  color: #39adb5;
}

.token.cdata {
  color: #39adb5;
}

.token.char {
  color: #39adb5;
}

.token.class {
  color: #39adb5;
}

.token.class-name {
  color: #6182b8;
}

.token.comment {
  color: #aabfc9;
}

.token.constant {
  color: #7c4dff;
}

.token.deleted {
  color: #e53935;
}

.token.doctype {
  color: #aabfc9;
}

.token.entity {
  color: #e53935;
}

.token.function {
  color: #7c4dff;
}

.token.hexcode {
  color: #f76d47;
}

.token.id {
  color: #7c4dff;
  font-weight: bold;
}

.token.important {
  color: #7c4dff;
  font-weight: bold;
}

.token.inserted {
  color: #39adb5;
}

.token.keyword {
  color: #7c4dff;
}

.token.number {
  color: #f76d47;
}

.token.operator {
  color: #39adb5;
}

.token.prolog {
  color: #aabfc9;
}

.token.property {
  color: #39adb5;
}

.token.pseudo-class {
  color: #f6a434;
}

.token.pseudo-element {
  color: #f6a434;
}

.token.punctuation {
  color: #39adb5;
}

.token.regex {
  color: #6182b8;
}

.token.selector {
  color: #e53935;
}

.token.string {
  color: #f6a434;
}

.token.symbol {
  color: #7c4dff;
}

.token.tag {
  color: #e53935;
}

.token.unit {
  color: #f76d47;
}

.token.url {
  color: #e53935;
}

.token.variable {
  color: #e53935;
}
.my-editor {
  background-color: #f0f2f5;
  max-height: 400px;
  font-family: Fira code, monospace !important;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px 10px;
  font-weight: normal;
}
</style>
