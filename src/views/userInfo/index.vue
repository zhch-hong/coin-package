<template>
  <div style="height: 100%" class="flex-column">
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <div style="width: 100%">
      <userList v-if="activeName === '会员查询'"></userList>
      <OpenPublicRelationCard v-if="activeName === '公关卡开卡'" />
      <!--    <userCoinAdd :cardType="0" v-if="activeName === '公关卡开卡'"></userCoinAdd>-->
      <OpenTemporaryCard v-if="activeName === '临时卡开卡'" />
      <!--    <userCoinAdd :cardType="2" v-if="activeName === '临时卡开卡'"></userCoinAdd>-->
      <closeCard v-if="activeName === '解绑实体卡'"></closeCard>
      <TemporaryBindRecord v-if="activeName === '临时卡绑定记录'"></TemporaryBindRecord>
    </div>
  </div>
</template>

<script>
import userList from './components/vipSearch/index'
// import userCoinAdd from './components/openCard'
import closeCard from './components/closeCard'
import OpenPublicRelationCard from './components/open-public-relation-card'
import OpenTemporaryCard from './components/open-temporary-card'
import TemporaryBindRecord from './components/temporary-bind-records'

export default {
  name: 'index',
  components: {
    userList,
    // userCoinAdd,
    closeCard,
    OpenPublicRelationCard,
    OpenTemporaryCard,
    TemporaryBindRecord
  },
  computed: {
    tabList() {
      return ['会员查询', '公关卡开卡', '临时卡开卡', '临时卡绑定记录', '解绑实体卡']
    }
  },
  data() {
    return {
      cardType: 0,
      activeName: '会员查询'
    }
  },
  methods: {
    handleSelect(val) {
      this.activeName = val
    }
  }
}
</script>

<style scoped></style>
