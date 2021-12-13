<template>
  <div>
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <coinEdit v-if="activeName === '清币加币'"></coinEdit>
    <errorHandler v-if="activeName === '异常处理'"></errorHandler>
    <offline-mode v-if="activeName === '离线模式'"></offline-mode>
  </div>
</template>

<script>
import coinEdit from './components/coinEdit';
import errorHandler from './components/errorHandler';
import OfflineMode from './components/offline-mode';

export default {
  name: 'index',
  components: {
    coinEdit,
    errorHandler,
    OfflineMode,
  },
  data() {
    return {
      activeName: '',
    };
  },
  methods: {
    handleSelect(val) {
      console.log(val);
      this.activeName = val;
    },
  },
  computed: {
    tabList() {
      if (this.$store.state.offline) {
        return ['离线模式'];
      }
      return ['清币加币', '异常处理', '离线模式'];
    },
  },
  created() {
    if (this.$store.state.offline) {
      this.activeName = '离线模式';
    } else {
      this.activeName = '清币加币';
    }
  },
};
</script>

<style scoped></style>
