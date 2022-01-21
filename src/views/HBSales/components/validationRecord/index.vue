<template>
  <div class="validation-record">
    <bc-search ref="condition" :loading="loading" :config="filterConfig" @on-search="handleOnSearch(1)" />
    <bc-table
      :config="tableConfig"
      :data="tableData"
      :loading="loading"
      :page-num="pageNum"
      :show-num="showNum"
      :count="count"
      @on-page-change="handleOnSearch"
      @on-size-change="handleOnSizeChange"
    >
    </bc-table>
  </div>
</template>

<script>
import { to } from '@/utils/tools';

export default {
  name: 'validation-record',
  data() {
    return {
      loading: false,
      tableData: [],
      pageNum: 1,
      showNum: 10,
      count: 0,
    };
  },
  computed: {
    filterConfig() {
      return [
        { label: '订单号', prop: 'orderId', type: 'input', valueType: 'number' },
        { label: '用户ID', prop: 'uid', type: 'input', valueType: 'number' },
        { label: '手机号码', prop: 'phone', type: 'input', valueType: 'number' },
        { label: '规格名称', prop: 'specificationName', type: 'input' },
        {
          label: '核销时间',
          type: 'datePicker',
          valueType: 'string',
          prop: 'time',
          startProp: 'startTime',
          endProp: 'endTime',
        },
      ];
    },
    tableConfig() {
      return {
        columns: [
          { label: '订单号', prop: 'orderId' },
          { label: '用户ID', prop: 'uid' },
          { label: '手机号码', prop: 'phone' },
          { label: '规格名称', prop: 'specificationName' },
          { label: '套餐名称', prop: 'giftName' },
          { label: '核销时间', prop: 'checkTime' },
          { label: '核销数量', prop: 'count' },
          { label: '核销金额', filter: (data) => this.MIXIN_Points2Yuan(data.leagueSettle) },
          { label: '核销模块', prop: 'moduleName' },
          { label: '核销员工', prop: 'staffName' },
        ],
      };
    },
  },
  methods: {
    handleOnSizeChange(showNum) {
      this.showNum = showNum;
      this.handleOnSearch(1);
    },
    async handleOnSearch(pageNum) {
      if (pageNum) {
        this.pageNum = pageNum;
      }
      const params = this.$refs.condition.getParams();
      params.pageNum = this.pageNum;
      params.showNum = this.showNum;
      this.loading = true;
      const [err, res] = await to(this.$api.getLeagueCheckDetail(params));
      this.loading = false;
      if (res) {
        this.tableData = res.body.items;
        this.count = res.body.count;
      }
    },
  },
  mounted() {
    this.handleOnSearch(1);
  },
};
</script>

<style lang="scss" scoped>
.validation-record {
  padding: 24px;
}
</style>
