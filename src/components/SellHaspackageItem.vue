<template>
  <div v-if="item.useNum > 0" class="sell-haspackage-item flex-center" :style="getSelectStyle" @click="$emit('click')">
    {{ item.name }}
  </div>
</template>
<script>
export default {
  props: {
    packageId: {
      type: Number,
      default: -1,
    },
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getSelectStyle() {
      if (this.item.id === this.packageId) {
        return { backgroundColor: '#ffffff', color: '#4194FE' };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sell-haspackage-item {
  width: 192px;
  border: 1px solid #4194fe;
  height: 120px;
  padding: 0 16px;
  text-align: center;
  font-weight: bold;
  color: #ffffff;
  background-color: #4194fe;
  border-radius: 20px;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>
