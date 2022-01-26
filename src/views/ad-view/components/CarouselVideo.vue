<template>
  <video ref="carouselVideo" width="100%" height="100%" autoplay muted loop :src="url"></video>
</template>
<script>
export default {
  props: {
    url: String,
  },

  async mounted() {
    await this.$nextTick();
    const v = this.$refs.carouselVideo;
    v.addEventListener('ended', () => {
      this.$emit('complete');
    });
  },
};
</script>
