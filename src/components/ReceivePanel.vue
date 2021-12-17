<template>
  <div>
    <div class="right-container">
      <div class="bc-title">支付金额</div>
      <div class="left-total flex-center">
        <div style="font-size: 18px; color: #333333; font-weight: 500">待支付金额:</div>
        <div style="color: #f32525; font-size: 35px; font-weight: bold; margin-top: 6px">
          ￥{{ count | MIXIN_Points2Yuan }}元
        </div>
      </div>
      <div class="bc-title">支付方式</div>
      <div class="pay-way">
        <div v-if="!offline" class="item flex-center" @click="handleCan">
          <img src="@/assets/open-public-relation-card/scan-pay.png" style="width: 50px; margin-right: 20px" />
          <div>扫码支付</div>
        </div>
        <div class="item flex-center" @click="handleRMB">
          <img src="@/assets/open-public-relation-card/money-pay.png" style="width: 50px; margin-right: 20px" />
          <div>现金支付</div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      width="30%"
      custom-class="success-dialog"
      :visible.sync="visible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描付款码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <template #footer>
        <el-button size="small" @click="handleCancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import $api from '@/api';
import mixin from '@/mixins/mixin';
import store from '@/store';

export default {
  mixins: [mixin],

  props: {
    needPayValue: Number,
    orderId: Number,
  },

  data() {
    return {
      visible: false,
    };
  },

  computed: {
    offline() {
      return store.state.offline;
    },
  },

  methods: {
    async fetchPayState(data) {
      const { body, errCode, errMsg } = await $api.createOtherIORecord(data);
      if (errCode === 0) {
        const { status } = body;
        if (status === 0) {
          setTimeout(() => {
            this.fetchPayState(data);
          }, 2000);
        }

        if (status === 1) {
          this.$emit('success');
        }
      } else {
        this.$message.error({ message: errMsg, duration: 1500 });
      }
    },

    handleCan() {
      this.visible = true;
      let payCode = '';
      document.onkeydown = ({ key }) => {
        if (key !== 'Enter') {
          payCode += key;
        } else {
          document.onkeydown = null;
          payCode = payCode.replace(/\s+/g, '');
          payCode = payCode.replace(/\s+/g, '');
          this.fetchPayState({ orderId: this.orderId, type: 2, authNo: payCode });
        }
      };
    },

    handleRMB() {
      this.$confirm('确认已收到现金？', {
        title: '提示',
        type: 'warning',
      })
        .then(() => {
          this.fetchPayState({ orderId: this.orderId, type: 1 });
        })
        .catch(() => {
          //
        });
    },

    handleCancel() {
      this.visible = false;
      document.onkeydown = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.right-container {
  .left-total {
    margin: 40px 0;
    height: 30vh;
    background: #ffffff;
    border: 1px solid #7a7a80;
    border-radius: 20px;
    padding: 80px 0;
    text-align: center;
  }

  .pay-way {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 40px 0;

    .item {
      color: #616161;
      font-weight: bold;
      text-align: center;
      line-height: 120px;
      width: 222px;
      height: 96px;
      background: #ffffff;
      border: 2px solid #4194fe;
      border-radius: 10px;
    }
  }
}

/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>
