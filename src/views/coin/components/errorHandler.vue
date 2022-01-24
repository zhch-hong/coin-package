<template>
  <div class="error-handler">
    <vcard padding flex style="background: bottom">
      <el-form
        class="el-form-box"
        style="width: 100%"
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        label-width="120px"
      >
        <el-row justify="space-between" align="center">
          <el-col :span="8">
            <el-form-item label="订单号:" prop="orderId">
              <el-input
                v-model.number="searchForm.orderId"
                size="mini"
                style="width: 200px"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="购买时间:" prop="times">
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
          <el-col :span="6">
            <div style="padding-top: 3px">
              <el-button type="primary" size="mini" @click="search" style="width: 120px; border-radius: 10px"
                >查 询</el-button
              >
              <el-button size="mini" @click="reset" style="width: 120px; border-radius: 10px">重 置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </vcard>
    <div class="bc-title" style="margin: 20px 0 20px 35px">异常处理</div>
    <vcard style="background: bottom">
      <div class="padding-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-row-style="{ backgroundColor: '#fff', borderRadius: '10px' }"
          :cell-style="{ backgroundColor: '#f0f2f5', borderBottom: '1px solid #e2e4e8' }"
        >
          <el-table-column prop="orderId" label="订单号" :min-width="200" align="center"></el-table-column>
          <el-table-column prop="giftName" label="套餐名称" :min-width="120" align="center"></el-table-column>
          <el-table-column prop="uid" label="会员卡号" :min-width="120" align="center"></el-table-column>
          <el-table-column prop="transactionId" label="流水号" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.transactionId || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售数量" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderGift ? scope.row.orderGift[0].count : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coinNum" label="应出币数" :min-width="120" align="center"></el-table-column>
          <el-table-column prop="sureCoin" label="实出币数" :min-width="120" align="center"></el-table-column>
          <el-table-column label="是否确认出币" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sureCoin ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coinType" label="出币类型" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ ['实物币', '电子币', '手动取币'][scope.row.coinType - 1] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="offValueSum" label="应收金额" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.offValueSum | MIXIN_Points2Yuan | toFixed2 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="offValueSum" label="实收金额" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.offValueSum | MIXIN_Points2Yuan | toFixed2 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="valuePayType" label="支付方式" :min-width="120" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.valuePayType === 0">未支付</span>
                <span v-else-if="scope.row.valuePayType === 1">微信</span>
                <span v-else-if="scope.row.valuePayType === 2">支付宝</span>
                <span v-else-if="scope.row.valuePayType === 3">现金</span>
                <span v-else>其他</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="业务是否完成" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>否</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="购买时间" :min-width="200" align="center"> </el-table-column>
          <el-table-column prop="backTime" label="是否退单" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.backTime ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="收银员姓名" :min-width="120" align="center"> </el-table-column>
          <el-table-column prop="auditor" label="异常处理审核员" :min-width="120" align="center"> </el-table-column>
          <el-table-column prop="status" label="状态" :min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status ? '已处理' : '未处理' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" :min-width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleOrder(scope.row)">处理 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </vcard>
    <!--导出以及分页部分-->
    <div class="pagenation-box flex-center">
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
    </div>
    <el-dialog
      title="异常处理"
      :visible.sync="showModal"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form style="width: 100%" :inline="true" :model="currentOrder" label-width="120px">
        <el-row justify="space-between" align="center">
          <el-col :span="12" :gutter="20">
            <el-form-item label="订单号:" prop="orderId">
              <el-input v-model.number="currentOrder.orderId" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :gutter="20">
            <el-form-item label="流水号:" prop="transactionId">
              <el-input v-model.number="currentOrder.transactionId" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between" align="center">
          <el-col :span="12" :gutter="20">
            <el-form-item label="套餐名称:" prop="giftName">
              <el-input v-model.number="currentOrder.giftName" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :gutter="20">
            <el-form-item label="购买时间:" prop="time">
              <el-input v-model.number="currentOrder.time" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between" align="center">
          <el-col :span="12" :gutter="20">
            <el-form-item label="购买数量:">
              <el-input v-model.number="currentOrder.count" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :gutter="20">
            <el-form-item label="支付金额:" prop="offValueSum">
              <el-input v-model.number="currentOrder.offValueSum" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between" align="center">
          <el-col :span="12" :gutter="20">
            <el-form-item label="应出币数:" prop="coinNum">
              <el-input v-model.number="currentOrder.coinNum" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :gutter="20">
            <el-form-item label="实出币数:" prop="sureCoin">
              <el-input v-model.number="currentOrder.sureCoin" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between" align="center">
          <el-col :span="12" :gutter="20">
            <el-form-item label="是否确认出币:" prop="sureSend">
              <el-input v-model.number="currentOrder.sureSend" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :gutter="20">
            <el-form-item label="业务是否完成:" prop="completeState">
              <el-input v-model.number="currentOrder.completeState" disabled style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="showModal = false">取 消</el-button>
        <el-button :loading="loading" type="danger" @click="showAuthModal = true">确认处理</el-button>
      </div>
    </el-dialog>
    <StaffAuth :show.sync="showAuthModal" @success="authSuccess"></StaffAuth>
  </div>
