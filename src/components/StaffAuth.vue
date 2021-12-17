<template>
  <div class="staff-auth-component">
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="740px"
    >
      <div class="flex-center">
        <img style="width: 143px" src="@/assets/components-img/staff-auth-title.png" alt="title" />
      </div>
      <div class="auth-container">
        <div class="left flex-start">
          <el-form ref="authForm" :model="authForm" :rules="authRules" label-width="120px">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="authForm.phone" style="width: 240px" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="authForm.code" style="width: 240px" :maxlength="6">
                <template slot="append">
                  <el-button @click="getCode(1)">{{ verCodeText }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <div class="voice-content">
              收不到短信，请尝试
              <el-button type="text" @click="getCode(2)">语音获取</el-button>
            </div>
          </el-form>
        </div>
        <div class="right">
          <webview
            id="staffAuth"
            :src="wxAuthUrl"
            style="min-width: 350px; min-height: 350px; margin: 0 auto; overflow-y: hidden"
            nodeintegration
          ></webview>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="closeAuthModal">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isPhone } from '../utils/validate';

export default {
  name: 'StaffAuth',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (val) {
          setTimeout(() => {
            if (this.hasCreateWebview) {
              this.refreshWebview();
            } else {
              this.initWxLogin();
            }
          }, 1000);
        }
      },
    },
  },
  data() {
    return {
      wxAuthUrl: process.env.VUE_APP_WX_AUTH_URL,
      webview: null,
      hasCreateWebview: false,
      refreshFlag: false,
      loading: false,
      authForm: {
        phone: '',
        code: '',
      },
      openId: '',
      authRules: {
        phone: [{ required: true, trigger: 'blur', message: '手机号错误', pattern: isPhone }],
        code: [{ required: true, trigger: 'blur', message: '验证码错误' }],
      },
      verCodeText: '获取验证码',
      timer: null,
      coolDown: 60,
    };
  },
  methods: {
    refreshWebview() {
      this.refreshFlag = false;
      if (!this.refreshFlag) {
        this.refreshFlag = true;
        this.webview.reload();
      }
    },
    // 初始化微信扫码
    initWxLogin() {
      this.$nextTick((_) => {
        this.webview = document.getElementById('staffAuth');
        this.hasCreateWebview = true;
        this.webview.addEventListener('ipc-message', (event) => {
          console.log('ipc-message', event);
          this.openId = event.args[0].openId;
          this.confirmByScan();
        });
      });
    },
    getCode(type) {
      if (!isPhone.test(this.authForm.phone)) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      if (type == 1) {
        if (this.verCodeText !== '获取验证码' && this.verCodeText !== '重新发送') return;
        this.verCodeText = '60s后重发';
        this.timer = setInterval(() => {
          if (this.coolDown === 0) {
            clearInterval(this.timer);
            this.verCodeText = '重新发送';
            this.coolDown = 60;
          } else {
            this.coolDown--;
            this.verCodeText = `${this.coolDown}s后重发`;
          }
        }, 1000);
      }
      this.$api.sendAdminPhoneCode({ codeType: type, phone: this.authForm.phone }).then((res) => {
        this.$message.success('发送成功');
      });
    },
    initGetCode() {
      clearInterval(this.timer);
      this.verCodeText = '获取验证码';
      this.coolDown = 60;
    },
    closeAuthModal() {
      try {
        this.$refs.authForm.resetFields();
      } catch (error) {
        //
      }
      this.$emit('update:show', false);
      this.$emit('cancel');
    },
    confirmByScan() {
      console.log('start init ver code');
      this.initGetCode();
      console.log('start refresh webview');
      this.refreshWebview();
      console.log('confirm authorization by scan success');
      this.$emit('success', { type: 3, openId: this.openId });
      try {
        this.$refs.authForm.resetFields();
      } catch (error) {
        //
      }
      this.$emit('update:show', false);
    },
    confirm() {
      this.$refs.authForm.validate((v) => {
        if (v) {
          console.log('start init ver code');
          this.initGetCode();
          console.log('confirm authorization validate success');
          this.$emit('success', { type: 1, ...this.authForm });
          try {
            this.$refs.authForm.resetFields();
          } catch (error) {
            //
          }
          this.$emit('update:show', false);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

/deep/ .el-dialog__body {
  padding: 0;
}

.auth-container {
  @include flex(center, center, row);

  .left {
  }

  .right {
    @include flex(center, center, column);
    margin-left: 30px;
    text-align: center;
  }

  .voice-content {
    width: 330px;
    @include flex(flex-end, center, row);
    font-size: 16px;
    color: #9d9d9d;
  }
}
</style>
