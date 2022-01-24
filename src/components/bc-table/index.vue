<template>
  <div class="bc-table content-body table-page-base">
    <div class="header-box flex-between" v-if="showHeader">
      <div class="count-text"></div>
      <div>
        <slot></slot>
      </div>
    </div>
    <el-table
      :data="data"
      :row-style="config.rowStyle"
      v-loading="loading"
      ref="table"
      style="width: 100%"
      @selection-change="handleOnSelectionChange"
      @sort-change="handleOnSortChange"
      :header-cell-style="{ backgroundColor: '#ffffff' }"
      :span-method="config.spanMethod"
      :show-summary="config.showSummary"
      :summary-method="config.getSum"
    >
      <template v-for="(item, index) in config.columns">
        <el-table-column
          align="center"
          :key="index"
          v-if="item.type && item.type === 'selection'"
          type="selection"
        ></el-table-column>
        <el-table-column
          align="center"
          :key="index"
          v-else-if="item.type && item.type === 'index'"
          type="index"
        ></el-table-column>
        <el-table-column align="center" :key="index" v-else-if="item.type && item.type === 'expand'" type="expand">
          <template slot-scope="scope">
            <component :is="item.component" :scope="scope" v-on="$listeners"></component>
          </template>
        </el-table-column>
        <el-table-column align="center" v-else :key="index" v-bind="item">
          <template slot-scope="scope">
            <div>
              <component v-if="item.component" :is="item.component" :scope="scope" v-on="$listeners" />
              <span v-else-if="item.filter">{{ item.filter(scope.row) }}</span>
              <span v-else-if="item.prop && scope.row[item.prop] !== null && scope.row[item.prop] !== ''">
                {{ scope.row[item.prop] }}
              </span>
              <span v-else>-</span>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!--导出以及分页部分-->
    <div class="bottom-contain flex-center">
      <div>
        <slot name="footer-actions"></slot>
      </div>
      <el-pagination
        v-if="needPagination"
        :page-size.sync="pageSize"
        :current-page.sync="pageNumber"
        :total="total"
        @current-change="changePageNum"
        @size-change="changeShowNum"
        background
        :page-sizes="[10, 20, 50, 100]"
        layout="total,sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BcTable',
  props: {
    config: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showNum: {
      type: Number,
      default: 20,
    },
    pageNum: {
      type: Number,
      default: 1,
    },
    count: {
      type: Number,
      default: 0,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    needPagination: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pageSize: 10,
      pageNumber: 1,
      total: 0,
    };
  },
  // fix bug: 解决固定表格高度后，不显示合计的BUG
  updated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    });
  },
  watch: {
    pageNum: {
      immediate: true,
      handler(val) {
        this.pageNumber = val;
      },
    },
    showNum: {
      immediate: true,
      handler(val) {
        this.pageSize = val;
      },
    },
    count: {
      immediate: true,
      handler(val) {
        this.total = val;
      },
    },
  },
  methods: {
    handleOnSortChange({ column, prop, order }) {
      this.$emit('on-sort-change', { column, prop, order });
    },
    changePageNum(pageNum) {
      this.$emit('on-page-change', pageNum);
      this.$emit('change', {
        pageNum: this.pageNumber,
        showNum: this.pageSize,
      });
    },
    changeShowNum(showNum) {
      this.$emit('on-size-change', showNum);
      this.$emit('change', {
        pageNum: this.pageNumber,
        showNum: this.pageSize,
      });
    },
    handleOnSelectionChange(selection) {
      this.$emit('on-change', selection);
    },
  },
};
</script>

<style lang="scss" scoped>
.bc-table {
  .header-box {
    padding: 16px 0;

    .count-text {
      font-size: 14px;
      color: #606266;
      font-weight: bold;
    }
  }

  .bottom-contain {
    padding: 16px 0;
  }
}
</style>
