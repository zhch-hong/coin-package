<template>
  <div class="user-consume-page" v-loading="loading">
    <el-row :gutter="40">
      <el-col :span="12" class="coupons-padding-left">
        <div class="bc-title">读优惠券</div>
        <img src="@/assets/discount-icon.png" class="scan-card-image" />
        <div class="button-style" @click="openScanUserInfoModal">点击扫描核销二维码</div>
        <div class="sweep-code-prompt">扫码提示：</div>
        <div class="sweep-code-prompt-tip">请把优惠券二维码放在扫码器上扫码读取</div>
      </el-col>
      <el-col :span="12" style="border-left: 1px solid #eeeeee" class="coupons-padding-left">
        <div class="bc-title">优惠券详情</div>
        <div class="details-lable">优惠券码：{{ couponsCode }}</div>
        <div class="details-lable">兑换币数：{{ coinNum }}</div>
        <el-button type="primary" style="width: 128px; margin-top: 75px" @click="sureUseCoupons"> 确定</el-button>
        <el-button type="info" style="width: 128px; margin-top: 75px" @click="resetCoupons"> 取消</el-button>
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
      <div class="custom-frame-header">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" class="custom-frame-left-icon" />
        <div>
          <div class="custom-frame-tip">请扫描优惠券二维码......</div>
          <div class="custom-frame-tip">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="custom-frame-cancel" :loading="loading" @click="closeScanUserInfoModal">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { isPositiveInt } from '../../../utils/validate'
import { getToken } from '../../../utils/auth'

export default {
  name: 'useCoupons',
  data() {
    return {
      loading: false,
      showScanUserInfoModal: false,
      couponsUrl: '',
      uid: '',
      couponsCode: '',
      coinNum: 0,

      items: [],
      useTimes: '1',
      currentPkg: {
        useTimeList: [],
        type: 2,
        endTime: '---'
      }
    }
  },
  methods: {
    // 取消核销
    resetCoupons() {
      this.couponsCode = ''
      this.coinNum = 0
    },
    // 打开扫描用户信息二维码弹窗
    openScanUserInfoModal() {
      this.uid = ''
      this.couponsCode = ''
      this.couponsUrl = ''
      this.showScanUserInfoModal = true
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          if (e.key !== 'Shift') {
            this.couponsUrl += e.key
          }
        } else {
          const urlList = this.couponsUrl.split('?')
          let paramsList = []
          if (urlList[1]) {
            paramsList = urlList[1].split('&')
          }
          paramsList.map((val) => {
            const key = val.split('=')[0]
            const value = val.split('=')[1]
            if (key === 'couponsCode') {
              this.couponsCode = value
            }
            if (key === 'uid') {
              this.uid = Number(value)
            }
          })
          this.closeScanUserInfoModal()
          if (!this.couponsCode) {
            this.$message.error('未读取到优惠券码')
            return
          }
          if (!this.uid) {
            this.$message.error('未读取到用户uid')
            return
          }
          this.getUserCoupons()
        }
      }
    },
    // 关闭弹窗
    closeScanUserInfoModal() {
      document.onkeydown = null
      this.showScanUserInfoModal = false
    },
    // 查询优惠券信息
    getUserCoupons() {
      if (!this.couponsCode) {
        this.$message.error('未读取到优惠券码')
        return
      }
      if (!this.uid) {
        this.$message.error('未读取到用户uid')
        return
      }
      this.loading = true
      this.$api
        .getCouponsInfo({ code: this.couponsCode, uid: this.uid })
        .then((res) => {
          console.log(res)
          this.coinNum = res.body.couponsInfo.coinNum + res.body.couponsInfo.awardCoinNum
        })
        .catch(() => {
          this.couponsCode = ''
          this.coinNum = 0
        })
        .finally((f) => {
          this.loading = false
        })
    },
    // 确认核销
    sureUseCoupons() {
      if (!this.couponsCode) {
        this.$message.error('未读取到优惠券码')
        return
      }
      if (!this.uid) {
        this.$message.error('未读取到用户uid')
        return
      }
      this.loading = true
      this.$api
        .useCoupons({ code: this.couponsCode, uid: this.uid })
        .then((res) => {
          this.$message.success('核销成功')
          if (this.coinNum > 0) {
            this.$root.$children[0].sendCoin(this.coinNum)
          }
        })
        .finally((f) => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin';

.user-consume-page {
  padding: 20px;
  min-height: 880px;

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

/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.coupons-padding-left {
  padding-left: 54px !important;
  box-sizing: border-box;
}

.sweep-code-prompt {
  font-size: 19px;
  color: #7a7a80;
  padding-top: 49px;
}

.sweep-code-prompt-tip {
  font-size: 18px;
  color: #7a7a80;
  padding-top: 14px;
}

.details-lable {
  font-size: 18px;
  color: #7a7a80;
  padding-top: 52px;
}
</style>
