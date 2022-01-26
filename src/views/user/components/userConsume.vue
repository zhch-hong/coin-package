<template>
  <div class="user-consume-page sub-page-flex" v-loading="loading">
    <el-row style="height: 100%">
      <el-col :span="12" style="padding-left: 20px">
        <div class="bc-title">会员信息</div>
        <div style="display: flex">
          <div @click="openScanUserInfoModal(1)">
            <img src="@/assets/scan-user.png" alt="" style="width: 160px; margin: 67px 0 45px 0" />
            <div
              style="
                margin: 40px 0;
                border-radius: 8px;
                cursor: pointer;
                width: 190px;
                padding: 16px 0;
                color: #ffffff;
                text-align: center;
                background-color: #4194fe;
              "
            >
              点击扫码查询会员信息
            </div>
          </div>
          <div style="padding: 0 4%; box-sizing: border-box">
            <div>
              <img src="@/assets/or.png" alt="" style="width: 22px; height: 233px; margin: 59px 0" />
            </div>
          </div>
          <div @click="openScanUserInfoModal(2)">
            <img src="@/assets/discount-icon1.png" alt="" style="width: 192px; margin: 59px 0" />

            <div
              style="
                margin: 40px 0;
                border-radius: 8px;
                cursor: pointer;
                width: 190px;
                padding: 16px 0;
                color: #ffffff;
                text-align: center;
                background-color: #4194fe;
              "
            >
              点击扫描核销二维码
            </div>
          </div>
        </div>
        <div></div>
        <el-input v-model="phone" placeholder="点击手动输入手机号" style="width: 380px">
          <el-button slot="append" @click="getUserGiftByPhone">查询</el-button>
        </el-input>
        <template v-if="photoList.length && showPhoto">
          <h3>会员照片</h3>
          <el-image
            v-for="(img, index) in photoList"
            :key="index"
            :src="img"
            fit="cover"
            style="width: 128px; margin-right: 16px; margin-bottom: 16px"
          ></el-image>
        </template>
      </el-col>
      <el-col :span="12" class="flex-column" style="background-color: #ffffff; border-radius: 10px; height: 100%">
        <div class="bc-title" style="margin: 20px 40px">会员消费</div>
        <el-divider></el-divider>
        <div style="padding-left: 40px; color: #828385; padding-bottom: 40px">消费套餐</div>
        <div class="pkg-box">
          <div
            class="pkg-item flex-center"
            v-for="(item, index) in items"
            :key="index"
            @click="selectPkg(item)"
            v-if="item.useNum > 0"
            :style="getSelectStyle(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <el-divider></el-divider>
        <div class="flex-between" style="padding: 0 40px 40px; width: 100%">
          <div>
            <h4 v-if="currentPkg.type === 3">
              消费次数:
              <el-input v-model="useTimes" type="number" placeholder="请输入消费次数" style="width: 256px"></el-input>
            </h4>
            <div style="font-size: 18px; color: #545050">
              已消费:<span style="color: #f72727; font-size: 24px; font-weight: bold"
                >{{ currentPkg.checkNum || 0 }}次</span
              >
            </div>
            <div style="font-size: 18px; color: #545050">
              剩余可消费次数/时间:<span style="color: #f72727; font-size: 24px; font-weight: bold">{{
                currentPkg.type === 2 ? currentPkg.endTime : currentPkg.useNum + '次'
              }}</span>
            </div>
          </div>
          <el-button
            type="primary"
            style="width: 128px; background-color: #4194fe"
            :disabled="!currentPkg.id"
            @click="handlePlaceOrder"
            >确认
          </el-button>
        </div>
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
          <div style="font-size: 23px; font-weight: bold; color: #616161">
            请扫描{{ scanType === 1 ? '用户' : '核销' }}二维码......
          </div>
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
import moment from 'moment';
import { parseQuery } from '@/utils/tools';
import { isPositiveInt } from '../../../utils/validate';
import { getToken } from '../../../utils/auth';

