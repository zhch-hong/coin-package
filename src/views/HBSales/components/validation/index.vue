<template>
  <div class="validation">
    <el-row>
      <el-col class="validation-el-col" :span="10">
        <div class="flex-center"><img src="@/assets/hb-exclusive.png" class="hb-exclusive" /></div>
        <div class="flex-center">
          <div class="hb-button-style" @click="handleOpenScanModal">点击扫描嗨呗核销二维码</div>
        </div>
        <div class="flex-center">
          <el-input
            v-model="validateNumberCode"
            style="width: 360px; margin-top: 36px"
            placeholder="点击手动输入嗨呗核销数字码"
          >
            <el-button :loading="loading" slot="append" @click="handleInputComplete"> 查询</el-button>
          </el-input>
        </div>

        <template v-if="goodsInfo._id">
          <div style="padding-top: 44px"></div>
          <div class="bc-title">核销码详情：</div>
          <div class="cell-item">{{ goodsInfo.specificationName }}</div>
          <div class="cell-item">
            <div>核销数量</div>
            <el-input-number
              :disabled="getDataMode === 2 || goodsInfo.count === 1"
              v-model="useCount"
              :min="1"
              :max="goodsInfo.count"
              step-strictly
              @change="getTotalCoinNum"
              @blur="handleInputNumberBlur"
            />
          </div>
          <div class="cell-item">
            <div>已核销数量</div>
            <div>{{ goodsInfo.alreadyUseCount }}</div>
          </div>
          <div class="cell-item">
            <div>剩余可核销数量</div>
            <div>{{ goodsInfo.count }}</div>
          </div>
          <div class="cell-item">
            <div>
              <el-button type="primary" style="min-width: 120px" :loading="loading" @click="handleGetPkgDetail">
                查询套餐信息</el-button
              >
            </div>
            <div>
              <el-button type="info" style="width: 120px" @click="clearGoodsInfo">取消</el-button>
            </div>
          </div>
        </template>
      </el-col>
      <el-col :span="14" style="padding: 24px 24px 0 63px; box-sizing: border-box">
        <template v-if="showPackageDetail">
          <div class="bc-title">核销码绑定套餐包括：</div>
          <div class="flex-start writing-style" v-if="showCoinTypeRadio">
            <div>出币方式：</div>
            <el-radio-group v-model="coinType">
              <el-radio :label="1">机台出币</el-radio>
              <el-radio :label="3">手动取币</el-radio>
              <el-radio :label="2">电子币</el-radio>
            </el-radio-group>
          </div>
          <div class="flex-start flex-warp1" v-for="(item, index) in pkgDetail" :key="index">
            <div class="flex-start">
              <h2>{{ item.name }}</h2>
              <div>（{{ useCount }}份）：</div>
            </div>
            <div>
              <!-- 币套餐-->
              <template v-if="item.type === 1">
                {{ item.coinNum * useCount }}本币，{{ item.awardCoinNum * useCount }}赠币，共{{
                  (item.coinNum + item.awardCoinNum) * useCount
                }}币
              </template>
              <!--  时间套餐-->
              <template v-if="item.type === 2">
                {{ getPkgOverTime(item) }}
              </template>
              <!-- 次票套餐  -->
              <template v-if="item.type === 3"> {{ item.useNum }}次,{{ getPkgOverTime(item) }}</template>
            </div>
          </div>
          <div>
            <el-button type="primary" style="width: 120px" @click="handleShowConfirmModal">确认核销</el-button>
            <el-button type="info" style="width: 120px" @click="clearGoodsInfo">取消</el-button>
          </div>
        </template>
      </el-col>
    </el-row>
    <scan-code v-model="showScanModal" @on-success="handleOnScanSuccess" lable="嗨呗核销"></scan-code>
    <el-dialog
      :visible.sync="showScanUserInfoModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :width="getdefaultScreenSize > 1400 ? '30%' : '40%'"
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
        确认核销
      </div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div class="dialog-tip">确认后将绑定套餐下发至玩家中心</div>
          <div class="dialog-tip">个人账户，请确定是否核销？</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="flex-center">
          <el-button type="primary" style="width: 100px" :loading="loading" @click="closeScanUserInfoModal"
            >确认
          </el-button>
          <el-button
            type="info"
            style="width: 100px; margin-left: 100px"
            :loading="loading"
            @click="showScanUserInfoModal = false"
            >取 消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { to } from '@/utils/tools';

