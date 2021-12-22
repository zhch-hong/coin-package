<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('closed')"
  >
    <el-form ref="submitFrom" :model="submitFrom" :rules="rules">
      <el-form-item label="金额" prop="payValue">
        <el-input v-model.trim="submitFrom.payValue" @input="onPayInput"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="backup">
        <el-input v-model.trim="submitFrom.backup" type="textarea" :maxlength="60" :rows="4" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
/**
 * 去除额外的 . 和 -
 * @param {string} value
 * @param {string} char
 * @param {RegExp} regExp
 * @returns {string}
 */
function trimExtraChar(value, char, regExp) {
  const index = value.indexOf(char);
  let prefix = '';

  if (index === -1) {
    return value;
  }

  if (char === '-' && index !== 0) {
    return value.slice(0, index);
  }

  if (char === '.' && value.match(/^(\.|-\.)/)) {
    prefix = index ? '-0' : '0';
  }

  return prefix + value.slice(0, index + 1) + value.slice(index).replace(regExp, '');
}

/**
 * number 类型
 * @param {string} value
 * @param {boolean} [allowDot=true] - 允许小数点
 * @param {boolean} [allowMinus=true] - 允许负数
 * @returns {string}
 */
function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g);
  } else {
    value = value.split('.')[0];
  }

  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g);
  } else {
    value = value.replace(/-/, '');
  }

  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;

  return value.replace(regExp, '');
}

export default {
  data() {
    return {
      visible: false,
      submitFrom: {
        payValue: '',
        backup: '',
      },
      rules: {
        payValue: [
          {
            required: true,
            trigger: 'none',
            validator(rule, value, callback) {
              if (value === undefined || value === '' || value === null) {
                callback(new Error('无效字段'));
              } else if (value.split('.')[1] !== undefined) {
                if (value.split('.')[1].length > 2 || value.split('.')[1].length === 0) callback(new Error('无效字段'));
                else callback();
              } else {
                callback();
              }
            },
          },
        ],
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

    onPayInput(value) {
      value = value.toString();
      this.submitFrom.payValue = formatNumber(value, true, false);
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
