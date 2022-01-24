<template>
  <div class="store-manage">
    <div class="gift-exchange coupons-padding-left">
      <el-row class="list-container" type="flex" align="middle">
        <div class="bc-title">兑换方式</div>
      </el-row>
      <div>
        <img src="@/assets/sacn-exchage.png" class="scan-card-image" />
        <div class="button-style button-style1" @click="openModalByScan">点击扫码</div>
      </div>
      <div class="box-bottom">
        <el-input
          v-model="code"
          size="mini"
          style="width: 205px; padding: 20px 0px 38px 0"
          placeholder="点击手动输入兑换码"
        ></el-input>
      </div>
      <div class="box-bottom">
        <el-button type="danger" style="width: 140px" @click="search">查 询</el-button>
      </div>
    </div>
    <div class="gifts-list-container-box">
      <div class="gifts-list-container">
        <vcard style="margin-bottom: 0">
          <el-row class="list-container coupons-padding-left" type="flex" align="middle">
            <el-col :span="12"><div class="bc-title">兑换记录</div></el-col>
          </el-row>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="400"
            :header-cell-style="{ backgroundColor: '#EBF5FF' }"
          >
            <el-table-column
              v-for="(col, index) in dataColumn"
              :key="index"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.width"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="exchange(scope.row)">确认兑换</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <img style="width: 316px" src="@/assets/open-public-relation-card/no-data.png" alt="no-data" />
              <div style="font-size: 20px; font-weight: bold; color: #9f9f9f">暂无数据</div>
            </div>
          </el-table>
        </vcard>
        <div class="total-content">玩家ID：{{ uid }}</div>
        <div class="total-content tatal-content1">游戏币数:{{ userCoin }}枚</div>
      </div>
    </div>
    <el-dialog
      :visible.sync="showScanModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="custom-frame-header">提示</div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" class="custom-frame-left-icon" />
        <div>
          <div class="custom-frame-tip">请扫描物品兑换二维码......</div>
          <div class="custom-frame-tip">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="custom-frame-cancel" :loading="loading" @click="closeScanModal">取 消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { getToken } from '../../../utils/auth';

export default {
  name: 'store',
  components: {},
  data() {
    return {
      loading: false,
      code: '',
      userCoin: 0,
      uid: '',
      // 表格数据
      dataColumn: [
        { prop: 'prizeName', label: '商品名称', width: 120 },
        { prop: 'count', label: '兑换数量', width: 120 },
        { prop: 'title', label: '来源', width: 120 },
      ],
      tableData: [],
      // 扫码
      showScanModal: false,
    };
  },
  methods: {
    openModalByScan() {
      this.code = '';
      this.showScanModal = true;
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.code += e.key;
        } else {
          this.code = this.code.replace(/\s+/g, '');
          document.onkeydown = null;
          this.loading = true;
          this.code = this.code.replace(/\s+/g, '');
          this.$api
            .getExchangeInfo({ code: this.code })
            .then((res) => {
              this.tableData.length = 0;
              this.tableData.push(res.body.prizeInfo);
              this.uid = res.body.userInfo.uid;
              this.userCoin = res.body.userInfo.userCoin;
            })
            .finally(() => {
              this.loading = false;
              this.closeScanModal();
            });
        }
      };
    },
    closeScanModal() {
      document.onkeydown = null;
      this.showScanModal = false;
    },
    search() {
      if (!this.code) {
        this.$message.warning('请输入兑换码');
        return;
      }
      this.loading = true;
      this.$api
        .getExchangeInfo({ code: this.code })
        .then((res) => {
          this.loading = false;
          this.tableData.length = 0;
          this.tableData.push(res.body.prizeInfo);
          this.uid = res.body.userInfo.uid;
          this.userCoin = res.body.userInfo.userCoin;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    exchange(item) {
      this.$api
        .userExchange({ code: this.code })
        .then((res) => {
          this.$message.success('兑换成功');
          this.uid = '';
          this.code = '';
          this.userCoin = 0;
          this.tableData = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
.store-manage {
  @include flex(space-between, flex-start, row);
  .gifts-list-container-box {
    // padding-right: 33px;
    box-sizing: border-box;
  }
  .gifts-list-container {
    width: 45vw;
    border-top: 3px solid #bfc7d2;
    .list-container {
      padding: 20px 0;
    }

    .menu-container {
      @include flex(flex-start, center, row);
      overflow-x: auto;
    }

    .total-content {
      margin: 0;
      color: #3d3d3e;
      font-size: 17px;
      padding: 20px 50px 0 50px;
      box-sizing: border-box;
      background: white;
    }
  }

  .gift-exchange {
    width: 35vw;

    .list-container {
      padding: 20px 0;
      width: 100%;
    }

    .scan-title {
      border-radius: 16px;
      margin-top: 60px;
      width: 50%;
      text-align: center;
      font-size: 24px;
      color: #ffffff;
      background-color: #20a0ff;
      padding: 16px;
    }

    .form-container {
      padding-top: 80px;
      @include flex(flex-start, center, column);
    }
  }
}
.coupons-padding-left {
  padding-left: 54px !important;
  box-sizing: border-box;
}
.box-bottom {
  width: 200px;
  display: flex;
  justify-content: center;
}
.tatal-content1 {
  padding-bottom: 20px !important;
  border-radius: 0 0 10px 10px;
}
.button-style1 {
  width: 205px;
  padding: 12px 0;
}
</style>
