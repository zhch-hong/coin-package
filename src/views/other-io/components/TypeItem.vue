<template>
  <div class="type-item" @click="$emit('click')">
    <div
      class="layout"
      :style="{
        'background-image': isInput
          ? `url(${require('@/assets/other-io.png')})`
          : `url(${require('@/assets/other-out.png')})`,
      }"
    >
      <p class="content">{{ value }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    isInput: Boolean,
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
    background-position: center;
    background-size: contain;

    .content {
      // position: relative;
      margin: 0;
    }
  }
}
</style>
