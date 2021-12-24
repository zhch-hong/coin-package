<template>
  <div class="store-manage">
    <vcard padding v-loading="loading">
      <el-form style="width: 100%" :inline="true" :model="searchForm">
        <!-- <el-row>
          <el-col :span="4">
            <el-form-item label="模块名称：">
              <span>{{ settleData.moduleName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="收银员工：">
              <span>{{ settleData.staffName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上下机时间：">
          <span>{{ settleData.startTime }} - {{ settleData.endTime }}</span>
        </el-form-item>
        <br />
        <el-form-item label="总收入：">
                   <span>{{ settleData.totalIncome | MIXIN_Points2Yuan }}</span>
          <span> - </span>
        </el-form-item>
        <br />
        <el-form-item label="总退单：">
                   <span>{{ settleData.totalBack | MIXIN_Points2Yuan }}</span>
          <span>-</span>
        </el-form-item>
        <br />
        <el-form-item label="套餐收入：">
                   <span>{{ settleData.giftIncome | MIXIN_Points2Yuan }}</span>
          <span>-</span>
        </el-form-item>
        <br />
        <el-form-item label="物品销售收入：">
                   <span>{{ settleData.prizeIncome | MIXIN_Points2Yuan }}</span>
          <span>-</span>
        </el-form-item>
        <el-row>
          <el-col :span="4">
            <el-form-item label="现金：">
                           <span>{{ settleData.RMB | MIXIN_Points2Yuan }}</span>
              <span>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="支付宝：">
                           <span>{{ settleData.aliPay | MIXIN_Points2Yuan }}</span>
              <span>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="微信：">
                           <span>{{ settleData.weChatPay | MIXIN_Points2Yuan }}</span>
              <span>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="积分：">
                           <span>{{ settleData.starCoin }}</span>
              <span>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="其他支付：">
                           <span>{{ settleData.otherPay | MIXIN_Points2Yuan }}</span>
              <span>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="游戏币：">
                           <span>{{ settleData.coinNum }}</span>
              <span>-</span>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!--  -->
        <el-row class="list-box list-blue">
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>模块名称</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>收银员工</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>上下机时间</div>
            </div>
            <div class="item-input"></div>
          </el-col>
        </el-row>
        <el-row class="list-box list-gys">
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>总收入</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>总退单</div>
            </div>
            <div class="item-input"></div>
          </el-col>
        </el-row>
        <el-row class="list-box list-green">
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>套餐收入</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>物品销售收入</div>
            </div>
            <div class="item-input"></div>
          </el-col>
        </el-row>
        <el-row class="list-box list-yellow">
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>现金</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>支付宝</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>微信</div>
            </div>
            <div class="item-input"></div>
          </el-col>
        </el-row>
        <el-row class="list-box list-yellow">
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>积分</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>其他支付</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>游戏币</div>
            </div>
            <div class="item-input"></div>
          </el-col>
        </el-row>
        <el-row class="list-box list-yellow">
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>其他收支-收入</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8">
            <div class="item-list">
              <div class="xian"></div>
              <div>其他收支-支出</div>
            </div>
            <div class="item-input"></div>
          </el-col>
          <el-col :span="8"> </el-col>
        </el-row>
        <el-row class="btn-box-padding">
          <el-col :span="24">
            <el-button
              :loading="loading"
              type="primary"
              size="mini"
              style="width: 96px"
              @click="handleOnOpenAuthModal('exportXlSX')"
              >导 出
            </el-button>
            <el-button
              :loading="loading"
              type="info"
              size="mini"
              style="width: 96px"
              @click="handleOnOpenAuthModal('printTicket')"
              >打 印
            </el-button>
            <el-button
              :loading="loading"
              :disabled="disabledSettle"
              type="success"
              size="mini"
              style="width: 96px"
              @click="handleOnOpenAuthModal('cashInvoicing')"
              >确认班结
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </vcard>
    <staff-auth :show.sync="showAuthModal" @success="handleOnAuthSuccess"></staff-auth>
  </div>
</template>

<script>
import StaffAuth from '@/components/StaffAuth';
import exportTable from '@/utils/outputExcel';
import { removeToken } from '../../utils/auth';
import { to } from '../../utils/tools';

export default {
  name: 'store',
  components: {
    StaffAuth,
  },
  data() {
    return {
      currentType: '',
      showAuthModal: false,
      authData: {},
      loading: false,
      disabledSettle: false,
      searchForm: {},
      settleData: {
        moduleName: '',
        staffName: '',
        startTime: '',
        endTime: '',
        totalIncome: 0,
        totalBack: 0,
        giftIncome: 0,
        prizeIncome: 0,
        RMB: 0,
        aliPay: 0,
        weChatPay: 0,
        starCoin: 0,
      },
    };
  },
  methods: {
    // 打开授权弹窗
    async handleOnOpenAuthModal(method) {
      this.showAuthModal = true;
      this.currentType = method;
    },
    // 授权成功
    handleOnAuthSuccess(data) {
      this.authData = data;
      this[this.currentType]();
    },
    // 班结
    async cashInvoicing() {
      const data = { cashType: 2, ...this.authData };
      const [err, res] = await to(this.$api.cashInvoicing(data));
      if (err) {
        this.disabledSettle = false;
        this.loading = false;
        return;
      }

      const db = await this.$db.openDB('offlineDB');
      const offlineGiftRecord = await this.$db.cursorGetData(db, 'giftRecord');
      const offlinePrizeRecord = await this.$db.cursorGetData(db, 'prizeRecord');
      if (offlineGiftRecord.length || offlinePrizeRecord.length) {
        this.$message.error('当前有离线数据暂未同步，请先同步后班结');
        return;
      }
      if (!window.LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      const [confirmErr, confirmRes] = await to(
        this.$confirm('确认班结数据无误并且班结吗？', '班结', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
      );
      if (confirmErr) return;
      this.disabledSettle = true;
      this.loading = true;
      const [printErr, printRes] = await to(this.printTicket());
      if (printErr) {
        this.disabledSettle = false;
        this.loading = false;
        return;
      }
      const [printedErr, printedRes] = await to(
        this.$confirm('正在打印小票，请确认小票打印完毕后，点击确定班结！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
      );
      if (printedErr) {
        this.disabledSettle = false;
        this.loading = false;
        return;
      }

      // 更新indexedDB里班结状态
      const staffInfo = await this.$db.getDataByIndex(db, 'staffInfo', 'phone', sessionStorage.getItem('phone'));
      await this.$db.updateDB(db, 'staffInfo', {
        ...staffInfo,
        isSettle: true,
      });
      this.$message.success('班结成功');
      await this.$api.cashLoginOut({});
      removeToken();
      await this.$router.replace({ path: '/login' });
      this.loading = false;
    },
    // 导出表格
    async exportXlSX() {
      const data = { cashType: 1, ...this.authData };
      const [error] = await to(this.$api.cashInvoicing(data));
      if (error) {
        this.disabledSettle = false;
        this.loading = false;
        return;
      }

      const [err, res] = await to(this.getInfo());
      if (err) {
        this.loading = false;
        return;
      }
      const excelData = [
        [
          this.settleData.moduleName,
          this.settleData.staffName,
          this.settleData.startTime,
          this.settleData.endTime,
          this.MIXIN_Points2Yuan(this.settleData.totalIncome),
          this.MIXIN_Points2Yuan(this.settleData.totalBack),
          this.MIXIN_Points2Yuan(this.settleData.giftIncome),
          this.MIXIN_Points2Yuan(this.settleData.prizeIncome),
          this.MIXIN_Points2Yuan(this.settleData.RMB),
          this.MIXIN_Points2Yuan(this.settleData.aliPay),
          this.MIXIN_Points2Yuan(this.settleData.weChatPay),
          this.settleData.starCoin,
          this.MIXIN_Points2Yuan(this.settleData.otherPay),
          this.settleData.gameCoin,
          this.MIXIN_Points2Yuan(this.settleData.otherIncome),
          this.MIXIN_Points2Yuan(this.settleData.otherSpending),
        ],
      ];
      const tHeader = [
        '模块名称',
        '收银员工',
        '上机时间',
        '下机时间',
        '总收入',
        '总退单',
        '套餐收入',
        '物品销售收入',
        '现金',
        '支付宝',
        '微信',
        '积分',
        '其他支付',
        '游戏币',
        '其他收支-收入',
        '其他收支-支出',
      ];
      exportTable(tHeader, excelData, '班结信息').then(() => {
        this.loading = false;
      });
    },
    async getInfo() {
      this.loading = true;
      const [err, res] = await to(this.$api.getInvoicingInfo(this.authData));
      console.log(err);
      console.log(res);
      if (err) {
        this.loading = false;
        throw new Error('未安装打印控件，请先安装控件后重新启动系统');
      }
      this.settleData = res.body;
      this.loading = false;
    },
    // 打印
    async printTicket() {
      const data = { cashType: 1, ...this.authData };
      const [error] = await to(this.$api.cashInvoicing(data));
      if (error) {
        this.disabledSettle = false;
        this.loading = false;
        return;
      }

      if (!window.LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      const [err, res] = await to(this.getInfo());
      if (err) {
        throw new Error('没有权限');
      }
      LODOP.PRINT_INIT('');
      // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
      LODOP.SET_PRINT_STYLE('FontSize', 8);
      LODOP.ADD_PRINT_TEXT(25, 0, 180, 25, '========== 班结信息 =========');
      LODOP.ADD_PRINT_TEXT(50, 0, 180, 25, `模块名称：${this.settleData.moduleName}`);
      LODOP.ADD_PRINT_TEXT(75, 0, 180, 25, `收银员工：${this.settleData.staffName}`);
      LODOP.ADD_PRINT_TEXT(100, 0, 180, 25, `上机时间：${this.settleData.startTime}`);
      LODOP.ADD_PRINT_TEXT(125, 0, 180, 25, `下机时间：${this.settleData.endTime}`);
      LODOP.ADD_PRINT_TEXT(150, 0, 180, 25, `----------------------------`);
      LODOP.ADD_PRINT_TEXT(175, 0, 180, 25, `总收入：${this.$calc.accDiv(this.settleData.totalIncome, 100)}`);
      LODOP.ADD_PRINT_TEXT(200, 0, 180, 25, `总退单：${this.$calc.accDiv(this.settleData.totalBack, 100)}`);
      LODOP.ADD_PRINT_TEXT(225, 0, 180, 25, `套餐收入：${this.$calc.accDiv(this.settleData.giftIncome, 100)}`);
      LODOP.ADD_PRINT_TEXT(250, 0, 180, 25, `物品销售收入：${this.$calc.accDiv(this.settleData.prizeIncome, 100)}`);
      LODOP.ADD_PRINT_TEXT(275, 0, 180, 25, `现金：${this.$calc.accDiv(this.settleData.RMB, 100)}`);
      LODOP.ADD_PRINT_TEXT(300, 0, 180, 25, `支付宝：${this.$calc.accDiv(this.settleData.aliPay, 100)}`);
      LODOP.ADD_PRINT_TEXT(325, 0, 180, 25, `微信：${this.$calc.accDiv(this.settleData.weChatPay, 100)}`);
      LODOP.ADD_PRINT_TEXT(350, 0, 180, 25, `积分：${this.settleData.starCoin}`);
      LODOP.ADD_PRINT_TEXT(375, 0, 180, 25, `其他支付：${this.$calc.accDiv(this.settleData.otherPay, 100)}`);
      LODOP.ADD_PRINT_TEXT(400, 0, 180, 25, `游戏币：${this.settleData.gameCoin}`);
      LODOP.ADD_PRINT_TEXT(425, 0, 180, 25, `其他收支-收入：${this.$calc.accDiv(this.settleData.otherIncome, 100)}`);
      LODOP.ADD_PRINT_TEXT(450, 0, 180, 25, `其他支出-支出：${this.$calc.accDiv(this.settleData.otherSpending, 100)}`);
      LODOP.ADD_PRINT_TEXT(475, 0, 180, 25, `技术支持：百川之星科技有限公司`);
      LODOP.PRINT();
    },
  },
  created() {
    this.disabledSettle = false;
    // this.getInfo()
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.store-manage {
  .print-line {
  }

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

.btn-box-padding {
  padding-top: 80px;
}

.list-box {
  padding-top: 33px;

  .item-list {
    display: flex;
    font-size: 18px;
    color: #1f1f1f;
    padding-bottom: 11px;
  }

  .item-input {
    position: relative;
    width: 226px;
    height: 33px;
    background: #ffffff;
    border: 1px solid transparent;
    border-radius: 4px;
    &::after {
      position: absolute;
      content: '******';
      left: 0;
      top: 0;
      font-size: 30px;
    }
  }
}

.list-blue {
  .xian {
    width: 2px;
    height: 21px;
    background: #41a3fe;
    margin-right: 10px;
  }
}

.list-gys {
  .xian {
    width: 2px;
    height: 21px;
    background: #675ee1;
    margin-right: 10px;
  }
}

.list-green {
  .xian {
    width: 2px;
    height: 21px;
    background: #60a5ae;
    margin-right: 10px;
  }
}

.list-yellow {
  .xian {
    width: 2px;
    height: 21px;
    background: #ff9801;
    margin-right: 10px;
  }
}
</style>
