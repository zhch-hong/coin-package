<template>
  <section class="app-main">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped lang="scss">
.app-main {
  /*50 = navbar  */
  min-height: 100%;
  // background-color: #f0f2f5;
  background-image: url('../../assets/layout/rightBg.png');
  background-repeat: repeat-y;
  background-size: 100% 100%;
  background-position: center;
  position: relative;
  //overflow: hidden;
}
</style>
