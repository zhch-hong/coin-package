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
          /**
           * 直接将返回结果赋值给carouselData会有两个问题
           * 1、当广告资源只有一个视频时，播放完后便停止了，没有循环播放
           * 2、当广告只有两个时，第二个播放完毕后会回退到第一个
           * 所以这里做了一下重复操作，保证列表里的资源至少在3个以上
           */
          const list = [...body.resUrlList];
          if (list.length <= 2) {
            list.push(...body.resUrlList, ...body.resUrlList);
          }

          this.carouselData = list;
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
      if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')) {
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
