<template>
  <video
    ref="carouselVideo"
    class="carousel-video"
    width="100%"
    height="100%"
    autoplay
    muted
    :loop="isLoop"
    :src="source"
  ></video>
</template>
<script>
import { readFile } from '@utils/ad';

export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    isLoop: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      source: null,
    };
  },

  watch: {
    src: {
      immediate: true,
      handler: 'complete',
    },
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
    const video = this.$refs.carouselVideo;
    video.addEventListener('ended', () => {
      this.$emit('complete');

      // 当广告资源只有一个视频文件时，需要重复播放
      this.timer = setTimeout(() => {
        v.play();
      }, 500);
    });
  },

  methods: {
    async complete() {
      if (this.src === '') return;

      const source = await readFile(this.src);
      this.source = source;
    },
  },
};
</script>
<style lang="scss" scoped>
.carousel-video {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
