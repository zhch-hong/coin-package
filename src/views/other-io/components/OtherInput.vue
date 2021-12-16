<template>
  <div>
    <TypeItem v-for="(type, index) in typeList" :key="index" :value="type" />
  </div>
</template>
<script>
import $api from '@/api';
import TypeItem from './TypeItem.vue';

export default {
  components: { TypeItem },

  data() {
    return {
      typeList: [],
    };
  },

  mounted() {
    this.fetchTypeList();
  },

  methods: {
    async fetchTypeList() {
      const { body, errCode } = await $api.readOtherIOTypeList({});
      if (errCode === 0) {
        const { items } = body;
        this.typeList = items;
      }
    },
  },
};
</script>