</template>

<script>
import StaffAuth from '../../../components/StaffAuth';

export default {
  name: 'errorHandler',
  components: {
    StaffAuth,
  },
  data() {
    return {
      showAuthModal: false,
      showModal: false,
      loading: false,
      // 查询、翻页
      searchForm: {
        orderId: '',
        times: '',
      },
      pageNum: 1,
      showNum: 10,
      count: 0,
      tableData: [],
      currentOrder: {},
    };
  },
  filters: {
    toFixed2(v) {
      return v.toFixed(2);
    },
  },
  methods: {
    authSuccess(data) {
      console.log(data);
      this.fixAbnormalOrder(data);
    },
    fixAbnormalOrder(data) {
      this.$api
        .fixAbnormalOrder({ ...data, orderId: this.currentOrder.orderId })
        .then((res) => {
          this.showModal = false;
          if (this.currentOrder.coinType == 1)
            this.$root.$children[0].errorSendCoin(
              this.$calc.Subtr(this.currentOrder.coinNum, this.currentOrder.sureCoin),
              this.currentOrder.orderId,
              this.currentOrder.sureCoin
            );
        })
        .catch((e) => {
          this.$message.error('处理失败');
        });
    },
    handleOrder(item) {
      console.log(item);
      this.$confirm('温馨提醒：处理异常订单前，请先确认是否已收款。若未收到款项请勿处理该笔订单。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.currentOrder = { ...item };
          if (!this.currentOrder.transactionId) {
            this.currentOrder.transactionId = '无';
          }
          this.currentOrder.count = this.currentOrder.orderGift[0].count;
          this.currentOrder.offValueSum = this.MIXIN_Points2Yuan(this.currentOrder.offValueSum).toFixed(2);
          this.currentOrder.sureSend = this.currentOrder.sureCoin ? '是' : '否';
          this.currentOrder.completeState = '否';
          this.showModal = true;
        })
        .catch(() => {});
    },
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
        .getAbnormalOrder(params)
        .then((res) => {
          this.tableData = res.body.items;
          this.count = res.body.count;
        })
        .finally((result) => {
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
@import '../../../styles/mixin';

.error-handler {
  .list-container {
    padding: 0 20px;
    box-sizing: border-box;
  }

  .total-content {
    margin: 0;
    padding: 20px;
  }

  .pagenation-box {
    padding: 20px;
    // @include flex(space-between, center, row);
  }
}
.el-form-box {
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 21px 0 0 0;
}
.padding-table {
  padding: 12px 14px 0 14px;
  box-sizing: border-box;
}
</style>
