<template>
  <div style="padding: 20px">
    <bc-search ref="condition" style="padding: 24px; background-color: #ffffff" :config="formConfig" @on-search="handleOnSearch(1)" />
    <bc-table
      @on-page-change="handleOnSearch"
      @on-size-change="handleSizeChange"
      :loading="loading"
      :data="tableData"
      :config="tableConfig"
      :page-num="pageNum"
      :show-num="showNum"
      :count="count"
    />
  </div>
</template>

<script>
import { to } from '@utils/tools'
import TableColumnRecord from './components/table-column-record'

export default {
  name: 'temporary-bind-records',
  data() {
    return {
      loading: false,
      tableData: [],
      pageNum: 1,
      showNum: 20,
      count: 0
    }
  },
  computed: {
    formConfig() {
      return [
        {
          label: '绑定时间',
          prop: 'time',
          type: 'datePicker',
          valueType: 'string',
          startProp: 'startTime',
          endProp: 'endTime'
        },
        { label: '电话号码', prop: 'phone', type: 'input' },
        { label: '会员ID', prop: 'uid', type: 'input' }
      ]
    },
    tableConfig() {
      return {
        columns: [
          { label: '绑定时间', prop: 'time' },
          { label: '电话号码', prop: 'phone' },
          { label: '会员ID', prop: 'uid' },
          { label: '会员昵称', prop: 'nickName' },
          { label: '临时账户资产记录', component: TableColumnRecord }
        ]
      }
    }
  },
  methods: {
    handleSizeChange(showNum) {
      this.showNum = showNum
      this.handleOnSearch(1)
    },
    handleOnSearch(pageNum) {
      if (pageNum) {
        this.pageNum = pageNum
      }
      const params = {
        ...this.$refs.condition.getParams(),
        pageNum: this.pageNum,
        showNum: this.showNum
      }
      if (params.uid) {
        params.uid = Number(params.uid)
      }
      this.getData(params)
    },
    async getData(params) {
      this.loading = true
      const [, res] = await to(this.$api.getCardMigrationDetail(params))
      this.loading = false
      if (res) {
        this.tableData = res.body.items
        this.count = res.body.count
      }
    }
  },
  mounted() {
    this.handleOnSearch(1)
  }
}
</script>
