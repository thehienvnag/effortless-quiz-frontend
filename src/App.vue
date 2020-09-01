<template>
  <div id="app">
    <app-layout></app-layout>
  </div>
</template>

<script>
import { actionTypes } from "./store/actions/userAction";
export default {
  components: {
    "app-layout": () => import("./layout/AppLayout"),
  },
  created() {
    this.$store.dispatch(actionTypes.loadUserById);
  },
};
</script>

<style lang="less"></style>
