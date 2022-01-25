<template>
  <div>
    <el-dialog
      :visible.sync="showModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @opened="onOpened"
      custom-class="success-dialog"
      :width="getdefaultScreenSize > 1400 ? '50%' : '60%'"
    >
      <div class="el-dialog-title-box">
        <div><img class="login_logo" src="@/assets/login_logo.png" alt="" /></div>
        <!-- <div><img class="close-windows-icon" src="@/assets/close-windows-icon.png" @click="closeModal" /></div> -->
      </div>
      <div class="el-dialog-top-box">
        <img class="gold-icon" src="@/assets/gold-icon.png" alt="" />
        <div>清 币</div>
      </div>
      <el-form
        inline
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="160px"
        v-loading="coinLoading"
        element-loading-text="数币中..."
      >
        <div>
          <el-form-item label="机台名称:">
            <span style="display: block; width: 200px">{{ machine.machineName }}</span>
          </el-form-item>
        </div>
        <el-form-item label="清币数量:" prop="updateNum">
          <el-input v-model.number="formData.coinNum" size="small" style="width: 200px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="回收仓库" prop="warehouseId">
          <HousePicker v-model="formData.warehouseId" style="width: 200px" />
        </el-form-item>
        <el-form-item label="备注:" prop="backup">
          <el-input v-model.trim="formData.backup" size="small" style="width: 200px" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div slot="footer" class="dialog-footer">
          <div class="flex-center">
            <el-button
              :loading="coinLoading"
              style="width: 116px; margin-left: 40px; border-radius: 10px; padding: 9px 0"
              type="primary"
              size="small"
              @click="handleSubmit"
              >确定</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import HousePicker from '@/components/HousePicker.vue';
import { isNumber, isPositiveInt } from '../../../utils/validate';

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
      coinLoading: false,
      formData: {
        coinNum: '',
        warehouseId: '',
        backup: '',
      },
      formRules: {
        coinNum: [{ required: true, trigger: 'blur', message: '请输入正确的数字', pattern: isNumber }],
        warehouseId: [{ required: true, trigger: 'blur', message: '无效仓库' }],
      },
    };
  },

  computed: {
    showModal: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
    getdefaultScreenSize() {
      return this.$store.state.defaultScreenSize;
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async (v) => {
        if (v) {
          const params = { bindMachineId: this.machine.machineId, bindMachineType: 1, ...this.formData };
          const { errCode } = await this.$api.machineClearCoin(params);
          if (errCode === 0) {
            this.$message.success('操作成功');
            this.$root.$children[0].resetError();
            this.$store.dispatch('getMachineCoinNum');
            this.$emit('success');
            this.storageDefaultImportHouse(this.formData.warehouseId);
            this.showModal = false;
          }
        }
      });
    },

    async onOpened() {
      console.log(this.machine);
      this.setDefaultImportHouse();
      this.coinLoading = true;
      this.formData.coinNum = await this.getCoinCount();
      this.coinLoading = false;
    },

    getCoinCount() {
      return new Promise((resolve) => {
        this.$root.$children[0].sendCoin(-1, '', (value) => {
          resolve(value);
        });
      });
    },

    storageDefaultImportHouse(id) {
      localStorage.setItem('defaultImportHouse', JSON.stringify(id));
    },

    setDefaultImportHouse() {
      const id = localStorage.getItem('defaultImportHouse');
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
/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>
