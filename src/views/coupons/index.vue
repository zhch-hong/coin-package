<template>
  <div style="height: 100%" class="flex-column">
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <!-- <el-menu default-active="优惠券核销" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="优惠券核销">优惠券核销</el-menu-item>
    </el-menu> -->
    <useCoupons v-if="activeName === '优惠券核销'"></useCoupons>
  </div>
</template>

<script>
import useCoupons from './components/useCoupons'

export default {
  name: 'index',
  components: {
    useCoupons
  },
  data() {
    return {
      activeName: '优惠券核销'
    }
  },
  computed: {
    tabList() {
      return ['优惠券核销']
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
