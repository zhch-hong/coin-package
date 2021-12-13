<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7">
        <div class="user-content">
          <el-form style="width: 100%; padding: 20px 20px 0 20px" :inline="false">
            <h4>会员信息：</h4>
            <br />
            <el-form-item label="">
              <el-input :maxlength="8" v-model="uid" clearable size="mini" style="width: 140px" placeholder="点击输入会员ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" style="width: 96px" :loading="loading" @click="handleSearchUser">确 定 </el-button>
            </el-form-item>
            <span>会员ID：{{ uid }}</span
            ><br /><br />
            <span>游戏币数：{{ userCoin }}</span>
          </el-form>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="user-content" v-if="userCoin !== '0'">
          <el-form style="width: 100%; padding: 20px 20px 0 20px" :inline="false">
            <h4>会员提币</h4>
            <br />
            <el-form-item label="">
              <el-input v-model="getNum" clearable size="mini" style="width: 140px" placeholder="请输入提币数量"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" style="width: 96px" :loading="loading" @click="userGetCoin">确 定 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { isPositiveInt } from '../../../utils/validate'
import { getToken } from '../../../utils/auth'

export default {
  name: 'store',
  components: {},
  data() {
    return {
      loading: false,
      uid: '',
      userCoin: 0,
      getNum: 0
    }
  },
  methods: {
    userGetCoin() {
      if (!isPositiveInt.test(this.getNum)) {
        this.$message.error('请输入正确的游戏币')
        return
      }
      if (this.getNum > this.userCoin) {
        this.$message.error('玩家剩余游戏币不足')
        return
      }
      if (!this.$store.state.connectPort) {
        this.$message.error('没有连接机台，无法提币')
        return
      }
      this.loading = true
      this.$api
        .userGetCoin({ uid: this.uid, getNum: this.getNum })
        .then((res) => {
          this.$message.success(`玩家 ${this.uid} 提币  ${this.getNum} 成功`)
          this.uid = ''
          this.$root.$children[0].sendCoin(this.getNum)
          this.userCoin = this.getNum = 0
        })
        .finally((f) => {
          this.loading = false
        })
    },
    handleSearchUser() {
      if (!isPositiveInt.test(this.uid)) {
        this.$message.error('请输入正确的会员ID')
        return
      }
      this.loading = true
      this.$api.getUserCoin({ uid: this.uid }).then((res) => {
        this.userCoin = this.getNum = res.body.userCoin
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.user-content {
  background-color: #ffffff;
  height: 885px;
}
</style>
