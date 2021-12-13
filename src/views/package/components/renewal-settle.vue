<template>
  <div class="settle-page" v-loading="loading">
    <div class="overview-box">
      <h3 style="color: #333333">订单号：{{ orderInfo.orderId }}</h3>
      <h3 style="color: #333333">
        金额：{{ orderInfo.offValueSum | MIXIN_Points2Yuan }}（{{ orderInfo.coinValueSum | MIXIN_NumFixed }}积分）（{{
          orderInfo.gameCoinSum
        }}游戏币）
      </h3>
      <el-button type="danger" @click="$router.back()">取消购买</el-button>
    </div>
    <el-row>
      <el-col :span="6">
        <div class="star-coin-container">
          <div class="bc-title">消耗积分</div>
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
            <!-- <el-input v-model="payNum" placeholder="请输入消耗积分"></el-input> -->
            <div>
              <el-radio v-model="payIndex" label="1">积分支付：</el-radio>
              <el-input v-model="payNum" placeholder="请输入消耗积分" @focus="onPayFocus(1)"></el-input>
            </div>
            <br />
            <div v-if="orderInfo.gameCoinBuy !== 0">
              <el-radio v-model="payIndex" label="2">游戏币支付：</el-radio>
              <el-input v-model="payIconNum" placeholder="请输入消耗游戏币" disabled @focus="onPayFocus(2)"></el-input>
            </div>
            <el-button style="margin-top: 20px" type="primary" @click="openConfirmModal">确定</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right-container">
          <div class="bc-title">支付金额</div>
          <div class="left-total flex-center">
            <div style="font-size: 18px; color: #333333; font-weight: 500">待支付金额:</div>
            <div style="color: #f32525; font-size: 35px; font-weight: bold; margin-top: 6px">￥{{ leftTotalFee | MIXIN_Points2Yuan }}元</div>
          </div>
          <div class="bc-title">支付方式</div>
          <div class="pay-way">
            <div class="item flex-center" @click="openUserPayByScanModal">
              <img src="@/assets/open-public-relation-card/scan-pay.png" style="width: 50px; margin-right: 20px" />
              <div>扫码支付</div>
            </div>
            <div class="item flex-center" @click="sureGetRMB" v-if="cashPayments">
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
      <h4>确定使用{{ payNum }}积分支付订单吗？<br /><br />如果消耗积分不足以支付订单，则剩余金额需使用现金支付</h4>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="showConfirmUserStartCoinModal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handlePayStarCoin">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showScanModal"
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
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描付款码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScanModal">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { isPositiveFloat } from '../../../utils/validate'
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
      giftInfo: {},
      ticketHeight: 0,
      // 支付积分
      showScanUserInfoModal: false,
      uid: '',
      payIndex: '1',
      userStarCoin: '0',
      userGameCoin: '0',
      payNum: '',
      payIconNum: '',
      showConfirmUserStartCoinModal: false,
      // 右边待支付金额
      leftTotalFee: '',
      // 扫码支付弹窗
      showScanModal: false,
      userPayId: '',
      timer: -1,
      // 是否可以现金支付
      cashPayments: true
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
    printTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统')
        return
      }
      LODOP.PRINT_INIT('')
      // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, '========== 欢迎光临 =========')
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `套餐销售小票`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单编号：${this.orderInfo.orderId}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${sessionStorage.getItem('storeName')}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `商品：${this.giftInfo.name}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：1`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `价格：￥${this.MIXIN_Points2Yuan(this.orderInfo.offValueSum)}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `总计：${this.MIXIN_Points2Yuan(this.orderInfo.offValueSum)}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`)
      LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `技术支持：金花运营服务平台`)
      // LODOP.PREVIEW()
      this.ticketHeight = 0
      LODOP.PRINT()
      callback && callback()
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
        .userRenewalPayStarCoin({
          orderId: this.orderInfo.orderId,
          uid: this.uid,
          payNum: Number(this.payNum)
        })
        .then((res) => {
          if (Number(this.payNum) === Number(this.orderInfo.coinValueSum)) {
            // 积分支付完成
            this.$message.success('购买完成')
            this.printTicket()
            this.$alert('续期成功', '成功', {
              type: 'success'
            }).then(() => {
              this.$router.back()
            })
          } else {
            // 还需要补现金
            this.leftTotalFee = this.$calc.Subtr(this.orderInfo.offValueSum, this.MIXIN_Integral2PointsFloor(this.payNum))
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
    // 支付类型： type  1 现金支付  2 扫码支付
    sureGetRMB() {
      document.onkeydown = (e) => {
        if (e.key == 'Enter') {
          return false
        }
      }
      this.$confirm('确认已收到现金?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          this.$api
            .userRenewalPayRMB({ orderId: this.orderInfo.orderId, type: 1 })
            .then((res) => {
              this.$message.success('购买完成')
              this.printTicket()
              this.$alert('续期成功', '成功', {
                type: 'success'
              }).then(() => {
                this.$router.back()
              })
            })
            .finally(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    closeScanModal() {
      this.$confirm('是否确认取消支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          document.onkeydown = null
          this.showScanModal = false
          this.loading = false
        })
        .catch(() => {})
    },
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
            .userRenewalPayRMB({ orderId: this.orderInfo.orderId, type: 2, authNo: this.userPayId })
            .then((res) => {
              if (res.body.status === 1) {
                this.$message.success('购买完成')
                this.showScanModal = false
                this.loading = false
                this.printTicket()
                this.$alert('续期成功', '成功', {
                  type: 'success'
                }).then(() => {
                  this.$router.back()
                })
              } else {
                this.timer = setInterval(() => {
                  this.queryOrder()
                }, 5000)
              }
            })
            .catch((e) => {
              this.showScanModal = false
              this.loading = false
            })
        }
      }
    },
    // 查询订单支付状态  flag: 0 :未支付 , 1:已支付
    queryOrder() {
      this.$api
        .queryOrder({ outTradeNo: this.orderInfo.orderId })
        .then((res) => {
          if (res.body.flag === 1) {
            clearInterval(this.timer)
            this.$message.success('购买完成')
            this.showScanModal = false
            this.loading = false
            this.printTicket()
            this.$alert('续期成功', '成功', {
              type: 'success'
            }).then(() => {
              this.$router.back()
            })
          }
        })
        .catch((e) => {
          this.showScanModal = false
          this.loading = false
          clearInterval(this.timer)
        })
    },
    openConfirmModal() {
      if (this.payIndex == '1') {
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
        this.showConfirmUserStartCoinModal = true
      } else if (this.payIndex == '2') {
        if (Number(this.payIconNum) < this.orderInfo.gameCoinSum) {
          this.$message.error('玩家游戏币数量不足')
          return
        }
        this.loading = true
        this.$api
          .userRenewalPayGameCoin({
            uid: this.uid,
            orderId: this.orderInfo.orderId,
            payNum: this.payIconNum
          })
          .then((res) => {
            this.loading = false
            this.$message.success('购买完成')
            this.printTicket()
            this.$router.back()
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
      this.giftInfo = params.gift
      this.payIconNum = this.orderInfo.gameCoinSum
    } else {
      this.$message.error('获取订单信息异常，请重新下单')
      this.$router.back()
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
