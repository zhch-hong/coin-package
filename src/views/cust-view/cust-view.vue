<template>
  <div class="cust-view">
    <template v-if="view === 'package'">
      <div v-for="(sell, index) in sellList" :key="index" class="item">
        <SellPackageItem :item="sell" />
      </div>
    </template>
    <template v-else-if="view === 'goods'">
      <div v-for="(sell, index) in sellList" :key="index" class="item">
        <SellGoodsItem :item="sell" />
      </div>
    </template>
    <template v-else-if="view === 'haspackage'">
      <div v-for="(sell, index) in sellList" :key="index" class="item">
        <SellHaspackageItem :item="sell" />
      </div>
    </template>
  </div>
</template>
<script>
/* eslint-disable import/no-extraneous-dependencies */

import { ipcRenderer } from 'electron';
import SellPackageItem from '@/components/SellPackageItem.vue';
import SellGoodsItem from '@/components/SellGoodsItem.vue';
import SellHaspackageItem from '@/components/SellHaspackageItem.vue';

export default {
  components: { SellGoodsItem, SellPackageItem, SellHaspackageItem },

  data() {
    return {
      sellList: [],
      view: 'package',
    };
  },

  created() {
    ipcRenderer.on('package-list-change', this.onPackageListChange);
    ipcRenderer.on('goods-list-change', this.onGoodsListChange);
    ipcRenderer.on('haspackage-list-change', this.onHaspackageListChange);
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
    onHaspackageListChange(event, value) {
      this.view = 'haspackage';
      this.sellList = value;
    },
  },
};
</script>
<style lang="scss" scoped>
.cust-view {
  display: flex;
  flex-wrap: wrap;

  .item {
    margin: 16px;
  }
}
</style>
