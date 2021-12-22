<template>
  <div class="package-sale">
    <bc-type-menu v-model="currentType" :type-list="giftTypeList" @change="changeType" />

    <div class="gifts-list" v-loading="loading">
      <div class="item" v-for="(item, i) in giftList" :key="i">
        <div class="item-name flex-center" :style="{ 'background-color': item.type === 3 ? '#7D74F6' : '#4194FE' }">
          {{ item.giftName }}
        </div>

        <div style="font-size: 18px; color: #848484; margin-top: 18px; padding-left: 24px">
          ￥{{ item.price | MIXIN_Points2Yuan }}元
        </div>

        <div style="font-size: 18px; color: #a3a3a3; margin-top: 6px; padding-left: 24px">
          {{ item.price | MIXIN_Points2StarCoin }}积分
        </div>

        <div class="flex-between" style="margin: 16px 0 0 24px">
          <el-button
            v-if="item.onlyScanBuy"
            type="primary"
            size="mini"
            style="width: 138px; height: 43px"
            :style="{ 'background-color': item.type === 3 ? '#7D74F6' : '#4194FE' }"
            @click="scanPay(item)"
            >仅扫码购买
          </el-button>

          <el-button
            v-else
            type="primary"
            size="mini"
            style="width: 138px; height: 43px"
            :style="{ 'background-color': item.type === 3 ? '#7D74F6' : '#4194FE' }"
            @click="pay(item)"
          >
            购 买
          </el-button>

          <img src="../../../assets/package-sale/cart-icon.png" style="width: 26px" />
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="showConfirmModal"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="40%"
    >
      <div class="dialog-header flex-between">
        <img src="@/assets/logo_small.png" alt="logo" style="width: 110px" />

        <i
          class="el-icon-close"
          style="color: red; font-size: 24px; font-weight: bold; cursor: pointer"
          @click="closeConfirmModal"
        ></i>
      </div>

      <el-row :gutter="40" style="padding: 20px 40px">
        <el-col :span="10" v-if="!$store.state.offline">
          <div class="star-coin-container">
            <div
              style="
                border-left: 2px solid #4194fe;
                padding-left: 20px;
                font-weight: bold;
                font-size: 21px;
                color: #616161;
              "
            >
              会员信息
            </div>

            <img src="@/assets/scan-user.png" style="width: 184px; margin: 45px 0" />

            <div
              style="
                margin: 40px 0 16px;

                border-radius: 8px;

                cursor: pointer;

                width: 200px;

                padding: 16px 0;

                color: #ffffff;

                text-align: center;

                background-color: #1890ff;
              "
              @click="openScanUserInfoModal"
            >
              点击扫码查询会员信息
            </div>

            <el-input v-show="!isScanPay" size="mini" style="width: 200px" v-model="uid" placeholder="手动输入ID">
              <el-button slot="append" @click="searchUserInfo">查询</el-button>
            </el-input>

            <div v-if="getUserResult">
              <p>
                <span>会员ID：</span>

                <span class="user-id">{{ uid || '暂无' }}</span>
              </p>

              <p>
                <span>剩余积分：</span>

                <span class="user-coins">{{ userStarCoin }}</span>
              </p>
            </div>
          </div>
        </el-col>

        <el-col :span="14">
          <div
            style="
              border-left: 2px solid #4194fe;
              padding-left: 20px;
              font-weight: bold;
              font-size: 21px;
              color: #616161;
            "
          >
            购买套餐：<span style="color: #4194fe">{{ currentPkg.giftName }}</span>
          </div>

          <div>
            <h3 style="color: #7a7a7a">单价：{{ currentPkg.price | MIXIN_Points2Yuan }}元</h3>

            <div class="package-list">
              <el-carousel
                trigger="click"
                height="100px"
                indicator-position="none"
                arrow="always"
                :autoplay="false"
                :loop="false"
              >
                <el-carousel-item v-for="(array, index) in packageList" :key="index">
                  <div class="carousel-package">
                    <el-row v-for="indexⅡ in 4" :key="'c_' + indexⅡ">
                      <el-col :span="24">
                        <span>{{ array[indexⅡ - 1] ? array[indexⅡ - 1]['giftName'] : '' }}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>

          <div style="display: flex; align-items: center; margin: 30px 0">
            <span>购买数量：</span>

            <el-input-number v-model="count" size="large" :precision="0" :step="1" :min="1"></el-input-number>
          </div>

          <div
            style="display: flex; align-items: center; margin: 30px 0"
            v-if="!$store.state.offline && currentPkg.coinNum"
          >
            <span>电子币：</span>

            <el-radio-group v-model="isVirtual">
              <el-radio :label="true">是</el-radio>

              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </div>

          <el-button
            style="border-color: #4194fe; color: #4194fe; border-radius: 8px"
            size="mini"
            v-if="currentPkg.type === 1 || currentPkg.type === 4"
            @click="handleOnGetCoinManual"
            >手动取币
          </el-button>
        </el-col>
      </el-row>

      <div slot="footer">
        <template v-if="!$store.state.offline">
          <el-button
            style="width: 122px"
            :loading="loading"
            v-if="currentPkg.type === 1"
            type="primary"
            :disabled="isVirtual && !getUserResult"
            @click="confirmBuy"
            >确认
          </el-button>

          <el-button
            style="width: 122px"
            :loading="loading"
            v-if="currentPkg.type === 2 || currentPkg.type === 3 || currentPkg.type === 4"
            type="primary"
            :disabled="currentPkg.type !== 3 && !getUserResult"
            @click="confirmBuy"
            >确认
          </el-button>
        </template>

        <el-button style="width: 122px" type="info" @click="closeConfirmModal">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showScanUserInfoModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div
        style="
          text-align: center;
          padding: 18px 0;
          font-size: 24px;
          font-weight: bold;
          border-bottom: 1px solid #cccccc;
        "
      >
        提示
      </div>

      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />

        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描用户二维码......</div>

          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button style="color: #4194fe; border-color: #4194fe" :loading="loading" @click="closeScanUserInfoModal"
          >取 消
        </el-button>
      </div>
    </el-dialog>

    <staffAuth :show.sync="showAuthModal" @success="authSuccess"></staffAuth>
  </div>