export default {
  name: 'userConsume',
  data() {
    return {
      showPhoto: false,
      loading: false,
      showScanUserInfoModal: false,
      phone: '',
      uid: '',
      photoList: [],
      items: [],
      useTimes: '1',
      currentPkg: {
        useTimeList: [],
        type: 2,
        endTime: '---',
      },
      ticketHeight: 0,
      scanType: null,
      validateCodeInfo: {},
    };
  },
  methods: {
    getSelectStyle(item) {
      if (item.id === this.currentPkg.id) {
        return { backgroundColor: '#ffffff', color: '#4194FE' };
      }
    },
    getHeight() {
      this.ticketHeight += 25;
      return this.ticketHeight;
    },
    printTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      const printFlag = sessionStorage.getItem('printFlag');
      if (printFlag) {
        this.$api.getStorePrint({ code: 'USER_EXPENSE' }).then(async (res) => {
          const p = res.body.printInfo;
          if (p.printFlag) {
            LODOP.PRINT_INIT('');
            // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
            LODOP.SET_PRINT_STYLE('FontSize', 8);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `用户编号：${this.uid}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `套餐名称：${this.currentPkg.name}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `消费次数：${this.useTimes}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`);
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme);
            // LODOP.PREVIEW()
            LODOP.PRINT();
            this.ticketHeight = 0;
            callback && callback();
          } else {
            callback && callback();
          }
        });
      }
    },
    handlePlaceOrder() {
      console.log(this.useTimes);
      const params = {
        id: this.currentPkg.id,
      };
      if (this.currentPkg.type === 3) {
        if (!isPositiveInt.test(this.useTimes)) {
          this.$message.error('请输入正确的消费次数');
          return;
        }
        params.num = this.useTimes;
      }
      this.loading = true;
      this.$api
        .checkUserGift(params)
        .then((res) => {
          this.$alert('核销成功', '成功', {
            type: 'success',
            showClose: false,
          }).then(() => {
            this.printTicket(() => {
              this.showPhoto = false;
              this.phone = '';
              this.uid = '';
              this.items = [];
              this.useTimes = '1';
              this.currentPkg = {
                useTimeList: [],
                type: 2,
                endTime: '---',
              };
            });
          });
        })
        .finally((f) => {
          this.loading = false;
        });
    },
    selectPkg(pkg) {
      console.log(pkg);
      this.currentPkg = pkg;
      if (pkg.type === 2) {
        this.showPhoto = true;
      } else {
        this.showPhoto = false;
      }
    },
    // 打开扫描用户信息二维码弹窗
    openScanUserInfoModal(type) {
      this.scanType = type;
      this.uid = '';
      let qrcode = '';
      this.showScanUserInfoModal = true;
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          if (type === 1) {
            this.uid += e.key;
          } else {
            qrcode += e.key;
          }
        } else {
          this.closeScanUserInfoModal();
          if (type === 1) {
            // 查询会员信息
            this.uid = this.uid.replace(/\s+/g, '');
            if (!this.uid || this.uid.length !== 8) {
              this.$message.error('请输入正确的会员ID');
              return;
            }
            this.getUserGiftData(1);
          } else {
            // 扫描核销二维码
            qrcode = qrcode.replace(/Shift/g, '');
            this.validateCodeInfo = parseQuery(qrcode.split('?')[1]);
            this.getUserGiftData(3);
          }
        }
      };
    },
    closeScanUserInfoModal() {
      document.onkeydown = null;
      this.showScanUserInfoModal = false;
    },
    getUserGiftData(type) {
      this.loading = true;
      const params = { type };
      if (type === 1) {
        params.uid = this.uid;
      } else if (type === 2) {
        params.phone = this.phone;
      } else if (type === 3) {
        params.code = this.validateCodeInfo.couponsCode;
        params.uid = this.validateCodeInfo.uid;
        this.uid = this.validateCodeInfo.uid;
      }
      this.$api
        .getUserTimeNumGift(params)
        .then((res) => {
          this.items = res.body.items;
          this.photoList = res.body.photoList;
          this.$message.success('查询成功');
        })
        .finally((f) => {
          this.loading = false;
        });
    },
    getUserGiftByPhone() {
      if (!this.phone) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      this.getUserGiftData(2);
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

.user-consume-page {
  padding: 20px;
  height: 100%;

  .pkg-box {
    // display: grid;
    // width: 100%;
    // grid-gap: 20px;
    // grid-template-columns: auto auto auto;
    // flex: 1;
    // flex-basis: auto;
    // max-height: 400px;
    // overflow-y: auto;
    // padding: 0 40px;
    display: flex;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
    justify-content: space-around;
    flex-wrap: wrap;
    .pkg-item {
      width: 192px;
      border: 1px solid #4194fe;
      height: 120px;
      padding: 0 16px;
      text-align: center;
      font-weight: bold;
      color: #ffffff;
      background-color: #4194fe;
      border-radius: 20px;
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
