<template>
  <div style="margin: 16px">
    <div>
      <el-form ref="searchForm" size="mini" :model="searchForm" inline>
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
        <el-form-item label="类别名称" prop="balanceName">
          <el-input v-model.trim="searchForm.balanceName"></el-input>
        </el-form-item>
        <el-form-item label="授权员工" prop="adminName">
          <el-input v-model.trim="searchForm.adminName"></el-input>
        </el-form-item>
        <el-form-item label="收支类型" prop="balanceType">
          <el-select v-model="searchForm.balanceType" clearable>
            <el-option label="收入" :value="1"></el-option>
            <el-option label="支出" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收银员" prop="staffName">
          <el-input v-model.trim="searchForm.staffName"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin: 0 0 16px 0; text-align: right">
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData" height="70vh">
      <el-table-column label="操作时间" prop="time"></el-table-column>
      <el-table-column label="类别" prop="balanceName"></el-table-column>
      <el-table-column label="类型" prop="balanceType" :formatter="typeFormat"></el-table-column>
      <el-table-column label="金额" prop="payValue" :formatter="pointFormat"></el-table-column>
      <el-table-column label="收银员" prop="staffName"></el-table-column>
      <el-table-column label="授权员工" prop="adminName"></el-table-column>
      <el-table-column label="备注" prop="backup" width="310"> </el-table-column>
    </el-table>
    <el-row style="margin-top: 16px">
      <el-col :span="6">
        <el-button size="mini" icon="el-icon-document" :loading="exportLoading" @click="exportExcel"
          >导出数据</el-button
        >
      </el-col>
      <el-col :span="18" style="text-align: right">
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
            payValue: feePage,
            staffName: '-',
            adminName: '-',
            backup: '-',
          },
          {
            time: '合计',
            balanceName: '-',
            balanceType: '-',
            payValue: totalFee,
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
