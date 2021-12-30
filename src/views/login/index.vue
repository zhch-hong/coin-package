<template>
  <div class="login-container">
    <div class="title-container">
      <img style="width: 240px" src="../../assets/login_logo.png" />

      <p class="title">四川百川之星科技有限公司</p>
    </div>

    <div class="login-type-container">
      <div :class="[loginType === 3 ? 'active' : '']" @click="changeLoginType(3)">扫码登录</div>

      <div :class="[loginType === 2 ? 'active' : '']" @click="changeLoginType(2)">账号密码登录</div>

      <div :class="[loginType === 1 ? 'active' : '']" @click="changeLoginType(1)">验证码登录</div>
    </div>

    <div class="scan-login-box" v-show="loginType === 3" v-loading="loading">
      <webview
        id="login_webview"
        :src="wxAuthUrl"
        style="width: 350px; height: 400px; margin: 0 auto"
        nodeintegration
      ></webview>
    </div>

    <el-form
      v-show="loginType !== 3"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="phone">
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入员工登录账号"
          type="text"
          :maxlength="11"
          auto-complete="on"
        >
          <img class="input-icon" slot="prefix" src="../../assets/accountIcon.png" />
        </el-input>
      </el-form-item>

      <el-form-item prop="pwd" v-if="loginType === 2">
        <el-input
          ref="pwd"
          v-model="loginForm.pwd"
          placeholder="请输入登录密码"
          type="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        >
          <img class="input-icon" slot="prefix" src="../../assets/passwordIcon.png" />
        </el-input>
      </el-form-item>

      <div v-if="loginType === 1">
        <el-form-item prop="code">
          <el-input style="width: 334px" ref="code" v-model="loginForm.code" placeholder="请输入验证码" name="code">
            <img class="input-icon" slot="prefix" src="../../assets/passwordIcon.png" />
          </el-input>

          <el-button style="margin-left: 4px" @click="getCode(1)">{{ verCodeText }}</el-button>
        </el-form-item>

        <div class="voice-content">
          收不到短信，请尝试

          <el-button type="text" @click="getCode(2)">语音获取</el-button>
        </div>
      </div>

      <el-form-item>
        <el-button
          v-if="loginType !== 3"
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 12px"
          @click.native.prevent="handleLogin"
          >登录
        </el-button>

        <br />

        <el-button v-if="loginType === 2" :loading="loading" style="width: 100%" @click="handleLoginOfflineMode">
          以离线模式登录
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="激活"
      :visible.sync="showModuleKeyModal"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
    >
      <el-input v-model="moduleKey" placeholder="请输入收银秘钥"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="handleActiveModule">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5';

import { to } from '@/utils/tools';

import { setToken } from '../../utils/auth';

