# 金花收银系统说明文档

1、node_modules
由于包含 node 原生模块，建议在其他电脑上开发此项目时，复制 node_modules 而非使用 npm install，否则可能导致原生模块编译失败

使用原生模块的包：serialport ，用于驱动硬件（收银吐币机）

2、开发启动请使用 npm 命令 electron:serve ，打测试包使用 electron:test ,生产环境请使用 electron:build，由于是桌面应用程序，不适用 npm run serve 和 npm run build，因为这两个指令只会打包页面，不会生成应用程序。

3、在新电脑上打包成应用程序时，由于电脑上可能没有 electron 必需的工具，会导致打包失败，具体打包请参考 https://segmentfault.com/a/1190000018533945

## 收银吐币机

驱动该机器使用了 node 模块 serialport，具体参考 App.vue；

进入登录页时检测是否有串口连接：

```javascript
     async created() {
         // 获取连接上的串口
        let ports = await SerialPort.list();
        this.portsList = ports;
        console.log(ports);
        if (!this.portsList.length) {
            this.$message.error('没有发现吐币机，请连接吐币机后点击重置机台')
            return;
        }
        this.showSelectPortModal = true;
    }
```

由于串口通讯使用了 16 进制的数字代码，App.vue 已经具备了将数字转为 16 进制的方法，直接调用即可，会返回高 8 位和低 8 位。

详情可参考《吧台售币收银吐币机协议》

## 小票打印机

web 打印使用了第三方控件：C-Lodop

电脑上需安装该控件并后台运行，并且小票机必须正确安装驱动程序后，业务代码中可通过全局使用 Lodop 进行打印，详情请全局搜索 printTicket 方法和查看 C-Lodop 官方 API

## 扫码枪

扫码枪的本质是扫描到信息会触发键盘事件，相当于模拟按下了键盘，所以本系统中扫码枪获取信息的方式为监听键盘事件，具体可查看礼品结算页面的扫码逻辑：

         document.onkeydown = e => {
                    if (e.key !== "Enter") {
                        // 当扫码枪扫描完成之后会自动触发enter键
                        this.uid += e.key;
                    } else {
                        // 扫描完成后取消监听
                        document.onkeydown = null;
                        this.loading = true;
                        /..../
                    }
                };

自动更新 打包：解压 exe=>$PLUGINSDIR\app-64.7z\resources 打包成 zip

## 日志输出地址

C:\Users\tqm\AppData\Roaming\gf-admin-desktop\logs
