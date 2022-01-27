<template>
  <div style="position: relative; height: 100vh; overflow: hidden">
    <template v-if="isDefault">
      <div class="default-ad-image"></div>
    </template>
    <template v-else>
      <transition name="fade" appear>
        <template v-for="url in adList">
          <template v-if="isVideo(url)">
            <CarouselVideo v-if="current === url" :key="url" :src="url" :is-loop="isLoop" @complete="onComplete" />
          </template>
          <template v-else>
            <CarouselImage v-if="current === url" :key="url" :src="url" :is-loop="isLoop" @complete="onComplete" />
          </template>
        </template>
      </transition>
    </template>
  </div>
</template>
<script>
import $api from '@/api';

import CarouselImage from './components/CarouselImage.vue';
import CarouselVideo from './components/CarouselVideo.vue';

export default {
  components: {
    CarouselImage,
    CarouselVideo,
  },

  data() {
    return {
      adList: [],
      index: 0,
    };
  },

  computed: {
    current() {
      return this.adList[this.index];
    },
    isDefault() {
      return this.adList.length === 0;
    },
    isLoop() {
      return this.adList.length === 1;
    },
  },

  created() {
    this.fetchAdList();
  },

  methods: {
    async fetchAdList() {
      const { key } = this.$route.query;
      const { body, errCode } = await $api.readModuleAd(key);
      if (errCode === 0) {
        const { resUrlList } = body;
        this.adList = resUrlList;
      }
    },

    onComplete() {
      if (this.index < this.adList.length - 1) ++this.index;
      else this.index = 0;
    },

    isVideo(url) {
      return url.toLowerCase().endsWith('.mp4');
    },
  },
};
</script>
<style lang="scss" scoped>
.default-ad-image {
  height: 100vh;
  background: url('../../assets/default-image.png') center/contain no-repeat;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 300ms;
}
.fade-enter {
  transform: translateX(100vw);
}
.fade-leave-to {
  transform: translateX(-100vw);
}
</style>
