<template>
  <div style="height: 100%" class="flex-column">
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <div class="a-placeholder"></div>
    <giftsExchange v-if="activeName === '物品兑换'"></giftsExchange>
    <giftsExchangeRecord v-if="activeName === '兑换记录'"></giftsExchangeRecord>
  </div>
</template>

<script>
import giftsExchange from './components/giftsExchange'
import giftsExchangeRecord from './components/giftsExchangeRecord'

export default {
  name: 'index',
  components: {
    giftsExchange,
    giftsExchangeRecord
  },
  data() {
    return {
      activeName: '物品兑换'
    }
  },
  computed: {
    tabList() {
      return ['物品兑换', '兑换记录']
    }
  },
  methods: {
    handleSelect(val) {
      console.log(val)
      this.activeName = val
    }
  }
}
</script>

<style scoped>
.a-placeholder {
  width: 100%;
  height: 16px;
}
</style>
