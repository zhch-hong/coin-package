<template>
  <div class="open-virtual-account" v-loading="loading">
    <img class="scan-card-image" src="@/assets/open-public-relation-card/virtual-account-img.png" alt="img" />
    <el-input-number
      style="display: block; margin-top: 32px"
      v-model="accountsCount"
      size="large"
      :min="1"
      :max="20"
      step-strictly
    ></el-input-number>
    <el-button
      type="primary"
      style="padding: 12px 40px; margin-top: 32px; border-radius: 10px; margin-left: 35px"
      @click="handleConfirmOpenCard"
      >确定</el-button
    >
    <div style="margin-top: 32px">
      <span style="color: red">*</span>
      温馨提示：公关卡虚拟账号密码为账户账号后6位
    </div>
    <div>公关卡虚拟账号可通过账户账号和初始密码进行密码修改</div>
    <div>密码修改请点击“会员操作”--“重置密码”功能进行修改</div>
    <StaffAuth :show.sync="showStaffAuth" @success="requestOpenCard" />
    <el-dialog
      :visible.sync="showSuccessModal"
      width="565px"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-header flex-between">
        <img src="@/assets/logo_small.png" alt="logo" style="width: 110px" />
        <i
          class="el-icon-close"
          style="color: red; font-size: 24px; font-weight: bold; cursor: pointer"
          @click="closeSuccessDialog"
        ></i>
      </div>
      <div class="dialog-body">
        <div class="success-info flex-start" style="align-items: flex-start">
          <img src="@/assets/open-public-relation-card/open-card-success.png" alt="success" style="width: 154px" />
          <div style="margin-left: 30px">
            <div style="margin-top: 16px; font-size: 27px; color: #4194fe; font-weight: bold">开卡成功！</div>
            <div style="margin-top: 32px">
              <span style="color: red">*</span>
              温馨提示：请保存好公关卡虚拟账户号码，<br />保存后收银台将不再展示
            </div>
          </div>
        </div>
        <div class="actions flex-center" style="margin-top: 40px">
          <el-button type="primary" style="width: 100px; border-radius: 10px" @click="handleSaveCard2Local"
            >保存卡号</el-button
          >
          <el-button plain style="margin-left: 48px; width: 100px; border-radius: 10px" @click="closeSuccessDialog"
            >完成</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/** *
 *
 * 开公关卡  -  虚拟卡
 * 开卡接口 = userOpenVipCard
 * 必传的参数：
 * cardType = 0
 * vipLevelId = 获取开卡信息接口中vipType = 0 的id
 * cardNumList = []
 * cardNum = accountsCount
 * openCardType = 1
 * 如果需要授权 ===
 * type = 授权的type
 * phone = 授权的手机号
 * code = 授权的验证码
 */
import StaffAuth from '@/components/StaffAuth';
import { to } from '@/utils/tools';

export default {
  name: 'open-virtual-account',
  components: { StaffAuth },
  data() {
    return {
      loading: false,
      openCardInfo: {},
      accountsCount: 1,
      showStaffAuth: false,
      showSuccessModal: false,
      virtualAccountsList: [],
    };
  },
  methods: {
    handleSaveCard2Local() {
      const content = this.virtualAccountsList.join('\r\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const objectURL = URL.createObjectURL(blob);
      const dom = document.createElement('a');
      dom.href = objectURL;
      dom.download = '虚拟卡.txt';
      dom.click();
      URL.revokeObjectURL(objectURL);
    },
    closeSuccessDialog() {
      this.showSuccessModal = false;
      this.accountsCount = 1;
      this.virtualAccountsList = [];
    },
    handleConfirmOpenCard() {
      if (!this.openCardInfo.id) {
        this.$message.error('该门店未设置公共卡信息');
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
        cardType: 0,
        vipLevelId: this.openCardInfo.id,
        cardNumList: [],
        cardNum: this.accountsCount,
        openCardType: 1,
        ...authInfo,
      };
      this.$api
        .userOpenVipCard(params)
        .then((orderInfo) => {
          this.virtualAccountsList = orderInfo.body.cardNumList;
          return this.$api.userOpenVipCardPayRMB({
            orderId: orderInfo.body.orderId,
            type: 2,
            authNo: orderInfo.body.orderId,
            vipLevelId: this.openCardInfo.id,
          });
        })
        .then((res) => {
          if (res.body.status === 1) {
            this.showSuccessModal = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取公共卡开卡信息
    getCardFee() {
      this.$api.getVipCardInfo({}).then((res) => {
        // vipType : 0公关卡   2公共卡  3临时卡
        this.openCardInfo = res.body.find((item) => item.vipType === 0);
        if (!this.openCardInfo) {
          this.$message.error('该门店未设置公共卡信息');
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
