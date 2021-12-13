<template>
  <div>
    <el-dialog
      title="清币"
      :visible.sync="showModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @opened="onOpened"
    >
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
        <el-button :loading="coinLoading" type="primary" size="small" @click="handleSubmit">确定</el-button>
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
</style>
