<template>
  <div class="title">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'bc-title'
}
</script>

<style lang="scss" scoped>
.title {
  border-left: 6px solid #4778c7;
  padding-left: 16px;
  font-size: 23px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 16px;
}
</style>
