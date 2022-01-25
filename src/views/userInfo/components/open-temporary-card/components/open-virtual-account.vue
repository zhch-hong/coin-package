<template>
  <div class="open-virtual-account" v-loading="loading">
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/phone-icon.png" alt="phone" />
      <span>手机号码</span>
      <input v-model="formInfo.phone" type="text" placeholder="请输入" :maxlength="11" />
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/password-icon.png" alt="phone" />
      <span>验证码</span>
      <input v-model="formInfo.code" type="text" placeholder="请输入验证码" :maxlength="6" />
      <div
        style="
          width: 102px;
          height: 32px;
          font-size: 16px;
          background-color: #4194fe;
          cursor: pointer;
          border-radius: 16px;
          color: #ffffff;
        "
        class="flex-center"
        @click="getCode"
      >
        {{ verCodeText }}
      </div>
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/new-password-icon.png" alt="phone" />
      <span>新密码</span>
      <input
        v-model="formInfo.password"
        :maxlength="6"
        @input="handleInput('password')"
        type="password"
        placeholder="请输入新密码"
      />
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/new-password-icon.png" alt="phone" />
      <span>确认新密码</span>
      <input
        v-model="formInfo.confirmPassword"
        :maxlength="6"
        @input="handleInput('confirmPassword')"
        type="password"
        placeholder="再次输入新密码"
      />
    </div>
    <div>
      <el-button
        type="primary"
        size="medium"
        style="width: 122px; border-radius: 10px; margin-left: 50px"
        @click="handleConfirmOpenCard"
        >确认开卡</el-button
      >
      <el-button
        size="medium"
        style="width: 122px; border-radius: 10px; background-color: #7a7a80; color: #ffffff; margin-left: 26px"
        @click="initForm"
        >取消
      </el-button>
    </div>
    <StaffAuth :show.sync="showStaffAuth" @success="requestOpenCard" />
  </div>
</template>

<script>
/** *
 *
 * 开临时卡  -  虚拟卡
 * 开卡接口 = userOpenVipCard
 * 必传的参数：
 * cardType = 3
 * vipLevelId = 获取开卡信息接口中vipType = 3 的id
 * cardNumList = [手机号]
 * cardPwd = 密码
 * openCardType = 1
 * openCardCode = 验证码
 * 如果需要授权 ===
 * type = 授权的type
 * phone = 授权的手机号
 * code = 授权的验证码
 */
import StaffAuth from '@/components/StaffAuth';
import { to } from '@/utils/tools';
import { isPhone } from '@/utils/validate';

export default {
  name: 'open-virtual-account',
  components: { StaffAuth },
  data() {
    return {
      loading: false,
      formInfo: {
        phone: '',
        code: '',
        password: '',
        confirmPassword: '',
      },
      verCodeText: '获取验证码',
      timer: null,
      coolDown: 60,
      openCardInfo: {},
      showStaffAuth: false,
    };
  },
  methods: {
    handleInput(prop) {
      this.formInfo[prop] = this.formInfo[prop].replace(/\D/g, '');
    },
    initForm() {
      this.formInfo = {
        phone: '',
        code: '',
        password: '',
        confirmPassword: '',
      };
      this.initGetCode();
    },
    initGetCode() {
      clearInterval(this.timer);
      this.verCodeText = '获取验证码';
      this.coolDown = 60;
    },
    getCode() {
      if (!isPhone.test(this.formInfo.phone)) {
        this.$message.error('请输入正确的手机号');
        return;
      }
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
      this.$api.sendUserPhoneCode({ codeType: 1, /* 1短信 2语音 */ phone: this.formInfo.phone }).then(() => {
        this.$message.success('发送成功');
      });
    },
    handleConfirmOpenCard() {
      if (!this.openCardInfo.id) {
        this.$message.error('该门店未设置临时卡信息');
        return;
      }
      if (!isPhone.test(this.formInfo.phone)) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      if (!this.formInfo.code) {
        this.$message.error('请输入验证码');
        return;
      }
      if (isNaN(this.formInfo.password) || this.formInfo.password.length !== 6) {
        this.$message.error('密码只能为6位数字');
        return;
      }
      if (this.formInfo.password !== this.formInfo.confirmPassword) {
        this.$message.error('两次密码输入不一致');
        return;
      }
      if (this.openCardInfo.authFlag === 1) {
        // 需要授权
        this.showStaffAuth = true;
      } else {
        this.requestOpenCard();
      }
    },
    async requestOpenCard(authInfo = {}) {
      this.loading = true;
      const params = {
        cardType: 3,
        vipLevelId: this.openCardInfo.id,
        cardNumList: [this.formInfo.phone],
        openCardType: 1,
        cardPwd: this.formInfo.password,
        openCardCode: this.formInfo.code,
        ...authInfo,
      };
      // 防止接口调用失败不重置获取验证码，提前重置
      this.initGetCode();
      this.loading = false;
      const [, orderInfo] = await to(this.$api.userOpenVipCard(params));
      const [, res] = await to(
        this.$api.userOpenVipCardPayRMB({
          orderId: orderInfo.body.orderId,
          type: 2,
          authNo: orderInfo.body.orderId,
          vipLevelId: this.openCardInfo.id,
        })
      );
      if (res.body.status === 1) {
        this.$message.success('开通成功');
      }
    },
    // 获取公共卡开卡信息
    getCardFee() {
      this.$api.getVipCardInfo({}).then((res) => {
        // vipType : 0公关卡   2公共卡  3临时卡
        this.openCardInfo = res.body.find((item) => item.vipType === 3);
        if (!this.openCardInfo) {
          this.$message.error('该门店未设置临时卡信息');
          this.openCardInfo = {};
        }
      });
    },
  },
  created() {
    this.getCardFee();
  },
};
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

.open-virtual-account {
  margin-top: 32px;

  .form-item {
    border-bottom: 1px solid #dadada;
    padding-bottom: 18px;
    width: 500px;
    margin-bottom: 24px;

    img {
      width: 17px;
    }

    span {
      margin-left: 12px;
      font-size: 19px;
      font-weight: 400;
      color: #2b2b2b;
    }

    input {
      font-size: 19px;
      font-weight: 400;
      border: none;
      background-color: transparent;
      outline: none;
      margin-left: 24px;
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
}
</style>
