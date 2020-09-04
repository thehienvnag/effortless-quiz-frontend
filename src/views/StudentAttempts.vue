<template>
  <show-student-grade
    :options="{
      title: 'Student Name',
      dataIndex: 'nameOfUser',
      key: 'nameOfUser',
    }"
  ></show-student-grade>
</template>

<script>
export default {
  components: {
    "show-student-grade": () => import("../views/ShowStudentGrade"),
  },
};
</script>

<style></style>
