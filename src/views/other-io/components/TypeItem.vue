<template>
  <div class="type-item" @click="$emit('click')">
    <span>{{ value }}</span>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
  },
};
</script>
<style lang="scss" scoped>
.type-item {
  cursor: pointer;
  display: inline-block;
  width: 200px;
  height: 200px;
  margin: 20px;
  line-height: 200px;
  text-align: center;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
