<template>
  <div style="margin: 16px">
    <div>
      <el-form class="el-form-style" ref="searchForm" size="mini" :model="searchForm" inline>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="datetimerange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="类别名称" prop="balanceName">
              <el-input v-model.trim="searchForm.balanceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权员工" prop="adminName">
              <el-input v-model.trim="searchForm.adminName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收支类型" prop="balanceType">
              <el-select v-model="searchForm.balanceType" clearable>
                <el-option label="收入" :value="1"></el-option>
                <el-option label="支出" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收银员" prop="staffName">
              <el-input v-model.trim="searchForm.staffName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button size="small" type="primary" @click="handleSearch" style="border-radius: 10px; width: 120px"
                >查询</el-button
              >
              <el-button
                size="small"
                plain
                type="primary"
                @click="handleReset"
                style="border-radius: 10px; width: 120px"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bc-title" style="margin: 20px 0 20px 35px">收支明细</div>
    <el-table :data="tableData" height="70vh">
      <el-table-column label="操作时间" prop="time" align="center"></el-table-column>
      <el-table-column label="类别" prop="balanceName" align="center"></el-table-column>
      <el-table-column label="类型" prop="balanceType" :formatter="typeFormat" align="center"></el-table-column>
      <el-table-column label="金额" prop="payValue" :formatter="pointFormat" align="center"></el-table-column>
      <el-table-column label="收银员" prop="staffName" align="center"></el-table-column>
      <el-table-column label="授权员工" prop="adminName" align="center"></el-table-column>
      <el-table-column label="备注" prop="backup" width="310" align="center"> </el-table-column>
    </el-table>

    <el-row style="margin-top: 16px">
      <el-col :span="2">
        <span style="visibility: hidden">xxx</span>
      </el-col>
      <el-col :span="19" style="text-align: center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size.sync="searchForm.showNum"
          :total="total"
          :current-page.sync="searchForm.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="fetchTableData"
          @size-change="fetchTableData"
        ></el-pagination>
      </el-col>
      <el-col :span="3" style="text-align: center">
        <el-button
          size="mini"
          type="primary"
          style="border-radius: 10px; width: 105px"
          icon="el-icon-document"
          :loading="exportLoading"
          @click="exportExcel"
          >导出数据</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import $api from '@/api';
import exportTable from '@utils/outputExcel';
import calc from '@utils/calc';

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      datetimerange: null,
      exportLoading: false,
      searchForm: {
        balanceName: '',
        adminName: '',
        balanceType: '',
        staffName: '',
        startTime: '',
        endTime: '',
        sort: '',
        orderBy: '',
        pageNum: 1,
        showNum: 10,
      },
    };
  },

  watch: {
    datetimerange(value) {
      if (value === null) {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      } else {
        this.searchForm.startTime = value[0];
        this.searchForm.endTime = value[1];
      }
    },
  },

  mounted() {
    this.fetchTableData();
  },

  methods: {
    async fetchTableData() {
      const { body, errCode } = await $api.readOtherIORecord(this.searchForm);
      if (errCode === 0) {
        const { items, count, totalFee } = body;
        const { feePage } = this.summaryColumn(items);
        this.tableData = items;
        this.total = count;
        this.tableData.push(
          {
            time: '小计',
            balanceName: '-',
            balanceType: '-',
            payValue: feePage.toFixed(2),
            staffName: '-',
            adminName: '-',
            backup: '-',
          },
          {
            time: '合计',
            balanceName: '-',
            balanceType: '-',
            payValue: totalFee.toFixed(2),
            staffName: '-',
            adminName: '-',
            backup: '-',
          }
        );
      }
    },

    handleSearch() {
      this.searchForm.pageNum = 1;
      this.fetchTableData();
    },

    async handleReset() {
      this.searchForm.startTime = '';
      this.searchForm.endTime = '';
      this.datetimerange = null;
      this.$refs.searchForm.resetFields();
      await this.$nextTick();
      this.handleSearch();
    },

    summaryColumn(data) {
      let feePage = 0;
      data.forEach(({ payValue }) => {
        feePage = calc.accAdd(feePage, payValue);
      });
      return {
        feePage,
      };
    },

    typeFormat(row, col, value) {
      if (value === 1) return '收入';
      if (value === 2) return '支出';
      return value;
    },

    pointFormat(row, col, value) {
      return this.MIXIN_Points2Yuan(value);
    },

    exportExcel() {
      this.exportLoading = true;
      const clone = { ...this.searchForm };
      delete clone.pageNum;
      delete clone.showNum;

      $api.readOtherIORecord(clone).then(
        ({ body }) => {
          const { items, totalFee } = body;
          const data = items.map((val) => {
            return [
              val.time,
              val.balanceName,
              this.typeFormat('', '', val.balanceType),
              this.MIXIN_Points2Yuan(val.payValue),
              val.staffName,
              val.adminName,
              val.backup,
            ];
          });

          data.push(['合计', '-', '-', this.MIXIN_Points2Yuan(totalFee), '-', '-', '-']);

          const tHeader = ['操作时间', '类别', '类型', '金额', '收银员', '授权员工', '备注'];
          exportTable(tHeader, data, '收支明细').then(() => {
            this.exportLoading = false;
          });
        },

        () => {
          this.exportLoading = false;
        }
      );
    },
  },
};
</script>
<style scoped lang="scss">
.el-form-style {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px 30px 10px 30px;
  box-sizing: border-box;
}
.table-box-style {
  padding: 10px;
  background: white;
  border-radius: 10px;
  box-sizing: border-box;
}
/deep/ .el-table__header-wrapper {
  border-radius: 10px;
  background: white;
}
/deep/ .el-table {
  .thead {
    color: red;
  }
}
</style>
