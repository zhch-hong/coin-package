<template>
  <div class="other-output">
    <TypeItem
      v-for="type in typeList"
      :key="type.id"
      :value="type.balanceName"
      :is-input="false"
      @click="handleIOFrom(type)"
    />
  </div>
</template>
<script>
import $api from '@/api';
import { ioFrom, staffAuth } from '../components-call';
import TypeItem from './TypeItem.vue';

export default {
  components: { TypeItem },

  data() {
    return {
      typeList: [],
      searchForm: {
        balanceName: '',
        balanceType: 2,
        startTime: '',
        endTime: '',
        sort: '',
        sortType: '',
        pageNum: 1,
        showNum: 999,
      },
    };
  },

  mounted() {
    this.fetchTypeList();
  },

  methods: {
    async fetchTypeList() {
      const { body, errCode } = await $api.readOtherIOTypeList(this.searchForm);
      if (errCode === 0) {
        const { items } = body;
        this.typeList = items;
      }
    },

    async handleIOFrom(object) {
      const { authFlag, id } = object;
      // 表单
      const form = await ioFrom();
      if (typeof form !== 'undefined') {
        const data = {
          payValue: form.payValue * 100,
          backup: form.backup,
          balanceId: id,
        };
        // 1 需要授权
        if (authFlag === 1) {
          const auth = await staffAuth();
          if (typeof auth === 'undefined') return;
          const { type, openId, phone, code } = auth;
          if (type === 1) {
            Object.assign(data, { type, phone, code });
          }
          if (type === 3) {
            Object.assign(data, { type, openId });
          }
        }
        const { errCode } = await $api.createOtherIOOrder(data);
        if (errCode === 0) {
          this.$message.success({ message: '操作成功', duration: 1500 });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.other-output {
  display: flex;
  flex-wrap: wrap;
}
</style>
