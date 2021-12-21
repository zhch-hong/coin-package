<template>
  <div class="type-item" @click="$emit('click')">
    <div class="layout">
      <p class="content">{{ value }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
  },
};
</script>
<style lang="scss" scoped>
.type-item {
  display: inline-block;
  margin: 20px;

  .layout {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 240px;
    height: 109px;
    padding: 10px;
    color: #fff;
    font-size: 23px;
    background: url('../../../assets/other-io.png') center/contain;

    .content {
      // position: relative;
      margin: 0;
    }
  }
}
</style>
