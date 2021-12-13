<template>
  <div class="table-column-actions">
    <div>剩余游戏币：{{ scope.row.coin + scope.row.sendCoin }}</div>
    <div>剩余积分：{{ scope.row.integral }}</div>
    <div v-for="(item, index) in scope.row.giftList" :key="index">{{ item.name }}:{{ item.type === 2 ? item.useNum + '次' : getTime(item) }}</div>
  </div>
</template>

<script>
export default {
  name: 'table-column-actions',
  props: {
    scope: {
      type: Object,
      required: true
    }
  },
  methods: {
    getTime(data) {
      switch (data.overGiftType) {
        case 1:
          return `${data.overGiftTime}天`
        case 2:
          return `${data.overGiftTime}天`
        case 3:
          return data.overGiftTime
        case 4:
          return '无过期时间'
        default:
          return '-'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-column-actions {
}
</style>
