<template>
  <div class="sub-page-flex">
    <el-row>
      <el-col :span="12">
        <div class="user-content">
          <el-form style="width: 100%; padding: 40px 20px 0 60px" @submit.native.prevent :inline="false">
            <div class="bc-title">会员信息：</div>
            <img src="@/assets/scan-user.png" alt="" style="width: 184px; margin: 60px 0 60px 40px" />
            <el-form-item label="">
              <el-input v-model="userId" clearable style="width: 224px" placeholder="点击输入会员ID"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 40px">
              <el-button
                type="primary"
                size="mini"
                style="width: 108px; font-size: 15px; border-radius: 10px; margin-left: 55px"
                :loading="loading"
                @click="handleSearchUser"
                >确 定
              </el-button>
            </el-form-item>
            <div
              style="
                font-size: 17px;
                color: #3d3d3e;
                font-weight: 500;
                line-height: 28px;
                margin-top: 40px;
                padding-left: 55px;
              "
            >
              <div>会员ID：{{ uid }}</div>
              <div>游戏币数：{{ userCoin }}</div>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="user-content" v-if="userCoin !== '0'">
          <el-form style="width: 100%; padding: 40px 20px 0 60px" :inline="false">
            <div class="bc-title">会员提币：</div>
            <el-form-item label="" style="margin-top: 40px">
              <el-input v-model="getNum" clearable style="width: 263px" placeholder="请输入提币数量"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 40px">
              <el-button
                type="primary"
                size="mini"
                style="width: 108px; font-size: 15px; border-radius: 10px"
                :loading="loading"
                @click="userGetCoin"
                >确 定
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { isPositiveInt } from '../../../utils/validate';

export default {
  name: 'store',
  components: {},
  data() {
    return {
      userId: '',
      loading: false,
      uid: '',
      userCoin: 0,
      getNum: 0,
    };
  },
  methods: {
    userGetCoin() {
      if (!isPositiveInt.test(this.getNum)) {
        this.$message.error('请输入正确的游戏币');
        return;
      }
      if (this.getNum > this.userCoin) {
        this.$message.error('玩家剩余游戏币不足');
        return;
      }
      if (!this.$store.state.connectPort) {
        this.$message.error('没有连接机台，无法提币');
        return;
      }
      this.loading = true;
      this.$api
        .userGetCoin({ uid: this.userId, getNum: this.getNum })
        .then((res) => {
          this.$message.success(`玩家 ${this.uid} 提币  ${this.getNum} 成功`);
          this.userId = this.uid = '';
          this.$root.$children[0].sendCoin(this.getNum);
          this.userCoin = this.getNum = 0;
        })
        .finally((f) => {
          this.loading = false;
        });
    },
    handleSearchUser() {
      this.loading = true;
      this.$api
        .getUserCoin({ uid: this.userId })
        .then((res) => {
          this.userCoin = this.getNum = res.body.userCoin;
          this.uid = res.body.uid;
        })
        .finally((f) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.user-content {
}
</style>
