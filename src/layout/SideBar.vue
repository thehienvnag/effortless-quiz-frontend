<template>
  <div>
    <div class="logo">
      <img src="../../public/logo.png" alt="Logo" />
      <span v-if="showAppName">Effortless <b>QUIZ</b></span>
    </div>
    <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
      <a-menu-item key="2">
        <a-icon type="desktop" />
        <span>Option 2</span>
      </a-menu-item>
      <a-menu-item key="1">
        <router-link to="/quizzes">
          <a-icon type="pie-chart" />
          <span>Manage Quizzes</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="user" /><span>User</span></span>
        <a-menu-item key="3">
          Tom
        </a-menu-item>
        <a-menu-item key="4">
          Bill
        </a-menu-item>
        <a-menu-item key="5">
          Alex
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"><a-icon type="team" /><span>Team</span></span>
        <a-menu-item key="6">
          Team 1
        </a-menu-item>
        <a-menu-item key="8">
          Team 2
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="9">
        <a-icon type="file" />
        <span>File</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
export default {
  props: ["collapsed"],
  computed: {
    showAppName() {
      return !this.collapsed;
    },
  },
};
</script>

<style></style>
