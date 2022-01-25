<template>
  <div class="store-manage">
    <vcard padding flex v-if="!$store.state.offline" style="padding: 0; background: bottom">
      <el-form
        ref="searchForm"
        style="width: 100%; background-color: #ffffff; border-radius: 10px; padding: 20px 0 10px; border-radius: 10px"
        :inline="true"
        :model="searchForm"
        label-width="120px"
      >
        <el-form-item label="物品名称:">
          <el-input v-model="searchForm.prizeName" size="mini" style="width: 180px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="物品类型:">
          <el-input v-model="searchForm.prizeType" size="mini" style="width: 180px" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="收银员:" label-width="100px">
          <el-input v-model="searchForm.name" size="mini" style="width: 180px" placeholder="请输入"></el-input>
          <!-- <el-select v-model="searchForm.name" style="width: 180px" size="mini" placeholder="请选择">
            <el-option v-for="item in optUser" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select> -->
        </el-form-item>

        <el-form-item label="购买时间:" prop="time">
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
        <el-form-item>
          <el-button type="primary" size="mini" style="width: 120px; border-radius: 10px" @click="handleSearch"
            >查 询</el-button
          >
          <el-button size="mini" style="width: 120px; border-radius: 10px" @click="resetForm">重 置</el-button>
        </el-form-item>
      </el-form>
    </vcard>
    <div class="bc-title" style="margin: 20px 0 20px 35px">销售统计</div>
    <el-table :loading="loading" :data="items" style="width: 100%; flex: 1">
      <el-table-column label="物品编号" prop="prizeId" align="center" min-width="120"></el-table-column>
      <el-table-column label="物品名称" prop="prizeName" align="center" min-width="160"></el-table-column>
      <el-table-column label="物品类型" prop="prizeType" align="center" min-width="120"> </el-table-column>
      <el-table-column label="销售数量" prop="count" align="center" min-width="120"> </el-table-column>
    </el-table>
    <!--导出以及分页部分-->
    <div class="flex-between" style="width: 100%; padding: 10px" v-if="!$store.state.offline">
      <div></div>
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
import exportTable from '@/utils/outputExcel';
import moment from 'moment';
import { to } from '@/utils/tools';
import { getToken } from '../../../utils/auth';

export default {
  name: 'store',
  data() {
    return {
      loading: false,
      // 查询、翻页
      searchForm: {
        prizeName: '',
        prizeType: '',
        name: '',
        time: [],
      },
      pageNum: 1,
      showNum: 10,
      count: 0,
      items: [],
    };
  },
  filters: {
    toFixed2(val) {
      return val.toFixed(2);
    },
    formatStatus(val) {
      switch (val) {
        case 0:
          return '待支付';
        case 1:
          return '已支付';
        case 2:
          return '已退单';
        default:
          return '其他';
      }
    },
  },
  methods: {
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getInfo();
    },
    // 重置表单
    resetForm() {
      this.$refs.searchForm.resetFields();
      this.searchForm.prizeName = '';
      this.searchForm.prizeType = '';
      this.searchForm.name = '';
      this.searchForm.time = [];
      this.pageNum = 1;
      this.getInfo();
    },
    // 格式化参数
    formatSearchParams() {
      const result = { ...this.searchForm };
      if (result.time && result.time.length) {
        result.startTime = result.time[0] || '';
        result.endTime = result.time[1] || '';
        delete result.time;
      }
      result.pageNum = this.pageNum;
      result.showNum = this.showNum;
      return result;
    },
    // 获取表格数据
    getInfo() {
      this.$refs.searchForm.validate((v) => {
        if (v) {
          this.loading = true;
          this.$api
            .getPrizeSalesDetail(this.formatSearchParams())
            .then((res) => {
              this.items = res.body.items;
              this.count = res.body.count;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    getOrderStatus(status) {
      switch (status) {
        case 0:
          return '待支付';
        case 1:
          return '已支付';
        case 2:
          return '已退单';
        default:
          return '其他';
      }
    },
  },
  async mounted() {
    if (this.$store.state.offline) {
      const db = await this.$db.openDB('offlineDB');
      this.items = await this.$db.cursorGetData(db, 'prizeStatistical');
    } else {
      this.getInfo();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.store-manage {
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
    @include flex(space-between, center, row);
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
    }
  }
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
/deep/ .el-table__header-wrapper {
  border-radius: 10px;
  background: white;
}
</style>
