<template>
  <div class="base-info">
    <el-row :gutter="40">
      <el-col :span="12" class="flex">
        <span>会员头像：</span>
        <img style="width: 36px" :src="baseInfo.photo"/>
      </el-col>
      <el-col :span="12" class="flex">
        <span>会员照片:</span>
        <el-button v-if="!getRealPhoto" size="small" type="primary" @click="showModal=true">点击录入人脸</el-button>
        <el-image v-else fit="cover" style="width: 36px" :src="getRealPhoto"/>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="12" class="flex">
        <span>姓名：</span>
        <span>{{ baseInfo.realName }}</span>
      </el-col>
      <el-col :span="12" class="flex">
        <span>性别:</span>
        <span>{{ baseInfo.sex | formatSex }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="12" class="flex">
        <span>手机号码：</span>
        <span>{{ baseInfo.phone }}</span>
      </el-col>
      <el-col :span="12" class="flex">
        <span>出生日期:</span>
        <span>{{ baseInfo.birthday }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="12" class="flex">
        <span>本币余额：</span>
        <span>{{ baseInfo.userCoin }}</span>
      </el-col>
      <el-col :span="12" class="flex">
        <span>赠币余额:</span>
        <span>{{ baseInfo.userSendCoin }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="12" class="flex">
        <span>通讯地址：</span>
        <span>{{ baseInfo.address }}</span>
      </el-col>
      <el-col :span="12" class="flex">
        <span>会员有效期时间:</span>
        <span>{{ baseInfo.endTime === 0 ? '无限期' : baseInfo.endTime }}</span>
      </el-col>
    </el-row>
    <input-information :show-modal="showModal" :base-info=baseInfo @on-close="handleOnClose"></input-information>
  </div>
</template>

<script>
import TakePhoto from './components/take-photo'
import inputInformation from './components/input-information'

export default {
  name: "BaseInfo",
  components: {TakePhoto, inputInformation},
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      baseInfo: {}
    }
  },
  computed: {
    getRealPhoto() {
      if (this.baseInfo.realPhotoInfo && this.baseInfo.realPhotoInfo.length) {
        return this.baseInfo.realPhotoInfo.find(item => item.isSelf).photo
      }
      return ''
    },
  },
  filters: {
    formatSex(val) {
      switch (val) {
        case 0:
          return '未知'
        case 1:
          return '男'
        case 2:
          return '女'
      }
    }
  },
  watch: {
    userInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.uid) {
          this.getUserInfo()
        }
      }
    }
  },
  methods: {
    handleOnClose(info) {
      this.showModal = false
      if (info) {
        this.baseInfo.realPhotoInfo = info
      }
    },
    async getUserInfo() {
      const res = await this.$api.getUserBaseInfo({uid: this.userInfo.uid})
      this.baseInfo = res.body
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin";

.base-info {
  margin-top: 24px;

  .flex {
    border-bottom: 1px solid #f2f6fc;
    @include flex(space-between, center, row);
    height: 48px;

    &:nth-child(2n) {
      border-left: 1px solid #f2f6fc;
    }

    img {
      border-radius: 8px;
    }
  }
}
</style>