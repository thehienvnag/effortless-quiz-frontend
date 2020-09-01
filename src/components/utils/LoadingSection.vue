<template>
  <div>
    <h3>
      <a-icon :type="iconTitle.type" :style="{ marginRight: '6px' }" />
      {{ title }}
    </h3>
    <p>{{ content }}</p>
    <a-icon
      :type="iconLoading.type"
      :style="{ fontSize: iconLoading.fontSize, color: iconLoading.color }"
    ></a-icon>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      contentStyle: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateY(-50%, -50%)",
      },
    };
  },
  props: ["iconTitle", "iconLoading", "title", "content"],
};
</script>

<style></style>
