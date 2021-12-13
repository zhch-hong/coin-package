<template>
  <div class="vip-detail">
    <el-dialog
        title="详情"
        :visible.sync="show"
        @closed="$emit('on-closed')"
    >
      <div>
        <div class="action-bar">
          <span class="action-name">{{ currentAct.label }}</span>
          <div class="action-btns">
            <el-button
                v-for="act in actions"
                :key="act.value"
                :type="
                                act.value === currentAct.value ? 'primary' : ''
                            "
                size="small"
                @click="handleOnActClick(act)"
            >
              {{ act.label }}
            </el-button>
          </div>
        </div>
        <component
            :is="currentAct.component"
            :user-info="detail"
        ></component>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseInfo from './components/base-info'
import CountTicket from './components/count-ticket'
import TimeTicket from './components/time-ticket'
import ActionLogs from './components/action-logs'

export default {
  name: "VipDetail",
  components: {
    BaseInfo, CountTicket, TimeTicket, ActionLogs
  },
  data() {
    return {
      show: false,
      currentAct: {
        label: '基本信息',
        value: 1,
        component: 'BaseInfo'
      },
      actions: [{
        label: '基本信息',
        value: 1,
        component: 'BaseInfo'

      }, {
        label: '次票',
        value: 2,
        component: 'CountTicket'

      }, {
        label: '年（月）票',
        value: 3,
        component: 'TimeTicket'

      }, {
        label: '操作日志',
        value: 4,
        component: 'ActionLogs'

      }]
    }
  },
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleOnActClick(act) {
      this.currentAct = act
    }
  },
  watch: {
    detail: {
      deep: true,
      handler(val) {
        if (val.uid) {
          this.currentAct = {
            label: '基本信息',
            value: 1,
            component: 'BaseInfo'
          }
          this.show = true
        } else {
          this.show = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../../../../styles/mixin";

.vip-detail {
  .action-bar {
    @include flex(space-between, center, row);
  }
}
</style>