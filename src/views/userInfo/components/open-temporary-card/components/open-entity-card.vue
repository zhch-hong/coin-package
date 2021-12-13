<template>
  <div class="open-entity-card" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="user-content">
          <h2 class="title">{{ cardType === 0 ? '公关卡' : '临时卡' }}开卡列表：单次最大批量开20张<br /></h2>
          <el-table
            :loading="loading"
            :data="tableData"
            :height="650"
            highlight-current-row
            :header-cell-style="{
              backgroundColor: '#EBF5FF',
              fontSize: '16px',
              fontWeight: 'bold'
            }"
          >
            <el-table-column label="会员ID/卡号" prop="cardNum" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" circle></el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <img style="width: 316px" src="@/assets/open-public-relation-card/no-data.png" alt="no-data" />
              <div style="font-size: 20px; font-weight: bold; color: #9f9f9f">暂无数据</div>
            </div>
          </el-table>
          <div class="flex-between" style="padding: 10px">
            <div style="font-size: 17px; font-weight: bold; color: #545050">开卡费总计(共 {{ tableData.length }} 张):￥{{ totalFee }}</div>
            <div>
              <el-button type="primary" size="medium" style="width: 150px" @click="openAuthModal">确认开卡</el-button>
              <el-button size="medium" style="width: 150px; background-color: #7a7a80; color: #ffffff" @click="clearTable">清空列表 </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="user-content" style="background-color: transparent">
          <el-form style="width: 100%; padding: 0px 20px 0 20px" @submit.native.prevent :inline="false">
            <el-form-item label="">
              <el-input
                :maxlength="30"
                v-model="cardNum"
                @input="cancelSearch"
                @keydown.enter.native="handleChangeValue"
                @clear="cancelSearch"
                clearable
                size="medium"
                style="width: 400px"
                placeholder="点击输入卡号回车键输入结束"
              ></el-input>
            </el-form-item>
            <p style="font-size: 14px; line-height: 24px">
              <span style="color: red">*</span>温馨提示：请将鼠标指针放到输入框内，<br />再将实体卡放在读卡器上，完成读取
            </p>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showScanUserInfoModal"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div style="text-align: center; padding: 18px 0; font-size: 24px; font-weight: bold; border-bottom: 1px solid #cccccc">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描卡号......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="closeScanUserInfoModal">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showPayModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="565px"
    >
      <div class="dialog-header flex-between">
        <img src="@/assets/logo_small.png" alt="logo" style="width: 110px" />
        <i class="el-icon-close" style="color: red; font-size: 24px; font-weight: bold; cursor: pointer" @click="closePayModal"></i>
      </div>
      <h2 align="center" style="margin-top: 70px">
        <span> 待支付金额: </span>
        <span style="color: #f5040d; font-weight: bold; font-size: 41px">{{ totalFee }}</span>
        <span> 元</span>
      </h2>
      <div style="margin-top: 60px; padding-bottom: 60px" class="flex-center">
        <div class="flex-center pay-button" @click="handlePayRMB">
          <img style="width: 40px; margin-right: 16px" src="@/assets/open-public-relation-card/scan-pay.png" alt="scan-pay" />
          扫码支付
        </div>
        <div class="flex-center pay-button" @click="userPayRMB" style="margin-left: 36px">
          <img style="width: 40px; margin-right: 16px" src="@/assets/open-public-relation-card/money-pay.png" alt="scan-pay" />
          现金支付
        </div>
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
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描付款二维码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScanModal">取 消</el-button>
      </div>
    </el-dialog>
    <StaffAuth :show.sync="showAuthModal" @success="authSuccess"></StaffAuth>
  </div>
</template>

<script>
import moment from 'moment'
import { coin2Rmb } from '@/utils/tools'
import StaffAuth from '@/components/StaffAuth'
import { getToken } from '@/utils/auth'

