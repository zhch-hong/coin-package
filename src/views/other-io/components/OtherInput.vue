<template>
  <div>
    <TypeItem v-for="{ balanceName, id } in typeList" :key="id" :value="balanceName" @click="handleIOFrom(id)" />
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
      typeList: [
        {
          balanceName: '税费',
          id: 1,
        },
      ],
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
    // this.fetchTypeList();
  },

  methods: {
    async fetchTypeList() {
      const { body, errCode } = await $api.readOtherIOTypeList(this.searchForm);
      if (errCode === 0) {
        const { items } = body;
        this.typeList = items;
      }
    },

    async handleIOFrom(balanceId) {
      // 表单
      const from = await ioFrom();
      if (typeof from !== 'undefined') {
        // 授权
        const auth = await staffAuth();
        if (typeof auth !== 'undefined') {
          const { type, openId, phone, code } = auth;
          const data = { ...from, type, balanceId };
          if (type === 1) {
            Object.assign(data, { phone, code });
          }
          if (type === 3) {
            Object.assign(data, { openId });
          }
          const { body, errCode } = await $api.createOtherIOOrder(data);
          if (errCode === 0) {
            const { needPayValue, orderId } = body;
            // 支付方式
            const isSuccess = await receivePanel(needPayValue, orderId);
            if (isSuccess) {
              this.$message.success({ message: '操作成功', duration: 1500 });
            } else {
              this.$message.warning({ message: '操作失败', duration: 1500 });
            }
          }
        }
      }
    },
  },
};
</script>
