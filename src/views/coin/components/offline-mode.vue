<template>
  <div class="offline-mode">
    <div class="offline-mode-box">
      <div v-if="$store.state.offline"><img class="offline-mode-img" src="@/assets/offline.png" alt="" /></div>
      <div v-else><img class="offline-mode-img" src="@/assets/online.png" alt="" /></div>
      <div class="offline-mode-conent-box">
        <div class="offline-mode-conent-info">
          当前模式：<span :style="{ color: $store.state.offline ? '#7A7A80' : '#67C23A' }">{{ modeText }}模式</span>
        </div>
        <div>
          <el-button type="primary" style="width: 170px" :loading="loading" @click="dialogVisible = true">启动{{ targetModeText }}模式</el-button>
          <el-button
            type="info"
            :plain="$store.state.offline"
            style="width: 170px"
            :loading="loading"
            :disabled="$store.state.offline"
            @click="handleOnSyncData"
            >同步离线数据</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :show-close="false"
      width="30%"
    >
      <div>
        <div class="dialog-title-box">
          <img class="replace-model" src="@/assets/replace-model.png" alt="" />
          <div>切换为{{ targetModeText }}模式</div>
        </div>
        <div class="dialog-conent-box">
          <div class="dialog-conent-title">金花系统可基于两种模式运行：</div>
          <div class="dialog-conent-title">1.在线模式</div>
          <div class="dialog-conent-info">微信、支付宝等第三方支付方式与门店的销售数据等，实时更新</div>
          <div class="dialog-conent-title">2.离线模式</div>
          <div class="dialog-conent-info">
            当门店网络突然出现异常情况时，金花系统可以在离线模式下运行，此模式下仅保障门店的基本运行，如：现金销售套餐、物品，所有与外网相关的服务将不能使用，网络恢复后，数据实时更新。
          </div>
          <div class="dialog-conent-tip">当前为{{ modeText }}模式，您是否需要切换为{{ targetModeText }}模式</div>
        </div>
      </div>
      <div slot="footer" class="flex-center">
        <el-button type="primary" style="width: 100px" @click="handleOnToggleMode">确 定</el-button>
        <el-button type="info" style="width: 100px; margin-left: 100px" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 数据同步 -->
    <el-dialog
      :visible.sync="dialogVisible2"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="custom-frame-header">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" class="custom-frame-left-icon" />
        <div>
          <div class="custom-frame-tip">系统将自动同步数据</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="flex-center">
          <el-button type="primary" style="width: 100px" :loading="loading" @click="closeScanUserInfoModal">确定 </el-button>
          <el-button type="info" style="width: 100px; margin-left: 100px" :loading="loading" @click="dialogVisible2 = false">取 消 </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 切换在线模式 -->
    <el-dialog
      :visible.sync="dialogVisible3"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="custom-frame-header">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" class="custom-frame-left-icon" />
        <div>
          <div class="custom-frame-tip">为保证数据无异常，切换为</div>
          <div class="custom-frame-tip">在线模式时，请您重新登录！</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="flex-center">
          <el-button type="primary" style="width: 100px" :loading="loading" @click="closeScanUserInfoModal2">确定 </el-button>
          <el-button type="info" style="width: 100px; margin-left: 100px" :loading="loading" @click="dialogVisible3 = false">取 消 </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { to } from '@/utils/tools'
import { removeToken } from '@/utils/auth'

export default {
  name: 'offline-mode',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogVisible2: false, // 同步数据
      dialogVisible3: false // 切换在线模式
    }
  },
  computed: {
    modeText() {
      return this.$store.state.offline ? '离线' : '在线'
    },
    targetModeText() {
      return this.$store.state.offline ? '在线' : '离线'
    }
  },
  methods: {
    handleOnSyncData() {
      this.dialogVisible2 = true
    },
    // 同步数据确认
    async closeScanUserInfoModal() {
      this.loading = true
      const db = await this.$db.openDB('offlineDB')
      const prizeRecord = await this.$db.cursorGetData(db, 'prizeRecord')
      const [prizeErr, prizeRes] = await to(
        this.$api.cashUploadOrder({
          type: 2,
          orderList: prizeRecord
        })
      )
      this.dialogVisible2 = false
      if (prizeErr) {
        this.$message.error('同步商品订单信息失败')
        this.loading = false
        return
      }
      const giftRecord = await this.$db.cursorGetData(db, 'giftRecord')
      const [giftErr, giftRes] = await to(this.$api.cashUploadOrder({ type: 1, orderList: giftRecord }))
      if (giftErr) {
        this.$message.error('同步套餐订单信息失败')
        this.loading = false
        return
      }
      if (prizeRes && giftRes) {
        await this.$db.clearDB(db, 'prizeRecord')
        await this.$db.clearDB(db, 'giftRecord')
        this.loading = false
        this.$message.success('同步数据完成')
      }
    },
    // 切换在线模式
    closeScanUserInfoModal2() {
      removeToken()
      sessionStorage.clear()
      this.$router.replace({ path: '/login' })
    },
    handleOnToggleMode() {
      if (!this.$store.state.offline) {
        this.$store.commit('TOGGLE_OFFLINE', !this.$store.state.offline)
        this.dialogVisible = false
      } else {
        this.dialogVisible3 = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
.offline-mode {
  padding: 38px;
  box-sizing: border-box;
  .offline-mode-box {
    width: 100%;
    display: flex;
    .offline-mode-img {
      width: 184px;
      height: 184px;
    }
    .offline-mode-conent-box {
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      padding-left: 66px;
      box-sizing: border-box;
      .offline-mode-conent-info {
        width: 100%;
        padding-bottom: 43px;
        font-size: 23px;
        color: #3c3c3c;
        .offline-mode-conent-info-span {
          color: #0fd565;
        }
      }
    }
  }
  .dialog-title-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    font-size: 27px;
    color: #4194fe;
    padding: 18px 0 0 0;
    line-height: 47px;
    .replace-model {
      width: 38px;
      height: 47px;
      margin-right: 10px;
    }
  }
  .dialog-conent-box {
    width: 100%;
    padding: 15px 46px 27px 46px;
    box-sizing: border-box;
    .dialog-conent-title {
      color: #222222;
      font-size: 17px;
      line-height: 25px;
    }
    .dialog-conent-info {
      color: #616161;
      font-size: 16px;
      line-height: 25px;
    }
    .dialog-conent-tip {
      color: #eb0000;
      font-size: 16px;
      padding-top: 13px;
    }
  }
}
</style>
