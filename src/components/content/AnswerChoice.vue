<template>
  <div
    :style="{
      width: '98%',
      fontSize: '0.8em',
      margin: '0 auto',
      display: 'flex',
      marginBottom: '1em',
    }"
  >
    <span
      :style="{
        padding: '0 1.5%',
        textAlign: 'center',
        cursor: 'pointer',
      }"
    >
      <a-button
        @click="onChecked"
        :shape="btnShape"
        :style="{ display: 'inline-block', margin: 0 }"
        :type="btnType"
      >
        <span v-if="!isReviewDisplay || (!ans.correct && !chosenAnswerId )">{{ alphabet }}</span>
        <span v-if="isReviewDisplay">
          <a-icon
            type="check"
            v-if="ans.correct"
            :style="{ color: '#81c784' }"
          />
          <a-icon
            type="close"
            v-if="!ans.correct && chosenAnswerId"
            :style="{ color: '#ff5252' }"
          />
        </span>
      </a-button>
    </span>
    <span
      :style="{
        border: '1.5px solid #dde1e4',
        borderRadius: '2px',
        width: '90%',
        padding: '1.2% 0.4em 1.2% 0.6em',
      }"
    >
      <span>
        {{ ans.content }}
        <!-- Top Hat Test is a relatively new product where is a relatively new
        product where is a relatively new product where -->
      </span>
      <small
        v-if="ans.correct"
        :style="{ display: 'block', margin: '0', textAlign: 'right' }"
        ><b>Correct answer</b>
      </small>
    </span>
  </div>
</template>

<script>
import { Button } from "ant-design-vue";
import Vue from "vue";
Vue.use(Button);
export default {
  data() {
    return {
      charCode: 65,
      btnShape: null,
    };
  },
  created() {
    if (this.questionTypeId === 2) {
      this.btnShape = "circle";
    }
  },
  computed: {
    alphabet() {
      return String.fromCharCode(this.charCode + this.index);
    },
    btnType() {
      if (this.questionDisabled) {
        return "default";
      }
      return this.chosenAnswerId
        ? this.chosenAnswerId.includes(this.ans.id + "")
          ? "primary"
          : "default"
        : "default";
    },
    isReviewDisplay() {
      if(!this.chosenAnswerId){
        return true;
      }
      return (
        this.questionDisabled && this.chosenAnswerId.includes(this.ans.id + "")
      );
    },
  },
  methods: {
    onChecked() {
      if (!this.questionDisabled) {
        console.log("checked");
        this.$emit("checkAnswer", {
          answerId: this.ans.id + "",
          questionTypeId: this.questionTypeId,
        });
      }
    },
  },
  props: [
    "ans",
    "index",
    "chosenAnswerId",
    "questionDisabled",
    "questionTypeId",
  ],
};
</script>

<style></style>