export default {
  name: 'Login',

  data() {
    return {
      refreshFlag: false,

      webview: null,

      wxAuthUrl: process.env.VUE_APP_WX_AUTH_URL,

      loading: false,

      showModuleKeyModal: false,

      moduleKey: null,

      verCodeText: '获取验证码',

      timer: null,

      coolDown: 60,

      loginType: 1,

      loginForm: {
        phone: '',

        pwd: '',

        code: '',
      },

      loginRules: {
        phone: [
          {
            required: true,

            trigger: 'blur',

            message: '请输入正确的手机号',
          },
        ],

        pwd: [
          {
            required: true,

            trigger: 'blur',

            message: '请输入密码',
          },
        ],

        code: [
          {
            required: true,

            trigger: 'blur',

            message: '请输入验证码',
          },
        ],
      },

      userInfoByScan: {},
    };
  },

  methods: {
    initGetCode() {
      this.verCodeText = '获取验证码';

      this.coolDown = 60;

      clearInterval(this.timer);
    },

    handleActiveModule() {
      if (!this.moduleKey) {
        this.$message.error('请输入正确的收银秘钥');

        return;
      }

      this.loading = true;

      this.$api

        .bindCash({ moduleKey: this.moduleKey })

        .then(() => {
          this.$message.success('激活成功');

          localStorage.setItem('moduleKey', this.moduleKey);

          this.initWebview();

          this.closeModal();
        })

        .finally(() => {
          this.loading = false;
        });
    },

    closeModal() {
      this.showModuleKeyModal = false;
    },

    getCode(type) {
      if (!this.loginForm.phone) {
        this.$message.error('请输入正确的手机号');

        return;
      }

      if (type === 1) {
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

      this.$api

        .sendSms({ codeType: type, phone: this.loginForm.phone, moduleKey: this.moduleKey })

        .then(() => {
          this.$message.success('发送成功');
        })

        .catch(() => {
          this.initGetCode();
        });
    },

    changeLoginType(type) {
      this.loginType = type;
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          const params = {
            moduleKey: this.moduleKey,

            type: this.loginType,

            phone: this.loginForm.phone,
          };

          if (this.loginType === 1) {
            // 验证码登录

            params.code = this.loginForm.code;
          } else if (this.loginType === 2) {
            // 账号密码登录

            params.pwd = this.loginForm.pwd;
          }

          this.$api

            .cashLogin(params)

            .then(async (res) => {
              setToken(res.body.staffName);

              this.$store.commit('SET_TICKETSCALE', res.body.saveTicketRate);

              sessionStorage.setItem('storeName', res.body.storeName);

              sessionStorage.setItem('phone', res.body.phone);

              sessionStorage.setItem('staffName', res.body.staffName);

              sessionStorage.setItem('moduleName', res.body.moduleName);

              sessionStorage.setItem('moduleId', res.body.moduleId);

              sessionStorage.setItem('printFlag', res.body.printFlag);

              const db = await this.$db.openDB('offlineDB');

              const staffInfo = await this.$db.getDataByIndex(db, 'staffInfo', 'phone', res.body.phone);

              const staffInfoSchema = { ...res.body, phone: res.body.phone, isSettle: false };

              if (staffInfo) {
                await this.$db.updateDB(db, 'staffInfo', staffInfoSchema);
              } else {
                await this.$db.addData(db, 'staffInfo', staffInfoSchema);
              }

              const [giftPrintErr, giftPrintRes] = await to(this.$api.getStorePrint({ code: 'GIFT_SALE' }));

              const [prizePrintErr, prizePrintRes] = await to(this.$api.getStorePrint({ code: 'PRIZE_SALE' }));

              await this.$db.clearDB(db, 'printFormat');

              if (giftPrintRes && prizePrintRes) {
                await this.$db.addData(db, 'printFormat', giftPrintRes.body.printInfo);

                await this.$db.addData(db, 'printFormat', prizePrintRes.body.printInfo);
              }

              await this.getMachineCoinNum();

              await this.$router.push({
                path: '/',

                query: { pwdFlag: res.body.pwd ? 1 : -1 },
              });
            })

            .catch((e) => {
              this.initGetCode();
            })

            .finally(() => {
              this.loading = false;
            });
        }
      });
    },

    handleLoginOfflineMode() {
      this.$refs.loginForm.validate(async (v) => {
        if (v) {
          const db = await this.$db.openDB('offlineDB');

          const staffInfo = await this.$db.cursorGetData(db, 'staffInfo');

          if (staffInfo.find((staff) => staff.isSettle === false && staff.phone !== this.loginForm.phone)) {
            this.$message.error('存在未班结员工，无法登录');

            return;
          }

          const staff = staffInfo.find((staff) => staff.phone === this.loginForm.phone);

          if (!staff) {
            this.$message.error('该员工无法使用离线模式');

            return;
          }

          if (staff.pwd !== md5(this.loginForm.pwd)) {
            this.$message.error('密码错误');

            return;
          }

          this.loading = true;

          setToken(staff.staffName);

          sessionStorage.setItem('storeName', staff.storeName);

          sessionStorage.setItem('staffName', staff.staffName);

          sessionStorage.setItem('moduleName', staff.moduleName);

          sessionStorage.setItem('printFlag', staff.printFlag);

          this.$store.commit('TOGGLE_OFFLINE', true);

          this.loading = false;

          // await this.getMachineCoinNum();

          await this.$router.push({ path: '/' });
        }
      });
    },

    getMachineCoinNum() {
      this.$api.getMachineCoinNum().then(async (res) => {
        await this.$store.commit('UPDATE_CURRENT_COINS', res.body.coinNum);
      });
    },

    refreshWebview() {
      this.refreshFlag = false;

      if (!this.refreshFlag) {
        this.refreshFlag = true;

        this.webview.reload();
      }
    },

    handleLoginByScan(obj) {
      this.loading = true;

      const params = {
        moduleKey: this.moduleKey,

        type: this.loginType,

        openId: obj.openId,
      };

      this.$api

        .cashLogin(params)

        .then(async (res) => {
          setToken(res.body.staffName);

          this.$store.commit('SET_TICKETSCALE', res.body.saveTicketRate);

          sessionStorage.setItem('storeName', res.body.storeName);

          sessionStorage.setItem('phone', res.body.phone);

          sessionStorage.setItem('staffName', res.body.staffName);

          sessionStorage.setItem('moduleName', res.body.moduleName);

          sessionStorage.setItem('moduleId', res.body.moduleId);

          sessionStorage.setItem('printFlag', res.body.printFlag);

          const db = await this.$db.openDB('offlineDB');

          const staffInfo = await this.$db.getDataByIndex(db, 'staffInfo', 'phone', res.body.phone);

          const staffInfoSchema = { ...res.body, phone: res.body.phone, isSettle: false };

          if (staffInfo) {
            await this.$db.updateDB(db, 'staffInfo', staffInfoSchema);
          } else {
            await this.$db.addData(db, 'staffInfo', staffInfoSchema);
          }

          const [giftPrintErr, giftPrintRes] = await to(this.$api.getStorePrint({ code: 'GIFT_SALE' }));

          const [prizePrintErr, prizePrintRes] = await to(this.$api.getStorePrint({ code: 'PRIZE_SALE' }));

          await this.$db.clearDB(db, 'printFormat');

          if (giftPrintRes && prizePrintRes) {
            await this.$db.addData(db, 'printFormat', giftPrintRes.body.printInfo);

            await this.$db.addData(db, 'printFormat', prizePrintRes.body.printInfo);
          }

          await this.$router.push({
            path: '/',

            query: { pwdFlag: res.body.pwd ? 1 : -1 },
          });
        })

        .catch((e) => {
          this.refreshWebview();
        })

        .finally(() => {
          this.loading = false;
        });
    },

    initWebview() {
      const moduleKey = localStorage.getItem('moduleKey');

      if (moduleKey) {
        this.moduleKey = moduleKey;

        this.webview = document.getElementById('login_webview');

        // 可以看到webview的控制台打印

        this.webview.addEventListener('console-message', (e) => {
          console.log(`webview: ${e.message}`);
        });

        this.webview.addEventListener('ipc-message', (event) => {
          this.userInfoByScan = event.args[0];

          this.handleLoginByScan(event.args[0]);

          console.log(event);
        });

        this.$api

          .getModuleActiveFlag({ moduleKey })

          .then((res) => {
            if (!res.body.activeFlag) {
              this.showModuleKeyModal = true;
            }
          })

          .catch((e) => {
            // this.showModuleKeyModal = true
          });
      } else {
        this.showModuleKeyModal = true;
      }
    },
  },

  created() {
    this.$store.commit('TOGGLE_OFFLINE', false);
  },

  mounted() {
    this.initWebview();
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/mixin';

$bg: #2d3a4b;

$dark_gray: #889aa4;

$light_gray: #eee;

.login-container {
  min-height: 100%;

  width: 100%;

  background-image: url('../../assets/login_bg.png');

  background-repeat: no-repeat;

  background-size: 100% 100%;

  background-position: center;

  overflow: hidden;

  padding-top: 200px;

  .login-form {
    position: relative;

    width: 520px;

    max-width: 100%;

    padding: 24px 35px 0;

    margin: 0 auto;

    overflow: hidden;

    .voice-content {
      width: 100%;

      @include flex(flex-end, center, row);

      font-size: 14px;

      color: #9d9d9d;
    }
  }

  .el-input {
    height: 40px;
  }

  .input-icon {
    margin-left: 4px;

    width: 14px;

    vertical-align: middle;
  }

  .title-container {
    position: relative;

    text-align: center;

    .title {
      font-size: 18px;

      color: #989898;

      margin: 16px auto 40px auto;

      text-align: center;
    }
  }

  .login-type-container {
    margin-bottom: 24px;

    @include flex(center, center, row);

    font-size: 14px;

    color: #989898;

    div {
      cursor: pointer;

      margin: 0 24px;

      padding: 16px 0;

      border-bottom: 2px solid transparent;
    }

    .active {
      color: #1890ff;

      border-bottom-color: #1890ff;
    }
  }

  .scan-login-box {
    @include flex(center, center, row);
  }
}
</style>