export default {
  name: 'validation',
  data() {
    return {
      loading: false,
      getDataMode: 1, // 1 扫码 | 2 手动输入
      showScanModal: false,
      validateCode: '', // 扫码获得的核销二维码
      validateNumberCode: '', // 手动输入的数字码
      goodsInfo: {
        _id: null,
        uid: null,
        goodsName: '',
        specificationName: '',
        count: 0,
        alreadyUseCount: 0,
      },
      useCount: 1,
      showPackageDetail: false,
      coinType: 1,
      pkgDetail: [],
      sendCoinNum: 0,
      showScanUserInfoModal: false,
    };
  },
  computed: {
    showCoinTypeRadio() {
      return this.pkgDetail.some((item) => item.type === 1);
    },
    getdefaultScreenSize() {
      return this.$store.state.defaultScreenSize;
    },
  },
  methods: {
    getPkgOverTime(item) {
      let resultText = '';
      switch (item.overGiftType) {
        case 1:
          resultText = `核销后${item.overGiftTime}天后过期`;
          break;
        case 2:
          resultText = `核销后${item.overGiftTime}个月过期`;
          break;
        case 3:
          resultText = `${item.overGiftTime}过期`;
          break;
        case 4:
          resultText = '不过期';
          break;
        default:
          resultText = '过期时间未知';
      }
      return resultText;
    },
    async handleGetPkgDetail() {
      this.loading = true;
      const [err, res] = await to(this.$api.getLeagueCodeGiftInfo({ orderId: this.goodsInfo.orderId }));
      this.loading = false;
      if (res) {
        this.pkgDetail = res.body.giftInfoList;
        this.getTotalCoinNum();
        this.showPackageDetail = true;
      }
    },
    // 打开核销二次确认弹窗
    handleShowConfirmModal() {
      if (this.coinType === 1 && !this.$store.state.connectPort) {
        this.$message.error('没有发现吐币机，请连接吐币机后点击重置机台');
        return;
      }
      this.showScanUserInfoModal = true;
      // this.$confirm('确认后将绑定套餐下发至玩家个人中心账户，请确认是否核销？', '确认核销', {
      //   confirmButtonText: '确定',
      //   type: 'warning'
      // })
      //   .then(async () => {
      //     const params = {
      //       exchangeType: this.getDataMode === 1 ? 1 : 2,
      //       leagueId: this.goodsInfo.leagueId,
      //       orderId: Number(this.goodsInfo.orderId),
      //       count: this.useCount,
      //       coinType: this.coinType
      //     }
      //     if (this.getDataMode === 2) {
      //       params.code = Number(this.goodsInfo.code)
      //     }
      //     this.loading = true
      //     const [err, res] = await to(this.$api.checkLeagueCode(params))
      //     this.loading = false
      //     if (err) {
      //       if (err.errMsg === '用户不是门店会员，需进入玩家中心成为会员后，才能核销。') {
      //         this.$alert(err.errMsg, '提示')
      //           .then((res) => {
      //             this.clearGoodsInfo()
      //           })
      //           .catch((e) => {})
      //       }
      //     }
      //     if (res) {
      //       this.$message.success('核销成功')
      //       if (this.showCoinTypeRadio && this.coinType === 1) {
      //         this.$root.$children[0].sendCoin(this.sendCoinNum)
      //         this.sendCoinNum = 0
      //       }
      //       this.clearGoodsInfo()
      //     }
      //   })
      //   .catch((e) => {})
    },
    // 确认核销
    async closeScanUserInfoModal() {
      const params = {
        exchangeType: this.getDataMode === 1 ? 1 : 2,
        leagueId: this.goodsInfo.leagueId,
        orderId: Number(this.goodsInfo.orderId),
        count: this.useCount,
        coinType: this.coinType,
      };
      if (this.getDataMode === 2) {
        params.code = Number(this.goodsInfo.code);
      }
      this.loading = true;
      const [err, res] = await to(this.$api.checkLeagueCode(params));
      this.loading = false;
      if (err) {
        this.showScanUserInfoModal = false;
        if (err.errMsg === '用户不是门店会员，需进入玩家中心成为会员后，才能核销。') {
          this.$alert(err.errMsg, '提示')
            .then((res) => {
              this.clearGoodsInfo();
            })
            .catch((e) => {});
        }
      }
      if (res) {
        this.showScanUserInfoModal = false;
        this.$message.success('核销成功');
        if (this.showCoinTypeRadio && this.coinType === 1) {
          this.$root.$children[0].sendCoin(this.sendCoinNum);
          this.sendCoinNum = 0;
        }
        this.clearGoodsInfo();
      }
    },
    // 计数器失去焦点
    handleInputNumberBlur() {
      if (!this.useCount) this.useCount = 1;
    },
    // 计算总计需要出多少币
    getTotalCoinNum() {
      this.sendCoinNum = 0;
      this.pkgDetail.forEach((item) => {
        if (item.type === 1) {
          this.sendCoinNum += (item.coinNum + item.awardCoinNum) * this.useCount;
        }
      });
    },
    // 打开扫码弹窗
    handleOpenScanModal() {
      if (this.loading) return;
      this.showScanModal = true;
    },
    parseQuery(query) {
      const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
      const obj = {};
      while (reg.exec(query)) obj[RegExp.$1] = RegExp.$2;
      return obj;
    },
    // 扫码完成
    handleOnScanSuccess(code) {
      let query;
      try {
        query = this.parseQuery(code.split('?')[1]);
      } catch (e) {
        this.$message.error('该二维码无效，请重新扫码');
        return;
      }
      if (!query || !query.orderId || isNaN(query.orderId)) {
        this.$message.error('错误的二维码，请重新扫码');
        return;
      }
      this.clearGoodsInfo();
      this.validateCode = query.orderId;
      this.getDataMode = 1;
      this.handleGetInfo();
    },
    // 输入完成点击查询
    handleInputComplete() {
      if (isNaN(this.validateNumberCode)) {
        this.$message.error('请输入正确的数字');
        return;
      }
      const validateNumberCode = this.validateNumberCode;
      this.clearGoodsInfo();
      this.validateNumberCode = validateNumberCode;
      this.getDataMode = 2;
      this.handleGetInfo();
    },
    // 清空数据
    clearGoodsInfo() {
      this.showPackageDetail = false;
      this.getDataMode = 1;
      this.validateCode = '';
      this.validateNumberCode = '';
      this.useCount = 1;
      this.coinType = 1;
      this.goodsInfo = {
        _id: null,
        uid: null,
        goodsName: '',
        specificationName: '',
        count: 0,
        alreadyUseCount: 0,
      };
      this.pkgDetail = [];
      this.sendCoinNum = 0;
    },
    // 获取套餐信息
    async handleGetInfo() {
      if (!this.validateCode && !this.validateNumberCode) {
        return;
      }
      this.showPackageDetail = false;
      this.useCount = 1;
      this.loading = true;
      const params = {
        [this.getDataMode === 1 ? 'orderId' : 'code']:
          this.getDataMode === 1 ? Number(this.validateCode) : Number(this.validateNumberCode),
      };
      const [err, res] = await to(this.$api.getCodeInfo(params));
      this.loading = false;
      if (err) {
        this.clearGoodsInfo();
      }
      if (res) {
        if (res.body.count === 0) {
          this.$message.error('该核销码已核销');
          this.clearGoodsInfo();
          return;
        }
        const result = { ...res.body };
        if (this.getDataMode === 2) {
          result.code = Number(this.validateNumberCode);
        }
        this.goodsInfo = result;
      }
    },
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
.validation {
  .scan-button {
    user-select: none;
    cursor: pointer;
    background-color: #409eff;
    color: #ffffff;
    width: 360px;
    text-align: center;
    box-sizing: border-box;
    padding: 18px 0;
  }

  .cell-item {
    @extend .flex-between;
    padding: 24px 0;
    border-bottom: 1px solid #e4e7ed;
  }

  .text-item {
  }
}
.validation-el-col {
  padding: 24px 80px 0 80px;
  border-right: 1px solid #8a8a8a;
  box-sizing: border-box;
}
.writing-style {
  color: #787879;
  padding-top: 40px;
}
.hb-exclusive {
  width: 244px;
  height: 123px;
  margin-top: 35px;
  margin-bottom: 35px;
}
.hb-button-style {
  width: 270px;
  height: 42px;
  text-align: center;
  background: #4194fe;
  border-radius: 10px;
  line-height: 42px;
  font-size: 16px;
  color: white;
}
.flex-warp1 {
  flex-wrap: wrap;
}
.dialog-tip {
  font-size: 21px;
  color: #616161;
  line-height: 32px;
}
</style>
