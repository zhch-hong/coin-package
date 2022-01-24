<template>
  <div class="store-manage">
    <vcard padding flex style="background: bottom">
      <el-form class="el-form-search" ref="searchForm" :inline="true" :model="searchForm" label-width="120px">
        <el-row justify="space-between" align="center">
          <el-col :span="8">
            <el-form-item label="用户ID:" prop="uid">
              <el-input
                v-model.number="searchForm.uid"
                size="mini"
                style="width: 200px"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信昵称:" prop="nickName">
              <el-input v-model="searchForm.nickName" size="mini" style="width: 200px" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话号码:" prop="phone">
              <el-input v-model="searchForm.phone" size="mini" style="width: 200px" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参入活动主题:" prop="title">
              <el-input v-model="searchForm.title" size="mini" style="width: 200px" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动时间:" prop="times">
              <el-date-picker
                v-model="searchForm.times"
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
          <el-col :span="7" :offset="1" style="textalign: right">
            <el-button type="primary" size="mini" style="border-radius: 10px; width: 120px" @click="search"
              >查 询</el-button
            >
            <el-button size="mini" type="primary" plain style="border-radius: 10px; width: 120px" @click="reset"
              >重 置</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </vcard>
    <div class="bc-title" style="margin: 20px 0 20px 35px">收支明细</div>
    <vcard style="background: bottom">
      <div class="el-form-table">
        <el-table :data="tableData" style="width: 100%">
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
      <div class="pagenation-box">
        <el-row>
          <el-col :span="12" :offset="9">
            <el-pagination
              :page-size.sync="showNum"
              :current-page.sync="pageNum"
              @current-change="changePage"
              @size-change="changePage"
              background
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="count"
            ></el-pagination>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" size="mini" icon="el-icon-document" :loading="loading" @click="exportXlSX"
              >导出数据
            </el-button>
          </el-col>
        </el-row>
      </div>
    </vcard>
  </div>
</template>

<script>
import { paramsFilter, clearObject } from '@/utils/tools';
import exportTable from '@/utils/outputExcel';

export default {
  name: 'store',
  components: {},
  data() {
    return {
      loading: false,
      // 查询、翻页
      searchForm: {
        uid: '',
        phone: '',
        title: '',
        times: '',
        nickName: '',
      },
      pageNum: 1,
      showNum: 10,
      count: 0,
      // 表格数据
      dataColumn: [
        { prop: 'uid', label: '用户ID', width: 120 },
        { prop: 'nickName', label: '微信昵称', width: 120 },
        { prop: 'phone', label: '电话号码', width: 120 },
        { prop: 'title', label: '参入活动主题', width: 120 },
        { prop: 'time', label: '活动时间', width: 180 },
        { prop: 'type', label: '中奖种类名称', width: 120 },
        { prop: 'name', label: '奖项物品名称', width: 120 },
      ],
      tableData: [],
      // 新增
      showAddModal: false,
      // 编辑
      showEditModal: false,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    reset() {
      this.$refs.searchForm.resetFields();
      this.pageNum = 1;
      this.getInfo();
    },
    search() {
      this.pageNum = 1;
      this.getInfo();
    },
    // 翻页
    changePage(val) {
      this.getInfo();
    },
    getInfo() {
      // 默认参数
      const params = { ...this.searchForm };
      if (params.times && params.times.length) {
        params.startTime = params.times[0];
        params.endTime = params.times[1];
      } else {
        params.startTime = '';
        params.endTime = '';
      }
      delete params.times;
      params.pageNum = this.pageNum;
      params.showNum = this.showNum;
      this.loading = true;
      this.$api
        .getExchangeDetail(params)
        .then((res) => {
          this.tableData = res.body.items;
          this.count = res.body.count;
        })
        .finally((result) => {
          this.loading = false;
        });
    },
    // 导出表格
    exportXlSX() {
      this.loading = true;
      const params = { ...this.searchForm };
      if (params.times && params.times.length) {
        params.startTime = params.times[0];
        params.endTime = params.times[1];
      } else {
        params.startTime = '';
        params.endTime = '';
      }
      delete params.times;
      params.pageNum = 1;
      params.showNum = this.count;
      this.$api.getExchangeDetail(params).then(
        (res) => {
          const data = res.body.items.map((val) => {
            return [val.uid, val.nickName, val.phone, val.title, val.time, val.type, val.name];
          });
          const tHeader = [
            '用户ID',
            '微信昵称',
            '电话号码',
            '参与活动主题',
            '活动时间',
            '中奖种类名称',
            '奖项物品名称',
          ];
          exportTable(tHeader, data, '兑换记录').then(() => {
            this.loading = false;
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.store-manage {
  .list-container {
    padding: 20px;
  }

  .total-content {
    margin: 0;
    padding: 20px;
  }

  .pagenation-box {
    padding: 20px 0 0 0;
    // @include flex(space-between, center, row);
  }
}
.el-form-search {
  width: 100%;
  background-color: #fff;
  padding-top: 19px;
  border-radius: 10px;
}
.el-col-title {
  color: #4194fe;
  font-size: 19px;
  padding-left: 35px;
  box-sizing: border-box;
}
.el-form-table {
  padding: 0 14px;
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
