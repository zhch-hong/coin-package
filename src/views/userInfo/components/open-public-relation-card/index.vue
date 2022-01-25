<template>
  <div class="open-public-relation-card">
    <div class="flex-start">
      <div
        class="type-name"
        :style="{ color: cardType === 0 ? '#4194FE' : '#898989' }"
        @click="handleToggleCardType(0)"
      >
        开虚拟账户
      </div>
      <el-divider direction="vertical" />
      <div
        class="type-name"
        :style="{ color: cardType === 1 ? '#4194FE' : '#898989' }"
        @click="handleToggleCardType(1)"
      >
        开实体卡
      </div>
    </div>
    <component :is="cardType === 0 ? 'OpenVirtualAccount' : 'OpenEntityCard'"></component>
  </div>
</template>

<script>
import OpenVirtualAccount from './components/open-virtual-account';
import OpenEntityCard from './components/open-entity-card';

export default {
  name: 'open-public-relation-card',
  components: { OpenVirtualAccount, OpenEntityCard },
  data() {
    return {
      cardType: 0, //  0 虚拟账户  |   1 实体卡
    };
  },
  methods: {
    handleToggleCardType(type) {
      this.cardType = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.open-public-relation-card {
  padding: 35px 50px;
  box-sizing: border-box;
  .type-name {
    cursor: pointer;
    font-size: 19px;
    font-weight: 500;
    color: #898989;
  }
}
</style>
