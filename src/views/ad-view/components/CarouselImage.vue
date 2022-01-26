<template>
  <div class="carousel-image" :style="{ 'background-image': image }"></div>
</template>
<script>
export default {
  props: {
    src: String,
  },

  computed: {
    image() {
      return `url('${this.src}')`;
    },
  },

  mounted() {
    console.log('mounted image');
    setTimeout(() => {
      this.$emit('complete');
    }, 5000);
  },
};
</script>
<style lang="scss" scoped>
.carousel-image {
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
