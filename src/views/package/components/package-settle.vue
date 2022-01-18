<template>
  <div class="settle-page" v-loading="loading">
    <div class="overview-box">
      <h3 style="color: #333333">订单号：{{ orderInfo.orderId }}</h3>
      <h3 style="color: #333333">
        金额：{{ orderInfo.offValueSum | MIXIN_CeilIntegral | MIXIN_Points2Yuan }} （{{ orderInfo.coinValueSum }}积分）
        （{{ orderInfo.gameCoinSum }}游戏币）
      </h3>
      <el-button type="danger" @click="$router.replace('/package/package-sales')">取消购买</el-button>
    </div>
    <el-row>
      <el-col :span="6" v-if="orderInfo.starPayFlag === 1 || orderInfo.cionPayFlag === 1">
        <div class="star-coin-container">
          <div class="bc-title">消耗积分/游戏币</div>
          <img src="@/assets/scan-user.png" style="width: 184px; margin: 45px 0" />
          <div class="scan-title" @click="openScanUserInfoModal">点击扫码识别会员信息</div>
          <div v-if="uid">
            <p>
              <span>会员ID：</span>
              <span class="user-id">{{ uid || '暂无' }}</span>
            </p>
            <p>
              <span>剩余积分：</span>
              <span class="user-coins">{{ userStarCoin }}</span>
            </p>
            <p>
              <span>剩余本币：</span>
              <span class="user-coins">{{ userGameCoin }}</span>
            </p>
            <div v-if="orderInfo.starPayFlag === 1">
              <el-radio v-model="payIndex" label="1">积分支付：</el-radio>
              <el-input v-model="payNum" placeholder="请输入消耗积分" @focus="onPayFocus(1)"></el-input>
            </div>
            <br />
            <div v-if="orderInfo.cionPayFlag === 1 && !orderInfo.useCoupons" @click="onPayFocus(2)">
              <el-radio v-model="payIndex" :disabled="orderInfo.gameCoinSum == 0" label="2">游戏币支付：</el-radio>
              <el-input v-model="payIconNum" placeholder="请输入消耗游戏币" disabled @focus="onPayFocus(2)"></el-input>
            </div>
            <!-- <el-input v-model="payNum" placeholder="请输入消耗积分"></el-input> -->
            <el-button style="margin-top: 20px" type="primary" @click="openConfirmModal">确定</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right-container">
          <div class="bc-title">支付金额</div>
          <div class="left-total flex-center">
            <div style="font-size: 18px; color: #333333; font-weight: 500">待支付金额:</div>
            <div style="color: #f32525; font-size: 35px; font-weight: bold; margin-top: 6px">
              ￥{{ leftTotalFee | MIXIN_Points2Yuan }}元
            </div>
          </div>
          <div class="bc-title">
            支付方式
            <el-tag type="warning" v-if="!isScanCode && uid1 == '' && !loading"
              >本套餐单价已超过套餐限额时，非会员仅支持现金支付；会员线上支付金额已超过门店线上支付限额，仅支持现金支付</el-tag
            >
            <el-tag type="warning" v-if="!isScanCode && uid1 !== '' && !loading"
              >会员线上支付金额已超过门店线上支付限额，仅支持现金支付</el-tag
            >
          </div>
          <div class="pay-way">
            <div
              v-if="!$store.state.offline && isScanCode && !loading"
              class="item flex-center"
              @click="openUserPayByScanModal"
            >
              <img src="@/assets/open-public-relation-card/scan-pay.png" style="width: 50px; margin-right: 20px" />
              <div>扫码支付</div>
            </div>
            <div class="item flex-center" @click="sureGetRMB" v-if="cashPayments">
              <img src="@/assets/open-public-relation-card/money-pay.png" style="width: 50px; margin-right: 20px" />
              <div>现金支付</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showScanUserInfoModal"
      custom-class="success-dialog"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div
        style="
          text-align: center;
          padding: 18px 0;
          font-size: 24px;
          font-weight: bold;
          border-bottom: 1px solid #cccccc;
        "
      >
        提示
      </div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描用户二维码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="closeScanUserInfoModal">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="showConfirmUserStartCoinModal"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <h4>确定使用{{ payNum }}积分支付订单吗？<br /><br />如果消耗积分不足以支付订单，则剩余金额需使用现金支付</h4>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="showConfirmUserStartCoinModal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handlePayStarCoin">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showScanModal"
      :show-close="false"
      custom-class="success-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div
        style="
          text-align: center;
          padding: 18px 0;
          font-size: 24px;
          font-weight: bold;
          border-bottom: 1px solid #cccccc;
        "
      >
        提示
      </div>
      <div class="flex-center" style="margin: 40px 0">
        <img src="@/assets/scan-icon.png" style="width: 54px; margin-right: 24px" />
        <div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">请扫描付款码......</div>
          <div style="font-size: 23px; font-weight: bold; color: #616161">扫描中请不要触碰键盘按键</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScanModal">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showSuccessModal"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div style="text-align: center">
        <i class="el-icon-success" style="color: #4194fe; font-size: 108px"></i>
        <div style="font-size: 28px; font-weight: bold; margin-top: 36px">购买成功</div>
        <div
          @click="$router.replace('/package/package-sales')"
          style="
            margin: 36px auto 0;
            width: 400px;
            cursor: pointer;
            border-radius: 10px;
            text-align: center;
            font-size: 24px;
            padding: 12px 0;
            color: #ffffff;
            background-color: #4194fe;
          "
        >
          返回
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { to } from '@/utils/tools';
import { isPositiveFloat } from '../../../utils/validate';
import { getToken } from '../../../utils/auth';

