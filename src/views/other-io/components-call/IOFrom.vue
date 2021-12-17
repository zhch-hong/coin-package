<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('closed')"
  >
    <el-form ref="submitFrom" :model="submitFrom" :rules="rules">
      <el-form-item label="收入金额" prop="payValue">
        <el-input v-model="submitFrom.payValue"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="backup">
        <el-input v-model="submitFrom.backup" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      submitFrom: {
        payValue: '',
        backup: '',
      },
      rules: {
        payValue: [{ required: true, message: '无效字段', trigger: 'none' }],
        backup: [{ required: true, message: '无效字段', trigger: 'none' }],
      },
    };
  },

  mounted() {
    this.show();
  },

  methods: {
    show() {
      this.visible = true;
    },

    hide() {
      this.visible = false;
    },

    handleCancel() {
      this.$emit('cancel');
      this.hide();
    },

    handleSubmit() {
      this.$refs.submitFrom.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.submitFrom);
          this.hide();
        } else {
          //
        }
      });
    },
  },
};
</script>
