<template>
  <div class="menu-wrap flex-start">
    <div
      class="menu-item flex-center"
      :class="{ 'menu-item_active': activeIndex === index }"
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectTab(tab, index)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'bc-tab',
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  methods: {
    selectTab(tab, index) {
      this.activeIndex = index;
      this.$emit('select', tab);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-wrap {
  width: 100%;
  background-color: #ffffff;
  padding: 16px 20px 12px;

  .menu-item {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    background-image: url('../../assets/components-img/tab-default.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    cursor: pointer;
    height: 35px;
    padding: 0 32px;
    font-size: 18px;
    font-weight: 500;
    color: #666666;
  }

  .menu-item_active {
    background-image: url('../../assets/components-img/tab-active.png');
    color: #ffffff;
    position: relative;
  }
}
</style>
