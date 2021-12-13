<template>
  <div class="update-public-user-pwd" v-loading="loading">
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/phone-icon.png" alt="phone" />
      <span>公关会员虚拟号码</span>
      <input v-model="formInfo.account" type="text" placeholder="请输入" />
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/password-icon.png" alt="phone" />
      <span>原密码</span>
      <input v-model="formInfo.oldPassword" @input="handleInput('oldPassword')" :maxlength="6" type="password" placeholder="请输入原密码" />
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/new-password-icon.png" alt="phone" />
      <span>新密码</span>
      <input v-model="formInfo.password" @input="handleInput('password')" :maxlength="6" type="password" placeholder="请输入新密码" />
    </div>
    <div class="form-item flex-start">
      <img src="@/assets/open-temporary-card/new-password-icon.png" alt="phone" />
      <span>确认新密码</span>
      <input v-model="formInfo.confirmPassword" @input="handleInput('confirmPassword')" :maxlength="6" type="password" placeholder="再次输入新密码" />
    </div>
    <div>
      <el-button type="primary" size="medium" style="width: 150px" @click="handleConfirm">确定</el-button>
      <el-button size="medium" style="width: 150px; background-color: #7a7a80; color: #ffffff" @click="initForm">取消 </el-button>
    </div>
  </div>
</template>

<script>
import { to } from '@/utils/tools'

export default {
  name: 'update-public-user-pwd',
  data() {
    return {
      loading: false,
      formInfo: {
        account: '',
        oldPassword: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleInput(prop) {
      this.formInfo[prop] = this.formInfo[prop].replace(/\D/g, '')
    },
    initForm() {
      this.formInfo = {
        account: '',
        oldPassword: '',
        password: '',
        confirmPassword: ''
      }
    },
    handleConfirm() {
      if (isNaN(this.formInfo.account)) {
        this.$message.error('请输入正确的虚拟号码')
        return
      }
      if (isNaN(this.formInfo.oldPassword)) {
        this.$message.error('请输入正确的原密码')
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
        type: 1,
        cardNum: this.formInfo.account,
        pwd: this.formInfo.password,
        oldPwd: this.formInfo.oldPassword
      }
      const [, res] = await to(this.$api.updateCardPwd(params))
      this.loading = false
      if (res) {
        this.$message.success('修改成功')
        this.initForm()
      }
    }
  },
  created() {}
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
