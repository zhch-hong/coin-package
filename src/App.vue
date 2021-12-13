<template>
  <div
    id="app"
    v-loading="appLoading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    :element-loading-text="appLoadingInfo"
  >
    <router-view />
    <!--        测试出币用-->
    <el-dialog
      title="选择收银吐币机"
      :visible.sync="showSelectPortModal"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table highlight-current-row :data="portsList" style="width: 100%">
        <el-table-column prop="path" label="串口名称"></el-table-column>
        <el-table-column prop="productId" label="ID" width="180"></el-table-column>
        <el-table-column prop="serialNumber" label="串口号"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleChangePort(scope.row)">选择</el-button>
            <el-button type="text" @click="testSendCoin(scope.row)">测试出币</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="正在出币中..."
      :visible.sync="showSendCoinsModal"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="text-align: center; font-weight: bold; font-size: 24px">
        <span style="color: #409eff">{{ hasSendCoins }}</span>
        /
        <span>{{ needSendCoins }}</span>
      </div>
      <div v-if="false" class="flex-center" style="margin: 24px 0 0; user-select: none" v-loading="pauseButtonLoading">
        <img style="width: 130px; cursor: pointer" @click="toggleSendCoinState" :src="getSendCoinIcon" />
      </div>
      <div slot="footer">
        <el-button :loading="isSendCoins" @click="showSendCoinsModal = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    设置密码-->
    <el-dialog
      title="设置密码"
      :visible.sync="setPwdModal"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
    >
      <div>
        <el-alert
          title="请设置登录密码，否则在离线模式下该账户将不可使用"
          show-icon
          :closable="false"
          type="info"
        ></el-alert>
        <el-form
          style="margin-top: 12px"
          ref="passwordForm"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="80px"
        >
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="passwordForm.password" size="mini" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              size="mini"
              type="password"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="setPwdLoading" type="primary" size="mini" @click="handleOnSetPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import electron from 'electron';
import moment from 'moment';
import SerialPort from 'serialport';
import { compareVersion, to } from '@/utils/tools';
import log from 'electron-log';
import { getToken, removeToken } from '@/utils/auth';
import pauseSendCoinImg from './assets/pauseSendCoin.png';
import sendCoinImg from './assets/sendCoin.png';

const { dialog, app, getCurrentWindow } = electron.remote;
const { ipcRenderer } = electron;

