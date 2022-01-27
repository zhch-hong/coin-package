<template>
  <div class="navbar">
    <div class="left-menu">
      <div class="info-item flex-start">
        <img class="info-icon" src="@/assets/layout/navbar/staff.png" alt="staff" />
        <p>{{ staffName }}</p>
      </div>
      <div class="info-item flex-start">
        <img class="info-icon" src="@/assets/layout/navbar/module.png" alt="module" />
        <p>：{{ moduleName }}</p>
      </div>
      <div class="info-item flex-start" v-if="!$store.state.offline">
        <img class="info-icon" src="@/assets/layout/navbar/coins.png" alt="coins" />
        <p style="color: #f83333">：{{ $store.state.currentCoins }}</p>
      </div>
    </div>
    <div class="right-menu">
      <div class="flex-center" style="margin-right: 16px">
        <div>当前模式：</div>
        <div class="mode-text" :style="{ backgroundColor: $store.state.offline ? '#F56C6C' : '#36F00B' }">
          {{ $store.state.offline ? '离线' : '在线' }}
        </div>
      </div>
      <div class="lock-screen" v-if="$isDev" @click="handleOnReload">
        <i class="el-icon-refresh-left"></i>
      </div>
      <!-- <div class="lock-screen" @click="$root.$children[0].sendCoin(30)" v-if="$isDev">
        <i class="el-icon-star-off"></i>
      </div> -->
      <el-popover placement="bottom" width="200" trigger="click">
        <div class="lock-screen" slot="reference"><i class="el-icon-setting"></i></div>
        <div class="flex-center" style="flex-direction: column">
          <el-button size="mini" style="width: 128px" @click="handleShowUpdatePasswordModal">修改密码</el-button>
          <el-button
            size="mini"
            style="width: 128px; margin-left: 0; margin-top: 12px"
            v-if="!$store.state.offline"
            @click="$root.$children[0].resetPort"
          >
            选择收银吐币机
          </el-button>
        </div>
      </el-popover>
      <div class="lock-screen" @click="logout">
        <!-- <i class="el-icon-lock"></i> -->
        <img src="@/assets/passwordIcon1.png" alt="" style="width: 20px" />
      </div>

      <el-dialog
        title="修改密码"
        :visible.sync="showUpdatePasswordModal"
        @close="handleCloseModal"
        width="400px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <el-form
          ref="updatePassword"
          :model="updatePasswordForm"
          :rules="updatePasswordRules"
          inline
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="新密码" prop="pwd">
            <el-input
              v-model="updatePasswordForm.pwd"
              :maxlength="32"
              style="vertical-align: sub"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input
              v-model="updatePasswordForm.confirmPwd"
              :maxlength="32"
              style="vertical-align: sub"
              placeholder="请再次输入新密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpdatePasswordModal = false">取 消</el-button>
          <el-button type="primary" @click="handleOnConfirmUpdatePassword">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { removeToken } from '../../utils/auth';

export default {
  data() {
    const validatePwd = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error('请输入6-32位密码，'));
      }
      callback();
    };
    const validateConfirmPwd = (rule, value, callback) => {
      if (value !== this.updatePasswordForm.pwd) {
        callback(new Error('两次密码不一致'));
      }
      callback();
    };
    return {
      avatar: '',
      userName: '',
      moduleName: '',
      staffName: '',
      showUpdatePasswordModal: false,
      updatePasswordForm: {
        pwd: '',
        confirmPwd: '',
      },
      updatePasswordRules: {
        pwd: { required: true, validator: validatePwd },
        confirmPwd: { required: true, validator: validateConfirmPwd },
      },
    };
  },
  computed: {
    ...mapGetters(['sidebar']),
  },
  watch: {
    $route() {
      if (!this.$store.state.offline) {
        this.$store.dispatch('getMachineCoinNum');
      }
    },
  },
  methods: {
    handleOnConfirmUpdatePassword() {
      this.$refs.updatePassword.validate((v) => {
        if (v) {
          this.$api.updateStaffPwd({ pwd: this.updatePasswordForm.pwd }).then(() => {
            this.$message.success('修改成功');
            this.handleCloseModal();
          });
        }
      });
    },
    handleCloseModal() {
      this.$refs.updatePassword.resetFields();
      this.showUpdatePasswordModal = false;
    },
    handleShowUpdatePasswordModal() {
      this.showUpdatePasswordModal = true;
    },
    handleOnReload() {
      window.location.reload();
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    },
    async logout() {
      if (this.$store.state.offline) {
        removeToken();
        sessionStorage.clear();
        await this.$router.replace({ path: '/login' });
      } else {
        this.$api.cashLoginOut({}).finally((f) => {
          removeToken();
          this.$router.replace({ path: '/login' });
        });
      }
    },
  },
  created() {
    this.userName = sessionStorage.getItem('cashier_token');
    this.moduleName = sessionStorage.getItem('moduleName');
    this.staffName = sessionStorage.getItem('staffName');
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.navbar {
  @include flex(space-between, center, row);
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  border-top: 1px solid #ebeef5;
  border-bottom: 2px solid #f0f2f5;

  .left-menu {
    @include flex(flex-start, center, row);
    padding: 0 20px;
    width: 720px;
    font-size: 15px;
    font-weight: 400;
    color: #666666;

    .info-item {
      margin-right: 48px;
    }

    .info-icon {
      width: 20px;
      margin-right: 10px;
    }
  }

  .right-menu {
    @include flex(center, center, row);
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .mode-text {
      padding: 0 12px;
      line-height: 25px;
      border-radius: 7px;
      text-align: center;
      color: #ffffff;
    }

    .lock-screen {
      @include flex(center, center, row);
      margin-right: 20px;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      text-align: center;

      &:active {
        background-color: #174cb7;
        box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.35) inset;
        color: #ffffff;
      }

      i {
        font-size: 24px;
      }
    }
  }
}
</style>
