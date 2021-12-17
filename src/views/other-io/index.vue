<template>
  <div>
    <bc-tab :tabs="tabList" @select="onChangeTab"></bc-tab>
    <component :is="current"></component>
  </div>
</template>
<script>
import OtherInput from './components/OtherInput.vue';
import OtherOutput from './components/OtherOutput.vue';
import IODetail from './components/IODetail.vue';

export default {
  components: {
    OtherInput,
    OtherOutput,
    IODetail,
  },

  data() {
    return {
      tabList: ['收入', '支出', '收支明细'],
      current: 'OtherInput',
    };
  },

  methods: {
    onChangeTab(value) {
      if (value === '收入') this.current = 'OtherInput';
      if (value === '支出') this.current = 'OtherOutput';
      if (value === '收支明细') this.current = 'IODetail';
    },
  },
};
</script>
