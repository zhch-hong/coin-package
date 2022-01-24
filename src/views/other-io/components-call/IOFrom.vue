<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="ScreenSize > 1400 ? '30%' : '40%'"
    @closed="$emit('closed')"
  >
    <template #title>
      <div class="dialog-title">
        <img class="log" src="@/assets/logo_small.png" alt="百川之星" />
        <img class="close" src="@/assets/close-windows-icon.png" alt="关闭" @click="handleCancel" />
      </div>
    </template>
    <div style="margin: 0 40px">
      <div class="io-type">
        <img class="io-icon" src="@/assets/gold-icon.png" alt="金额" />
        <span class="io-text">{{ ioText }}</span>
      </div>
      <el-form ref="submitFrom" :model="submitFrom" :rules="rules" label-width="120px">
        <el-form-item :label="ioText + '金额'" prop="payValue">
          <el-input v-model.trim="submitFrom.payValue" @input="onPayInput"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="backup">
          <el-input
            v-model.trim="submitFrom.backup"
            type="textarea"
            :maxlength="60"
            :rows="4"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" type="primary" style="border-radius: 10px; width: 116px" @click="handleSubmit"
          >确定</el-button
        >
        <el-button size="small" type="info" style="border-radius: 10px; width: 116px" @click="handleCancel"
          >取消</el-button
        >
      </div>
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
  props: {
    isInput: Boolean,
  },

  data() {
    return {
      visible: false,
      submitFrom: {
        payValue: '',
        backup: '',
      },
      ScreenSize: 1400,
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

  computed: {
    ioText() {
      return this.isInput ? '收入' : '支出';
    },
  },

  mounted() {
    this.show();
  },

  methods: {
    show() {
      this.visible = true;
      this.ScreenSize = window.screen.width;
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
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  background-color: #f5f7fa;
}

/deep/ .el-button--small {
  padding: 9px 30px;
}

.dialog-title {
  position: relative;
  height: 30px;

  .log {
    max-height: 100%;
    font-size: 0;
  }

  .close {
    position: absolute;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 20px;
    height: 20px;
  }
}

.io-type {
  padding-bottom: 20px;
  margin: 0 120px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  .io-icon {
    font-size: 0;
    max-width: 40px;
  }

  .io-text {
    font-size: 24px;
    font-weight: bold;
    color: #4194fe;
  }
}

.dialog-footer {
  margin: 0 120px;
  display: flex;
  justify-content: space-between;
}
</style>
