/**
 * @param {string} path
 * @description 校验是否为外部资源
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

// 校验电话号码
export const isPhone = /^1[3456789]\d{9}$/;

// 校验正整数
export const isPositiveInt = /^[1-9]\d*$/;

// 校验数字
export const isNumber = /^[0-9]*$/;

// 验证最多两位小数的非负数
export const isPositiveFloat = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/

// 验证最多一位小数的非负数
export const isPositiveSingleFloat = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1})?$/
