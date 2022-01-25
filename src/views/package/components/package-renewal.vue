<template>
  <div class="renewal" v-loading="loading">
    <el-row>
      <el-col :span="9" class="left-container">
        <div class="bc-title">会员信息</div>
        <img src="@/assets/scan-user.png" class="scan-card-image" />
        <div
          style="
            margin: 40px 0;
            border-radius: 8px;
            cursor: pointer;
            width: 200px;
            padding: 13px 0;
            color: #ffffff;
            text-align: center;
            background-color: #4194fe;
          "
          @click="openScanUserInfoModal"
        >
          点击扫码查询会员信息
        </div>
        <el-input v-model="uid" placeholder="手动输入ID" style="width: 200px">
          <el-button slot="append" @click="getRenewalTimeGift">查询</el-button>
        </el-input>
      </el-col>
      <el-col :span="13" style="padding-left: 160px; box-sizing: bordre-box">
        <div class="bc-title">年（月）票明细</div>
        <div class="flex-start" style="margin-top: 20px; margin-bottom: 20px">
          <img src="@/assets/package-renewal/ticket-icon.png" style="width: 18px" />
          <div style="color: #a4a4a4; font-size: 17px; margin-left: 12px">请选择年（月）票</div>
        </div>
        <div class="pkg-box">
          <div
            class="pkg-item"
            v-for="(item, index) in giftList"
            :key="index"
            @click="selectPkg(item)"
            :style="{
              backgroundColor: item.id === currentPkg.id ? '#4194FE' : '#7A7A80',
            }"
          >
            {{ item.name }}
          </div>
        </div>
        <h4 style="color: #494949">
          续期费金额:<span style="color: red; font-weight: bold; font-size: 26px"
            >￥{{ currentPkg.price | MIXIN_Points2Yuan }}元</span
          >
        </h4>
        <h4 style="color: #494949">当前有效截止日期：{{ currentPkg.endTime }}</h4>
        <h4 style="color: #494949">续期有效截止日期：{{ currentPkg.newEndTime }}</h4>
        <el-button
          type="primary"
          style="width: 122px; border-radius: 10px"
          :disabled="!currentPkg.id"
          @click="handlePlaceOrder"
        >
          确定
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showScanUserInfoModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div
        style="
          text-align: center;
          padding: 18px 0;
          font-size: 24px;
          font-weight: bold;
          border-bottom: 1px solid #cccccc;
        "
      >
        提示
      </div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描用户二维码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="closeScanUserInfoModal" style="border-radius: 10px">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'renewal',
  data() {
    return {
      loading: false,
      uid: '',
      currentPkg: {
        price: 0,
        endTime: '---',
        newEndTime: '---',
      },
      giftList: [],
      showScanUserInfoModal: false,
    };
  },
  methods: {
    // 下单
    handlePlaceOrder() {
      this.loading = true;
      this.$api
        .userRenewalTimeGift({ id: this.currentPkg.id })
        .then((res) => {
          this.$router.push({
            name: 'renewal-settle',
            params: { ...res.body, gift: this.currentPkg },
          });
        })
        .finally((f) => {
          this.loading = false;
        });
    },
    selectPkg(pkg) {
      this.currentPkg = pkg;
    },
    closeScanUserInfoModal() {
      document.onkeydown = null;
      this.showScanUserInfoModal = false;
    },
    // 打开扫描用户信息二维码弹窗
    openScanUserInfoModal() {
      this.uid = '';
      this.showScanUserInfoModal = true;
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.uid += e.key;
        } else {
          this.uid = this.uid.replace(/\s+/g, '');
          document.onkeydown = null;
          this.showScanUserInfoModal = false;
          this.getRenewalTimeGift();
        }
      };
    },
    getRenewalTimeGift() {
      if (!this.uid) {
        this.$message.error('请输入正确的会员ID');
        return;
      }
      this.loading = true;
      this.$api
        .getRenewalTimeGift({ uid: this.uid })
        .then((res) => {
          if (res.body.giftList.length) {
            this.giftList = res.body.giftList;
          } else {
            this.$alert('该玩家没有可续期套餐', '提示', {
              type: 'warning',
            });
          }
        })
        .finally((f) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin';

/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.renewal {
  padding: 20px;
  /* 屏幕小于1400px */
  @media screen and (max-width: 1400px) {
    min-height: 500px;
  }
  /* 屏幕大于1400px */
  @media screen and (min-width: 1401px) {
    min-height: 880px;
  }

  .left-container {
    padding: 0 70px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // height: 80vh;
    margin-right: 20px;
    border-right: 1px solid #cccccc;

    .scan-title {
      border-radius: 8px;
      width: 200px;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      background-color: #4194fe;
      padding: 16px;
    }
  }

  .pkg-box {
    // height: 470px;
    overflow-y: auto;

    .pkg-item {
      width: 372px;
      height: 53px;
      color: #ffffff;
      line-height: 53px;
      text-align: center;
      font-weight: bold;
      border-radius: 10px;
      font-size: 21px;
      padding: 0 12px;
      margin-bottom: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