</template>

<script>
/* eslint-disable object-shorthand */

import Cookies from 'js-cookie';
import { to } from '@/utils/tools';

import staffAuth from '../../../components/StaffAuth';

export default {
  name: 'store',

  components: {
    staffAuth,
  },

  data() {
    return {
      showAuthModal: false,

      loading: false,

      currentType: '',

      giftList: [],

      giftTypeList: [],

      offlineGiftData: [],

      // 点击购买的弹窗

      showConfirmModal: false,

      showScanUserInfoModal: false,

      getUserResult: false,

      uid: '',

      userStarCoin: '',

      userGameCoin: '',

      buyDiscount: 1, // 会员的打折率，通过查询会员的信息得到，默认是1，不打折

      currentPkg: {},
      packageList: [],

      count: 1,

      isVirtual: false,

      isManual: false,

      isScanPay: false, // 仅扫码购买
    };
  },

  watch: {
    'currentType'(value) {
      Cookies.set('currentType', JSON.stringify(value));
    },

    'currentPkg.detail': {
      deep: true,
      immediate: true,
      handler(array) {
        if (array instanceof Array) {
          const temp = array.concat(array).concat(array).concat(array).concat(array).concat(array).concat(array);
          // temp.splice(0, 10);
          const packageList = [];
          const split = (value) => {
            if (value.length > 4) {
              const s = value.splice(0, 4);
              packageList.push(s);
              split(value);
            } else {
              packageList.push(value);
            }
          };
          split(temp);
          this.packageList = packageList;
        }
      },
    },
  },

  methods: {
    // 关闭确认弹窗

    closeConfirmModal() {
      this.showConfirmModal = false;

      this.uid = '';

      this.userStarCoin = '';

      this.userGameCoin = '';

      this.currentPkg = {};

      this.count = 1;

      this.getUserResult = false;

      this.isVirtual = false;
    },

    handleOnGetCoinManual() {
      if (this.isScanPay && !this.uid) {
        this.$message.error('请先扫码查询会员信息');

        return;
      }

      if (!this.$store.state.offline) {
        this.isManual = true;

        this.confirmBuy();
      } else {
        this.$router.push({
          name: 'package-settle',

          params: {
            orderId: sessionStorage.getItem('moduleId') + Date.now(),

            offValueSum: this.$calc.accMul(this.currentPkg.price, this.count),

            coinValueSum: this.currentPkg.coinPrice,

            starPayFlag: 0,

            gift: this.currentPkg,

            isVirtual: false,

            isManual: true,

            count: this.count,
          },
        });
      }
    },

    // 点击确认购买

    confirmBuy() {
      if (this.currentPkg.authFlag === 1) {
        this.showAuthModal = true;
      } else {
        if (this.isScanPay && !this.uid) {
          this.$message.error('请先扫码查询会员信息');

          return;
        }

        // 判断如果输入了uid但是没有点击查询

        if (this.uid && !this.getUserResult) {
          this.$message.error('请先扫码查询会员信息');

          return;
        }

        this.handlePay();
      }
    },

    handlePay(authData = {}) {
      if (!this.isManual) {
        if (process.env.VUE_APP_ENV === 'production' && !this.$store.state.connectPort) {
          this.$message.error('没有连接机台，无法购买');

          return;
        }
      }

      const orderInfo = {
        packageInfo: this.currentPkg,

        count: this.count,

        isVirtual: this.isVirtual,

        isManual: this.isManual,

        buyDiscount: this.currentPkg.type === 1 ? this.buyDiscount : 1,

        totalPrice: this.$calc.accMul(this.currentPkg.price, this.count),

        // 用于下单的字段，直接打包放在这里，后面的订单直接使用，否则判断出币方式的逻辑要写两次

        paymentInfo: {
          giftId: this.currentPkg.giftId,

          count: this.count,

          kind: this.currentPkg.type,

          ...authData,
        },
      };

      // 判断出币方式：如果是币套餐或者组合套餐，则需要查看是否是虚拟币或者是手动取币

      if (this.currentPkg.type === 1 || this.currentPkg.type === 4) {
        if (this.isVirtual) {
          orderInfo.paymentInfo.coinType = 2;

          orderInfo.paymentInfo.uid = this.uid;
        } else if (this.isManual) {
          orderInfo.paymentInfo.coinType = 3;

          orderInfo.paymentInfo.uid = this.uid;
        } else {
          if (this.getUserResult) {
            orderInfo.paymentInfo.uid = this.uid;
          }

          orderInfo.paymentInfo.coinType = 1;
        }
      } else {
        orderInfo.paymentInfo.uid = this.uid;
      }

      // 如果没有优惠券直接去-》支付，不走订单详情

      this.getCanUseCoupons(orderInfo);
      // this.$router.push({
      //   name: 'package-confirm-order',
      //   params: orderInfo,
      // });
    },

    // 查询优惠券

    getCanUseCoupons(orderInfo) {
      // this.loading = true;
      const params = {
        type: 1, // 1 套餐 |  2 物品
        giftId: orderInfo.packageInfo.giftId,
        kind: orderInfo.packageInfo.type,
        uid: orderInfo.paymentInfo.uid || '',
        price: this.$calc.accMul(orderInfo.packageInfo.price, orderInfo.count),
      };
      // 如果没有优惠券直接去-》支付，不走订单详情

      this.$api
        .getCanUseCoupons(params)
        .then((res) => {
          if (res.body.items.length !== 0) {
            this.$router.push({
              name: 'package-confirm-order',
              params: orderInfo,
            });
          } else {
            this.toPayFor(orderInfo);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 直接去支付

    toPayFor(orderInfo) {
      this.loading = true;

      const params = {
        ...orderInfo.paymentInfo,
      };

      params.useCouponsId = '';

      this.$api

        .userBuyCoinGift(params)

        .then((res) => {
          this.$router.push({
            name: 'package-settle',

            params: {
              ...res.body,

              gift: orderInfo.packageInfo,

              isVirtual: orderInfo.isVirtual,

              isManual: orderInfo.isManual,

              count: orderInfo.count,

              useCoupons: '',

              discountMoney: 0,
            },
          });
        })

        .finally(() => {
          this.loading = false;
        });
    },

    authSuccess(data) {
      console.log(data);

      this.handlePay(data);
    },

    // 关闭扫描用户二维码弹窗

    closeScanUserInfoModal() {
      document.onkeydown = null;

      this.showScanUserInfoModal = false;
    },

    searchUserInfo() {
      this.loading = true;

      this.$api

        .getUserInfo({ uid: this.uid })

        .then((res) => {
          this.uid = res.body.uid;
          this.userStarCoin = res.body.starCoinNum;
          this.buyDiscount = res.body.buyGiftDiscount;
          this.isVirtual = true;
          this.getUserResult = true;
        })

        .catch((e) => {
          this.userStarCoin = '0';

          this.uid = '';
        })

        .finally(() => {
          this.showScanUserInfoModal = false;

          this.loading = false;
        });
    },

    // 打开扫描用户信息二维码弹窗

    openScanUserInfoModal() {
      this.uid = '';

      this.userStarCoin = '';

      this.getUserResult = false;

      this.showScanUserInfoModal = true;

      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.uid += e.key;
        } else {
          this.uid = this.uid.replace(/\s+/g, '');

          this.uid = this.uid.replace(/shift|capslock/gi, '');

          document.onkeydown = null;

          this.searchUserInfo();
        }
      };
    },

    changeType() {
      if (this.$store.state.offline) {
        this.giftList = this.offlineGiftData.filter((item) => {
          return item.giftType === this.currentType.value;
        });
      } else {
        this.getInfo({ giftType: this.currentType.value });
      }
    },

    async pay(item) {
      this.isScanPay = false;

      // 组合套餐需要先查询套餐详情

      if (item.type === 4) {
        const groupPkg = await this.$api.getGroupGiftDetail({
          giftId: item.giftId,
        });

        item.detail = groupPkg.body.detail;
      }

      this.currentPkg = item;

      this.showConfirmModal = true;
    },

    getInfo(params) {
      this.loading = true;

      this.$api
        .getCoinGift(params)
        .then((res) => {
          this.giftList = res.body.giftList;
          this.giftTypeList = res.body.giftTypeList.map((item) => {
            return { label: item, value: item };
          });
          this.setDefaultCurrentType();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    scanPay(data) {
      this.pay(data);

      this.isScanPay = true;
    },

    setDefaultCurrentType() {
      if (this.currentType === '') {
        const type = Cookies.get('currentType');
        if (typeof type === 'undefined') {
          if (this.giftTypeList.length > 0) {
            this.currentType = this.giftTypeList[0];
          }
        } else {
          this.currentType = JSON.parse(type);
        }
      }
    },
  },

  // 有线模式下同步套餐数据到本地数据库，用于离线模式

  async created() {
    if (!this.$store.state.offline) {
      const [err, res] = await to(this.$api.getAllGift());

      if (res) {
        let giftList = [];

        Object.values(res.body.giftJson).forEach((item) => {
          giftList = giftList.concat(item).filter((prize) => prize.type === 1 && prize.authFlag === 0);
        });

        const db = await this.$db.openDB('offlineDB');

        for (let i = 0; i < giftList.length; i++) {
          const item = giftList[i];

          const giftInfo = await this.$db.getDataByIndex(db, 'giftInfo', 'giftId', item.giftId);

          if (giftInfo) {
            await this.$db.updateDB(db, 'giftInfo', item);
          } else {
            await this.$db.addData(db, 'giftInfo', item);
          }
        }
      }
    }
  },

  async mounted() {
    this.setDefaultCurrentType();
    if (!this.$store.state.offline) {
      this.getInfo({ giftType: this.currentType ? this.currentType.value : '' });
    } else {
      const db = await this.$db.openDB('offlineDB');

      const giftData = await this.$db.cursorGetData(db, 'giftInfo');

      giftData.forEach((gift) => {
        if (!this.giftTypeList.find((type) => type.value === gift.giftType)) {
          this.giftTypeList.push({ label: gift.giftType, value: gift.giftType });
        }
      });

      this.offlineGiftData = giftData;

      this.changeType();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin';

/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.dialog-header {
  width: 100%;

  height: 53px;

  background-color: #f5f7fa;

  padding: 0 32px;

  border-bottom: 1px solid #cccccc;
}

.package-list {
  height: 100px;
  color: #1890ff;

  .carousel-package {
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f2f2f2;
    padding: 8px 16px;
    border-radius: 10px;
  }
}

.package-sale {
  flex: 1;

  padding: 20px;

  display: flex;

  flex-direction: column;

  .gifts-list {
    flex: 1 auto;

    height: 0;

    padding: 20px 0;

    overflow-y: auto;

    display: grid;

    grid-row-gap: 20px;

    grid-column-gap: 20px;

    grid-template-columns: repeat(auto-fill, 270px);

    .item {
      width: 270px;

      height: 310px;

      box-sizing: border-box;

      padding: 19px 28px 0;

      background-color: #ffffff;

      border-radius: 1px 1px 1px 1px;

      box-shadow: 0px 2px 0px 0px rgba(204, 204, 204, 0.15);

      .item-name {
        text-align: center;

        padding: 6px;

        overflow: hidden;

        background-color: #41a3fe;

        height: 151px;

        color: #ffffff;

        font-size: 20px;

        font-weight: bold;

        border-radius: 20px;
      }
    }
  }

  .star-coin-container {
    padding-right: 20px;

    border-right: 1px solid #e4e7ed;
  }
}
</style>
