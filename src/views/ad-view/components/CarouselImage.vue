<template>
  <div class="carousel-image" :style="{ 'background-image': `url('${src}')` }"></div>
</template>
<script>
import _ from 'lodash';

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

  watch: {
    src: {
      immediate: true,
      handler(value) {
        if (value === '') return;

        if (!this.isLoop) {
          const { $emit } = this;
          _.delay($emit.bind(this), 10000, 'complete');
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
