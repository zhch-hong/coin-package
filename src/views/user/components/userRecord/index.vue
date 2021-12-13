<template>
  <div class="sub-page-flex">
    <div class="flex-start" style="padding: 20px 20px 0">
      <div
        style="font-size: 19px; color: #898989; cursor: pointer"
        :style="{ color: selectedPage === 1 ? '#4194FE' : '#898989' }"
        @click="selectedPage = 1"
      >
        提币/补游戏币/补积分
      </div>
      <el-divider direction="vertical" />
      <div
        style="font-size: 19px; color: #898989; cursor: pointer"
        :style="{ color: selectedPage === 2 ? '#4194FE' : '#898989' }"
        @click="selectedPage = 2"
      >
        消费记录
      </div>
    </div>
    <common-records v-if="selectedPage === 1" />
    <records-consumption v-else />
  </div>
</template>

<script>
import commonRecords from './components/common-records'
import recordsConsumption from './components/records-consumption'

export default {
  name: 'UserRecords',
  components: {
    commonRecords,
    recordsConsumption
  },
  data() {
    return {
      selectedPage: 1
    }
  }
}
</script>
