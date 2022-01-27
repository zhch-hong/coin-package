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

  async mounted() {
    await this.$nextTick();
    const video = this.$refs.carouselVideo;
    video.addEventListener('ended', () => {
      this.$emit('complete');
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
