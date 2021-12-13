<template>
  <div class="store-manage">
    <vcard style="background-color: #f0f2f5; margin-bottom: 0px">
      <div class="padding-table">
        <el-table
          :data="tableData"
          :loading="loading"
          style="width: 100%"
          :header-row-style="{ backgroundColor: '#fff', borderRadius: '10px' }"
          :cell-style="{ backgroundColor: '#f0f2f5', borderBottom: '1px solid #e2e4e8' }"
        >
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="cutCoin(scope.row)">清币</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" @click="appendCoin(scope.row)">加币</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" @click="coinRecord(scope.row)">变更清单</el-button>
            </template>
          </el-table-column>
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
    </vcard>
    <!-- 清币 -->
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="custom-frame-header">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" class="custom-frame-left-icon" />
        <div>
          <div class="custom-frame-tip">是否确认清币？</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="flex-center">
          <el-button type="primary" style="width: 100px" :loading="loading" @click="closeScanUserInfoModal"
            >确定
          </el-button>
          <el-button
            type="info"
            style="width: 100px; margin-left: 100px"
            :loading="loading"
            @click="dialogVisible = false"
            >取 消
          </el-button>
        </div>
      </div>
    </el-dialog>
    <coin_cut v-model="showCutModal" :machine="selectMachine" @success="addSuccess"></coin_cut>
    <coin_add v-model="showAddModal" :machine="selectMachine" @success="addSuccess"></coin_add>
    <coin_record v-model="showRecordModal" :source-data="editData"></coin_record>
  </div>
</template>

<script>
/* eslint-disable camelcase */

import { paramsFilter } from '@/utils/tools';
import coin_cut from './coin_cut';
import coin_add from './coin_add';
import coin_record from './coin_record';

export default {
  name: 'store',
  components: { coin_cut, coin_add, coin_record },
  data() {
    return {
      loading: false,
      /** 操作的机台 */
      selectMachine: {},
      // 表格数据
      dataColumn: [
        // { prop: "name", label: "操作员工", width: 120 },
        { prop: 'machineCount', label: '当前币数', width: 120 },
        { prop: 'machineName', label: '设备名称', width: 120 },
        { prop: 'machineId', label: '设备ID', width: 120 },
      ],
      tableData: [],
      // 清币
      showCutModal: false,
      // 加币
      showAddModal: false,
      // 清单
      showRecordModal: false,
      editData: {},
      dialogVisible: false,
    };
  },
  methods: {
    addSuccess() {
      this.getInfo();
    },
    // 清币
    closeScanUserInfoModal() {
      this.showCutModal = true;
      this.dialogVisible = false;
    },
    cutCoin(row) {
      this.dialogVisible = true;
      this.selectMachine = row;
      // this.$confirm('是否确认清币?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   showClose: false,
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.showCutModal = true
      //   })
      //   .catch(() => {})
    },

    appendCoin(row) {
      this.showAddModal = true;
      this.selectMachine = row;
    },

    coinRecord(bloc) {
      this.editData = bloc;
      this.showRecordModal = true;
    },
    getInfo() {
      this.loading = true;
      this.$api
        .getMachineInfo()
        .then((res) => {
          this.tableData = res.body.items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.getInfo();
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
.store-manage {
  .list-container {
    padding: 20px;
  }

  .total-content {
    margin: 0;
    padding: 20px;
  }

  .pagenation-box {
    padding: 20px;
    @include flex(space-between, center, row);
  }
}
.padding-table {
  padding: 19px 14px 0 14px;
  box-sizing: border-box;
}
</style>
<style>
.el-divider {
  background: #898989;
}
</style>
