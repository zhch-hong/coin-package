<template>
  <div class="modify-data sub-page-flex">
    <el-row style="height: 100%">
      <el-col :span="8">
        <div class="left-contain">
          <div class="bc-title">会员信息</div>
          <img src="@/assets/scan-user.png" alt="" style="width: 240px; margin: 60px 0 60px 0" />
          <div
            style="
              margin: 40px 0;
              cursor: pointer;
              border-radius: 8px;
              width: 240px;
              padding: 16px 0;
              color: #ffffff;
              text-align: center;
              background-color: #4194fe;
            "
            :loading="loading"
            @click="openScanUserInfoModal"
          >
            点击扫码查询会员信息
          </div>
          <div></div>
          <el-input v-model="uid" placeholder="或输入手机号/会员ID" style="width: 240px">
            <el-button slot="append" @click="getUserInfo" :loading="loading">查询</el-button>
          </el-input>
        </div>
      </el-col>
      <el-col
        :span="16"
        v-if="updateInfo.uid"
        class="flex-start"
        style="border-left: 1px solid #cccccc; flex-direction: column; align-items: flex-start; margin-top: 40px"
      >
        <div class="bc-title" style="margin-left: 25%">资料修改</div>
        <el-form ref="form" label-width="120px" label-position="right" :model="updateInfo" :rules="rules" style="margin-left: 28%; margin-top: 40px">
          <el-form-item label="会员姓名" prop="realName">
            <el-input v-model="updateInfo.realName" style="width: 240px" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <span>{{ updateInfo.sex | MIXIN_FormatSex }}</span>
          </el-form-item>
          <el-form-item label="身份证" prop="IDCard">
            <el-input v-model="updateInfo.IDCard" style="width: 240px" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="updateInfo.birthday"
              type="date"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="updateInfo.address" style="width: 240px" type="textarea" :rows="4" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="持卡人联系电话" prop="phone">
            <span>{{ updateInfo.phone }}</span>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="updateInfo.code" style="width: 240px" clearable placeholder="请输入">
              <el-button size="small" slot="append" @click="handleOnSendCode(1)">{{ codeText }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div style="font-size: 14px; color: #999ca0">
              收不到短信？尝试获取
              <el-button type="text" size="small" @click="handleOnSendCode(2)">语音验证码</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 120px" @click="handleOnUpdateInfo">确认</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog
      custom-class="success-dialog"
      :visible.sync="showScanUserInfoModal"
      :show-close="false"
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
  </div>
</template>

<script>
import { isPhone } from '@/utils/validate'

export default {
  name: 'ModifyData',
  data() {
    return {
      loading: false,
      uid: '',
      showScanUserInfoModal: false,
      updateInfo: {
        realName: '',
        IDCard: '',
        birthday: '',
        address: '',
        sex: null,
        phone: '',
        code: ''
      },
      rules: {
        realName: { required: true, message: '请输入正确的会员姓名' },
        birthday: { required: true, message: '请选择生日' },
        code: { required: true, message: '请输入验证码' }
      },
      codeText: '获取验证码',
      timer: null,
      coolDown: 60
    }
  },
  created() {
    clearInterval(this.timer)
    this.codeText = '获取验证码'
    this.coolDown = 60
  },
  methods: {
    // 打开扫描用户信息二维码弹窗
    openScanUserInfoModal() {
      this.uid = ''
      this.showScanUserInfoModal = true
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.uid += e.key
        } else {
          this.uid = this.uid.replace(/\s+/g, '')
          this.closeScanUserInfoModal()
          if (!this.uid || this.uid.length !== 8) {
            this.$message.error('请输入正确的会员ID')
            return
          }
          this.getUserInfo()
        }
      }
    },
    closeScanUserInfoModal() {
      document.onkeydown = null
      this.showScanUserInfoModal = false
    },
    // 发送验证码
    handleOnSendCode(type) {
      if (!isPhone.test(this.updateInfo.phone)) {
        this.$message.error('请输入正确的手机号')
        return
      }
      if (type === 1) {
        if (this.codeText !== '获取验证码' && this.codeText !== '重新发送') return
        this.codeText = '60s后重发'
        this.timer = setInterval(() => {
          if (this.coolDown === 0) {
            clearInterval(this.timer)
            this.codeText = '重新发送'
            this.coolDown = 60
          } else {
            this.coolDown--
            this.codeText = `${this.coolDown}s后重发`
          }
        }, 1000)
      } else {
        this.$message.success('发送成功，请注意接听来电')
      }
      this.$api.sendUpdateUserInfoSms({ phone: this.updateInfo.phone, codeType: type }).then((res) => {
        this.$message.success('发送成功')
      })
    },
    // 查询用户信息
    getUserInfo() {
      if (!this.uid) {
        this.$message.error('请输入正确的会员ID')
        return
      }
      this.loading = true
      this.$api
        .getUserBaseInfo({ uid: this.uid })
        .then((res) => {
          this.uid = res.body.uid
          this.updateInfo = { ...this.updateInfo, ...res.body }
          clearInterval(this.timer)
          this.codeText = '获取验证码'
          this.coolDown = 60
        })
        .finally((f) => {
          this.loading = false
        })
    },
    // 编辑信息
    handleOnUpdateInfo() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loading = true
          const { uid, realName, IDCard, birthday, address, phone, code } = this.updateInfo
          this.$api
            .editUserVipInfo({ uid, realName, IDCard, birthday, address, phone, code })
            .then((res) => {
              this.$message.success('保存成功')
              this.clearData()
            })
            .finally((f) => {
              this.loading = false
            })
        }
      })
    },
    clearData() {
      clearInterval(this.timer)
      this.uid = ''
      this.updateInfo = {
        realName: '',
        IDCard: '',
        birthday: '',
        address: '',
        sex: null,
        phone: '',
        code: ''
      }
      this.codeText = '获取验证码'
      this.timer = null
      this.coolDown = 60
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

.modify-data {
  .left-contain {
    margin: 40px 0 0 60px;
    height: 100%;
  }
}
</style>
