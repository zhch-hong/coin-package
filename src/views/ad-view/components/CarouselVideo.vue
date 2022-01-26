<template>
  <video ref="carouselVideo" style="display: block" width="100%" height="100%" autoplay muted :src="source"></video>
</template>
<script>
import { readFile } from '@utils/ad';

export default {
  props: {
    src: {
      type: String,
      default: '',
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
      handler: 'read',
    },
  },

  async mounted() {
    console.log('video mounted');
    await this.$nextTick();
    const video = this.$refs.carouselVideo;
    video.addEventListener('ended', () => {
      this.$emit('complete');
      this.timer = setTimeout(() => {
        video.play();
      }, 20);
    });
  },

  beforeDestroy() {
    clearTimeout(this.timer);
  },

  methods: {
    async read() {
      if (this.src === '') return;

      const source = await readFile(this.src);
      this.source = source;
    },
  },
};
</script>
