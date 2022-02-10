<template>
  <div>
    <template v-if="view === 'package'">
      <SellPackageItem v-for="(sell, index) in sellList" :key="index" :item="sell" />
    </template>
    <template v-else-if="view === 'goods'">
      <SellGoodsItem v-for="(sell, index) in sellList" :key="index" :item="sell" />
    </template>
  </div>
</template>
<script>
/* eslint-disable import/no-extraneous-dependencies */

import { ipcRenderer } from 'electron';
import SellPackageItem from '@/components/SellPackageItem.vue';
import SellGoodsItem from '@/components/SellGoodsItem.vue';

export default {
  components: { SellGoodsItem, SellPackageItem },

  data() {
    return {
      sellList: [],
      view: 'package',
    };
  },

  created() {
    ipcRenderer.on('package-list-change', this.onPackageListChange);
    ipcRenderer.on('goods-list-change', this.onGoodsListChange);
  },

  methods: {
    onPackageListChange(event, value) {
      this.view = 'package';
      this.sellList = value;
    },
    onGoodsListChange(event, value) {
      this.view = 'goods';
      this.sellList = value;
    },
  },
};
</script>
