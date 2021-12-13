<template>
  <div class="bc-type-menu flex-start">
    <div
      class="bc-type-menu-item"
      :class="{ 'bc-type-menu-item_active': value.value === item.value }"
      v-for="(item, index) in typeList"
      :key="index"
      @click="handleClick(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'bc-type-menu',
  props: {
    value: {
      required: true
    },
    typeList: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('input', item)
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.bc-type-menu {
  flex-wrap: wrap;

  .bc-type-menu-item {
    cursor: pointer;
    background-color: #ffffff;
    padding: 12px;
    font-size: 18px;
    font-weight: 400;
    border-radius: 2px;
    color: #666666;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .bc-type-menu-item_active {
    background-color: #4194fe;
    color: #ffffff;
  }
}
</style>
