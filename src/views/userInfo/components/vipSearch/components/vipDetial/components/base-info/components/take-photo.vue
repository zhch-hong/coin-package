<template>
  <el-dialog
      title="人脸录入"
      append-to-body
      width="440px"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="show">
    <div class="contain">
      <video id="video" width="400px" height="400px" autoplay="autoplay"></video>
      <canvas v-show="false" id="canvas" width="400px" height="400px"></canvas>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="takePhoto">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "take-photo",
  props: {
    showModal: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      show: false,
      video: null,
      mediaStreamTrack: null,
      imgUrl: ''
    }
  },
  watch: {
    showModal: {
      handler(val) {
        this.show = val
        if (val) {
          this.$nextTick(() => {
            this.initCamera()
          })
        }
      }
    }
  },
  methods: {
    takePhoto() {
      let video = document.getElementById('video');
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 500, 500);
      let img = canvas.toDataURL();
      this.imgUrl = img
      this.$emit('on-close', img)
    },
    initCamera() {
      let constraints = {
        video: {width: 500, height: 500},
        audio: false
      };
      //获得video摄像头
      this.video = document.getElementById('video');
      let promise = navigator.mediaDevices.getUserMedia(constraints);
      promise.then((mediaStream) => {
        this.mediaStreamTrack = mediaStream.getVideoTracks()
        this.video.srcObject = mediaStream;
        this.video.play();
      }).catch(e => {
        this.$message.error('未检测到摄像头')
        this.$emit('on-close')
      });
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin';

.contain {

  .right {
    margin-left: 20px;
    @include flex(flex-start, center, column);
  }
}
</style>