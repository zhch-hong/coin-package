<template>
  <video ref="carouselVideo" width="100%" height="100%" autoplay muted :src="source"></video>
</template>
<script>
import { readFile } from '@utils/ad';

export default {
  props: {
    url: String,
  },

  data() {
    return {
      source: null,
    };
  },

  async mounted() {
    console.log('mounted');
    await this.$nextTick();
    const v = this.$refs.carouselVideo;
    this.read();
    // v.addEventListener('ended', () => {
    //   this.$emit('complete');
    // });
  },

  methods: {
    read() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        const source = readFile(this.url);
        console.log(this.url);
        this.source = source;
      }, 500);
    },
  },
};
</script>
