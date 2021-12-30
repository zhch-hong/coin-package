<template>
  <div class="sub-page-flex">
    <el-row>
      <el-col :span="7">
        <div class="user-content">
          <el-form style="width: 100%; padding: 40px 20px 0 60px" @submit.native.prevent :inline="false">
            <div class="bc-title">会员信息：</div>
            <img src="@/assets/scan-user.png" alt="" style="width: 184px; margin: 60px 0 60px 40px" />
            <el-form-item label="">
              <el-input
                v-model="uid"
                @input="cancelSearch"
                @clear="cancelSearch"
                clearable
                style="width: 224px"
                placeholder="点击输入会员ID"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                style="width: 120px; font-size: 15px"
                :loading="loading"
                @click="handleSearchUser"
                >确 定
              </el-button>
            </el-form-item>
            <p>会员ID：{{ userInfo.uid }}</p>
            <p>游戏币数：{{ userCoin }}</p>
            <p>积分数：{{ userStarCoin }}</p>
          </el-form>
        </div>
      </el-col>
      <el-col :span="17">
        <el-row>
          <el-col :span="8">
            <el-form ref="putCoin" style="padding: 40px 20px 0 60px" @submit.native.prevent label-position="top">
              <div class="bc-title">手动补游戏币/积分/彩票：</div>
              <el-form-item label="补游戏币" style="margin-top: 40px">
                <el-input v-model="putCoin" style="width: 210px" placeholder="请输入补游戏币数量"></el-input>
              </el-form-item>
              <el-form-item label="备注" :rules="{ required: true, message: '请输入备注' }">
                <el-input
                  v-model="putCoinRemark"
                  :maxlength="50"
                  style="width: 210px"
                  placeholder="请输入备注"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  style="width: 120px; font-size: 15px"
                  :loading="loading"
                  @click="openAuthModal(1)"
                  >确 定
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form
              style="padding: 20px 50px 0"
              ref="putStar"
              label-position="top"
              @submit.native.prevent
              :inline="false"
            >
              <h4><br /></h4>
              <br />
              <el-form-item label="补积分">
                <el-input v-model="putStar" style="width: 210px" placeholder="请输入补积分数量"></el-input>
              </el-form-item>
              <el-form-item label="备注" :rules="{ required: true, message: '请输入备注' }">
                <el-input
                  v-model="putStarRemark"
                  :maxlength="50"
                  style="width: 210px"
                  placeholder="请输入备注"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  style="width: 120px; font-size: 15px"
                  :loading="loading"
                  @click="openAuthModal(2)"
                >
                  确 定
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form
              style="padding: 20px 50px 0"
              ref="putTicket"
              label-position="top"
              @submit.native.prevent
              :inline="false"
            >
              <h4><br /></h4>
              <br />
              <el-form-item label="补彩票">
                <el-input
                  v-model="putTicket"
                  style="width: 210px"
                  placeholder="请输入补彩票数量"
                  :maxlength="6"
                ></el-input>
                <p>
                  需扣除门店积分<span style="color: red; margin-left: 6px">{{ deductScore }}</span>
                </p>
              </el-form-item>
              <el-form-item label="备注" :rules="{ required: true, message: '请输入备注' }">
                <el-input
                  v-model="putTicketRemark"
                  :maxlength="50"
                  style="width: 210px"
                  placeholder="请输入备注"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  style="width: 120px; font-size: 15px"
                  :loading="loading"
                  @click="openAuthModal(3)"
                >
                  确 定
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <staffAuth :show.sync="showAuthModal" @success="authSuccess"></staffAuth>
  </div>
</template>

<script>
import { isPositiveInt, isNumber, isPositiveFloat, isPhone } from '../../../utils/validate';

import { to } from '../../../utils/tools';
import StaffAuth from '../../../components/StaffAuth';

