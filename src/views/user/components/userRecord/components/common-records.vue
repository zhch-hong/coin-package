<template>
  <div class="common-records">
    <el-form
      ref="searchForm"
      style="
        width: 100%;
        background-color: #ffffff;
        padding: 20px 20px 0 20px;
        border-radius: 10px;
        box-sizing: border-box;
      "
      :inline="true"
      :model="searchForm"
      label-width="80px"
    >
      <el-row justify="space-between" align="center">
        <el-col :span="8">
          <el-form-item label="玩家ID:" prop="uid">
            <el-input
              v-model="searchForm.uid"
              size="mini"
              clearable
              style="width: 200px"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="操作类型:" prop="type">
            <el-select v-model="searchForm.type" style="width: 180px" clearable size="mini" placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" class="flex-end">
          <el-form-item label="操作时间:" prop="time">
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
      </el-row>
      <div class="flex-end">
        <el-form-item>
          <el-button type="primary" size="mini" style="border-radius: 10px; width: 120px" @click="search"
            >查 询</el-button
          >
          <el-button
            size="mini"
            style="border-radius: 10px; width: 120px; border-color: #4194fe; color: #4194fe"
            @click="reset"
            >重 置
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="bc-title" style="margin: 20px 0 20px 35px">操作记录</div>
    <el-table :loading="loading" :data="tableData" style="width: 100%">
      <el-table-column label="操作时间" prop="time" align="center" min-width="140"></el-table-column>
      <el-table-column label="玩家ID" prop="uid" align="center" min-width="140"></el-table-column>
      <el-table-column
        label="变动前游戏币数"
        prop="beforeNum"
        align="center"
        min-width="160"
        :formatter="startCoinFormat"
      ></el-table-column>
      <el-table-column
        label="变动前积分数"
        prop="beforeNum"
        align="center"
        min-width="120"
        :formatter="startScoreFormat"
      ></el-table-column>
      <el-table-column label="操作类型" prop="type" align="center" min-width="120" :formatter="actionFormat">
      </el-table-column>
      <el-table-column label="操作数量" prop="changeNum" align="center" min-width="120"></el-table-column>
      <el-table-column
        label="变动后游戏币数"
        prop="afterNum"
        align="center"
        min-width="120"
        :formatter="endCoinFormat"
      ></el-table-column>
      <el-table-column
        label="变动后积分数"
        prop="afterNum"
        align="center"
        min-width="120"
        :formatter="endScoreFormat"
      ></el-table-column>
      <el-table-column label="收银员" prop="staffName" align="center" min-width="120"></el-table-column>
      <el-table-column label="授权员工" prop="auditor" align="center" min-width="120"></el-table-column>
      <el-table-column label="备注" prop="backup" align="center" min-width="120"></el-table-column>
    </el-table>
    <br />
    <!--导出以及分页部分-->
    <div class="flex-center">
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
  </div>
</template>

<script>
import { paramsFilter, clearObject } from '@/utils/tools';

export default {
  name: 'CommonRecords',
  components: {},
  data() {
    return {
      loading: false,
      statusList: [
        { label: '提币', value: 1 },
        { label: '补游戏币', value: 2 },
        { label: '补积分', value: 3 },
        { label: '补彩票', value: 4 },
      ],
      // 查询、翻页
      searchForm: {
        uid: '',
        type: '',
        time: [],
      },
      pageNum: 1,
      showNum: 10,
      count: 0,
      // 表格数据
      tableData: [],
    };
  },

  mounted() {
    this.getInfo();
  },
  methods: {
    reset() {
      this.pageNum = 1;
      this.$refs.searchForm.resetFields();
      this.getInfo();
    },
    search() {
      this.pageNum = 1;
      this.getInfo();
    },
    getInfo() {
      // 默认参数
      const params = {
        ...this.searchForm,
      };
      console.log(params);
      if (params.time && params.time.length) {
        params.startTime = params.time[0];
        params.endTime = params.time[1];
      } else {
        params.startTime = '';
        params.endTime = '';
      }
      delete params.time;
      params.pageNum = this.pageNum;
      params.showNum = this.showNum;
      this.loading = true;
      this.$api
        .getUserLog(params)
        .then((res) => {
          this.tableData = res.body.items;
          this.count = res.body.count;
        })
        .finally((result) => {
          this.loading = false;
        });
    },

    actionFormat(row, col, value) {
      if (value === 1) return '提币';
      if (value === 2) return '补游戏币';
      if (value === 3) return '补积分';
      if (value === 4) return '补彩票';
      return value;
    },

    startCoinFormat({ beforeNum, type }) {
      if (type === 1 || type === 2) return beforeNum;
      return 0;
    },

    startScoreFormat({ beforeNum, type }) {
      if (type === 3 || type === 4) return beforeNum;
      return 0;
    },

    endCoinFormat({ afterNum, type }) {
      if (type === 1 || type === 2) return afterNum;
      return 0;
    },

    endScoreFormat({ afterNum, type }) {
      if (type === 3 || type === 4) return afterNum;
      return 0;
    },

    // 导出表格
    exportXlSX() {
      this.loading = true;
      const obj = {
        pageNum: 1,
        showNum: this.count,
        ...paramsFilter(this.searchForm),
      };
      this.$api.redCoinDetail.getRedCoinDetail(obj).then(
        (res) => {
          const data = res.body.items.map((val) => {
            return [val.playerInPut, val.playerOutPut, val.date];
          });
          const tHeader = ['用户投入(红包币)', '用户产出(红包币)', '变动日期'];
          exportTable(tHeader, data, '集团列表').then(() => {
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

.common-records {
  padding: 20px;

  .list-container {
    padding: 20px;
  }

  .total-content {
    margin: 0;
    padding: 20px;
  }

  .pagenation-box {
    padding: 20px;
    @include flex(flex-end, center, row);
  }
}

.auth-container {
  @include flex(center, center, row);

  .left {
    width: 50%;
  }

  .right {
    @include flex(center, center, column);
    text-align: center;
    border-left: 1px solid #dcdfe6;
    width: 50%;

    .qrcode {
      border: 1px solid #dcdfe6;
      width: 240px;
      height: 240px;
    }
  }
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
