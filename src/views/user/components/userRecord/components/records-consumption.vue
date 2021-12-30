<template>
  <div class="records-consumption">
    <el-form
      ref="searchForm"
      style="width: 100%; background-color: #ffffff; padding: 20px; border-radius: 10px"
      :inline="true"
      :model="searchForm"
      label-width="120px"
    >
      <el-row justify="space-between" align="center">
        <el-col :span="8" :gutter="20">
          <el-form-item label="会员ID:" prop="uid">
            <el-input
              v-model="searchForm.uid"
              size="mini"
              clearable
              style="width: 200px"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="套餐名称:" prop="giftName">
            <el-input
              v-model="searchForm.giftName"
              size="mini"
              clearable
              style="width: 200px"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="flex-end">
          <el-form-item label="类型" prop="type">
            <el-select v-model="searchForm.type">
              <el-option
                v-for="item in statusList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-form-item label="消费时间:" prop="time">
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
        <el-col :span="8" class="flex-end">
          <el-form-item>
            <el-button type="primary" size="mini" style="width: 120px" @click="search">查 询</el-button>
            <el-button size="mini" style="width: 120px; border-color: #4194fe; color: #4194fe" @click="reset"
              >重 置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :loading="loading"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{ backgroundColor: '#ffffff' }"
      :cell-style="{ backgroundColor: '#F0F2F5' }"
    >
      <el-table-column label="消费时间" prop="time" align="center" min-width="140"></el-table-column>
      <el-table-column label="会员ID" prop="uid" align="center" min-width="140">
        <template slot-scope="scope">
          <span>{{ !scope.row.nickName ? '0' : scope.row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员电话" prop="phone" align="center" min-width="160"></el-table-column>
      <el-table-column label="套餐名称" prop="giftName" align="center" min-width="120"></el-table-column>
      <el-table-column label="套餐价格" prop="price" align="center" min-width="120"></el-table-column>
      <el-table-column label="消费次数" prop="num" align="center" min-width="120"></el-table-column>
      <el-table-column label="剩余次数" prop="cutNum" align="center" min-width="120"></el-table-column>
      <el-table-column label="过期时间" prop="endTime" align="center" min-width="120"></el-table-column>
      <el-table-column label="操作模块" prop="moduleName" align="center" min-width="120"></el-table-column>
      <el-table-column label="核销设备" prop="usePlace" align="center" min-width="120"></el-table-column>
      <el-table-column label="收银员" prop="staffName" align="center" min-width="120"></el-table-column>
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
export default {
  name: 'RecordsConsumption',
  data() {
    return {
      loading: false,
      statusList: [
        { label: '时间票', value: 1 },
        { label: '次票', value: 2 },
      ],
      // 查询、翻页
      searchForm: {
        uid: '',
        giftName: '',
        type: 1,
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
    this.search();
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
        .getUserNumAndTimeGiftDetail(params)
        .then((res) => {
          this.tableData = res.body.items.map((item) => {
            item.price = this.$calc.accDiv(item.price, 100).toFixed(2);
            if (this.searchForm.type === 1) {
              item.num = 1;
              item.cutNum = '-';
            }
            if (!item.endTime) {
              item.endTime = '无限期';
            }
            return item;
          });
          this.count = res.body.count;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.records-consumption {
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
</style>