export default {
  name: 'electron-vue',
  data() {
    const validateConfirmPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      appLoading: false,
      appLoadingInfo: '',
      sendCoinBack: null,
      showSendCoinsModal: false,
      isSendCoins: false,
      isDev: process.env.VUE_APP_ENV === 'development',
      showSelectPortModal: false,
      portsList: [],
      orderId: '',
      sureCoin: 0, // 异常处理，代表异常下已出过的币数
      isErrorSendCoin: false, // 是否是异常订单出币
      needSendCoins: 0, // 需要出的币数
      coinType: 1, // 1正常出币，2全部出币
      hasSendCoins: 0, // 当前已出的币数
      coinsPort: null, // 吐币机机台串口
      heartbeatTimer: null, // 心跳测试定时器
      /** 上一次心跳指令序号，默认和 heartbeatNum 相同 */
      prevHeartbeatNum: 1,
      heartbeatNum: 1, // 心跳测试指令序号 ，从1开始递增
      responseTimer: null, // 机台回复定时器，超过3秒未回复则为发生错误
      responseError: false,
      responseNum: 0, // D1指令序号
      isPause: false, // 是否处于暂停出币状态
      pauseButtonLoading: false,
      port: 0,
      setPwdModal: false,
      setPwdLoading: false,
      passwordForm: {
        password: '',
        confirmPassword: '',
      },
      passwordRules: {
        password: { required: true, message: '请输入正确的密码' },
        confirmPassword: { required: true, validator: validateConfirmPwd },
      },
    };
  },

  watch: {
    $route(to, from) {
      if (to.query.pwdFlag && to.query.pwdFlag === -1) {
        this.passwordForm.password = '';
        this.passwordForm.confirmPassword = '';
        this.setPwdModal = true;
      }
    },
    responseError(err) {
      if (err) {
        console.error('机台发生错误');
        this.isSendCoins = false;
        this.responseError = false;
      }
    },
    showSelectPortModal(value) {
      if (value) {
        this.readPortsTimer = setInterval(async () => {
          this.portsList = await SerialPort.list();
        }, 2000);
      } else {
        clearInterval(this.readPortsTimer);
      }
    },
  },

  computed: {
    getSendCoinIcon() {
      if (this.isPause) return sendCoinImg;
      return pauseSendCoinImg;
    },
  },

  async created() {
    log.info('app created');

    const that = this;
    ipcRenderer.on('getVersion', (event, arg) => {
      if (process.env.NODE_ENV !== 'development') that.checkVersion(arg);
    });
    ipcRenderer.on('download', (event, arg) => {
      that.appLoadingInfo = `收银系统正在更新中 ${Number(arg.percent * 100).toFixed(2)}%` + `...`;
    });
    ipcRenderer.on('before-logout', async () => {
      if (getToken()) {
        await this.$api.cashLoginOut({});
      }
      ipcRenderer.send('logout');
    });
    app.getNewVersion();
    this.setPort();
  },

  methods: {
    async setPort() {
      const ports = await SerialPort.list();
      this.portsList = ports;

      if (this.portsList.length === 0) {
        this.$message.error('没有发现吐币机，请连接吐币机后点击重置机台');
        return;
      }

      let port = localStorage.getItem('port');
      if (port === null) {
        this.showSelectPortModal = true;
      } else {
        port = JSON.parse(port);
        const index = ports.findIndex(({ path }) => path === port.path);
        if (index === -1) {
          this.showSelectPortModal = true;
        } else {
          this.handleChangePort(port);
        }
      }
    },

    handleChangePort(port) {
      localStorage.setItem('port', JSON.stringify(port));
      this.$store.commit('UPDATE_CONNECT_PORT', true);
      this.port = port;
      this.showSelectPortModal = false;
      this.connectPort(port);
    },

    async connectPort(port) {
      const serialPort = new SerialPort(port.path, {
        baudRate: 115200,
      });
      this.coinsPort = serialPort;

      serialPort.on('open', () => {
        log.info(`打开串口成功[${port.path}]`);
        console.log(`打开串口成功${port.path}`);
        const ByteLength = SerialPort.parsers.ByteLength;
        const parser = serialPort.pipe(new ByteLength({ length: 15 }));

        // 开启心跳连接
        this.heartbeat();

        parser.on('data', (res, err) => {
          if (err) {
            this.$alert('机台回复发生了错误', '提示', { type: 'error' });
            this.isSendCoins = false;
          } else {
            console.log(`${moment().format('YYYY/M/D H:mm:ss')}，指令回复，${JSON.stringify(res)}`);

            // log.info('machine response data')
            // log.info(this.buffer2Array(res).map((item) => this.getNumber(item)[0]))

            // 请求头出错
            if (res[0] !== 170) {
              this.$message.error('指令信息有误，重置机台链接');
              this.isSendCoins = false;
              log.error('machine has an error , please restart machine and try again:');
              log.error(this.buffer2Array(res).map((item) => this.getNumber(item)[0]));
              this.resetError();
              return;
            }

            // 机台报错
            if (res[11] === 1) {
              console.log(`机台报错${res[11]}`);

              if (Number(this.coinType) === 1) {
                this.responseError = true;
                this.$nextTick(() => {
                  this.resetError();
                });
              }

              log.error('machine has an error ,buy i dont know what happened');
              log.error(this.buffer2Array(res).map((item) => this.getNumber(item)[0]));

              this.callBack();
              return;
            }
            // 209 向机台发出出币指令，机台出币时的回复，160 向机台发出心跳检测指令时的回复
            if (res[2] === 209) {
              // 出币D1指令回复
              this.responseSendCoins(res);
            } else if (res[2] === 160) {
              // 下一次心跳时会将这个数放进 hex 表中发送到机台
              this.prevHeartbeatNum = this.heartbeatNum;
              this.heartbeatNum++;
            }
          }
        });
      });

      serialPort.on('error', (error) => {
        this.$alert(`打开串口${port.path}失败，请连接机台后重启软件`, '连接失败', { type: 'error' })
          .then(() => {
            //
          })
          .catch(() => {
            //
          });
      });

      serialPort.on('close', (error) => {
        this.$alert(`打开串口${port.path}失败，请连接机台后重启软件`, '连接失败', { type: 'error' })
          .then(() => {
            //
          })
          .catch(() => {
            //
          });
      });
    },

    /**
     * 心跳指令
     */
    heartbeat() {
      console.log('开始心跳测试');
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => {
        const hexData = [
          '0xaa',
          '0x0c',
          '0xa0',
          '0x01', // 指令序号
          '0x00',
          '0x00',
          '0x00',
          '0x00',
          '0x00',
          '0x00',
          '0x00',
          '0x00',
          '0xad',
          '0xbb',
        ];
        hexData[3] = this.getNumber(this.heartbeatNum)[0];
        // 校验和
        let totalCode = 0;
        for (let i = 1; i < 12; i++) {
          totalCode += Number(hexData[i].toString(10));
        }
        hexData[12] = this.getNumber(totalCode)[0];

        this.coinsPort.write(hexData, (err) => {
          if (err) {
            console.error(`心跳检测链接失败${err.message}`);
          } else {
            console.log(`${moment().format('YYYY/M/D H:mm:ss')}，发送指令，${hexData}`);
          }
        });

        // ignoreLoopConnect 忽略心跳指令检测状态
        if (this.ignoreLoopConnect === true) {
          return;
        }

        setTimeout(() => {
          console.log(this.prevHeartbeatNum, this.heartbeatNum, this.loopConnectFaild);
          if (this.prevHeartbeatNum === this.heartbeatNum) {
            if (typeof this.loopConnectFaild !== 'undefined') return;

            const win = getCurrentWindow();
            win.focus();
            this.loopConnectFaild = dialog
              .showMessageBox(win, {
                message: '连接机台失败',
                type: 'error',
                buttons: ['更换机台', '忽略'],
                defaultId: 2,
                title: '错误',
                detail: '继续连接将在3秒后尝试重连机台',
                cancelId: -1,
              })
              .then(({ response }) => {
                if (response === -1 || response === 1) {
                  this.ignoreLoopConnect = true;
                } else if (response === 0) {
                  clearInterval(this.heartbeatTimer);
                  this.showSelectPortModal = true;
                } else {
                  // 继续连接，不做处理，3s后继续发送心跳检测指令
                }
              })
              .catch((error) => {
                console.log(error.message);
              })
              .finally(() => {
                this.loopConnectFaild = undefined;
              });
          }
        }, 1000);
      }, 3000);
    },

    /**
     * 向机台发出出币指令后，机台回复时的处理函数
     */
    responseSendCoins(hexData) {
      clearTimeout(this.responseTimer);
      // console.log(`@机台指令：${hexData}`)
      if (this.responseNum !== hexData[3]) {
        // console.log(`有效指令:${hexData[9]},${Number(hexData[9].toString(10))}`)
        // 如果和上一次的指令序号不同,说明不是重复指令，需要加已出币数
        this.hasSendCoins += Number(hexData[9].toString(10));
        this.responseNum = hexData[3];
      }
      const resData = [
        '0xaa', // 0
        '0x0c', // 1
        '0xd1', // 2 指令类型：C1 出币  D1 回复出币指令 c4清除故障
        '0x01', // 3 序号
        '0x00', // 4
        '0x00', // 5
        '0x00', // 6
        '0x00', // 7
        '0x00', // 8
        '0x00', // 9
        '0x00', // 10
        '0x00', // 11
        '0xd9', // 12
        '0xbb', // 13
      ];
      // 指令序号  256之后从0开始计数
      resData[3] = this.getNumber(hexData[3])[0];
      // 本次出币数，256 进1
      const [needCoinsLow, needCoinsHigh] = this.getNumber(this.needSendCoins);
      resData[5] = needCoinsLow;
      resData[6] = needCoinsHigh;
      // 已出币数，256 进1
      const [hasSendCoinsLow, hasSendCoinsHigh] = this.getNumber(this.hasSendCoins);
      resData[7] = hasSendCoinsLow;
      resData[8] = hasSendCoinsHigh;
      // 校验和
      let totalCode = 0;
      for (let i = 1; i < 12; i++) {
        totalCode += Number(resData[i].toString(10));
      }
      resData[12] = this.getNumber(totalCode)[0];

      console.log(
        `${moment().format('YYYY/M/D H:mm:ss')}，已出币${this.hasSendCoins}，应出币${
          this.needSendCoins
        }，发送指令，${JSON.stringify(resData)}`
      );

      // 开始答复
      this.coinsPort.write(resData, (err) => {
        if (err) {
          console.log(err);
        } else {
          // 如果当前处于暂停状态，则回复的d1指令不再处理异常
          if (!this.isPause) {
            // 设置定时器，等待时间内如果没有回应，则机台出现异常
            this.responseTimer = setTimeout(() => {
              console.log('@response error');
              if (this.isPause) return;
              if (this.coinType === 1) {
                this.responseError = true;
                this.sendError();
              }
              this.callBack();
            }, 3000);
          }

          // 已经出完币了 ,初始化数据，重新开始心跳指令
          if (this.hasSendCoins >= this.needSendCoins) {
            console.log('出币结束，重新开始心跳指令');
            this.showSendCoinsModal = false;
            this.isSendCoins = false;
            this.prevHeartbeatNum = 1;
            this.heartbeatNum = 1;
            this.hasSendCoins = 0;
            this.needSendCoins = 0;
            this.responseNum = 0;
            this.orderId = '';
            this.sureCoin = 0;
            clearTimeout(this.responseTimer);

            this.$store.dispatch('getMachineCoinNum');
            this.heartbeat();
          }
        }
      });
    },

    async logout() {
      this.$api.cashLoginOut({}).finally((f) => {
        removeToken();
        sessionStorage.clear();
        this.$router.replace({ path: '/login' });
      });
    },
    handleOnSetPwd() {
      this.$refs.passwordForm.validate(async (v) => {
        if (v) {
          this.setPwdLoading = true;
          const [err, res] = await to(this.$api.updateStaffPwd({ pwd: this.passwordForm.password }));
          this.setPwdLoading = false;
          if (res) {
            this.$message.success('设置成功,请重新登录');
            this.setPwdModal = false;
            this.logout();
          }
        }
      });
    },
    async testSendCoin(port) {
      this.appLoading = true;
      this.handleChangePort(port);
      setTimeout(() => {
        this.sendCoin(1);
        setTimeout(() => {
          this.resetPort();
          this.appLoading = false;
        }, 1000);
      }, 1000);
    },

    /**
     * 转为16进制，以'0x'开头的标准十六进制
     */
    getNumber(num = 0) {
      if (num >= 256) {
        const resultInt = parseInt(num / 256).toString(16);
        const remainder = (num % 256).toString(16);
        return [
          remainder.length === 1 ? `0x0${remainder}` : `0x${remainder}`,
          resultInt.length === 1 ? `0x0${resultInt}` : `0x${resultInt}`,
        ];
      }
      num = Number(num).toString(16);
      if (num.length === 1) {
        num = `0${num}`;
      }
      return [`0x${num}`, '0x00'];
    },
    // Buffer 转 Array
    buffer2Array(bufferData) {
      return Array.prototype.slice.call(new Uint8Array(bufferData));
    },

    // 异常订单处理出币
    errorSendCoin(coins = 0, orderId = '', sureCoin = 0) {
      this.sureCoin = sureCoin;
      this.sendCoin(coins, orderId);
      this.isErrorSendCoin = true;
    },

    // 出币指令
    sendCoin(coins = 0, orderId = '', callBack = null) {
      this.isErrorSendCoin = false;
      this.isPause = false;
      this.sendCoinBack = callBack;
      clearInterval(this.heartbeatTimer);
      this.hasSendCoins = 0;
      if (coins === -1) {
        this.coinType = 2;
        this.needSendCoins = 9999;
      } else {
        this.coinType = 1;
        this.needSendCoins = coins;
      }
      this.orderId = orderId;
      // 停止心跳指令
      const hexData = [
        '0xaa', // 0
        '0x0c', // 1
        '0xc1', // 2 指令类型：C1 出币
        '0x01', // 3 序号
        '0x00', // 4
        '0x00', // 5
        '0x00', // 6
        '0x00', // 7
        '0x00', // 8
        '0x00', // 9
        '0x00', // 10
        '0x00', // 11
        '0xd9', // 12
        '0xbb', // 13
      ];
      // 本次出币数，大于256 进1
      const [numLow, numHigh] = this.getNumber(this.needSendCoins);
      hexData[5] = numLow;
      hexData[6] = numHigh;
      // 校验和
      let totalCode = 0;
      for (let i = 1; i < 12; i++) {
        totalCode += Number(Number(hexData[i]).toString(10));
      }
      hexData[12] = this.getNumber(totalCode)[0];
      if (this.coinType === 1) {
        this.showSendCoinsModal = true;
        this.isSendCoins = true;
      }

      // 开始出币
      this.coinsPort.write(hexData, (err) => {
        if (err) {
          console.log(`${moment().format('YYYY/M/D H:mm:ss')}，发送出币指令错误，${JSON.stringify(hexData)}`);

          log.error(`调用出币指令方法错误[App.sendCoin][SerialPort#write]，${JSON.stringify(err)}`);
          this.$alert('机台出币发生错误，请重启软件', '出币错误', { type: 'error' })
            .then(() => {
              //
            })
            .catch(() => {
              //
            })
            .finally(() => {
              this.isSendCoins = false;
              this.showSendCoinsModal = false;
              this.resetError();
              this.resetPort();
            });
        } else {
          console.log(`${moment().format('YYYY/M/D H:mm:ss')}，发送出币指令成功，${JSON.stringify(hexData)}`);
        }
      });
      // 设置定时器，等待时间内如果没有回应，则机台出现异常
      this.responseTimer = setTimeout(() => {
        if (this.isPause) return;
        if (this.coinType === 1) {
          this.responseError = true;
          this.sendError();
        }
        this.callBack();
      }, 1000);
    },
    // 改变出币状态  ：   暂停/继续出币
    toggleSendCoinState() {
      if (this.pauseButtonLoading) return;
      this.pauseButtonLoading = true;
      setTimeout(() => {
        this.pauseButtonLoading = false;
      }, 1000);
      if (this.isPause) {
        this.continueSendCoin();
      } else {
        this.pauseSendCoin();
      }
      this.isPause = !this.isPause;
    },
    // 继续出币指令
    continueSendCoin() {
      console.log('@继续出币');
      console.log(`总共需要出币：${this.needSendCoins},剩余需要出币数：${this.needSendCoins - this.hasSendCoins}`);
      this.isErrorSendCoin = false;
      clearInterval(this.heartbeatTimer);
      const hexData = [
        '0xaa', // 0
        '0x0c', // 1
        '0xc1', // 2 指令类型：C1 出币
        '0x01', // 3 序号
        '0x00', // 4
        '0x00', // 5
        '0x00', // 6
        '0x00', // 7
        '0x00', // 8
        '0x00', // 9
        '0x00', // 10
        '0x00', // 11
        '0xd9', // 12
        '0xbb', // 13
      ];
      // 本次出币数，大于256 进1
      const [numLow, numHigh] = this.getNumber(this.needSendCoins);
      hexData[5] = numLow;
      hexData[6] = numHigh;
      // 已出币数，256 进1
      const [hasSendCoinsLow, hasSendCoinsHigh] = this.getNumber(this.hasSendCoins);
      hexData[7] = hasSendCoinsLow;
      hexData[8] = hasSendCoinsHigh;
      // 校验和
      let totalCode = 0;
      for (let i = 1; i < 12; i++) {
        totalCode += Number(Number(hexData[i]).toString(10));
      }
      hexData[12] = this.getNumber(totalCode)[0];
      this.isSendCoins = true;
      console.log('出币指令16进制：', hexData);
      // log.info('start send coin:')
      // log.info(hexData)
      // 开始出币
      this.coinsPort.write(hexData, (err) => {
        if (err) {
          console.log(err);
        } else {
          // // 设置定时器，等待时间内如果没有回应，则机台出现异常
          // this.responseTimer = setTimeout(() => {
          //   if (this.isPause) return
          //   if (this.coinType === 1) {
          //     this.responseError = true
          //     this.sendError()
          //   }
          //   this.callBack()
          // }, 3000)
          console.log('== 出币成功 == ');
        }
      });
    },
    // 暂停出币指令
    pauseSendCoin() {
      clearTimeout(this.responseTimer);
      const resData = [
        '0xaa', // 0
        '0x0c', // 1
        '0xc5', // 2 指令类型：C1 出币  D1 回复出币指令 c4清除故障
        '0x01', // 3 序号
        '0x00', // 4
        '0x00', // 5
        '0x00', // 6
        '0x00', // 7
        '0x00', // 8
        '0x00', // 9
        '0x00', // 10
        '0x00', // 11
        '0xd9', // 12
        '0xbb', // 13
      ];
      // 校验和
      let totalCode = 0;
      for (let i = 1; i < 12; i++) {
        totalCode += Number(resData[i].toString(10));
      }
      resData[12] = this.getNumber(totalCode)[0];
      console.log('@暂停出币');
      console.log(resData);
      // 开始发送暂停出币指令
      this.coinsPort.write(resData, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('@暂停出币成功');
        }
      });
    },

    resetPort() {
      clearInterval(this.heartbeatTimer);
      clearInterval(this.responseTimer);
      this.needSendCoins = 0; // 需要出的币数
      this.hasSendCoins = 0; // 当前已出的币数
      this.prevHeartbeatNum = 1;
      this.heartbeatNum = 1;
      this.responseNum = 0;
      this.orderId = '';
      this.sureCoin = 0;
      this.responseError = false;
      if (this.coinsPort) {
        this.coinsPort.close((res) => {
          console.log('机台已关闭');
        });
      }
      this.showSelectPortModal = true;
    },
    callBack() {
      if (this.sendCoinBack) {
        this.sendCoinBack.call(this, this.hasSendCoins);
        this.sendCoinBack = null;
      }
    },
    // 清除错误
    resetError() {
      const hexData = [
        '0xaa',
        '0x0c',
        '0xc4',
        '0x01', // 指令序号
        '0x00',
        '0x00',
        '0x00',
        '0x00',
        '0x00',
        '0x00',
        '0x00',
        '0x00',
        '0xad',
        '0xbb',
      ];
      hexData[3] = this.getNumber(this.heartbeatNum)[0];
      // 校验和
      let totalCode = 0;
      for (let i = 1; i < 12; i++) {
        totalCode += Number(hexData[i].toString(10));
      }
      const that = this;
      hexData[12] = this.getNumber(totalCode)[0];
      this.coinsPort.write(hexData, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('清除错误', hexData);
        }
        // 清除机台
        clearInterval(that.heartbeatTimer);
        clearInterval(that.responseTimer);
        that.needSendCoins = 0; // 需要出的币数
        that.hasSendCoins = 0; // 当前已出的币数
        that.prevHeartbeatNum = 1;
        that.heartbeatNum = 1;
        that.responseNum = 0;
        that.orderId = '';
        that.sureCoin = 0;
        that.responseError = false;
        log.info('reset machine');
        this.coinsPort.close((res) => {
          console.log('机台已重连');
          that.connectPort(that.port);
        });
      });
    },
    sendError() {
      console.log('@call sendError');
      log.error('machine response timeout , please restart machine and try again');
      if (this.orderId == '') {
        this.$alert('机台发生异常，请点击确定重置机台，或者关闭机台电源重启机台！', '错误', {
          type: 'error',
          showClose: false,
        }).then(() => {
          this.resetError();
          this.$store.dispatch('getMachineCoinNum');
          this.showSendCoinsModal = false;
        });
        return;
      }
      this.$api[this.isErrorSendCoin ? 'notifySureCoinInAbnormal' : 'notifySureCoin']({
        orderId: `${this.orderId}`,
        sureCoin: this.sureCoin ? this.$calc.accAdd(this.hasSendCoins, this.sureCoin) : this.hasSendCoins,
      })
        .then((res) => {
          this.$alert('机台发生异常，请点击确定重置机台，或者关闭机台电源重启机台！', '错误', {
            type: 'error',
            showClose: false,
          }).then(() => {
            this.resetError();
            this.$store.dispatch('getMachineCoinNum');
            this.showSendCoinsModal = false;
          });
        })
        .catch((e) => {});
    },

    // 开发：https://cdn.scbczx.com/development/GFSvr/cashWeb/app.zip
    // 测试：https://cdn.scbczx.com/test/GFSvr/cashWeb/app.zip
    // 生产：https://cdn.scbczx.com/production/GFSvr/cashWeb/app.zip
    checkVersion(newVersion) {
      const that = this;
      const appVer = app.getVersion();
      localStorage.setItem('version', newVersion || appVer);
      that.$api.getVersion({}).then((res) => {
        const version = res.body;
        console.log(`安装包版本：${appVer}`, `本地版本：${newVersion}`, `线上版本：${version.version}`);
        if (!compareVersion(newVersion || appVer, version.version)) {
          this.showSelectPortModal = false;
          this.appLoading = true;
          dialog
            .showMessageBox(null, {
              type: 'info',
              title: '版本更新测试',
              message: version.info,
              buttons: ['确定'],
            })
            .then((index) => {
              that.appLoadingInfo = '收银系统正在更新中...';
              app.upgrade(`${version.url}?t=${Date.now()}`, version.version, 'download');
            });
        }
      });
    },
  },
};
</script>
