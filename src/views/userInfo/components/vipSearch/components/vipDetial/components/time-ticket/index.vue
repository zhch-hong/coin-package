<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="realName" label="会员名称"/>
    <el-table-column prop="name" label="套餐名称"/>
    <el-table-column label="首次使用时间">
      <template slot-scope="scope">
        <div>
          <div v-if="scope.row.useTimeList.length">
            {{ scope.row.useTimeList[0].time }}
          </div>
          <span v-else>-</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="endTime" label="过期时间"/>
    <el-table-column prop="registerTime" label="购买时间"/>
  </el-table>
</template>

<script>
export default {
  name: "TimeTicket",
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    userInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.uid) {
          this.getData()
        }
      }
    }
  },
  methods: {
    async getData() {
      const res = await this.$api.getUserAllTimeNumGift({uid: this.userInfo.uid, giftType: 2})
      this.tableData = res.body.items.map(item => {
        return {...item, realName: res.body.realName}
      })
    }
  }
}
</script>

