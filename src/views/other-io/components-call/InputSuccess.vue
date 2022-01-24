<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="getdefaultScreenSize > 1400 ? '30%' : '40%'"
    @closed="$emit('closed')"
  >
    <div class="success">
      <img class="icon" src="@/assets/input-success.png" alt="收款成功" />
      <p class="text">收款成功</p>
      <el-button type="primary" @click="visible = false">返回</el-button>
    </div>
  </el-dialog>
</template>
<script>
import store from '@/store';

export default {
  data() {
    return {
      visible: true,
    };
  },

  mounted() {
    this.show();
  },
  computed: {
    getdefaultScreenSize() {
      return store.state.defaultScreenSize;
    },
  },
  methods: {
    show() {
      this.visible = true;
    },

    hide() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-button--primary {
  padding: 12px 200px;
  font-size: 20px;
  letter-spacing: 4px;
}

.success {
  text-align: center;

  .icon {
    font-size: 0;
    width: 116px;
    height: 116px;
  }
  .text {
    color: #000;
    font-size: 26px;
    font-weight: bold;
  }
}
</style>
