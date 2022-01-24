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
  /* 屏幕小于1400px */
  @media screen and (max-width: 1400px) {
    .layout {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 222px;
      height: 109px;
      padding: 10px;
      color: #fff;
      font-size: 18px;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      .content {
        // position: relative;
        margin: 0;
      }
    }
  }
  /* 屏幕大于1400px */
  @media screen and (min-width: 1401px) {
    .layout {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 283px;
      height: 109px;
      padding: 30px;
      color: #fff;
      font-size: 20px;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      .content {
        // position: relative;
        margin: 0;
      }
    }
  }
}
</style>
