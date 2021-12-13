import calc from '../utils/calc'
import { COIN_RMB_RATE } from '../utils/tools'

export default {
  filters: {
    MIXIN_FormatSex(val) {
      if (val) {
        const list = ['未知', '男', '女']
        return list[val]
      }
      return '-'
    },
    MIXIN_CeilIntegral(val) {
      return calc.accDiv(Math.ceil(calc.accMul(val, 100)), 100)
    },
    MIXIN_Points2Yuan(val) {
      return calc.toFixed(calc.accDiv(val, 100), 2)
    },
    MIXIN_Points2StarCoin(val) {
      return calc.accMul(val, calc.accDiv(COIN_RMB_RATE, 100))
    },
    MIXIN_NumFixed(val) {
      const sign = val >= 0 ? 1 : -1
      const p = Math.pow(10, 2)
      val *= sign * p
      let intNum = parseInt(val)
      val %= 1
      if (val % 1 >= 0.1) intNum += 1
      val = intNum / p
      return val
    }
  },
  methods: {
    MIXIN_CeilIntegral(val) {
      return calc.accDiv(Math.ceil(calc.accMul(val, 100)), 100)
    },
    MIXIN_Integral2Yuan(val) {
      return calc.accDiv(Math.ceil(calc.accMul(calc.accDiv(val, COIN_RMB_RATE), 100)), 100)
    },
    MIXIN_Integral2Points(val) {
      return Math.ceil(calc.accMul(calc.accDiv(val, COIN_RMB_RATE), 100))
    },
    MIXIN_Integral2PointsFloor(val) {
      return Math.floor(calc.accMul(calc.accDiv(val, COIN_RMB_RATE), 100))
    },
    MIXIN_Points2StarCoin(val) {
      return calc.accMul(val, calc.accDiv(COIN_RMB_RATE, 100))
    },
    MIXIN_Points2Yuan(val) {
      return calc.accDiv(val, 100)
    }
  }
}
