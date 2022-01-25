<template>
  <div class="carousel-image" :style="{ 'background-image': image }"></div>
</template>
<script>
export default {
  props: {
    url: String,
  },

  computed: {
    image() {
      return `url('${this.url}')`;
    },
  },

  mounted() {
    setTimeout(() => {
      this.$emit('complete');
    }, 10000);
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