export default {
  name: 'store',
  components: {
    StaffAuth,
  },
  data() {
    return {
      loading: false,
      uid: '',
      userInfo: {},
      hasFind: false,
      userCoin: 0,
      userStarCoin: 0,
      putCoin: '',
      putCoinRemark: '',
      putStar: '',
      putStarRemark: '',
      putTicket: '',
      putTicketRemark: '',
      type: 1, // 1补游戏币，2补积分，3补彩票
      showAuthModal: false,
    };
  },

  computed: {
    /** 补彩票需要扣除的门店积分 */
    deductScore() {
      return this.putTicket * this.$store.state.ticketScale;
    },
  },

  methods: {
    // 员工授权成功
    authSuccess(data) {
      this.addCoin(data);
    },
    // 查询用户信息
    async handleSearchUser() {
      this.loading = true;
      let err;
      let userCoin;
      let getUserInfo;
      [err, userCoin] = await to(this.$api.getUserCoin({ uid: this.uid }));
      [err, getUserInfo] = await to(this.$api.getUserInfo({ uid: this.uid }));
      if (!err) {
        this.userCoin = userCoin.body.userCoin;
        this.userStarCoin = getUserInfo.body.starCoinNum;
        this.userInfo = getUserInfo.body;
        this.hasFind = true;
      }
      this.loading = false;
    },
    // 删除 ，清空uid
    cancelSearch() {
      this.hasFind = false;
      this.userCoin = this.userStarCoin = 0;
    },
    // 打开授权弹窗
    openAuthModal(type) {
      if (!this.hasFind) {
        this.$message.error('请先查询正确的玩家信息');
        return;
      }
      if (type === 1) {
        if (!isPositiveInt.test(this.putCoin)) {
          this.$message.error('请输入正确的游戏币数量');
          return;
        }
        if (!this.putCoinRemark) {
          this.$message.error('请输入备注');
          return;
        }
      }
      if (type === 2) {
        if (!isPositiveFloat.test(this.putStar) || this.putStar <= 0) {
          this.$message.error('请输入正确的积分数量');
          return;
        }
        if (!this.putStarRemark) {
          this.$message.error('请输入备注');
          return;
        }
      }
      if (type === 3) {
        if (!isPositiveFloat.test(this.putTicket) || this.putTicket <= 0) {
          this.$message.error('请输入正确的彩票数量');
          return;
        }
        if (!this.putTicketRemark) {
          this.$message.error('请输入备注');
          return;
        }
      }
      this.type = type;
      this.showAuthModal = true;
    },
    // 开始加币
    addCoin(data) {
      if (this.type === 1) {
        this.loading = true;
        this.$api
          .addGameCoin({
            ...data,
            uid: this.userInfo.uid,
            addNum: Number(this.putCoin),
            backup: this.putCoinRemark,
          })
          .then((res) => {
            this.$message.success('补游戏币成功');
            this.addSuccess();
          })
          .finally((result) => {
            this.loading = false;
          });
      }

      if (this.type === 2) {
        this.loading = true;
        this.$api
          .addStarCoin({
            ...data,
            uid: this.uid,
            addNum: Number(this.putStar),
            backup: this.putStarRemark,
          })
          .then((res) => {
            this.$message.success('补积分成功');
            this.addSuccess();
          })
          .finally((result) => {
            this.loading = false;
          });
      }

      if (this.type === 3) {
        this.loading = true;
        this.$api
          .addGameTicket({
            ...data,
            uid: this.uid,
            addNum: Number(this.putTicket),
            backup: this.putTicketRemark,
          })
          .then((res) => {
            this.$message.success('补彩票成功');
            this.addSuccess();
          })
          .finally((result) => {
            this.loading = false;
          });
      }
    },

    addSuccess() {
      clearInterval(this.timer);
      this.handleSearchUser();
      this.putCoin = '';
      this.putStar = '';
      this.putTicket = '';
      this.userInfo = {};
      this.hasFind = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-content {
  height: 800px;

  .el-divider--vertical {
    height: 120px;
    top: 90px;
  }
}

.auth-container {
  @include flex(center, center, row);
  height: 400px;

  .left {
    width: 50%;
  }

  .right {
    @include flex(center, center, column);
    text-align: center;
    border-left: 1px solid #dcdfe6;
    width: 50%;
  }
}
</style>
