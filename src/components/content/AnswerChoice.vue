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
        :style="{ display: 'inline-block', margin: 0, padding: '0 0.8em' }"
        :type="btnType"
        >{{ alphabet }}</a-button
      >
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
    };
  },
  computed: {
    alphabet() {
      return String.fromCharCode(this.charCode + this.index);
    },
    btnType() {
      console.log(this.chosenAnswerId);
      return this.chosenAnswerId
        ? this.chosenAnswerId.includes(this.ans.id + "")
          ? "primary"
          : "default"
        : "default";
    },
  },
  methods: {
    onChecked() {
      this.$emit("checkAnswer", this.ans.id + "");
    },
  },
  props: ["ans", "index", "chosenAnswerId"],
};
</script>

<style></style>
