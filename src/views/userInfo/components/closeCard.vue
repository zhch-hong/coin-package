<template>
  <div class="user-consume-page" v-loading="loading">
    <el-row style="height: 100%">
      <el-col :span="10" style="padding-left: 42px">
        <div class="bc-title">会员信息</div>
        <div>
          <img src="@/assets/scan-user.png" class="scan-card-image" />
        </div>
        <div>
          <el-input
            v-model="currentPkg.cardNum"
            placeholder="手动输入卡号"
            style="width: 260px; margin: 10px 0"
            @input="changeValue"
          >
            <el-button slot="append" @click="getCardInfo">查询</el-button>
          </el-input>
        </div>

        <div style="margin-top: 60px; color: #3d3d3e">
          <p style="font-weight: bold; font-size: 17px">提示：</p>
          <span style="font-weight: bold; font-size: 15px"
            >请读取会员信息或点击会员卡手动输入卡号<br />读取会员信息</span
          >
        </div>
      </el-col>
      <el-col :span="14" style="background-color: #ffffff; height: 100%">
        <div style="text-align: center; font-size: 24px; color: #2a2a2a; font-weight: bold; padding: 53px 0">
          当前要解绑的实体会员卡卡号:
        </div>
        <div style="font-size: 24px; text-align: center; font-weight: bold; color: #2a2a2a; padding: 39px 0">
          {{ currentPkg.cardNum }}
        </div>
        <!--        <h3 v-if="userType">-->
        <!--          卡号信息为:-->
        <!--          <span style="color: red">{{ cardTypeList.find((item) => item.value === userType).label }}</span>-->
        <!--        </h3>-->
        <el-divider />
        <div style="text-align: center; font-size: 30px; font-weight: bold; color: #2a2a2a; padding: 80px 0 60px 0">
          退工本费:
          <span style="color: #f72727">￥{{ currentPkg.backNum }}</span>
        </div>
        <el-button
          type="primary"
          style="width: 170px; margin-left: 50%; transform: translateX(-50%); font-size: 20px; margin-bottom: 50px"
          :disabled="canClose"
          @click="handlePlaceOrder"
        >
          解 绑
        </el-button>
        <el-divider />
        <p style="font-size: 14px; color: #717171; padding: 0 56px">
          注：解绑后，收银员退回现金给顾客，系统自动增加对应退卡工本费记录。解绑卡内剩余次票、游戏币、积分等自动清空
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment';
import { getToken } from '../../../utils/auth';
import { coin2Rmb } from '../../../utils/tools';

export default {
  name: 'userConsume',
  mounted() {
    this.getCardFee();
  },
  data() {
    return {
      loading: false,
      cardNum: '',
      uid: '',
      items: [],
      canClose: true,
      cardTypeList: [
        { label: '公关卡', value: 2 },
        { label: '公共卡', value: 3 },
        { label: '临时卡', value: 5 },
      ],
      userType: 2,
      cardFee0: 0,
      cardFee2: 0,
      currentPkg: {
        backNum: 0,
        reason: '来自实体卡解绑',
      },
      ticketHeight: 0,
    };
  },
  methods: {
    getHeight() {
      this.ticketHeight += 25;
      return this.ticketHeight;
    },
    printTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      const printFlag = +sessionStorage.getItem('printFlag');
      if (printFlag) {
        this.$api.getStorePrint({ code: 'USER_EXPENSE' }).then(async (res) => {
          const p = res.body.printInfo;
          if (p.printFlag) {
            LODOP.PRINT_INIT('');
            // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
            LODOP.SET_PRINT_STYLE('FontSize', 8);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `用户编号：${this.uid}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `套餐名称：${this.currentPkg.name}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `消费次数：${this.useTimes}`);
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
      }
    },
    handlePlaceOrder() {
      this.$confirm(
        '确认解绑后，系统自动增加对应退卡工本费记录。解绑卡内剩余次票、游戏币、积分等自动清空',
        '解绑实体卡',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        this.$api
          .userCloseVipCard({
            cardNum: this.currentPkg.cardNum,
          })
          .then((res) => {
            this.$message.success('解绑成功');
            this.changeValue();
            this.currentPkg.cardNum = '';
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    selectPkg(pkg) {
      console.log(pkg);
      this.currentPkg = pkg;
    },
    getCardFee() {
      this.$api.getVipCardInfo({}).then((res) => {
        const list = res.body;
        for (let i = 0; i < list.length; i++) {
          if (Number(list[i].vipType) === 0) {
            this.cardFee0 = coin2Rmb(list[i].vipCost) || 0;
          } else {
            this.cardFee2 = coin2Rmb(list[i].vipCost) || 0;
          }
        }
      });
    },
    getCardInfo() {
      if (!this.currentPkg.cardNum) {
        this.$message.error('请输入正确的卡号');
        return;
      }
      this.$api
        .getCardInfo({
          cardNum: this.currentPkg.cardNum,
        })
        .then((res) => {
          if (res.errCode === 0) {
            if (res.body.userType === 2) {
              this.userType = 2;
            } else if (res.body.userType === 3) {
              this.userType = 3;
            } else if (res.body.userType === 5) {
              this.userType = 5;
            } else {
              this.$message.error('此卡号不是公关/公共卡');
              return;
            }
            this.$message.success(
              `查询到卡号信息为${this.cardTypeList.find((item) => item.value === this.userType).label}`
            );
            this.currentPkg.backNum = this.$calc.accDiv(res.body.backNum, 100);
            this.canClose = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeValue() {
      this.canClose = true;
      this.currentPkg.backNum = 0;
      this.userType = 2;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin';

.user-consume-page {
  width: 100%;
  flex: 1;
  padding: 20px;

  .pkg-box {
    @include flex(flex-start, center, row);
    flex-wrap: wrap;

    .pkg-item {
      width: 256px;
      height: 128px;
      border: 1px solid #eeeeee;
      line-height: 128px;
      text-align: center;
      font-weight: bold;
      font-size: 24px;
      margin-right: 20px;
      margin-bottom: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
