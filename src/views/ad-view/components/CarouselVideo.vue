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
import { readFile } from '@/utils/extend-screen';

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

  async mounted() {
    await this.$nextTick();
    const video = this.$refs.carouselVideo;
    video.addEventListener('ended', () => {
      this.$emit('complete');
    });
  },

  activated() {
    // 因为做了缓存，当从商品列表页切换到广告时，视频是处于暂停状态的，所以需要调用播放
    const video = this.$refs.carouselVideo;
    video.play();
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
