<template>
  <div style="height: 100%" class="flex-column">
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <userAdmin v-if="activeName === '会员提币'"></userAdmin>
    <userCoin_add v-if="activeName === '会员补资产'"></userCoin_add>
    <userConsume v-if="activeName === '会员消费'"></userConsume>
    <modify-data v-if="activeName === '资料修改'"></modify-data>
    <UpdatePassword v-if="activeName === '密码修改'"></UpdatePassword>
    <userRecord v-if="activeName === '会员操作记录'"></userRecord>
  </div>
</template>

<script>
/* eslint-disable camelcase */

import userAdmin from './components/userAdmin';
import userCoin_add from './components/userCoin_add';
import userRecord from './components/userRecord/index';
import userConsume from './components/userConsume';
import ModifyData from './components/modify-data';
import UpdatePassword from './components/update-password';

export default {
  name: 'index',
  components: {
    userAdmin,
    userCoin_add,
    userRecord,
    userConsume,
    ModifyData,
    UpdatePassword,
  },
  data() {
    return {
      activeName: '会员提币',
    };
  },
  computed: {
    tabList() {
      return ['会员提币', '会员补币', '会员消费', '资料修改', '密码修改', '会员操作记录'];
    },
  },
  methods: {
    handleSelect(val) {
      console.log(val);
      this.activeName = val;
    },
  },
};
</script>

<style scoped></style>