export default {
  name: 'settle',
  data() {
    return {
      showSuccessModal: false,
      loading: false,
      orderInfo: {
        orderId: '',
        offValueSum: '',
        coinValueSum: '',
      },
      giftInfo: {},
      ticketHeight: 0,
      // 支付积分
      showScanUserInfoModal: false,
      uid: '',
      userStarCoin: '0',
      userGameCoin: '0',
      payNum: '',
      payIconNum: '',
      payIndex: '1',
      showConfirmUserStartCoinModal: false,
      // 右边待支付金额
      leftTotalFee: '',
      // 扫码支付弹窗
      showScanModal: false,
      userPayId: '',
      timer: -1,
      // 是否可以现金支付
      cashPayments: true,
      // 次票二维码信息
      codeInfoList: [],
      giftLimit: '', // 套餐限额
      payLimit: '', // 会员今日已用
      uid1: '', // 从上个页面来的uid
      isScanCode: false, // 显示扫码
    };
  },
  methods: {
    getHeight(value) {
      this.ticketHeight += value || 25;
      return this.ticketHeight;
    },
    onPayFocus(index) {
      if (index == 2 && this.orderInfo.gameCoinSum == 0) {
        return;
      }
      this.payIndex = index.toString();
    },
    async printTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统');
        return;
      }
      const printFlag = Number(sessionStorage.getItem('printFlag'));
      if (printFlag) {
        let p;
        if (this.$store.state.offline) {
          const db = await this.$db.openDB('offlineDB');
          const printInfo = await this.$db.getDataByIndex(db, 'printFormat', 'code', 'GIFT_SALE');
          if (printInfo) {
            p = printInfo;
          }
        } else {
          const [err, res] = await to(this.$api.getStorePrint({ code: 'GIFT_SALE' }));
          if (res) {
            p = res.body.printInfo;
          }
        }
        if (p.printFlag) {
          LODOP.PRINT_INIT('');
          // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
          LODOP.SET_PRINT_STYLE('FontSize', 8);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单编号：${this.orderInfo.orderId}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `商品：${this.giftInfo.giftName}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：${this.orderInfo.count}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `单价：￥${this.MIXIN_Points2Yuan(this.giftInfo.price)}`);
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `小计：￥${this.MIXIN_Points2Yuan(this.$calc.accMul(this.giftInfo.price, this.orderInfo.count))}`
          );
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `----------------------------`);
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `已优惠金额：￥${this.MIXIN_Points2Yuan(this.orderInfo.discountMoney)}`
          );
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `总计：￥${this.MIXIN_Points2Yuan(this.orderInfo.offValueSum)}`
          );
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`);
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme);
          if (this.codeInfoList.length && this.giftInfo.type === 2) {
            this.codeInfoList.forEach((item, index) => {
              const h = index === 0 ? 0 : 150;
              const qrcode = `${process.env.VUE_APP_CASHPAGEJUMP}?codeType=${item.codeType}&uid=${item.uid}&couponsCode=${item.code}&pageType=verification`;
              LODOP.ADD_PRINT_BARCODE(this.getHeight(h), 25, 170, 170, 'QRCode', qrcode);
              LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 7);
              console.log(qrcode);
            });
          }
          // LODOP.PRINT_DESIGN()
          // LODOP.PREVIEW()
          LODOP.PRINT();
          this.ticketHeight = 0;
          callback && callback();
        } else {
          callback && callback();
        }
      }
    },
    // 关闭扫描用户二维码弹窗
    closeScanUserInfoModal() {
      document.onkeydown = null;
      this.showScanUserInfoModal = false;
    },
    // 打开扫描用户信息二维码弹窗
    openScanUserInfoModal() {
      this.uid = '';
      this.showScanUserInfoModal = true;
      document.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          this.uid += e.key;
        } else {
          this.uid = this.uid.replace(/\s+/g, '');
          this.uid = this.uid.replace(/shift|capslock/gi, '');
          document.onkeydown = null;
          this.loading = true;
          this.$api
            .getUserInfo({ uid: this.uid })
            .then((res) => {
              this.uid = res.body.uid;
              this.userStarCoin = res.body.starCoinNum;
              this.userGameCoin = res.body.coin;
            })
            .catch((e) => {
              this.userStarCoin = '0';
              this.userGameCoin = '0';
              this.uid = '';
            })
            .finally(() => {
              this.showScanUserInfoModal = false;
              this.loading = false;
            });
        }
      };
    },
    // 支付积分
    handlePayStarCoin() {
      this.loading = true;
      this.$api
        .packsUserPayStarCoin({
          orderId: this.orderInfo.orderId,
          uid: this.uid,
          payNum: Number(this.payNum),
        })
        .then((res) => {
          if (Number(this.payNum) === Number(this.orderInfo.coinValueSum)) {
            // 积分支付完成
            this.$message.success('购买完成');
            this.codeInfoList = res.body.codeInfoList || [];
            this.printTicket();
            // 如果需要出币则开始出币  售币套餐、组合套餐
            if (this.giftInfo.coinNum && !this.orderInfo.isVirtual && !this.orderInfo.isManual) {
              this.$root.$children[0].sendCoin(
                this.$calc.accMul(this.giftInfo.coinNum, this.orderInfo.count),
                this.orderInfo.orderId
              );
              this.$router.replace('/package/package-sales');
            } else {
              // 时间套餐、次票套餐
              this.showSuccessModal = true;
            }
          } else {
            // 还需要补现金
            this.leftTotalFee = Math.ceil(
              this.$calc.Subtr(this.orderInfo.offValueSum, this.MIXIN_Integral2PointsFloor(this.payNum))
            );
            this.userStarCoin = this.$calc.Subtr(this.userStarCoin, this.payNum);
            this.payNum = '';
            this.showConfirmUserStartCoinModal = false;
            this.$message.info('积分扣除成功，请继续支付剩余金额');
            this.cashPayments = false;
          }
        })
        .finally((f) => {
          this.loading = false;
        });
    },
    // 支付类型： type  1 现金支付  2 扫码支付
    sureGetRMB() {
      document.onkeydown = (e) => {
        if (e.key == 'Enter') {
          return false;
        }
      };
      this.$confirm('确认已收到现金?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          if (this.$store.state.offline) {
            const db = await this.$db.openDB('offlineDB');
            const orderInfo = {
              orderGift: [
                {
                  giftId: this.giftInfo.giftId,
                  coin: this.giftInfo.coin,
                  awardCoinNum: this.giftInfo.awardCoinNum,
                  coinNum: this.giftInfo.coinNum,
                  name: this.giftInfo.giftName,
                  price: this.giftInfo.price,
                  count: this.orderInfo.count,
                },
              ],
              orderId: this.orderInfo.orderId,
              moduleId: sessionStorage.getItem('moduleId'),
              moduleName: sessionStorage.getItem('moduleName'),
              uid: 0,
              giftName: this.giftInfo.giftName,
              type: this.giftInfo.type,
              coinType: 3,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              status: 1,
              offValueSum: this.orderInfo.offValueSum,
              coinValueSum: this.orderInfo.coinValueSum,
              valuePayType: 3,
              payCoin: 0,
              payValue: this.orderInfo.offValueSum,
              name: sessionStorage.getItem('staffName'),
              auditor: '',
            };
            await this.$db.addData(db, 'giftRecord', orderInfo);
            this.$message.success('购买完成');
            this.printTicket();
            this.$router.replace('/package/package-sales');
          } else {
            this.loading = true;
            this.$api
              .packsSureGetRMB({ orderId: this.orderInfo.orderId, type: 1 })
              .then((res) => {
                this.$message.success('购买完成');
                this.codeInfoList = res.body.codeInfoList || [];
                this.printTicket();
                // 如果需要出币则开始出币  售币套餐、组合套餐
                if (this.giftInfo.coinNum && !this.orderInfo.isVirtual && !this.orderInfo.isManual) {
                  this.$root.$children[0].sendCoin(
                    this.$calc.accMul(this.giftInfo.coinNum, this.orderInfo.count),
                    this.orderInfo.orderId
                  );
                  this.$router.replace('/package/package-sales');
                } else {
                  // 时间套餐、次票套餐
                  this.showSuccessModal = true;
                }
              })
              .finally(() => {
                this.loading = false;
              });
          }
        })
        .catch(() => {});
    },
    closeScanModal() {
      this.$confirm('是否确认取消支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          document.onkeydown = null;
          this.showScanModal = false;
          this.loading = false;
        })
        .catch(() => {});
    },
    openUserPayByScanModal() {
      if (Number(this.orderInfo.offValueSum) === 0) {
        this.loading = true;
        this.$api
          .packsSureGetRMB({
            orderId: this.orderInfo.orderId,
            type: 2,
            authNo: '',
          })
          .then((res) => {
            this.loading = false;
            this.$message.success('购买完成');
            this.codeInfoList = res.body.codeInfoList || [];
            this.printTicket();
            // 如果需要出币则开始出币  售币套餐、组合套餐
            if (this.giftInfo.coinNum && !this.orderInfo.isVirtual && !this.orderInfo.isManual) {
              this.$root.$children[0].sendCoin(
                this.$calc.accMul(this.giftInfo.coinNum, this.orderInfo.count),
                this.orderInfo.orderId
              );
              this.$router.replace('/package/package-sales');
            } else {
              // 时间套餐、次票套餐
              this.showSuccessModal = true;
            }
          });
      } else {
        this.userPayId = '';
        this.showScanModal = true;
        document.onkeydown = (e) => {
          if (e.key !== 'Enter') {
            this.userPayId += e.key;
          } else {
            this.userPayId = this.userPayId.replace(/\s+/g, '');
            this.userPayId = this.userPayId.replace(/shift|capslock/gi, '');
            document.onkeydown = null;
            this.loading = true;
            this.$api
              .packsSureGetRMB({
                orderId: this.orderInfo.orderId,
                type: 2,
                authNo: this.userPayId,
              })
              .then((res) => {
                if (res.body.status === 1) {
                  this.$message.success('购买完成');
                  this.showScanModal = false;
                  this.loading = false;
                  this.codeInfoList = res.body.codeInfoList || [];
                  this.printTicket();
                  // 如果需要出币则开始出币  售币套餐、组合套餐
                  if (this.giftInfo.coinNum && !this.orderInfo.isVirtual && !this.orderInfo.isManual) {
                    this.$root.$children[0].sendCoin(
                      this.$calc.accMul(this.giftInfo.coinNum, this.orderInfo.count),
                      this.orderInfo.orderId
                    );
                    this.$router.replace('/package/package-sales');
                  } else {
                    // 时间套餐、次票套餐
                    this.showSuccessModal = true;
                  }
                } else {
                  this.timer = setInterval(() => {
                    this.queryOrder();
                  }, 5000);
                }
              })
              .catch((e) => {
                this.showScanModal = false;
                this.loading = false;
              });
          }
        };
      }
    },
    // 查询订单支付状态  flag: 0 :未支付 , 1:已支付
    queryOrder() {
      this.$api
        .queryOrder({ outTradeNo: this.orderInfo.orderId })
        .then((res) => {
          if (res.body.flag === 1) {
            clearInterval(this.timer);
            this.$message.success('购买完成');
            this.showScanModal = false;
            this.loading = false;
            this.codeInfoList = res.body.codeInfoList || [];
            this.printTicket();
            // 如果需要出币则开始出币  售币套餐、组合套餐
            if (this.giftInfo.coinNum && !this.orderInfo.isVirtual && !this.orderInfo.isManual) {
              this.$root.$children[0].sendCoin(
                this.$calc.accMul(this.giftInfo.coinNum, this.orderInfo.count),
                this.orderInfo.orderId
              );
              this.$router.replace('/package/package-sales');
            } else {
              // 时间套餐、次票套餐
              this.showSuccessModal = true;
            }
          }
        })
        .catch((e) => {
          this.showScanModal = false;
          this.loading = false;
          clearInterval(this.timer);
        });
    },
    openConfirmModal() {
      if (this.payIndex == 1) {
        if (!isPositiveFloat.test(this.payNum)) {
          this.$message.error('请输入正确的数字');
          return;
        }
        if (Number(this.payNum) < 0) {
          this.$message.error('请输入正确的正数');
          return;
        }
        if (Number(this.payNum) > this.userStarCoin) {
          this.$message.error('输入数量大于玩家剩余积分数');
          return;
        }
        if (Number(this.payNum) > this.orderInfo.coinValueSum) {
          this.$message.error('输入数量大于订单总额');
          return;
        }
        this.showConfirmUserStartCoinModal = true;
      } else if (this.payIndex == 2) {
        if (Number(this.payIconNum) < this.orderInfo.gameCoinSum) {
          this.$message.error('玩家游戏币数量不足');
          return;
        }
        this.loading = true;
        this.$api
          .userPayGiftGameCoin({
            uid: this.uid,
            orderId: this.orderInfo.orderId,
            payNum: this.payIconNum,
          })
          .then((res) => {
            this.codeInfoList = res.body.codeInfoList || [];
            this.loading = false;
            this.$message.success('购买完成');
            this.printTicket();
            this.$router.replace('/package/package-sales');
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    // 套餐限额查询
    async getinfo() {
      this.loading = true;
      // 普通人
      await this.$api
        .getStorePayLimit({})
        .then((res) => {
          this.showScanModal = false;
          clearInterval(this.timer);
          this.giftLimit = res.body.giftLimit == '' ? 0 : res.body.giftLimit;
          if (this.uid1 == '') {
            this.setScanCode(1);
          } else {
            this.giftLimit = res.body.payLimit == '' ? 0 : res.body.payLimit; // 支付限额
          }
        })
        .catch((e) => {
          this.showScanModal = false;
          clearInterval(this.timer);
        });
      if (this.uid1 !== '' && this.giftLimit !== 0) {
        // 有身份的会员
        await this.$api
          .getUserInfo({ uid: this.uid1 })
          .then((res) => {
            this.showScanModal = false;
            clearInterval(this.timer);
            this.payLimit = res.body.payLimit == '' ? 0 : res.body.payLimit;
            this.setScanCode(2);
          })
          .catch((e) => {
            this.showScanModal = false;
            clearInterval(this.timer);
          });
      }
    },
    setScanCode(n) {
      // 是否显示扫码按钮
      if (n == 1) {
        if (this.giftLimit <= this.orderInfo.offValueSum && this.giftLimit !== 0) {
          // 已超出今日限额
          this.isScanCode = false;
        } else {
          this.isScanCode = true;
        }
      }
      if (n == 2) {
        const giftLimit = this.$calc.accAdd(this.payLimit, this.orderInfo.offValueSum);
        if (giftLimit > this.giftLimit) {
          this.isScanCode = false;
        } else {
          this.isScanCode = true;
        }
      }
      this.loading = false;
    },
  },
  created() {
    const params = this.$route.params;
    this.uid1 = params.uid;
    delete params.uid;
    console.log(params);
    this.isScanCode = true;
    if (params.orderId) {
      this.orderInfo = params;
      this.leftTotalFee = params.offValueSum;
      this.giftInfo = params.gift;
      this.payIconNum = this.orderInfo.gameCoinSum;
      this.orderInfo.cionPayFlag = params.gift.gameCoinBuy;

      if (!this.orderInfo.starPayFlag) {
        this.payIndex = '2';
      }
      // 币套餐
      console.log(params.gift.type, 'params.gift.type');
      if (params.gift.type == 1) {
        this.getinfo();
      }
    } else {
      this.$message.error('获取订单信息异常，请重新下单');
      this.$router.replace('/package/package-sales');
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin';

/deep/ .success-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.settle-page {
  width: 100%;
  height: 100%;

  .overview-box {
    background-color: #ffffff;
    width: 100%;
    @include flex(flex-start, center, row);
    font-weight: bold;
    padding: 8px 20px;
    margin-bottom: 20px;

    h3 {
      margin-right: 140px;
    }
  }

  .star-coin-container {
    padding: 20px 70px;
    display: flex;
    flex-direction: column;
    height: 80vh;
    margin-right: 20px;
    border-right: 1px solid #cccccc;

    .scan-title {
      border-radius: 8px;
      width: 200px;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      background-color: #4194fe;
      padding: 16px;
    }
  }

  .right-container {
    padding: 20px 0 0 80px;
    height: 668px;

    .left-total {
      margin-top: 41px;
      margin-bottom: 41px;
      flex-direction: column;
      width: 40vw;
      height: 30vh;
      background: #ffffff;
      border: 1px solid #7a7a80;
      border-radius: 20px;
      padding: 80px 0;
      text-align: center;
    }

    .pay-way {
      @include flex(space-between, center, row);
      margin-top: 41px;
      width: 40vw;

      .item {
        color: #616161;
        font-weight: bold;
        text-align: center;
        line-height: 120px;
        width: 222px;
        height: 96px;
        background: #ffffff;
        border: 2px solid #4194fe;
        border-radius: 10px;
      }
    }
  }
}
</style>
