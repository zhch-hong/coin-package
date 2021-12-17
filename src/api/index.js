import request from '@/utils/request';

export default {
  // 查询模块key是否激活
  getModuleActiveFlag(data) {
    return request({ url: '/cash/getModuleActiveFlag', method: 'post', data });
  },
  // 收银激活
  bindCash(data) {
    return request({ url: '/cash/bindCash', method: 'post', data });
  },
  // 发送验证码
  sendSms(data) {
    return request({ url: '/cash/sendSms', method: 'post', data });
  },
  // 登录
  cashLogin(data) {
    return request({ url: '/cash/cashLogin', method: 'post', data });
  },
  // 退出登录
  cashLoginOut(data) {
    return request({ url: '/cash/cashLoginOut', method: 'post', data });
  },
  // 查询班结信息
  getInvoicingInfo(data) {
    return request({ url: '/cash/invoicing/getInvoicingInfo', method: 'post', data });
  },
  // 确认班结
  cashInvoicing(data) {
    return request({ url: '/cash/invoicing/cashInvoicing', method: 'post', data });
  },
  // 查询模块绑定机台信息
  getMachineInfo(data) {
    return request({ url: '/cash/machine/getMachineInfo', method: 'post', data });
  },
  // 查询清币加币流水
  getMachineCoinDetail(data) {
    return request({ url: '/cash/machine/getMachineCoinDetail', method: 'post', data });
  },

  /**
   * 机台加币
   * @param {Object} data
   * @param {string} data.bindMachineId - 机台id
   * @param {number} data.bindMachineType - 机台类型，0 未绑定，1 金花机台，2 游戏机台
   * @param {number} data.coinNum - 清币数量
   * @param {number} data.warehouseId - 回收仓库
   * @param {string} [data.backup=] - 备注
   * @param {string} [data.handler=] - 经手人
   * @returns
   */
  machineAppendCoin(data) {
    return request({ url: '/cash/machine/addMachineCoinWarehouse', method: 'post', data });
  },

  /**
   * 机台清币
   * @param {Object} data
   * @param {string} data.bindMachineId - 机台id
   * @param {number} data.bindMachineType - 机台类型，0 未绑定，1 金花机台，2 游戏机台
   * @param {number} data.coinNum - 清币数量
   * @param {number} data.warehouseId - 回收仓库
   * @param {string} [data.backup] - 备注
   * @returns
   */
  machineClearCoin(data) {
    return request({ url: '/cash/machine/clearMachineCoinWarehouse', method: 'post', data });
  },

  // 查询物品
  getPrize(data) {
    return request({ url: '/cash/prize/getPrize', method: 'post', data });
  },
  // 查询用户剩余积分
  getUserInfo(data) {
    return request({ url: '/cash/getUserInfo', method: 'post', data });
  },
  // 购买物品
  userBuyPrize(data) {
    return request({ url: '/cash/prize/userBuyPrize', method: 'put', data });
  },
  // 游戏币购买
  userPayGiftGameCoin(data) {
    return request({ url: '/cash/gift/userPayGameCoin', method: 'post', data });
  },
  userPayPrizeGameCoin(data) {
    return request({ url: '/cash/prize/userPayGameCoin', method: 'post', data });
  },
  // 游戏币续费
  userRenewalPayGameCoin(data) {
    return request({ url: '/cash/gift/userRenewalPayGameCoin', method: 'post', data });
  },
  // 支付积分部分
  userPayStarCoin(data) {
    return request({ url: '/cash/prize/userPayStarCoin', method: 'post', data });
  },
  // 确认收到现金
  userPayRMB(data) {
    return request({ url: '/cash/prize/userPayRMB', method: 'post', data });
  },
  // 物品销售记录
  getPrizeOrder(data) {
    return request({ url: '/cash/prize/getPrizeOrder', method: 'post', data });
  },
  // 物品销售记录
  getPrizeSalesDetail(data) {
    return request({ url: '/cash/prize/getPrizeSalesDetail', method: 'post', data });
  },
  // 设计权限操作发送验证码
  sendAdminPhoneCode(data) {
    return request({ url: '/cash/sendAdminPhoneCode', method: 'post', data });
  },
  // 退单
  backPrize(data) {
    return request({ url: '/cash/prize/backPrize', method: 'post', data });
  },
  // 查询玩家剩余游戏币
  getUserCoin(data) {
    return request({ url: '/cash/user/getUserCoin', method: 'post', data });
  },
  // 玩家提币
  userGetCoin(data) {
    return request({ url: '/cash/user/userGetCoin', method: 'post', data });
  },
  // 玩家加币
  addGameCoin(data) {
    return request({ url: '/cash/user/addGameCoin', method: 'post', data });
  },
  // 查询会员操作记录
  getUserLog(data) {
    return request({ url: '/cash/user/getUserLog', method: 'post', data });
  },
  // 玩家加积分
  addStarCoin(data) {
    return request({ url: '/cash/user/addStarCoin', method: 'post', data });
  },
  // 查询兑换码
  getExchangeInfo(data) {
    return request({ url: '/cash/exchange/getExchangeInfo', method: 'post', data });
  },
  // 兑换
  userExchange(data) {
    return request({ url: '/cash/exchange/userExchange', method: 'post', data });
  },
  // 兑换记录
  getExchangeDetail(data) {
    return request({ url: '/cash/exchange/getExchangeDetail', method: 'post', data });
  },
  // 查询套餐
  getCoinGift(data) {
    return request({ url: '/cash/gift/getGift', method: 'post', data });
  },
  // 查询组合套餐内容
  getGroupGiftDetail(data) {
    return request({ url: '/cash/gift/getGroupGiftDetail', method: 'post', data });
  },
  // 套餐下单
  userBuyCoinGift(data) {
    return request({ url: '/cash/gift/userBuyGift', method: 'put', data });
  },
  // 套餐支付积分
  packsUserPayStarCoin(data) {
    return request({ url: '/cash/gift/userPayStarCoin', method: 'post', data });
  },
  // 套餐支付现金
  packsSureGetRMB(data) {
    return request({ url: '/cash/gift/userPayRMB', method: 'post', data });
  },
  // 套餐销售记录
  getGiftOrder(data) {
    return request({ url: '/cash/gift/getGiftOrder', method: 'post', data });
  },
  // 套餐销售记录
  backCoinGift(data) {
    return request({ url: '/cash/gift/backCoinGift', method: 'post', data });
  },
  // 查询订单是否支付成功
  queryOrder(data) {
    return request({ url: '/cash/queryOrder', method: 'post', data });
  },
  // 查询机台余币
  getMachineCoinNum(data) {
    return request({ url: '/cash/getMachineCoinNum', method: 'post', data });
  },
  // 查询可续期套餐
  getRenewalTimeGift(data) {
    return request({ url: '/cash/gift/getRenewalTimeGift', method: 'post', data });
  },
  // 续期套餐下单
  userRenewalTimeGift(data) {
    return request({ url: '/cash/gift/userRenewalTimeGift', method: 'post', data });
  },
  // 续期套餐支付积分
  userRenewalPayStarCoin(data) {
    return request({ url: '/cash/gift/userRenewalPayStarCoin', method: 'post', data });
  },
  // 续期套餐支付现金
  userRenewalPayRMB(data) {
    return request({ url: '/cash/gift/userRenewalPayRMB', method: 'post', data });
  },
  // 查询会员可核销套餐
  getUserTimeNumGift(data) {
    return request({ url: '/cash/user/getUserTimeNumGift', method: 'post', data });
  },
  // 核销套餐
  checkUserGift(data) {
    return request({ url: '/cash/user/checkUserGift', method: 'post', data });
  },
  // 获取打印配置
  getStorePrint(data) {
    return request({ url: '/cash/getStorePrint', method: 'post', data });
  },
  // 通知后端出币异常
  notifySureCoin(data) {
    return request({ url: '/cash/gift/notifySureCoin', method: 'post', data });
  },
  // 查询异常订单
  getAbnormalOrder(data) {
    return request({ url: '/cash/gift/getAbnormalOrder', method: 'post', data });
  },
  // 处理异常订单
  fixAbnormalOrder(data) {
    return request({ url: '/cash/gift/fixAbnormalOrder', method: 'post', data });
  },
  // 处理异常订单后再次异常
  notifySureCoinInAbnormal(data) {
    return request({ url: '/cash/gift/notifySureCoinInAbnormal', method: 'post', data });
  },
  // 收银版本信息
  getVersion(data) {
    return request({ url: '/cash/getVersion', method: 'post', data });
  },
  // 查询优惠券信息
  getCouponsInfo(data) {
    return request({ url: '/cash/exchange/getCouponsInfo', method: 'post', data });
  },
  // 核销优惠券
  useCoupons(data) {
    return request({ url: '/cash/exchange/useCoupons', method: 'post', data });
  },
  // 获取用户列表
  getUserList(data) {
    return request({ url: '/cash/vip/getUserList', method: 'post', data });
  },
  // 公共卡/公关卡开卡
  userOpenVipCard(data) {
    return request({ url: '/cash/vip/userOpenVipCard', method: 'post', data });
  },
  // 获取公关卡公共卡信息
  getVipCardInfo(data) {
    return request({ url: '/cash/vip/getVipCardInfo', method: 'post', data });
  },
  // 开卡支付人民币
  userOpenVipCardPayRMB(data) {
    return request({ url: '/cash/vip/userOpenVipCardPayRMB', method: 'post', data });
  },
  // 解绑实体卡
  userCloseVipCard(data) {
    return request({ url: '/cash/vip/userCloseVipCard', method: 'post', data });
  },
  getCardInfo(data) {
    return request({ url: '/cash/vip/getCardInfo', method: 'post', data });
  },
  // 查询会员基本信息
  getUserBaseInfo(data) {
    return request({ url: '/cash/user/getUserInfo', method: 'post', data });
  },
  // 查询会员基本信息 - 次票
  getUserAllTimeNumGift(data) {
    return request({ url: '/cash/user/getUserAllTimeNumGift', method: 'post', data });
  },
  // 查询会员基本信息 - 操作日志
  getUserOperationDetail(data) {
    return request({ url: '/cash/vip/getUserOperationDetail', method: 'post', data });
  },
  // 公共卡开卡 - 校验卡是否已开通
  checkCardNum(data) {
    return request({ url: '/cash/vip/checkCardNum', method: 'post', data });
  },
  // 修改资料 - 获取验证码
  sendUpdateUserInfoSms(data) {
    return request({ url: '/cash/user/sendSms', method: 'post', data });
  },
  // 修改资料
  editUserVipInfo(data) {
    return request({ url: '/cash/user/editUserVipInfo', method: 'post', data });
  },
  // 玩家消费记录
  getUserNumAndTimeGiftDetail(data) {
    return request({ url: '/cash/user/getUserNumAndTimeGiftDetail', method: 'post', data });
  },
  // 修改玩家信息
  editRealPhotoInfo(data) {
    return request({ url: '/cash/user/editRealPhotoInfo', method: 'post', data });
  },
  // 上传
  upload(data) {
    return request({ url: '/cash/upload', method: 'post', data });
  },
  // 设置登录密码
  updateStaffPwd(data) {
    return request({ url: '/cash/updateStaffPwd', method: 'post', data });
  },
  // 获取全部商品
  getAllPrize(data) {
    return request({ url: '/cash/prize/getAllPrize', method: 'post', data });
  },
  // 获取全部套餐
  getAllGift(data) {
    return request({ url: '/cash/gift/getAllGift', method: 'post', data });
  },
  // 同步离线数据
  cashUploadOrder(data) {
    return request({ url: '/cash/uploadOrder', method: 'post', data });
  },
  // 查询核销码信息
  getCodeInfo(data) {
    return request({ url: '/cash/exchange/getLeagueCodeInfo', method: 'post', data });
  },
  // 查询核销码绑定的套餐信息
  getLeagueCodeGiftInfo(data) {
    return request({ url: '/cash/exchange/getLeagueCodeGiftInfo', method: 'post', data });
  },
  // 核销商品
  checkLeagueCode(data) {
    return request({ url: '/cash/exchange/checkLeagueCode', method: 'post', data });
  },
  // 核销商品
  getLeagueCheckDetail(data) {
    return request({ url: '/cash/exchange/getLeagueCheckDetail', method: 'post', data });
  },
  // 用户发送验证码
  sendUserPhoneCode(data) {
    return request({ url: '/cash/sendUserPhoneCode', method: 'post', data });
  },
  // 修改公关卡密码
  updateCardPwd(data) {
    return request({ url: '/cash/vip/updateCardPwd', method: 'post', data });
  },
  // 临时卡绑定记录
  getCardMigrationDetail(data) {
    return request({ url: '/cash/vip/getCardMigrationDetail', method: 'post', data });
  },
  // 获取可使用的优惠券
  getCanUseCoupons(data) {
    return request({ url: '/cash/getCanUseCoupons', method: 'get', data });
  },

  /**
   * 仓库列表
   * @param {Object} data
   * @param {number} [data.warehouseType] - 仓库类型，0 全部仓库，1 普通仓库，2 机台仓库，默认0
   * @param {number} [data.pageNum] - 第几页
   * @param {number} [data.showNum] - 每页数据条数
   * @returns
   */
  readCoinTicketHouseList(data) {
    return request({ url: '/cash/machine/getWarehouse', method: 'get', data });
  },

  /**
   * 其他收支 - 收支类型列表
   * @param {Object} data
   * @param {string} [data.balanceName] - 类别名称
   * @param {number} [data.balanceType] - 1 收入，2 支出
   * @param {string} [data.startTime] - 开始时间
   * @param {string} [data.endTime] - 截止时间
   * @param {string} [data.sort] - 排序字段
   * @param {string} [data.sortType] - 排序方式，asc 正序，desc 倒序
   * @param {number} data.pageNum - 第几页
   * @param {number} data.showNum - 每页数据条数
   * @returns
   */
  readOtherIOTypeList(data) {
    return request({ url: '/cash/balance/getOtherBalance', method: 'get', data });
  },

  /**
   * 其他收支 - 创建订单
   * @param {Object} data
   * @param {number} data.payValue - 金额，单位：分
   * @param {string} data.backup - 备注
   * @param {number} data.type - 授权方式，1 验证码，3 扫码
   * @param {string} [data.openId] - openid，type为3时必传
   * @param {string} [data.phone] - 手机号，type为1时必传
   * @param {string} [data.code] - 验证码，type为1时必传
   * @param {number} data.balanceId - 类别id
   * @returns
   */
  createOtherIOOrder(data) {
    return request({ url: '/cash/balance/incomeAndExpend', method: 'post', data });
  },

  /**
   * 其他收支 - 创建记录
   * @param {Object} data
   * @param {number} data.orderId - 订单id
   * @param {number} data.type - 支付类型，1 现金，2 扫码
   * @param {string} [data.authNo] - 支付码，type为2时必传
   * @returns
   */
  createOtherIORecord(data) {
    return request({ url: '/cash/balance/incomeAndExpendPay', method: 'post', data });
  },

  /**
   * 其他收支 - 收支明细
   * @param {Object} data
   * @param {string} [data.balanceName=""] - 类别名称
   * @param {string} [data.adminName=""] - 授权员工姓名
   * @param {number} [data.balanceType=""] - 收支类型，1 收入，2 支出
   * @param {string} [data.staffName=""] - 收银员姓名
   * @param {string} [data.startTime=""] - 开始时间
   * @param {string} [data.endTime=""] - 截止时间
   * @param {string} [data.sort=""] - 排序字段
   * @param {string} [data.orderBy=""] - 排序方式，asc 正序，desc 倒序
   * @param {number} data.pageNum - 第几页
   * @param {number} data.showNum - 每页数据条数
   * @returns
   */
  readOtherIORecord(data) {
    return request({ url: '/cash/balance/getIncomeAndExpendDetail', method: 'get', data });
  },

  /** 套餐销售 - 作废销售记录
   * @param {Object} data
   * @param {number} data.orderId - 订单id
   * @param {number} data.type - 授权方式，1 验证码，3 扫码
   * @param {string} [data.phone=""] - 手机号，type为1时必传
   * @param {string} [data.code=""] - 验证码，type为1时必传
   * @param {string} [data.openId=""] - 验证码，type为3时必传
   * @returns
   */
  updateDiscardPackage(data) {
    return request({ url: '/cash/gift/invalidCoinGift', method: 'put', data });
  },
};
