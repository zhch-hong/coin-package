<template>
  <div style="height: 100vh">
    <template v-if="isDefault">
      <div class="default-ad-image"></div>
    </template>
    <template v-else>
      <template v-if="isVideo">
        <CarouselVideo :src="src" @complete="onComplete" />
      </template>
      <template v-else>
        <CarouselImage :src="src" @complete="onComplete" />
      </template>
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
    src() {
      return this.adList[this.index];
    },
    isDefault() {
      return this.adList.length === 0;
    },
    isVideo() {
      return this.src.toLowerCase().endsWith('.mp4');
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
  },
};
</script>
<style lang="scss" scoped>
.default-ad-image {
  height: 100vh;
  background: url('../../assets/default-image.png') center/contain no-repeat;
}
</style>
