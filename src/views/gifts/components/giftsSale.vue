<template>
  <div class="store-manage" v-loading="loading">
    <div class="gifts-list-container">
      <el-form
        style="
          width: 100%;
          background-color: #ffffff;
          border-radius: 10px;
          padding: 20px 20px 0 20px;
          margin-bottom: 20px;
        "
        ref="searchForm"
        :inline="true"
        label-position="left"
        label-width="90px"
        :model="searchForm"
      >
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <el-form-item label="物品名称:">
              <el-input
                v-model="searchForm.prizeName"
                size="mini"
                clearable
                style="width: 200px"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="mini" style="width: 120px; border-radius: 10px" @click="handleSearch"
                >物品查询</el-button
              >
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <el-form-item label="条形码下单:">
              <el-input
                v-model="searchForm.prizeCode"
                ref="prizeCode"
                @keydown.enter.native="handleAddGoodsByCode"
                size="mini"
                clearable
                style="width: 200px"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                style="width: 120px; border-radius: 10px"
                @click="handleAddGoodsByCode"
                >下单</el-button
              >
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-if="!$store.state.offline">
            <template>
              <el-form-item label="会员信息:">
                <el-input
                  v-model="searchForm.user"
                  size="mini"
                  clearable
                  style="width: 200px"
                  placeholder="请输入会员uid或手机号"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="mini" style="width: 120px; border-radius: 10px" @click="userSearch"
                  >会员查询</el-button
                >

                <el-button
                  size="mini"
                  style="width: 120px; border-radius: 10px; border-color: #4194fe; color: #4194fe"
                  @click="resetSearch"
                  >重 置
                </el-button>
              </el-form-item>
            </template>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-if="searchNickName">
            <template>
              <el-form-item label="会员昵称:">
                <el-input v-model="searchNickName" size="mini" readonly style="width: 200px"></el-input>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </el-form>

      <bc-type-menu v-model="currentIndex" :type-list="prizeTypeList" @change="clickType" />

      <div class="gifts-list" v-loading="loading">
        <div class="item" v-for="i in prizeList" :key="i.prizeId" @click="addPrize(i)">
          <div class="item-name flex-center">{{ i.prizeName }}</div>
          <div class="flex-between">
            <div>
              <div class="item_bottom_fonst">{{ i.offValue | MIXIN_Points2Yuan }}元</div>
              <div class="item_bottom_fonst1">{{ i.coinValue }}积分</div>
            </div>
            <div><img src="@/assets/package-sale/cart-icon.png" style="width: 26px" /></div>
          </div>
          <!-- <div class="item-name flex-center">{{ i.prizeName }}</div>
          <div style="font-size: 18px; color: #848484; margin-top: 18px; padding-left: 24px">
            ￥{{ i.offValue | MIXIN_Points2Yuan }}元
          </div>
          <div style="font-size: 18px; color: #a3a3a3; margin-top: 6px; padding-left: 24px">{{ i.coinValue }}积分</div>
          <div style="font-size: 18px; color: #a3a3a3; margin-top: 6px; padding-left: 24px">
            库存：{{ i.inventory }}
          </div>
          <div class="flex-between" style="margin: 16px 0 0 24px">
            <el-button
              type="primary"
              size="mini"
              style="width: 138px; height: 43px; border-color: #60a5ae; background-color: #60a5ae"
            >
              购 买
            </el-button>
            <img src="@/assets/package-sale/cart-icon.png" style="width: 26px" />
          </div> -->
        </div>
      </div>
    </div>

    <div class="gifts-order flex-column">
      <div style="flex: 1; flex-basis: auto; height: 0; overflow-y: auto; width: 100%">
        <el-table :data="orderList" style="width: 100%" :header-cell-style="{ backgroundColor: '#EBF5FF' }">
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="removeOrderPrize(scope)">删除</el-button>
            </template>
          </el-table-column>

          <el-table-column prop="prizeName" align="center" label="名称"></el-table-column>

          <el-table-column prop="count" label="数量" min-width="100" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.count" size="mini" style="width: 80px"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="offValue" align="center" label="价格">
            <template slot-scope="scope">
              <span>￥{{ scope.row.offValue | MIXIN_Points2Yuan }}</span>
            </template>
          </el-table-column>

          <div slot="empty" class="flex-column" style="align-items: center; padding-top: 200px">
            <img src="@/assets/no-data.png" style="width: 200px" />

            <div style="font-size: 20px; color: #9f9f9f; text-align: center">暂无数据</div>
          </div>
        </el-table>
      </div>

      <div class="total-box">
        <p>
          合计：

          <span>￥{{ orderTotalFee | MIXIN_Points2Yuan }}</span>

          （{{ coinsTotalFee }}积分）
        </p>

        <el-button type="primary" @click="handlePay">去结算</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { to } from '@/utils/tools';