export default {
  name: 'open-entity-card',
  components: {
    StaffAuth
  },
  props: {
    cardType: {
      type: Number,
      default: 3
    }
  },
  mounted() {
    this.getCardFee()
  },
  data() {
    return {
      showPayModal: false,
      showScanUserInfoModal: false,
      loading: false,
      totalFee: '0.00',
      cardNum: '',
      tableData: [],
      hasFind: false,
      userCoin: 0,
      userStarCoin: 0,
      putCoin: '',
      orderId: '',
      cardFee0: 0,
      cardFee2: 0,
      authFlag0: 0,
      authFlag2: 0,
      vipLevelId0: 0,
      vipLevelId2: 0,
      putStar: '',
      type: 1, // 1补游戏币，2补积分
      // 扫码支付弹窗
      showScanModal: false,
      userPayId: '',
      timer: -1,
      // 授权弹窗
      showAuthModal: false
    }
  },
  watch: {
    cardType() {
      this.tableData = []
      this.cardNum = ''
      this.totalFee = '0.00'
    }
  },
  methods: {
    // 员工授权成功
    authSuccess(data) {
      console.log(data)
      this.handleOpenCard(data)
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
          this.orderId = ''
          this.loading = false
        })
        .catch(() => {})
    },
    // 删除 ，清空uid
    cancelSearch() {},
    // 打开授权弹窗
    openAuthModal() {
      if (this.cardType === 3 && this.vipLevelId2 === 0) {
        this.$message.error('该门店未设置临时卡信息')
        return
      }
      if (this.cardType === 0 && this.vipLevelId0 === 0) {
        this.$message.error('该门店未设置公关卡信息')
        return
      }
      if (this.tableData.length <= 0) {
        this.$message.error('请至少添加一张卡号')
        return
      }
      if (this.cardType === 0 && this.authFlag0 === 1) {
        this.showAuthModal = true
      } else if (this.cardType === 3 && this.authFlag2 === 1) {
        this.showAuthModal = true
      } else {
        this.handleOpenCard({})
      }
    },
    getCardFee() {
      this.$api.getVipCardInfo({}).then((res) => {
        const list = res.body
        for (let i = 0; i < list.length; i++) {
          if (Number(list[i].vipType) === 0) {
            this.cardFee0 = coin2Rmb(list[i].vipCost) || 0
            this.authFlag0 = list[i].authFlag
            this.vipLevelId0 = list[i].id
          } else if (Number(list[i].vipType === 3)) {
            // 临时卡
            this.cardFee2 = coin2Rmb(list[i].vipCost) || 0
            this.authFlag2 = list[i].authFlag
            this.vipLevelId2 = list[i].id
          }
        }
      })
    },
    addSuccess() {
      clearInterval(this.timer)
      this.handleSearchUser()
      this.putCoin = this.putStar = ''
      this.hasFind = false
    },
    handleChangeValue(e) {
      // 为了防止快速按回车触发多次
      const cardNum = this.cardNum
      this.cardNum = ''
      if (!cardNum) {
        return
      }
      if (cardNum.length < 10) {
        this.$message.error('请输入正确的卡号')
        return
      }
      if (this.tableData.length >= 20) {
        this.$message.error('最多添加20张卡号')
        return
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].cardNum === cardNum) {
          this.$message.error('已添加过该卡号,不能重复添加')
          return
        }
      }
      this.$api.checkCardNum({ cardNum }).then((res) => {
        this.tableData.push({ cardNum })
        console.log(this.tableData.length)
        const cardFee = this.cardType === 0 ? this.cardFee0 : this.cardFee2
        this.totalFee = this.$calc.accMul(cardFee, this.tableData.length).toFixed(2)
        console.log(cardFee, this.totalFee)
      })
    },
    handleDelete(data) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].cardNum === data.cardNum) {
          this.tableData.splice(i, 1)
          break
        }
      }

      this.totalFee = this.$calc.accMul(this.cardType === 0 ? this.cardFee0 : this.cardFee2, this.tableData.length).toFixed(2)
    },
    handleOpenCard(data) {
      const list = []
      for (let i = 0; i < this.tableData.length; i++) {
        list.push(this.tableData[i].cardNum)
      }
      const params = {
        cardNumList: list,
        cardType: this.cardType,
        vipLevelId: this.cardType === 0 ? this.vipLevelId0 : this.vipLevelId2,
        ...data
      }
      this.$api
        .userOpenVipCard(params)
        .then((res) => {
          console.log(res)
          this.handlePayRMBData(res.body)
        })
        .catch((e) => {})
    },
    handlePayRMBData(data) {
      this.totalFee = coin2Rmb(data.offValueSum).toFixed(2)
      this.orderId = data.orderId
      if (Number(this.totalFee) === 0) {
        this.loading = true
        this.$api
          .userOpenVipCardPayRMB({
            orderId: this.orderId,
            type: 2,
            authNo: this.orderId,
            vipLevelId: this.cardType === 0 ? this.vipLevelId0 : this.vipLevelId2
          })
          .then((res) => {
            if (res.body.status === 1) {
              this.$message.success('开卡成功')
              this.showScanModal = false
              this.showPayModal = false
              this.tableData = []
              this.totalFee = '0.00'
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
      } else {
        this.showPayModal = true
      }
    },
    handlePayRMB() {
      if (!this.orderId) {
        this.$message.error('未查询到订单,请重新下单')
        return
      }
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
            .userOpenVipCardPayRMB({
              orderId: this.orderId,
              type: 2,
              authNo: this.userPayId
            })
            .then((res) => {
              if (res.body.status === 1) {
                this.$message.success('开卡成功')
                this.showScanModal = false
                this.showPayModal = false
                this.tableData = []
                this.totalFee = '0.00'
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
        .queryOrder({ outTradeNo: this.orderId })
        .then((res) => {
          if (res.body.flag === 1) {
            clearInterval(this.timer)
            this.$message.success('购买完成')
            this.showScanModal = false
            this.showPayModal = false
            this.tableData = []
            this.totalFee = '0.00'
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
    clearTable() {
      this.totalFee = '0.00'
      this.tableData = []
    },
    // 支付现金 ，支付类型： type  1 现金支付  2 扫码支付
    userPayRMB() {
      if (!this.orderId) {
        this.$message.error('未查询到订单,请重新下单')
        return
      }
      console.log('x')
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
            .userOpenVipCardPayRMB({
              orderId: this.orderId,
              type: 1
            })
            .then((res) => {
              this.$message.success('开卡成功')
              this.showScanModal = false
              this.showPayModal = false
              this.tableData = []
              this.totalFee = '0.00'
              this.printTicket()
            })
            .finally(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    printTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统')
        return
      }
      const printFlag = +sessionStorage.getItem('printFlag')
      if (printFlag) {
        this.$api.getStorePrint({ code: 'PRIZE_SALE' }).then(async (res) => {
          const p = res.body.printInfo
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
        })
      }
    },
    // 关闭扫描用户二维码弹窗
    closeScanUserInfoModal() {
      document.onkeydown = null
      this.showScanUserInfoModal = false
    },
    // 支付页面
    closePayModal() {
      document.onkeydown = null
      this.showPayModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.open-entity-card {
  margin-top: 32px;

  .user-content {
    background-color: #ffffff;
    height: 76vh;
    border-radius: 10px;
    overflow: auto;

    .title {
      border-left: 1px solid #4194fe;
      padding-left: 10px;
      margin: 23px 13px;
      font-size: 16px;
      font-weight: 400;
      color: #666666;
    }

    .el-divider--vertical {
      height: 120px;
      top: 90px;
    }
  }

  .auth-container {
    @include flex(center, center, row);
    height: 400px;

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

  .dialog-header {
    width: 100%;
    height: 53px;
    background-color: #f5f7fa;
    padding: 0 32px;
    border-bottom: 1px solid #cccccc;
  }

  .dialog-body {
    padding: 34px 50px;
  }

  .pay-button {
    user-select: none;
    cursor: pointer;
    border: 2px solid #cccccc;
    padding: 16px 28px;
    border-radius: 14px;

    &:active {
      border-color: #4194fe;
    }
  }
}
</style>
