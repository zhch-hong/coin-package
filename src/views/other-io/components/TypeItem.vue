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
  width: 240px;
  height: 109px;
  margin: 20px;
  line-height: 109px;
  text-align: center;
  color: #fff;
  font-size: 23px;
  background: url('../../../assets/other-io.png') center/contain;
}
</style>
