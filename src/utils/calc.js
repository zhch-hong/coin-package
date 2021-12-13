/**
 * created by TANGIMING
 * 2019-3-30
 * 这是处理JS加减乘除丢失精度的方法
 * * */
import * as math from 'mathjs'

export default {
  // 除法
  accDiv(arg1, arg2) {
    if (!arg1) return 0
    let t1 = 0
    let t2 = 0
    let r1
    let r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {}
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return this.accMul(r1 / r2, Math.pow(10, t2 - t1))
  },
  // 乘法
  accMul(arg1, arg2) {
    if (!arg1) return 0
    let m = 0
    const s1 = arg1.toString()
    const s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
  },

  // 加法
  accAdd(arg1, arg2) {
    let r1
    let r2
    let m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m
  },
  // 减法
  Subtr(arg1, arg2) {
    let r1
    let r2
    let m
    let n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = r1 >= r2 ? r1 : r2
    if (n > 0) {
      return this.toFixed((arg1 * m - arg2 * m) / m, n)
    }
    return Number((Math.round(arg1 * m) - Math.round(arg2 * m)) / m)
  },
  toFixed(num, n) {
    const pow = Math.pow(10, n)
    return Number(this.accDiv(Math.round(num * pow), pow))
  },
  add(a, b) {
    if (isNaN(a) || isNaN(b)) {
      console.error(`${a}或${b}是无效数字`)
      return
    }
    return math.number(math.add(math.bignumber(a), math.bignumber(b)))
  },
  subtract(a, b) {
    if (isNaN(a) || isNaN(b)) {
      console.error(`${a}或${b}是无效数字`)
      return
    }
    return math.number(math.subtract(math.bignumber(a), math.bignumber(b)))
  },
  multiply(a, b) {
    if (isNaN(a) || isNaN(b)) {
      console.error(`${a}或${b}是无效数字`)
      return
    }
    return math.number(math.multiply(math.bignumber(a), math.bignumber(b)))
  },
  divide(a, b) {
    if (isNaN(a) || isNaN(b)) {
      console.error(`${a}或${b}是无效数字`)
      return
    }
    return math.number(math.divide(math.bignumber(a), math.bignumber(b)))
  }
}
