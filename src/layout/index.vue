<template>
  <div class="app-wrapper">
    <el-container style="height: 100%">
      <el-aside width="265px">
        <sidebar class="sidebar-container" />
      </el-aside>
      <el-container>
        <el-header style="padding: 0; height: 50px">
          <navbar />
        </el-header>
        <el-main style="padding: 0">
          <app-main />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  computed: {},
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  // position: fixed;
  // top: 0;
  // right: 0;
  // z-index: 9;
  width: 100%;
  // width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.sidebar-container {
  background-image: url('./../assets/layout/leftBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
</style>
