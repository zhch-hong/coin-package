<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <img class="app-name" src="@/assets/layout/appName.png" alt="appName" />
    <div class="app-main-menu-list">
      <div
        class="app-main-menu-item"
        :class="{ 'item-active': currentRoute.path === route.path }"
        v-if="route.meta"
        v-for="route in routes"
        :key="route.path"
        @click="clickMenu(route)"
      >
        <img class="menu-icon" :src="require('@/assets/layout/menuIcon/' + route.meta.icon + '.png')" alt="icon" />
        {{ route.meta.title }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import variables from '@/styles/variables.scss';
import Logo from './Logo';

export default {
  components: { Logo },
  data() {
    return {
      currentRoute: {
        path: '/package',
      },
      version: '',
    };
  },
  methods: {
    clickMenu(route) {
      console.log(route);
      if (route.path === this.$route.path || route.redirect === this.$route.path) return;
      this.currentRoute = route;
      this.$router.push({
        path: route.path,
      });
    },
  },
  created() {
    this.version = localStorage.getItem('version');
  },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      const routes = this.$router.options.routes;
      if (this.$store.state.offline) {
        return routes.filter((route) => route.meta && route.meta.offline);
      }
      return routes;
    },
    activeMenu() {
      // const route = this.$route
      // const {meta, path} = route
      // // if set path, the sidebar will highlight the path you set
      // if (meta.activeMenu) {
      //     return meta.activeMenu
      // }
      // return path
      return '/';
    },
    showLogo() {
      return true;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
<style lang="scss">
.app-name {
  width: 150px;
  display: block;
  margin: 0 auto 20px;
}

.app-main-menu-list {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  padding: 0 26px;

  .app-main-menu-item {
    @include flex(center, center, column);
    border-radius: 20px;
    width: 103px;
    height: 99px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: white;
    font-family: aCustomFontNameForFree;

    .menu-icon {
      width: 38px;
      height: 38px;
      margin-bottom: 12px;
    }
  }
}

.item-active {
  background-color: #528eff;
  // box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.35) inset;
  box-shadow: 0px 4px 9px 0px rgba(140, 132, 249, 0.35) inset;
  border-radius: 16px;
}
</style>
