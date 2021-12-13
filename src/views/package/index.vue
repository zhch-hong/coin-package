<template>
  <div class="package">
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <PackageSale v-if="activeName === '套餐销售'"></PackageSale>
    <PackageRenewal v-if="activeName === '年（月）票续期'"></PackageRenewal>
    <PackageSaleRecord v-if="activeName === '销售记录'"></PackageSaleRecord>
  </div>
</template>

<script>
import PackageSale from './components/package-sale'
import PackageSaleRecord from './components/package-sale-record'
import PackageRenewal from './components/package-renewal'

export default {
  name: 'index',
  components: {
    PackageSale,
    PackageSaleRecord,
    PackageRenewal
  },
  data() {
    return {
      activeName: '套餐销售'
    }
  },
  computed: {
    tabList() {
      const arr = ['套餐销售', '年（月）票续期', '销售记录']
      const result = []
      arr.forEach((item) => {
        if (item === '年（月）票续期' && this.$store.state.offline) {
          console.log('离线模式')
        } else {
          result.push(item)
        }
      })
      return result
    }
  },
  methods: {
    handleSelect(val) {
      this.activeName = val
    }
  }
}
</script>

<style lang="scss" scoped>
.package {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
