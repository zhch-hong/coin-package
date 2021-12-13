<template>
  <div class="HBSales">
    <bc-tab :tabs="tabList" @select="handleSelect"></bc-tab>
    <Validation v-if="activeName === '嗨呗专销'"></Validation>
    <ValidationRecord v-if="activeName === '核销记录'"></ValidationRecord>
  </div>
</template>

<script>
import Validation from './components/validation'
import ValidationRecord from './components/validationRecord'

export default {
  name: 'HBSales',
  components: { Validation, ValidationRecord },
  data() {
    return {
      activeName: '嗨呗专销'
    }
  },
  computed: {
    tabList() {
      return ['嗨呗专销', '核销记录']
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
.HBSales {
  // background-color: #ffffff;
  min-height: 880px;
}
</style>
