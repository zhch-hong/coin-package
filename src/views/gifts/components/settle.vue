<template>
  <div class="settle-page" v-loading="loading">
    <div class="overview-box">
      <div>
        <h3 style="color: #333333">订单号：{{ orderInfo.orderId }}</h3>
        <h3 style="color: #333333">
          金额：{{ orderInfo.offValueSum | MIXIN_CeilIntegral | MIXIN_Points2Yuan }} （{{ orderInfo.coinValueSum | MIXIN_NumFixed }}积分） （{{
            orderInfo.gameCoinSum
          }}游戏币）
        </h3>
      </div>
      <el-button type="danger" @click="$router.replace('/gifts/index')">取消购买</el-button>
    </div>
    <el-row>
      <el-col :span="6" v-if="!$store.state.offline">
        <div class="star-coin-container" v-if="prizeBuyRule.includes(2) || prizeBuyRule.includes(3)">
          <div class="bc-title">消耗积分/游戏币</div>
          <img src="@/assets/scan-user.png" style="width: 184px; margin: 45px 0" />
          <div class="scan-title" @click="openScanUserInfoModal">扫码识别会员信息</div>
          <div v-if="uid">
            <p>
              <span>会员ID：</span>
              <span class="user-id">{{ uid || '暂无' }}</span>
            </p>
            <p>
              <span>剩余积分：</span>
              <span class="user-coins">{{ userStarCoin }}</span>
            </p>
            <p>
              <span>剩余本币：</span>
              <span class="user-coins">{{ userGameCoin }}</span>
            </p>
            <div v-if="prizeBuyRule.includes(2)">
              <el-radio v-model="payIndex" label="1">积分支付：</el-radio>
              <el-input v-model="payNum" placeholder="请输入消耗积分" @focus="onPayFocus(1)"></el-input>
            </div>
            <br />
            <div v-if="prizeBuyRule.includes(3) && !orderInfo.useCoupons" @click="onPayFocus(2)">
              <el-radio v-model="payIndex" :disabled="orderInfo.gameCoinSum == 0" label="2">游戏币支付：</el-radio>
              <el-input v-model="payIconNum" placeholder="请输入消耗游戏币" disabled @focus="onPayFocus(2)"></el-input>
            </div>
            <!-- <el-input v-model="payNum" placeholder="请输入消耗积分"></el-input> -->
            <el-button style="margin-top: 20px" type="primary" @click="openConfirmModal">确定</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right-container" v-if="prizeBuyRule.includes(1)">
          <div class="bc-title">支付金额</div>
          <div class="left-total flex-center">
            <div style="font-size: 18px; color: #333333; font-weight: 500">待支付金额:</div>
            <div style="color: #f32525; font-size: 35px; font-weight: bold; margin-top: 6px">￥{{ leftTotalFee | MIXIN_Points2Yuan }}元</div>
          </div>
          <div class="bc-title">支付方式</div>
          <div class="pay-way">
            <div v-if="!$store.state.offline" class="item flex-center" @click="openUserPayByScanModal">
              <img src="@/assets/open-public-relation-card/scan-pay.png" style="width: 50px; margin-right: 20px" />
              <div>扫码支付</div>
            </div>
            <div class="item flex-center" @click="userPayRMB" v-if="cashPayments">
              <img src="@/assets/open-public-relation-card/money-pay.png" style="width: 50px; margin-right: 20px" />
              <div>现金支付</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showScanUserInfoModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div style="text-align: center; padding: 18px 0; font-size: 24px; font-weight: bold; border-bottom: 1px solid #cccccc">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描用户二维码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="closeScanUserInfoModal">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="showConfirmUserStartCoinModal"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <h4>
        确定使用{{ payNum }}积分支付订单吗？
        <br />
        <br />如果消耗积分不足以支付订单，则剩余金额需使用现金支付
      </h4>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="showConfirmUserStartCoinModal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handlePayStarCoin">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="success-dialog"
      :visible.sync="showScanModal"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div style="text-align: center; padding: 18px 0; font-size: 24px; font-weight: bold; border-bottom: 1px solid #cccccc">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描付款码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScanModal">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showSuccessModal" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" width="30%">
      <div style="text-align: center">
        <i class="el-icon-success" style="color: #4194fe; font-size: 108px"></i>
        <div style="font-size: 28px; font-weight: bold; margin-top: 36px">购买成功</div>
        <div
          @click="$router.replace('/gifts/index')"
          style="
            margin: 36px auto 0;
            width: 400px;
            cursor: pointer;
            text-align: center;
            border-radius: 10px;
            font-size: 24px;
            padding: 12px 0;
            color: #ffffff;
            background-color: #4194fe;
          "
        >
          返回
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { isPositiveFloat } from '../../../utils/validate'
import { COIN_RMB_RATE, to } from '../../../utils/tools'
import { getToken } from '../../../utils/auth'

