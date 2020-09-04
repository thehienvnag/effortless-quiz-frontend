<template>
  <div
    class="home"
    :style="{ backgroundColor: '#edf2f8', height: '82.8vh', padding: '2em' }"
  >
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="12">
        <div :style="{ textAlign: 'center' }">
          <span class="subheading">Best Page Of Taking Quiz</span>
          <h1>The Wooden Of Knowledge</h1>
          <p>
            Where teacher easily give plenty of quiz without any efforts.
            <br />Where student participate to enjoy taking quiz!
          </p>
        </div>
      </a-col>
      <a-col :span="12">
        <img
          class=""
          src="../../public/cover_bg.svg"
          alt=""
          :style="{ minWidth: '350px', maxWidth: '90%' }"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from "vue";
import { Button, Row, Col } from "ant-design-vue";
Vue.use(Button)
  .use(Row)
  .use(Col);
export default {
  name: "Home",
};
</script>
