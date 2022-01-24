<template>
  <div class="update-password">
    <div class="flex-start">
      <div class="type-name" :style="{ color: type === 0 ? '#4194FE' : '#898989' }" @click="handleToggleType(0)">
        公关会员密码修改
      </div>
      <el-divider direction="vertical" />
      <div class="type-name" :style="{ color: type === 1 ? '#4194FE' : '#898989' }" @click="handleToggleType(1)">
        会员(含临时会员)密码修改
      </div>
    </div>
    <component :is="type === 0 ? 'UpdatePublicUserPwd' : 'UpdateTemporaryUserPwd'"></component>
  </div>
</template>

<script>
import UpdatePublicUserPwd from './components/update-public-user-pwd';
import UpdateTemporaryUserPwd from './components/update-temporary-user-pwd';

export default {
  name: 'update-password',
  components: { UpdatePublicUserPwd, UpdateTemporaryUserPwd },
  data() {
    return {
      type: 0,
    };
  },
  methods: {
    handleToggleType(type) {
      this.type = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.update-password {
  padding: 35px 50px;

  .type-name {
    cursor: pointer;
    font-size: 19px;
    font-weight: 500;
    color: #898989;
  }
}
</style>
