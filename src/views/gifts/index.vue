<template>
  <div>
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <giftsSale v-if="activeName === '物品销售'"></giftsSale>
    <giftsSaleRecord v-if="activeName === '销售记录'"></giftsSaleRecord>
    <giftsStatistical v-if="activeName === '销售统计'"></giftsStatistical>
  </div>
</template>

<script>
import giftsSale from './components/giftsSale'
import giftsSaleRecord from './components/giftsSaleRecord'
import giftsStatistical from './components/giftsStatistical'

export default {
  name: 'gifts',
  components: {
    giftsSale,
    giftsSaleRecord,
    giftsStatistical
  },
  data() {
    return {
      activeName: '物品销售'
    }
  },
  computed: {
    tabList() {
      return ['物品销售', '销售记录', '销售统计']
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

<style scoped></style>