export default {
  name: 'settle',
  data() {
    return {
      loading: false,
      orderInfo: {
        orderId: '',
        offValueSum: '',
        coinValueSum: ''
      },
      ticketHeight: 0,
      prizeList: [],
      // 支付积分
      showScanUserInfoModal: false,
      uid: '',
      userStarCoin: '0',
      userGameCoin: '0',
      // 消耗的积分
      payNum: '',
      payIconNum: '',
      payIndex: '1', // 1积分 2本币
      showConfirmUserStartCoinModal: false,
      // 右边待支付金额
      leftTotalFee: '',
      // 扫码支付弹窗
      showScanModal: false,
      userPayId: '',
      timer: -1,
      buyDiscount: 1,
      // 是否可以现金支付
      cashPayments: true,
      prizeBuyRule: [], // 支付模式,包含1可以现金支付，包含2可以积分支付
      showSuccessModal: false
    }
  },
  methods: {
    getHeight() {
      this.ticketHeight += 25
      return this.ticketHeight
    },
    onPayFocus(index) {
      if (index == 2 && this.orderInfo.gameCoinSum == 0) {
        return
      }
      this.payIndex = index.toString()
    },
    async printTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统')
        return
      }
      const printFlag = Number(sessionStorage.getItem('printFlag'))
      if (printFlag) {
        let p
        if (this.$store.state.offline) {
          const db = await this.$db.openDB('offlineDB')
          const printInfo = await this.$db.getDataByIndex(db, 'printFormat', 'code', 'PRIZE_SALE')
          if (printInfo) {
            p = printInfo
          }
        } else {
          const [err, res] = await to(this.$api.getStorePrint({ code: 'PRIZE_SALE' }))
          if (res) {
            p = res.body.printInfo
          }
        }
        if (p.printFlag) {
          LODOP.PRINT_INIT('')
          // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
          LODOP.SET_PRINT_STYLE('FontSize', 8)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单编号：${this.orderInfo.orderId}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`)
          this.prizeList.forEach((item) => {
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `商品：${item.prizeName}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：${item.count}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `单价：￥${this.MIXIN_Points2Yuan(item.offValue)}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `小计：￥${this.MIXIN_Points2Yuan(this.$calc.accMul(item.offValue, item.count))}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `----------------------`)
          })
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `已优惠金额：${this.MIXIN_Points2Yuan(this.orderInfo.discountMoney)}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `总计：${this.MIXIN_Points2Yuan(this.orderInfo.offValueSum)}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme)
          LODOP.PRINT()
          this.ticketHeight = 0
          callback && callback()
        } else {
          callback && callback()
        }
      }
    },
    // 关闭扫描用户二维码弹窗
    closeScanUserInfoModal() {
      document.onkeydown = null
      this.showScanUserInfoModal = false
    },
    // 打开扫描用户信息二维码弹窗
    openScanUserInfoModal() {
      this.uid = ''
      this.showScanUserInfoModal = true
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.uid += e.key
        } else {
          this.uid = this.uid.replace(/\s+/g, '')
          this.uid = this.uid.replace(/shift|capslock/gi, '')
          document.onkeydown = null
          this.loading = true
          this.$api
            .getUserInfo({ uid: this.uid })
            .then((res) => {
              this.uid = res.body.uid
              this.userStarCoin = res.body.starCoinNum
              this.userGameCoin = res.body.coin
            })
            .catch((e) => {
              this.userStarCoin = '0'
              this.userGameCoin = '0'
              this.uid = ''
            })
            .finally(() => {
              this.showScanUserInfoModal = false
              this.loading = false
            })
        }
      }
    },
    // 支付积分
    handlePayStarCoin() {
      this.loading = true
      this.$api
        .userPayStarCoin({
          orderId: this.orderInfo.orderId,
          uid: this.uid,
          payNum: Number(this.payNum)
        })
        .then((res) => {
          if (Number(this.payNum) === Number(this.orderInfo.coinValueSum)) {
            // 积分支付完成
            this.printTicket()
            this.showSuccessModal = true
          } else {
            if (!this.prizeBuyRule.includes(1)) {
              this.$alert('积分不足，购买失败', '购买失败', {
                type: 'error',
                showClose: false
              }).then(() => {
                this.$router.replace('/gifts/index')
              })
              return
            }
            // 还需要补现金
            this.leftTotalFee = Math.ceil(this.$calc.Subtr(this.orderInfo.offValueSum, this.MIXIN_Integral2PointsFloor(this.payNum)))
            this.userStarCoin = this.$calc.Subtr(this.userStarCoin, this.payNum)
            this.payNum = ''
            this.showConfirmUserStartCoinModal = false
            this.$message.info('积分扣除成功，请继续支付剩余金额')
            this.cashPayments = false
          }
        })
        .finally((f) => {
          this.loading = false
        })
    },
    // 支付现金 ，支付类型： type  1 现金支付  2 扫码支付
    userPayRMB() {
      document.onkeydown = (e) => {
        if (e.key == 'Enter') {
          return false
        }
      }
      this.$confirm('确认已收到现金?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(async () => {
          if (this.$store.state.offline) {
            const db = await this.$db.openDB('offlineDB')
            const orderInfo = {
              orderPrize: this.prizeList.map((item) => {
                return {
                  prizeName: item.prizeName,
                  prizeId: item.prizeId,
                  prizeType: item.prizeType,
                  coinValue: item.coinValue,
                  offValue: item.offValue,
                  count: item.count
                }
              }),
              moduleId: sessionStorage.getItem('moduleId'),
              moduleName: sessionStorage.getItem('moduleName'),
              orderId: this.orderInfo.orderId,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              status: 1,
              offValueSum: this.orderInfo.offValueSum,
              coinValueSum: this.orderInfo.coinValueSum,
              valuePayType: 3,
              payCoin: 0,
              payValue: this.orderInfo.offValueSum,
              name: sessionStorage.getItem('staffName'),
              auditor: ''
            }
            await this.$db.addData(db, 'prizeRecord', orderInfo)
            this.printTicket()
            this.showSuccessModal = true
          } else {
            this.loading = true
            this.$api
              .userPayRMB({
                orderId: this.orderInfo.orderId,
                type: 1
              })
              .then((res) => {
                this.showSuccessModal = true
                this.printTicket()
              })
              .finally(() => {
                this.loading = false
              })
          }
        })
        .catch(() => {})
    },
    closeScanModal() {
      this.$confirm('是否确认取消支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          document.onkeydown = null
          this.showScanModal = false
          this.loading = false
        })
        .catch(() => {})
    },
    // 扫支付宝、微信
    openUserPayByScanModal() {
      this.userPayId = ''
      this.showScanModal = true
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.userPayId += e.key
        } else {
          this.userPayId = this.userPayId.replace(/\s+/g, '')
          this.userPayId = this.userPayId.replace(/shift|capslock/gi, '')
          document.onkeydown = null
          this.loading = true
          this.$api
            .userPayRMB({
              orderId: this.orderInfo.orderId,
              type: 2,
              authNo: this.userPayId
            })
            .then((res) => {
              if (res.body.status === 1) {
                this.showSuccessModal = true
                this.showScanModal = false
                this.printTicket()
              } else {
                this.timer = setInterval(() => {
                  this.queryOrder()
                }, 5000)
              }
              this.loading = false
            })
            .catch((e) => {
              this.showScanModal = false
              this.loading = false
            })
        }
      }
    },
    // 支付宝、微信支付，查询订单支付状态  flag: 0 :未支付 , 1:已支付
    queryOrder() {
      this.$api
        .queryOrder({ outTradeNo: this.orderInfo.orderId })
        .then((res) => {
          if (res.body.flag === 1) {
            clearInterval(this.timer)
            this.showSuccessModal = true
            this.showScanModal = false
            this.loading = false
            this.printTicket()
          }
        })
        .catch((e) => {
          this.showScanModal = false
          this.loading = false
          clearInterval(this.timer)
        })
    },
    openConfirmModal() {
      if (this.payIndex == 1) {
        if (!isPositiveFloat.test(this.payNum)) {
          this.$message.error('请输入正确的数字')
          return
        }
        if (Number(this.payNum) <= 0) {
          this.$message.error('请输入正确的正数')
          return
        }
        if (Number(this.payNum) > this.userStarCoin) {
          this.$message.error('输入数量大于玩家剩余积分数')
          return
        }
        if (Number(this.payNum) > this.orderInfo.coinValueSum) {
          this.$message.error('输入数量大于订单总额')
          return
        }
        if (this.prizeBuyRule.length === 2) {
          // 既可以现金又可以积分
          this.showConfirmUserStartCoinModal = true
        } else {
          this.handlePayStarCoin()
        }
      } else if (this.payIndex == 2) {
        if (Number(this.userGameCoin) < this.orderInfo.gameCoinSum) {
          this.$message.error('玩家游戏币数量不足')
          return
        }
        this.loading = true
        this.$api
          .userPayPrizeGameCoin({
            uid: this.uid,
            orderId: this.orderInfo.orderId,
            payNum: this.payIconNum
          })
          .then((res) => {
            this.loading = false
            this.showSuccessModal = true
            this.printTicket()
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  },
  created() {
    const params = this.$route.params
    console.log(params)
    if (params.orderId && params.offValueSum) {
      this.orderInfo = params
      this.leftTotalFee = params.offValueSum
      this.prizeList = params.prizeList
      this.prizeBuyRule = JSON.parse(params.prizeList[0].prizeBuyRule)
      this.buyDiscount = Number(params.buyDiscount) || 1
      this.payIconNum = this.orderInfo.gameCoinSum
      if (!this.prizeBuyRule.includes(2)) {
        this.payIndex = '2'
      }
    } else {
      this.$message.error('获取订单信息异常，请重新下单')
      this.$router.replace('/gifts/index')
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
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

.settle-page {
  width: 100%;
  height: 100%;

  .overview-box {
    background-color: #ffffff;
    width: 100%;
    @include flex(flex-start, center, row);
    font-weight: bold;
    padding: 8px 20px;
    margin-bottom: 20px;

    h3 {
      margin-right: 140px;
    }
  }

  .star-coin-container {
    padding: 20px 70px;
    display: flex;
    flex-direction: column;
    height: 80vh;
    margin-right: 20px;
    border-right: 1px solid #cccccc;

    .scan-title {
      border-radius: 8px;
      width: 200px;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      background-color: #4194fe;
      padding: 16px;
    }
  }

  .right-container {
    padding: 20px 0 0 80px;
    height: 668px;

    .left-total {
      margin-top: 41px;
      margin-bottom: 41px;
      flex-direction: column;
      width: 40vw;
      height: 30vh;
      background: #ffffff;
      border: 1px solid #7a7a80;
      border-radius: 20px;
      padding: 80px 0;
      text-align: center;
    }

    .pay-way {
      @include flex(space-between, center, row);
      margin-top: 41px;
      width: 40vw;

      .item {
        color: #616161;
        font-weight: bold;
        text-align: center;
        line-height: 120px;
        width: 222px;
        height: 96px;
        background: #ffffff;
        border: 2px solid #4194fe;
        border-radius: 10px;
      }
    }
  }
}
</style>