import { isPositiveInt } from '../../../utils/validate';

export default {
  name: 'store',

  components: {},

  data() {
    return {
      loading: false,

      isSearch: false,

      searchForm: {
        prizeName: '',

        prizeCode: '',

        prizeId: '',

        user: '',
      },

      searchPrizeName: '',

      searchNickName: '',

      uid: '',

      buyDiscount: 1,

      currentIndex: {},

      prizeList: [],

      offlinePrizeData: [],

      prizeTypeList: [],

      orderList: [],
    };
  },

  computed: {
    orderTotalFee() {
      const result = this.orderList.reduce((total, cur, next) => {
        return this.$calc.accAdd(total, this.$calc.accMul(cur.offValue, cur.count));
      }, 0);

      // 向上取整

      return Math.ceil(result);
    },

    coinsTotalFee() {
      let result = this.orderList.reduce((total, cur, next) => {
        return this.$calc.accAdd(total, this.$calc.accMul(cur.coinValue, cur.count));
      }, 0);

      // 向上取整，保留两位小数

      result = this.$calc.accDiv(Math.ceil(this.$calc.accMul(result, 100)), 100);

      return result;
    },
  },

  watch: {
    currentIndex(value) {
      Cookies.set('currentIndex', JSON.stringify(value));
    },
  },

  methods: {
    // 条形码下单

    handleAddGoodsByCode() {
      if (this.$store.state.offline) {
        if (this.searchForm.prizeCode) {
          const prizeList = this.offlinePrizeData.filter((item) => item.prizeCode === this.searchForm.prizeCode);

          // 防止prizeCode重复，有多少商品添加多少

          if (prizeList && prizeList.length) {
            prizeList.forEach((item) => this.addPrize(item));
          } else {
            this.$message.error('未找到该物品');
          }

          this.searchForm.prizeCode = '';

          this.$refs.prizeCode.focus();
        }
      } else if (this.searchForm.prizeCode) {
        this.loading = true;

        this.$api

          .getPrize({ prizeCode: this.searchForm.prizeCode })

          .then((res) => {
            if (res.body.prizeList.length) {
              res.body.prizeList.forEach((item) => this.addPrize(item));
            } else {
              this.$message.error('未找到该物品');
            }

            this.searchForm.prizeCode = '';
          })

          .finally(() => {
            this.loading = false;

            this.$refs.prizeCode.focus();
          });
      }
    },

    resetSearch() {
      this.isSearch = false;

      this.searchForm.prizeName = '';

      this.searchForm.prizeCode = '';

      this.searchForm.prizeId = '';

      this.searchPrizeName = '';

      this.buyDiscount = 1;

      this.searchForm.user = '';

      this.searchUser = '';

      this.searchNickName = '';

      this.uid = '';

      this.currentIndex = {};

      this.getInfo({});
    },

    handlePay() {
      if (!this.orderList.length) return;

      let validateFlag = true;

      this.orderList.forEach((item) => {
        item.count = Number(item.count);

        if (!isPositiveInt.test(item.count)) {
          validateFlag = false;
        }
      });

      if (!validateFlag) {
        this.$message.error('请输入正确的购买数量');

        return;
      }

      if (this.$store.state.offline) {
        this.$router.push({
          name: 'giftSettle',

          params: {
            orderId: sessionStorage.getItem('moduleId') + Date.now(),

            offValueSum: this.orderTotalFee,

            coinValueSum: this.coinsTotalFee,

            prizeList: this.orderList,

            buyDiscount: 1,
          },
        });
      } else {
        const orderInfo = {
          prizeList: this.orderList,

          buyDiscount: this.buyDiscount,

          uid: Number(this.uid),

          totalPrice: this.orderTotalFee,
        };

        // 如果没有优惠券或者没有输入会员id直接去-》支付，不走订单详情

        if (this.uid == '') {
          this.toPayFor(orderInfo);
        } else {
          this.getCanUseCoupons(orderInfo);
        }

        // this.$router.push({

        //   name: 'giftsConfirmOrder',

        //   params: orderInfo

        // })

        return;

        this.loading = true;

        this.$api

          .userBuyPrize({
            prizeList: this.orderList,

            uid: Number(this.uid),
          })

          .then((res) => {
            this.$router.push({
              name: 'giftSettle',

              params: {
                ...res.body,

                prizeList: this.orderList,

                buyDiscount: this.buyDiscount,
              },
            });
          })

          .finally(() => {
            this.loading = false;
          });
      }
    },

    // 查优惠券

    getCanUseCoupons(orderInfo) {
      this.loading = true;
      const params = {
        type: 2, // 1 套餐 |  2 物品

        uid: orderInfo.uid || '',

        buyPrizeTypeList: JSON.stringify([...new Set(orderInfo.prizeList.map((item) => item.prizeType))]),

        price: orderInfo.totalPrice,
      };
      this.$api
        .getCanUseCoupons(params)
        .then((res) => {
          if (res.body.items.length !== 0) {
            this.loading = false;
            this.$router.push({
              name: 'giftsConfirmOrder',
              params: orderInfo,
            });
          } else {
            this.toPayFor(orderInfo);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 直接去支付

    toPayFor(orderInfo) {
      const params = {
        prizeList: orderInfo.prizeList.map((item) => ({ prizeId: item.prizeId, count: item.count })),
        uid: Number(orderInfo.uid),
      };
      this.$api
        .userBuyPrize(params)
        .then((res) => {
          this.$router.push({
            name: 'giftSettle',
            params: {
              ...res.body,
              prizeList: orderInfo.prizeList,
              buyDiscount: this.buyDiscount,
              useCoupons: '',
              discountMoney: 0,
            },
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addPrize(prize) {
      if (!this.$store.state.offline) {
        if (prize.inventory === 0) {
          this.$alert('当前物品库存不足，无法购买', {
            showClose: false,

            type: 'error',
          }).then(() => {});

          return;
        }

        if (!prize.prizeBuyRule || prize.prizeBuyRule === '[]') {
          this.$alert('当前物品不允许购买', {
            showClose: false,

            type: 'error',
          }).then(() => {});

          return;
        }

        if (prize.isStockRemind === 1 && prize.inventoryLimit > prize.inventory) {
          this.$alert('当前物品库存小于安全库存，请及时补充库存', {
            showClose: false,

            type: 'warning',
          }).then(() => {});
        }

        if (this.orderList.length && prize.prizeBuyRule !== this.orderList[0].prizeBuyRule) {
          this.$alert('当前物品支付方式冲突，无法添加', {
            showClose: false,

            type: 'error',
          }).then(() => {});

          return;
        }
      }

      const hasAdded = this.orderList.find((item) => {
        return item.prizeId === prize.prizeId;
      });

      if (hasAdded) {
        if (hasAdded.count >= prize.inventory) {
          this.$alert(`当前物品最大库存为${prize.inventory}`, {
            showClose: false,

            type: 'error',
          }).then(() => {});

          return;
        }

        hasAdded.count++;

        return;
      }

      const { prizeId, prizeName, prizeType, offValue, coinValue, prizeBuyRule } = prize;

      const params = {
        prizeId,

        prizeName,

        prizeType,

        offValue,

        coinValue,

        count: 1,

        prizeBuyRule,
      };

      this.orderList.push(params);
    },

    removeOrderPrize(prize) {
      this.orderList.splice(prize.$index, 1);
    },

    clickType({ value }) {
      if (this.$store.state.offline) {
        this.prizeList = this.offlinePrizeData.filter((item) => {
          return item.prizeType === value;
        });
      } else {
        this.getInfo({ prizeType: value });
      }
    },

    // 查询

    handleSearch() {
      if (this.$store.state.offline) {
        if (this.searchForm.prizeName) {
          let resultList = [];

          if (this.searchForm.prizeName) {
            resultList = this.offlinePrizeData.filter((item) => item.prizeName === this.searchForm.prizeName);
          }

          if (this.searchForm.prizeId) {
            resultList = this.offlinePrizeData.filter((item) => item.prizeId === this.searchForm.prizeId);
          }

          if (resultList.length) {
            this.prizeList = resultList;

            this.prizeTypeList = [{ label: resultList[0].prizeType, value: resultList[0].prizeType }];

            this.currentIndex = { label: resultList[0].prizeType, value: resultList[0].prizeType };
          } else {
            this.prizeList = [];

            this.prizeTypeList = [];

            this.currentIndex = {};
          }
        } else {
          this.initOfflinePrize();
        }
      } else {
        this.isSearch = true;

        this.searchPrizeName = this.searchForm.prizeName;

        this.getInfo({});
      }
    },

    // 查询用户信息

    userSearch() {
      if (!this.searchForm.user) {
        this.$message.error('请输入正确的会员信息');

        return;
      }

      this.searchUser = this.searchForm.user;

      this.$api

        .getUserInfo({ uid: this.searchUser })

        .then((res) => {
          this.uid = res.body.uid;

          this.searchNickName = res.body.nickName;

          this.buyDiscount = res.body.buyPrizeDiscount;
        })

        .finally(() => {});
    },

    // 查询物品数据

    getInfo(params) {
      return new Promise((resolve) => {
        this.loading = true;

        if (this.isSearch) {
          params.prizeName = this.searchPrizeName;

          params.prizeId = this.searchForm.prizeId;
        }

        this.$api

          .getPrize(params)

          .then((res) => {
            this.prizeList = res.body.prizeList;

            this.prizeTypeList = res.body.prizeTypeList.map((item) => {
              return { label: item, value: item };
            });
            this.setDefaultCurrentType();
            resolve();
          })

          .finally(() => {
            this.loading = false;
          });
      });
    },

    async initOfflinePrize() {
      const db = await this.$db.openDB('offlineDB');

      const giftData = await this.$db.cursorGetData(db, 'prizeInfo');

      giftData.forEach((gift) => {
        if (!this.prizeTypeList.find((type) => type.value === gift.prizeType)) {
          this.prizeTypeList.push({ label: gift.prizeType, value: gift.prizeType });
        }
      });

      this.offlinePrizeData = giftData;

      this.clickType(this.prizeTypeList[0]);
    },

    setDefaultCurrentType() {
      if (typeof this.currentIndex.value === 'undefined') {
        const type = Cookies.get('currentIndex');
        if (typeof type === 'undefined') {
          if (this.prizeTypeList.length > 0) this.currentIndex = this.prizeTypeList[0];
        } else {
          this.currentIndex = JSON.parse(type);
        }
      }
    },
  },

  async created() {
    if (!this.$store.state.offline) {
      const [err, res] = await to(this.$api.getAllPrize());

      if (res) {
        let giftList = [];

        Object.values(res.body.prizeJson).forEach((item) => {
          giftList = giftList.concat(item);
        });

        const db = await this.$db.openDB('offlineDB');

        for (let i = 0; i < giftList.length; i++) {
          const item = giftList[i];

          // 只存允许现金支付的商品

          if (item.prizeBuyRule.includes('1')) {
            const giftInfo = await this.$db.getDataByIndex(db, 'prizeInfo', 'id', item.id);

            if (giftInfo) {
              await this.$db.updateDB(db, 'prizeInfo', item);
            } else {
              await this.$db.addData(db, 'prizeInfo', item);
            }
          }
        }
      }
    }
  },

  async mounted() {
    document.onkeydown = (e) => {
      if (e.key == 'Enter') {
        return false;
      }
    };

    this.setDefaultCurrentType();

    if (!this.$store.state.offline) {
      this.getInfo({ prizeType: this.currentIndex.value || '' });
    } else {
      await this.initOfflinePrize();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.store-manage {
  @include flex(space-between, flex-start, row);

  .gifts-list-container {
    width: 63vw;

    padding: 20px;

    height: calc(100vh - 115px);

    overflow-y: auto;

    .menu-container {
      @include flex(flex-start, center, row);

      overflow-x: auto;
    }

    .gifts-list {
      display: grid;
      grid-gap: 20px;
      height: 43vh;
      /* 屏幕小于1400px */
      @media screen and (max-width: 1400px) {
        grid-template-columns: repeat(auto-fill, 190px);
      }
      /* 屏幕大于1400px */
      @media screen and (min-width: 1401px) {
        grid-template-columns: repeat(auto-fill, 270px);
      }
      overflow-y: auto;
      .item {
        /* 屏幕小于1400px */
        @media screen and (max-width: 1400px) {
          width: 195px;
          padding: 14px 19px 0 19px;
          height: 167px;
        }
        /* 屏幕大于1400px */
        @media screen and (min-width: 1401px) {
          width: 270px;
          padding: 19px 28px 0;
          height: 222px;
        }
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 1px 1px 1px 1px;
        box-shadow: 0px 2px 0px 0px rgba(204, 204, 204, 0.15);
        border-radius: 10px;
        .item-name {
          text-align: center;
          /* 屏幕小于1400px */
          @media screen and (max-width: 1400px) {
            font-size: 17px;
            height: 93px;
          }
          /* 屏幕大于1400px */
          @media screen and (min-width: 1401px) {
            font-size: 20px;
            height: 143px;
          }
          padding: 6px;
          overflow: hidden;
          background-color: #60a5ae;
          word-break: break-all;
          color: #ffffff;
          font-weight: bold;
          border-radius: 20px;
        }
      }
    }
  }

  .gifts-order {
    position: relative;

    background-color: #ffffff;

    border-left: 1px solid #dcdfe6;

    // width: 22vw;

    height: calc(100vh - 115px);

    /deep/ .el-table {
      &:before {
        height: 0;
      }
    }

    .total-box {
      width: 100%;

      border-top: 1px solid #8c939d;

      padding: 20px;

      background-color: #ffffff;

      @include flex(space-between, center, row);

      span {
        font-weight: bold;
      }
    }
  }
}
.item_bottom_fonst {
  font-size: 18px;
  color: #848484;
}
.item_bottom_fonst1 {
  color: #a3a3a3;
  font-size: 14px;
  line-height: 23px;
}
.flex-between {
  align-content: center;
  padding: 12px 12px 0 12px;
  box-sizing: border-box;
}
</style>
