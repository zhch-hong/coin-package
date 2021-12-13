<template>
  <div class="update-public-user-pwd" v-loading="loading">
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
        style="width: 102px; height: 32px; font-size: 16px; background-color: #4194fe; cursor: pointer; border-radius: 16px; color: #ffffff"
        class="flex-center"
        @click="getCode"
      >
        {{ verCodeText }}
      </div>
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/new-password-icon.png" alt="phone" />
      <span>新密码</span>
      <input v-model="formInfo.password" :maxlength="6" @input="handleInput('password')" type="password" placeholder="请输入新密码" />
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/new-password-icon.png" alt="phone" />
      <span>确认新密码</span>
      <input v-model="formInfo.confirmPassword" :maxlength="6" @input="handleInput('confirmPassword')" type="password" placeholder="再次输入新密码" />
    </div>
    <div>
      <el-button type="primary" size="medium" style="width: 150px" @click="handleConfirm">确定</el-button>
      <el-button size="medium" style="width: 150px; background-color: #7a7a80; color: #ffffff" @click="initForm">取消 </el-button>
    </div>
  </div>
</template>

<script>
import { to } from '@/utils/tools'
import { isPhone } from '@/utils/validate'

export default {
  name: 'update-public-user-pwd',
  data() {
    return {
      loading: false,
      formInfo: {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      verCodeText: '获取验证码',
      timer: null,
      coolDown: 60,
      openCardInfo: {},
      showStaffAuth: false
    }
  },
  methods: {
    handleInput(prop) {
      this.formInfo[prop] = this.formInfo[prop].replace(/\D/g, '')
    },
    initForm() {
      this.formInfo = {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      }
      this.initGetCode()
    },
    initGetCode() {
      clearInterval(this.timer)
      this.verCodeText = '获取验证码'
      this.coolDown = 60
    },
    getCode() {
      if (!isPhone.test(this.formInfo.phone)) {
        this.$message.error('请输入正确的手机号')
        return
      }
      if (this.verCodeText !== '获取验证码' && this.verCodeText !== '重新发送') return
      this.verCodeText = '60s后重发'
      this.timer = setInterval(() => {
        if (this.coolDown === 0) {
          clearInterval(this.timer)
          this.verCodeText = '重新发送'
          this.coolDown = 60
        } else {
          this.coolDown--
          this.verCodeText = `${this.coolDown}s后重发`
        }
      }, 1000)
      this.$api.sendUserPhoneCode({ codeType: 1, /* 1短信 2语音 */ phone: this.formInfo.phone }).then(() => {
        this.$message.success('发送成功')
      })
    },
    handleConfirm() {
      if (!isPhone.test(this.formInfo.phone)) {
        this.$message.error('请输入正确的手机号')
        return
      }
      if (!this.formInfo.code) {
        this.$message.error('请输入验证码')
        return
      }
      if (isNaN(this.formInfo.password) || this.formInfo.password.length !== 6) {
        this.$message.error('密码只能为6位数字')
        return
      }
      if (this.formInfo.password !== this.formInfo.confirmPassword) {
        this.$message.error('两次密码输入不一致')
        return
      }
      this.requestOpenCard()
    },
    async requestOpenCard() {
      this.loading = true
      const params = {
        type: 2,
        cardNum: this.formInfo.phone,
        code: Number(this.formInfo.code),
        pwd: this.formInfo.password
      }
      const [, res] = await to(this.$api.updateCardPwd(params))
      this.loading = false
      if (res) {
        this.$message.success('修改成功')
        this.initForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.update-public-user-pwd {
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
}
</style>
