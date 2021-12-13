<!-- 仓库选择器 -->
<template>
  <el-select v-model="localValue" size="small" placeholder="请选择">
    <el-option v-for="item in houseList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
  </el-select>
</template>
<script>
import $api from '@/api';

export default {
  props: ['value'],

  data() {
    return {
      houseList: [],
    };
  },

  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  async mounted() {
    await this.fetchHouseList();
    await this.$nextTick();
    this.isIncludeValue();
  },

  methods: {
    async fetchHouseList() {
      try {
        const { body, errCode } = await $api.readCoinTicketHouseList({
          warehouseType: 1,
          useFlag: 1,
        });
        if (errCode === 0) {
          this.houseList = body.items.map(({ id, name }) => ({ value: id, label: name }));
        }
      } catch (error) {
        //
      }
    },

    /**
     * 判断
     */
    isIncludeValue() {
      this.$nextTick();
      const index = this.houseList.findIndex((value) => value === this.localValue);
      if (index === -1) {
        this.localValue = '';
      }
    },
  },
};
</script>
