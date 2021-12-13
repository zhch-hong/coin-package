<template>
  <div>
    <el-dialog
      :visible.sync="showModal"
      width="60%"
      height="80vh"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="el-dialog-title-box">
        <div class="bc-title">变更清单</div>
      </div>
      <div class="el-from-box">
        <el-form ref="searchForm" :inline="true" :model="searchForm">
          <el-row>
            <el-col :span="9">
              <el-form-item label="类型:">
                <el-select v-model="searchForm.reason" style="width: 200px" clearable size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="记录时间:">
                <el-date-picker
                  v-model="searchForm.time"
                  unlink-panels
                  format="yyyy-MM-dd"
                  style="width: 240px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  type="daterange"
                  size="mini"
                  placeholder="请输入变动时间"
                  :default-time="['00:00:00', '23:59:59']"
                  clearable
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" style="width: 132px" @click="handleSearch">查 询 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="el-table-box">
        <el-table
          :loading="loading"
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          :header-cell-style="{ backgroundColor: 'rgb(242,242,242)' }"
          :cell-style="{ padding: '30px 0' }"
        >
          <el-table-column
            v-for="(col, index) in dataColumn"
            :key="index"
            :prop="col.prop"
            :label="col.label"
            :min-width="col.width"
            align="center"
          ></el-table-column>
        </el-table>
      </div>

      <!--导出以及分页部分-->
      <div class="pagenation-box flex-center">
        <el-pagination
          :page-size.sync="showNum"
          :current-page.sync="pageNum"
          @current-change="getInfo"
          @size-change="getInfo"
          background
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
      </div>
      <div slot="footer">
        <el-button type="primary" style="width: 100px" size="mini" :loading="loading" @click="closeModal"
          >确定
        </el-button>
        <el-button type="info" style="width: 100px" size="mini" :loading="loading" @click="closeModal"
          >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'coin_record',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    sourceData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      showModal: false,
      editData: {},
      searchForm: {
        reason: '',
        time: [],
      },
      options: [
        {
          value: '加币',
          label: '加币',
        },
        {
          value: '清币',
          label: '清币',
        },
      ],
      pageNum: 1,
      showNum: 10,
      count: 0,
      // 表格数据
      dataColumn: [
        { prop: 'name', label: '操作员工', width: 120 },
        { prop: 'time', label: '时间', width: 120 },
        { prop: 'updateNum', label: '币数', width: 120 },
        { prop: 'reason', label: '类型', width: 120 },
        { prop: 'note', label: '备注', width: 120 },
      ],
      tableData: [],
    };
  },
  watch: {
    value(newVal) {
      this.showModal = newVal;
    },
    sourceData(newVal) {
      const row = newVal;
      this.editData = JSON.parse(JSON.stringify(row));
      this.getInfo();
    },
  },
  methods: {
    closeModal() {
      this.$emit('input', false);
    },
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getInfo();
    },
    // 格式化参数
    formatSearchParams() {
      const result = { ...this.searchForm };
      result.startTime = result.time?.[0] || '';
      result.endTime = result.time?.[1] || '';
      delete result.time;
      result.pageNum = this.pageNum;
      result.showNum = this.showNum;
      return result;
    },
    // 获取表格数据
    getInfo() {
      this.loading = true;
      this.$api
        .getMachineCoinDetail(this.formatSearchParams())
        .then((res) => {
          this.tableData = res.body.items;
          this.count = res.body.count;
        })
        .finally(() => {
          this.loading = false;
        });
      // this.$nextTick(() => {
      //   this.$refs.searchForm.validate((v) => {
      //     if (v) {
      //     }
      //   });
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
.list-container {
}

.pagenation-box {
  padding: 20px;
  // @include flex(space-between, center, row);
}
.el-dialog-title-box {
  padding: 34px 0 0 98px;
  box-sizing: border-box;
  font-size: 19px;
}
.el-from-box {
  width: 100%;
  padding: 33px 56px 0 90px;
  box-sizing: border-box;
}
.el-table-box {
  padding: 0 50px;
  box-sizing: border-box;
}
</style>
