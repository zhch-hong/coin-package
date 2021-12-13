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
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">
.app-main {
  /*50 = navbar  */
  height: 100%;
  background-color: #f0f2f5;
  position: relative;
  //overflow: hidden;
}
</style>
