<template>
  <div>
    <template v-if="isDefault">
      <div class="default-ad-image"></div>
    </template>
    <template v-else>
      <el-carousel
        ref="carousel"
        :autoplay="false"
        height="100vh"
        indicator-position="none"
        arrow="never"
        @change="onCarouselChange"
      >
        <el-carousel-item v-for="item in carouselData" :key="item">
          <component :is="currentComponent" :url="item" @complete="onComplete"></component>
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>
<script>
import $api from '@/api';

import CarouselImage from './components/CarouselImage.vue';
import CarouselVideo from './components/CarouselVideo.vue';

export default {
  data() {
    return {
      isDefault: true,
      carouselData: [],
      currentComponent: null,
    };
  },

  created() {
    this.fetchCarousel();
  },

  methods: {
    async fetchCarousel() {
      const { key } = this.$route.query;
      const { body, errCode } = await $api.readModuleAd(key);
      if (errCode === 0) {
        const { resUrlList } = body;
        this.isDefault = resUrlList.length === 0;
        await this.$nextTick();
        if (!this.isDefault) {
          this.carouselData = body.resUrlList;
          await this.$nextTick();
          this.onCarouselChange(0);
        }
      }
    },

    async onCarouselChange(index) {
      // 防止组件复用，连续相同类型的资源只播放第一个，后面的相同类型的资源被跳过
      this.currentComponent = null;
      await this.$nextTick();

      let url = this.carouselData[index];
      url = url.toLowerCase();
      if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
        this.currentComponent = CarouselImage;
      } else if (url.endsWith('.mp4')) {
        this.currentComponent = CarouselVideo;
      } else {
        this.currentComponent = null;
      }
    },

    onComplete() {
      this.$refs.carousel.next();
    },
  },
};
</script>
<style lang="scss" scoped>
.default-ad-image {
  height: 100vh;
  background: url('../../assets/default-image.png') center/contain no-repeat;
}
</style>
