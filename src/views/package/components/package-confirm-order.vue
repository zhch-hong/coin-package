<template>
  <el-container class="confirm-order" style="height: 100%">
    <el-header class="flex-start" style="background-color: #ffffff">
      <el-button type="danger" @click="$router.back()" style="border-radius: 10px">取消购买</el-button>
    </el-header>
    <el-main style="flex: 1; padding: 24px; display: flex; flex-direction: column">
      <div class="flex-between" style="align-items: flex-start; flex: 1">
        <div class="order-detail flex-column" style="flex-basis: 48%; height: 100%">
          <div class="bc-title">订单详情</div>
          <div
            style="flex: 1; width: 100%; height: 100%; margin-top: 24px; background-color: #ffffff; border-radius: 10px"
          >
            <table class="package-list" style="width: 100%; text-align: center" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td>套餐名称</td>
                  <td>单价</td>
                  <td>数量</td>
                  <td>总价</td>
                </tr>
              </thead>
              <tr>
                <td>{{ packageInfo.giftName }}</td>
                <td>{{ packageInfo.price | MIXIN_Points2Yuan }}</td>
                <td>{{ orderInfo.count }}</td>
                <td>{{ orderInfo.totalPrice | MIXIN_Points2Yuan }}</td>
              </tr>
              <tr>
                <td colspan="3" style="font-size: 16px; font-weight: bold; color: #343434">汇总</td>
                <td style="font-size: 16px; font-weight: bold; color: #ff3d2a">
                  {{ orderInfo.totalPrice | MIXIN_Points2Yuan }}
                </td>
              </tr>
              <tr>
                <td colspan="3" style="font-size: 16px; font-weight: bold; color: #343434">会员折后价</td>
                <td style="font-size: 16px; font-weight: bold; color: #ff3d2a">
                  {{ memberPrice | MIXIN_Points2Yuan }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="coupons-detail flex-column" style="flex-basis: 48%; height: 100%">
          <div class="bc-title">优惠券详情</div>
          <div
            style="
              border-top: 1px solid #a0a0a0;
              max-height: 305px;
              margin: 24px 0;
              width: 100%;
              flex: 1 auto;
              overflow: auto;
            "
          >
            <div
              class="coupons-item flex-start"
              v-for="i in couponsList"
              :key="i.id"
              @click="handleSelectCoupon(i)"
              style="
                margin-top: 24px;
                box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.08);
                margin-right: 24px;
                height: 106px;
                background-color: #ffffff;
                border-radius: 10px;
              "
            >
              <div
                class="flex-column coupons-left"
                :style="{
                  'background-image': `url(${
                    i.type === 3
                      ? require('../../../assets/package-confirm-order/coupons-bg.png')
                      : require('../../../assets/package-confirm-order/coupons-bg-2.png')
                  })`,
                }"
              >
                <div v-if="i.type === 3">
                  <span style="font-size: 19px">￥</span>
                  <span style="font-size: 42px; font-weight: bold">{{ i.cutRMB | MIXIN_Points2Yuan }}</span>
                </div>
                <div v-if="i.type === 4">
                  <span style="font-size: 42px; font-weight: bold">{{ formatRate(i.cutRate) }}</span>
                  <span style="font-size: 19px">折</span>
                </div>
                <div style="font-size: 18px; margin-top: 4px">满{{ i.consumeLimit | MIXIN_Points2Yuan }}元可用</div>
              </div>
              <div class="coupons-right" style="padding: 0 20px; width: 100%">
                <div class="flex-between" style="width: 100%">
                  <div
                    style="
                      flex-grow: 1;
                      flex-shrink: 0;
                      width: 0;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      overflow: hidden;
                      font-size: 25px;
                      font-weight: bold;
                      color: #000000;
                    "
                  >
                    {{ i.couponsName }}
                  </div>
                  <img
                    style="width: 31px; margin-left: 12px"
                    :src="
                      selectedCoupon.id === i.id
                        ? require('../../../assets/package-confirm-order/select-coupons-active.png')
                        : require('../../../assets/package-confirm-order/select-coupons-default.png')
                    "
                    alt="select"
                  />
                </div>
                <div v-if="i.type === 4" style="margin-top: 12px">
                  最大折扣金额：{{ i.cutRMB | MIXIN_Points2Yuan }}元
                </div>
                <div style="margin-top: 12px">{{ i.endTime ? `有效期至${i.endTime}` : '不过期' }}</div>
              </div>
            </div>
          </div>
          <div
            class="flex-center"
            style="
              width: 100%;
              height: 56px;
              margin-right: 24px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.08);
            "
          >
            已优惠￥{{ totalDiscountMoney | MIXIN_Points2Yuan }}
          </div>
        </div>
      </div>
      <div style="padding: 24px 0; border-top: 1px solid #a0a0a0; margin-top: 24px" class="flex-center">
        <span style="font-size: 20px; font-weight: bold; color: #343434">合计：</span>
        <span style="font-size: 20px; font-weight: bold; color: #ff3d2a">{{ totalPayPrice | MIXIN_Points2Yuan }}</span>
        <span style="font-size: 16px">（{{ totalPayIntegral }}积分）</span>
        <el-button
          type="primary"
          style="width: 122px; margin-left: 42px; border-radius: 10px"
          :loading="loading"
          @click="handlePayment"
        >
          去支付
        </el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'confirm-order',
  data() {
    return {
      loading: false,
      orderInfo: {},
      packageInfo: {},
      memberPrice: 0,
      couponsList: [],
      selectedCoupon: {},
      discountMoney: 0,
    };
  },
  computed: {
    totalDiscountMoney() {
      if (this.selectedCoupon.id) {
        return this.discountMoney > this.memberPrice ? this.memberPrice : this.discountMoney;
      }
      return 0;
    },
    totalPayPrice() {
      if (this.selectedCoupon.id) {
        const result = this.$calc.Subtr(this.memberPrice, this.calcDiscountMoney());
        return result < 0 ? 0 : result;
      }
      return this.memberPrice;
    },
    totalPayIntegral() {
      const memberIntegral = this.MIXIN_CeilIntegral(
        this.$calc.accMul(this.MIXIN_Points2StarCoin(this.orderInfo.totalPrice), this.orderInfo.buyDiscount)
      );
      if (this.selectedCoupon.id) {
        const result = this.$calc.Subtr(memberIntegral, this.$calc.accMul(this.discountMoney, 0.33));
        return result < 0 ? 0 : result;
      }
      return memberIntegral;
    },
  },
  methods: {
    formatRate(val) {
      return this.$calc.accDiv(val, 10);
    },
    handlePayment() {
      this.loading = true;
      const params = {
        ...this.orderInfo.paymentInfo,
      };
      if (this.selectedCoupon.id) {
        params.useCouponsId = this.selectedCoupon.id;
      }
      this.$api
        .userBuyCoinGift(params)
        .then((res) => {
          this.$router.push({
            name: 'package-settle',
            params: {
              ...res.body,
              gift: this.packageInfo,
              isVirtual: this.orderInfo.isVirtual,
              isManual: this.orderInfo.isManual,
              count: this.orderInfo.count,
              useCoupons: !!this.selectedCoupon.id,
              discountMoney: this.totalDiscountMoney,
              uid: this.orderInfo.paymentInfo.uid,
            },
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSelectCoupon(item) {
      if (item.id === this.selectedCoupon.id) {
        this.selectedCoupon = {};
        this.discountMoney = 0;
      } else {
        this.selectedCoupon = item;
      }
    },
    /**
     * 计算优惠券优惠的价格：
     * 折扣券计算公式： 会员折扣价 * （1 - 折扣） = 优惠的金额
     */
    calcDiscountMoney(coupon = this.selectedCoupon) {
      let discountMoney = 0;
      // 抵用券
      if (coupon.type === 3) {
        discountMoney = coupon.cutRMB;
      }
      // 折扣券
      if (coupon.type === 4) {
        // 已优惠价格
        discountMoney = this.$calc.accMul(
          this.memberPrice,
          this.$calc.accDiv(this.$calc.Subtr(100, coupon.cutRate), 100)
        );
        // 如果参与打折的这部分金额当中，折扣金额 > 这张优惠券能打折的最大金额，则直接取折扣券的最大金额
        if (discountMoney > coupon.cutRMB) {
          discountMoney = coupon.cutRMB;
        }
      }
      this.discountMoney = Math.floor(discountMoney);
      return this.discountMoney;
    },
    setDefaultCoupon() {
      // 找到优惠力度最大的的券
      let defaultCoupon = {};
      let discountMoney = null; // 初始值，代表还没有参与计算
      this.couponsList.forEach((coupon) => {
        if (discountMoney === null) {
          defaultCoupon = coupon;
          discountMoney = this.calcDiscountMoney(coupon);
        } else {
          const currentCouponDiscountMoney = this.calcDiscountMoney(coupon);
          if (currentCouponDiscountMoney > discountMoney) {
            defaultCoupon = coupon;
            discountMoney = currentCouponDiscountMoney;
          }
        }
      });
      return defaultCoupon;
    },
    getCanUseCoupons() {
      this.loading = true;
      const params = {
        type: 1, // 1 套餐 |  2 物品
        giftId: this.orderInfo.packageInfo.giftId,
        kind: this.orderInfo.packageInfo.type,
        uid: this.orderInfo.paymentInfo.uid || '',
        price: this.$calc.accMul(this.orderInfo.packageInfo.price, this.orderInfo.count),
      };
      this.$api
        .getCanUseCoupons(params)
        .then((res) => {
          if (res.body.items.length) {
            this.couponsList = res.body.items;
            this.handleSelectCoupon(this.setDefaultCoupon());
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.orderInfo = this.$route.params;
    this.packageInfo = this.orderInfo.packageInfo;
    this.memberPrice = Math.ceil(this.$calc.accMul(this.orderInfo.totalPrice, this.orderInfo.buyDiscount));
    this.getCanUseCoupons();
  },
};
</script>

<style lang="scss" scoped>
.confirm-order {
  .package-list {
    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;

    thead {
      background: #ebf5ff;
      border-collapse: collapse;
    }

    tr {
      td {
        padding: 16px 0;
        font-size: 16px;
        font-weight: 500;
        color: #666666;
        border-right: 1px solid #d7d7d7;
        border-bottom: 1px solid #d7d7d7;
      }
    }
  }

  .coupons-left {
    padding: 0 12px;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 100%;
    flex-shrink: 0;
    width: 160px;
  }
}
</style>
