<template>
  <div class="bc-search">
    <el-form
      ref="form"
      :inline="true"
      size="mini"
      :model="formInfo"
      :rules="rules"
      :label-width="labelWidth"
      class="form-class"
    >
      <template v-for="(item, index) in configList">
        <el-form-item :label="item.label" :key="index" :prop="item.prop">
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="formInfo[item.prop]"
            :placeholder="item | formatPlaceholder"
            clearable
            v-bind="item.nativeProps"
            :maxlength="item.maxlength || 30"
          />
          <!-- 下拉框 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="formInfo[item.prop]"
            clearable
            :multiple="item.multiple"
            v-bind="item.nativeProps"
          >
            <el-option v-for="(opt, i) in item.options" :key="i" :label="opt.label" :value="opt.value" />
          </el-select>
          <!--连级选择器-->
          <el-cascader
            v-else-if="item.type === 'selectCity'"
            v-model="formInfo[item.prop]"
            v-bind="item.nativeProps"
            :options="item.options"
            clearable
          ></el-cascader>
          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="item.type === 'datePicker'"
            style="width: 240px"
            v-model="formInfo[item.prop]"
            unlink-panels
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="请输入变动时间"
            :default-time="['00:00:00', '23:59:59']"
            clearable
          ></el-date-picker>
          <bc-range-picker v-else-if="item.type === 'rangePicker'" v-model="formInfo[item.prop]"></bc-range-picker>
          <bc-city-picker v-else-if="item.type === 'cityPicker'" v-model="formInfo[item.prop]"></bc-city-picker>
          <template v-else-if="item.type === 'custom'">
            <component v-if="item.component" :is="item.component" />
          </template>
        </el-form-item>
      </template>
      <el-form-item :label="actionBtnText">
        <div class="flex-center">
          <el-button
            type="primary"
            size="mini"
            :loading="loading"
            style="width: 120px; border-radius: 10px"
            @click="handleOnSearch"
            >查 询
          </el-button>
          <el-button
            size="mini"
            :loading="loading"
            style="width: 120px; border-radius: 10px; border-color: #4194fe; color: #4194fe"
            @click="handleOnReset"
            >重 置
          </el-button>
          <div class="actions">
            <slot name="action"></slot>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
 * config = [
 *       {label: '订单号', prop: 'orderId', type: 'input'},
 *       {label: '下单时间',prop: 'orderId',type: 'datePicker',valueType: 'string',startProp: 'startTime',endProp: 'endTime'},
 * ]
 *
 * */
export default {
  name: 'bc-search',
  props: {
    labelWidth: {
      type: String,
      default: '',
    },
    config: {
      type: Array,
      required: true,
    },
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    actionBtnText: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formInfo: {},
      configList: [],
    };
  },
  filters: {
    formatPlaceholder(val) {
      let placeholder = `请输入${val.label}`;
      if (val.nativeProps && val.nativeProps.placeholder) {
        placeholder = val.nativeProps.placeholder;
      }
      return placeholder;
    },
  },
  watch: {
    config: {
      immediate: true,
      handler(value) {
        this.configList = value.map((item) => {
          this.initFormProps(item);
          return item;
        });
      },
    },
  },
  methods: {
    initFormProps(item) {
      let initValue = '';
      if (item.type === 'select' && item.nativeProps && item.nativeProps.multiple) {
        initValue = [];
      }
      if (item.type === 'datePicker' || item.type === 'rangePicker' || item.type === 'cityPicker') {
        initValue = [];
      }
      if (item.prop) {
        this.$set(this.formInfo, item.prop, initValue);
      }
    },
    getParams() {
      const result = JSON.parse(JSON.stringify(this.formInfo));
      this.configList.forEach((item) => {
        if (
          (item.type === 'datePicker' || item.type === 'rangePicker' || item.type === 'cityPicker') &&
          item.valueType
        ) {
          if (item.type === 'cityPicker') {
            result.province = result[item.prop][0] || '';
            result.city = result[item.prop][1] || '';
            result.area = result[item.prop][2] || '';
            delete result[item.prop];
          } else if ((item.valueType === 'string' || item.valueType === 'number') && item.startProp && item.endProp) {
            if (result[item.prop] && result[item.prop].length) {
              result[item.startProp] = result[item.prop][0];
              result[item.endProp] = result[item.prop][1];
              delete result[item.prop];
            } else {
              result[item.startProp] = '';
              result[item.endProp] = '';
              delete result[item.prop];
            }
          }
        } else if (item.valueType && item.valueType === 'number') {
          if (result[item.prop] !== '' && result[item.prop] !== null) {
            result[item.prop] = Number(result[item.prop]);
          } else {
            result[item.prop] = '';
          }
        }
      });
      return result;
    },
    handleOnSearch() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.$emit('on-search', this.getParams());
        }
      });
    },
    handleOnReset() {
      this.$refs.form.resetFields();
      if (this.formInfo.hasOwnProperty('pca')) {
        this.$set(this.formInfo, 'pca', []);
      }
      this.handleOnSearch();
    },
  },
  mounted() {
    this.$refs.form.resetFields();
  },
  // created() {
  //     this.configList = this.config.map(item => {
  //         this.initFormProps(item)
  //         return item
  //     })
  // }
};
</script>

<style lang="scss" scoped>
.bc-search {
  border-radius: 10px;
  padding: 24px 24px 10px 24px;
  box-sizing: border-box;
  background: #fff;
  .actions {
    margin: 0 10px;
  }
  .form-class {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
