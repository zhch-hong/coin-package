<template>
  <video ref="carouselVideo" width="100%" height="100%" autoplay muted :src="url"></video>
</template>
<script>
export default {
  props: {
    url: String,
  },

  data() {
    return {
      timer: null,
    };
  },

  beforeDestroy() {
    // 当广告资源不止一个时，那么在切换广告时，组件销毁前需要清除定时器
    clearTimeout(this.timer);
  },

  async mounted() {
    await this.$nextTick();
    const v = this.$refs.carouselVideo;
    v.addEventListener('ended', () => {
      this.$emit('complete');

      // 当广告资源只有一个视频文件时，需要重复播放
      this.timer = setTimeout(() => {
        v.play();
      }, 500);
    });
  },
};
</script>
