<template>
  <div>
    <TypeItem v-for="type in typeList" :key="type.id" :value="type.balanceName" @click="handleIOFrom(type)" />
  </div>
</template>
<script>
import $api from '@/api';
import { ioFrom, receivePanel, staffAuth } from '../components-call';
import TypeItem from './TypeItem.vue';

export default {
  components: { TypeItem },

  data() {
    return {
      typeList: [],
      searchForm: {
        balanceName: '',
        balanceType: 1,
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
        const data = { payValue: this.MIXIN_Integral2Points(form.payValue), backup: form.backup, balanceId: id };
        // 1 需要授权
        if (authFlag === 1) {
          const auth = await staffAuth();
          if (typeof auth !== 'undefined') {
            const { type, openId, phone, code } = auth;
            if (type === 1) {
              Object.assign(data, { type, phone, code });
            }
            if (type === 3) {
              Object.assign(data, { type, openId });
            }
          }
        }
        const { body, errCode } = await $api.createOtherIOOrder(data);
        if (errCode === 0) {
          const { needPayValue, orderId } = body;
          // 支付方式
          const isSuccess = await receivePanel(parseFloat(needPayValue), orderId);
          if (isSuccess) {
            this.$message.success({ message: '操作成功', duration: 1500 });
          } else {
            this.$message.warning({ message: '操作失败', duration: 1500 });
          }
        }
      }
    },
  },
};
</script>
