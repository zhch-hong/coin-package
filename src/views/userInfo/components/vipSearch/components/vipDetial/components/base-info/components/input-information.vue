<template>
  <div>
    <el-dialog
        title="信息录入"
        top="8vh"
        append-to-body
        :close-on-click-modal="false"
        :show-close="false"
        width="630px"
        :visible.sync="show">
      <div class="input-information">
        <el-form label-width="80px">
          <div class="item" v-for="(item,index) in infoList" :key="index">
            <div class="left">
              <el-form-item label="姓名">
                <el-input style="width: 300px;" placeholder="请输入姓名" v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="生日">
                <el-date-picker
                    style="width: 300px;"
                    v-model="item.birthday"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="item.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-image :src="item.photo" fit="cover" style="width: 185px;height: 185px;"
                      @click.native="handleOnTakePhoto(index)">
              <div slot="error" :style="imgStyle">点击录入人脸信息</div>
            </el-image>
          </div>
          <el-form-item>
            <el-button :disabled="infoList.length>=3" type="primary" @click="handleOnAddInfo">添加信息</el-button>
            <el-button :disabled="infoList.length<=1" @click="handleOnRemoveInfo">撤销</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="$emit('on-close')">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleOnSave">确认</el-button>
      </div>
    </el-dialog>
    <take-photo :show-modal="showTakePhotoModal" @on-close="handleOnCloseModal"></take-photo>
  </div>
</template>

<script>
import TakePhoto from './take-photo'

export default {
  name: "InputInformation",
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    baseInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    TakePhoto
  },
  data() {
    return {
      test: '',
      loading: false,
      showTakePhotoModal: false,
      currentIndex: 0,
      show: false,
      infoList: [{
        name: '',
        sex: 1,
        birthday: '',
        photo: '',
        isSelf: 1
      }]
    }
  },
  computed: {
    imgStyle() {
      return {
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F6FC',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  },
  watch: {
    showModal: {
      handler(val) {
        if (val) {
          if (this.baseInfo.realPhotoInfo.length) {
            this.infoList = this.baseInfo.realPhotoInfo
          }
          this.loading = false
          this.showTakePhotoModal = false
          this.currentIndex = 0
          this.show = false
        }
        this.show = val
      }
    }
  },
  methods: {
    handleOnTakePhoto(index) {
      this.currentIndex = index;
      this.showTakePhotoModal = true
    },
    handleOnCloseModal(img) {
      this.showTakePhotoModal = false
      if (!img) return
      this.loading = true
      let file = this.dataURLToFile(img, `img_${this.currentIndex}`)
      let formData = new FormData();
      formData.append("file", file);
      formData.append('type', 1)
      this.$api.upload(formData).then(res => {
        this.infoList[this.currentIndex].photo = res.body.fileLists[0].imgPath;
      }).finally(f => {
        this.loading = false
      })
    },
    handleOnRemoveInfo() {
      if (this.infoList.length > 1) {
        this.infoList.splice(this.infoList.length - 1, 1)
      }
    },
    handleOnSave() {
      let flag
      flag = this.infoList.find(item => {
        return !item.name || !item.birthday || !item.photo
      })
      if (flag) {
        this.$message.error('请完善会员信息')
        return
      }
      this.loading = true
      this.$api.editRealPhotoInfo({realPhotoInfo: this.infoList, uid: this.baseInfo.uid})
          .then(res => {
            this.$message.success('保存成功')
            this.$emit('on-close', this.infoList)
          })
          .finally(f => {
            this.loading = false
          })
    },
    // base64 转 file
    dataURLToFile(dataurl, name) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], name, {type: mime});
    },
    handleOnAddInfo() {
      this.infoList.push({
        name: '',
        sex: 1,
        birthday: '',
        photo: '',
        isSelf: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.input-information {
  .item {
    @include flex(space-between, center, row);
    margin-top: 20px;

  }
}
</style>