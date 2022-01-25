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
        <el-form-item label="订单状态:" prop="status">
          <el-select v-model="searchForm.status" clearable style="width: 180px" size="mini" placeholder="请选择">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人民币支付方式:" prop="valuePayType">
          <el-select v-model="searchForm.valuePayType" clearable style="width: 180px" size="mini" placeholder="请选择">
            <el-option
              v-for="item in payTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收银员姓名:" prop="name">
          <el-input
            v-model="searchForm.name"
            clearable
            size="mini"
            style="width: 180px"
            placeholder="请输入"
          ></el-input>
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
    <div class="bc-title" style="margin: 20px 0 20px 35px">销售记录</div>
    <el-table :loading="loading" :data="items" style="width: 100%; flex: 1">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.orderPrize"
            style="width: 100%"
            :header-cell-style="{ backgroundColor: 'rgb(242,242,242)' }"
          >
            <el-table-column label="商品名称" prop="prizeName" align="center" min-width="120"></el-table-column>
            <el-table-column label="市场价" prop="offValue" align="center" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.offValue | MIXIN_Points2Yuan | toFixed2 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="count" align="center" min-width="120"></el-table-column>
            <el-table-column label="销售金额" prop="prizeName" align="center" min-width="120">
              <template slot-scope="scope">
                <span>{{ $calc.accMul(scope.row.offValue, scope.row.count) | MIXIN_Points2Yuan | toFixed2 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderId" align="center" min-width="120"></el-table-column>
      <el-table-column label="下单时间" prop="time" align="center" min-width="160"></el-table-column>
      <el-table-column label="订单状态" prop="status" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status | formatStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收金额" prop="offValueSum" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ $calc.accAdd(scope.row.offValueSum, scope.row.cutRMB || 0) | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收积分" prop="coinValueSum" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ $calc.accAdd(scope.row.coinValueSum, $calc.accMul(scope.row.cutRMB, 0.33)) | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收游戏币" prop="gameCoinSum" align="center" min-width="120"></el-table-column>
      <el-table-column label="已优惠金额" prop="cutRMB" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cutRMB || 0 | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收金额" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.offValueSum | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" prop="" align="center" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.orderPayType == 1">积分</span>
          <span v-else-if="scope.row.orderPayType == 2">人民币</span>
          <span v-else-if="scope.row.orderPayType == 3">游戏币</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="人民币支付方式" prop="valuePayType" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.valuePayType | formatValuePayType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付积分" prop="payCoin" align="center" min-width="120"></el-table-column>
      <el-table-column label="支付金额" prop="payValue" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.payValue | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付游戏币" prop="payGameCoin" align="center" min-width="120"></el-table-column>
      <el-table-column label="收银员姓名" prop="name" align="center" min-width="120"></el-table-column>
      <el-table-column label="退单审核员" prop="auditor" align="center" min-width="120"></el-table-column>
      <el-table-column label="操作" prop="payValue" align="center" min-width="120" v-if="!$store.state.offline">
        <template slot-scope="scope">
          <el-button type="text" @click="openAuthModal(scope.row)">退单</el-button>
          <el-button type="text" @click="printTicket(scope.row)">打印小票</el-button>
        </template>
      </el-table-column>
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
      <el-button type="primary" size="mini" icon="el-icon-document" :loading="loading" @click="exportXlSX"
        >导出数据
      </el-button>
    </div>
    <StaffAuth :show.sync="showAuthModal" @success="authSuccess"></StaffAuth>
  </div>
</template>

<script>
import exportTable from '@/utils/outputExcel';
import moment from 'moment';
import { to } from '@/utils/tools';
import StaffAuth from '../../../components/StaffAuth';
import { getToken } from '../../../utils/auth';

export default {
  name: 'store',
  components: {
    StaffAuth,
  },
  data() {
    return {
      statusList: [
        { label: '待支付', value: 0 },
        { label: '已支付', value: 1 },
        { label: '已退单', value: 2 },
      ],
      payTypeList: [
        { label: '未支付', value: 0 },
        { label: '微信', value: 1 },
        { label: '支付宝', value: 2 },
        { label: '现金', value: 3 },
        { label: '其他', value: 4 },
      ],
      loading: false,
      // 查询、翻页
      searchForm: {
        status: '',
        valuePayType: '',
        name: '',
        time: [],
      },
      pageNum: 1,
      showNum: 10,
      count: 0,
      items: [],
      // 授权
      showAuthModal: false,
      currentOrder: {},
      ticketHeight: 0,
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
    formatValuePayType(type) {
      switch (type) {
        case 0:
          return '未支付';
        case 1:
          return '微信';
        case 2:
          return '支付宝';
        case 3:
          return '现金';
        default:
          return '其他';
      }
    },
  },
  methods: {
    getHeight() {
      this.ticketHeight += 25;
      return this.ticketHeight;
    },
    async printTicket(data) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      const printFlag = Number(sessionStorage.getItem('printFlag'));
      if (printFlag) {
        let p;
        if (this.$store.state.offline) {
          const db = await this.$db.openDB('offlineDB');
          const printInfo = await this.$db.getDataByIndex(db, 'printFormat', 'code', 'PRIZE_SALE');
          if (printInfo) {
            p = printInfo;
          }
        } else {
          const [err, res] = await to(this.$api.getStorePrint({ code: 'PRIZE_SALE' }));
          if (res) {
            p = res.body.printInfo;
          }
        }
        if (p.printFlag) {
          LODOP.PRINT_INIT('');
          // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
          LODOP.SET_PRINT_STYLE('FontSize', 8);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单编号：${data.orderId}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`);
          data.orderPrize.forEach((item) => {
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `商品：${item.prizeName}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：${item.count}`);
            LODOP.ADD_PRINT_TEXT(
              this.getHeight(),
              0,
              180,
              25,
              `单价：￥${this.MIXIN_Points2Yuan(item.offValue).toFixed(2)}`
            );
            LODOP.ADD_PRINT_TEXT(
              this.getHeight(),
              0,
              180,
              25,
              `小计：￥${this.MIXIN_Points2Yuan(this.$calc.accMul(item.offValue, item.count)).toFixed(2)}`
            );
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `----------------------`);
          });
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `已优惠金额：${this.MIXIN_Points2Yuan(data.cutRMB).toFixed(2)}`
          );
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `总计：${this.MIXIN_Points2Yuan(data.offValueSum).toFixed(2)}`
          );
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme);
          LODOP.PRINT();
          // LODOP.PREVIEW()
          this.ticketHeight = 0;
        } else {
          this.$message.error('小票格式未定义，无法打印');
        }
      }
    },
    printBackTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      this.$api.getStorePrint({ code: 'PRIZE_BACK' }).then(async (res) => {
        const p = res.body.printInfo;
        if (p.printFlag) {
          LODOP.PRINT_INIT('');
          LODOP.SET_PRINT_STYLE('FontSize', 8);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单编号：${this.currentOrder.orderId}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`);
          this.currentOrder.orderPrize.forEach((item) => {
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `商品：${item.prizeName}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：${item.count}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `单价：￥${this.MIXIN_Points2Yuan(item.offValue)}`);
            LODOP.ADD_PRINT_TEXT(
              this.getHeight(),
              0,
              180,
              25,
              `小计：￥${this.MIXIN_Points2Yuan(this.$calc.accMul(item.offValue, item.count))}`
            );
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `----------------------`);
          });
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `总计：${this.MIXIN_Points2Yuan(this.currentOrder.offValueSum)}`
          );
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme);
          LODOP.PRINT();
          this.ticketHeight = 0;
          callback && callback();
        } else {
          callback && callback();
        }
      });
    },
    authSuccess(data) {
      this.backPrize(data);
    },
    openAuthModal(order) {
      this.currentOrder = order;
      console.log(this.currentOrder);
      this.showAuthModal = true;
    },
    backPrize(data) {
      this.loading = true;
      this.$api
        .backPrize({ ...data, orderId: this.currentOrder.orderId })
        .then((res) => {
          this.printBackTicket();
          this.$message.success('退单成功');
          this.getInfo();
        })
        .finally((f) => {
          this.loading = false;
        });
    },
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getInfo();
    },
    // 重置表单
    resetForm() {
      this.$refs.searchForm.resetFields();
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
            .getPrizeOrder(this.formatSearchParams())
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
    getValuePayType(type) {
      switch (type) {
        case 0:
          return '未支付';
        case 1:
          return '微信';
        case 2:
          return '支付宝';
        case 3:
          return '现金';
        default:
          return '其他支付';
      }
    },
    // 导出表格
    exportXlSX() {
      this.loading = true;

      const obj = {
        ...this.formatSearchParams(),
        pageNum: 1,
        showNum: this.count,
      };
      this.$api.getPrizeOrder(obj).then(
        (res) => {
          const orderPayType = ['-', '积分', '人民币', '游戏币'];
          const data = res.body.items.map((val) => {
            return [
              val.orderId.toString(),
              val.time,
              this.getOrderStatus(val.status),
              this.MIXIN_Points2Yuan(this.$calc.Subtr(val.offValueSum, val.cutRMB || 0)),
              this.$calc.accAdd(val.coinValueSum, this.$calc.accMul(val.cutRMB, 0.33)),
              val.gameCoinSum,
              this.MIXIN_Points2Yuan(val.cutRMB),
              this.MIXIN_Points2Yuan(val.offValueSum),
              orderPayType[val.orderPayType],
              this.getValuePayType(val.valuePayType),
              val.payCoin,
              this.MIXIN_Points2Yuan(val.payValue),
              val.payGameCoin,
              val.name,
              val.auditor,
            ];
          });
          const tHeader = [
            '订单号',
            '下单时间',
            '订单状态',
            '应收金额',
            '应收积分',
            '应收游戏币',
            '已优惠金额',
            '实收金额',
            '支付方式',
            '人民币支付方式',
            '支付积分',
            '支付金额',
            '支付游戏币',
            '收银员姓名',
            '退单审核员',
          ];
          exportTable(tHeader, data, '销售物品记录').then(() => {
            this.loading = false;
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
  },
  async mounted() {
    if (this.$store.state.offline) {
      const db = await this.$db.openDB('offlineDB');
      this.items = await this.$db.cursorGetData(db, 'prizeRecord');
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
