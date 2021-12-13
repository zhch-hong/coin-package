<template>
  <!-- <el-dialog title="提示" :visible.sync="value" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" width="30%">
    <h3>请扫描优惠券二维码......</h3>
    <h3>扫描中请不要触碰键盘按键</h3>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeScanModal">取 消</el-button>
    </div>
  </el-dialog> -->
  <el-dialog
    :visible.sync="value"
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
        <div class="custom-frame-tip">请扫描{{ lable }}二维码......</div>
        <div class="custom-frame-tip">扫描中请不要触碰键盘按键</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="custom-frame-cancel" :loading="loading" @click="closeScanModal">取 消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'scan-code',
  props: {
    value: {
      type: Boolean
    },
    lable: {
      type: String,
      default: '用户'
    }
  },
  data() {
    return {
      code: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initKeyboard()
        }
      }
    }
  },
  methods: {
    initKeyboard() {
      this.code = ''
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.code += e.key
        } else {
          if (!this.code) {
            this.$message.error('未读取到二维码')
            return
          }
          this.$emit('on-success', this.code.replace(/shift|capslock/gi, ''))
          this.closeScanModal()
        }
      }
    },
    closeScanModal() {
      document.onkeydown = null
      this.$emit('input', false)
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
</style>
