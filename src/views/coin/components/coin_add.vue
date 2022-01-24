<template>
  <div>
    <el-dialog
      custom-class="success-dialog"
      :visible.sync="showModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="getdefaultScreenSize > 1400 ? '50%' : '60%'"
    >
      <div class="el-dialog-title-box">
        <div><img class="login_logo" src="@/assets/login_logo.png" alt="" /></div>
        <div><img class="close-windows-icon" src="@/assets/close-windows-icon.png" @click="closeModal" /></div>
      </div>
      <div class="el-dialog-top-box">
        <img class="gold-icon" src="@/assets/gold-icon.png" alt="" />
        <div>加 币</div>
      </div>
      <el-form inline ref="form" label-width="160px" :model="formData" :rules="formRules">
        <el-form-item label="机台名称:">
          <span style="display: block; width: 200px">{{ machine.machineName }}</span>
        </el-form-item>
        <el-form-item label="机台余币:">
          <span style="display: block; width: 200px">{{ machine.machineCount }}</span>
        </el-form-item>
        <el-form-item label="加币数量:" prop="coinNum">
          <el-input v-model.number="formData.coinNum" size="small" style="width: 200px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="出币仓库:" prop="warehouseId">
          <HousePicker v-model="formData.warehouseId" style="width: 200px" />
        </el-form-item>
        <el-form-item label="备注:" prop="backup">
          <el-input v-model="formData.backup" size="small" style="width: 200px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="经手人:" prop="backup">
          <el-input v-model="formData.handler" size="small" style="width: 200px" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div slot="footer" class="dialog-footer">
          <div class="flex-center">
            <el-button
              type="primary"
              style="width: 116px; margin-left: 40px; border-radius: 10px; padding: 9px 0"
              size="mini"
              :loading="loading"
              @click="handleSubmit"
              >确定
            </el-button>
            <el-button
              type="info"
              style="width: 116px; margin-left: 40px; border-radius: 10px; padding: 9px 0"
              size="mini"
              :loading="loading"
              @click="closeModal"
              >取 消
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import HousePicker from '@/components/HousePicker.vue';
import { isPositiveInt } from '../../../utils/validate';

export default {
  name: 'coin_cut',
  components: { HousePicker },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    machine: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      showModal: false,
      formData: {
        coinNum: '',
        warehouseId: '',
        backup: '',
        handler: '',
      },
      formRules: {
        coinNum: [{ required: true, trigger: 'blur', message: '请输入正确的数字', pattern: isPositiveInt }],
        warehouseId: [{ required: true, trigger: 'blur', message: '无效仓库' }],
      },
    };
  },
  watch: {
    value(newVal) {
      this.showModal = newVal;
    },
  },
  computed: {
    getdefaultScreenSize() {
      return this.$store.state.defaultScreenSize;
    },
  },
  created() {
    this.setDefaultExportHouse();
  },

  methods: {
    handleSubmit() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loading = true;
          const data = {
            bindMachineId: this.machine.machineId,
            bindMachineType: 1,
            ...this.formData,
          };
          this.$api
            .machineAppendCoin(data)
            .then((res) => {
              this.$message.success('加币成功');
              this.$store.dispatch('getMachineCoinNum');
              this.storageDefaultExportHouse(this.formData.warehouseId);
              this.closeModal();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },

    closeModal() {
      this.formData.coinNum = '';
      this.formData.backup = '';
      this.formData.handler = '';
      this.formData.warehouseId = '';
      this.$emit('input', false);
      this.$emit('success');
    },

    storageDefaultExportHouse(id) {
      localStorage.setItem('defaultExportHouse', JSON.stringify(id));
    },

    setDefaultExportHouse() {
      const id = localStorage.getItem('defaultExportHouse');
      if (id === null) {
        this.formData.warehouseId = '';
      } else {
        this.formData.warehouseId = Number(id);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
.el-dialog-top-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  color: #4194fe;
  padding: 28px 0 26px 0;
}
.gold-icon {
  width: 37px;
  height: 36px;
  margin-right: 18px;
}
.el-dialog-title-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 18px 10px 32px;
  box-sizing: border-box;
  background: #f5f7fa;
  border-bottom: 1px solid #cccccc;
  .close-windows-icon {
    width: 17px;
    height: 17px;
    margin-top: 7px;
  }
  .login_logo {
    width: 111px;
    height: 32px;
  }
}
</style>
