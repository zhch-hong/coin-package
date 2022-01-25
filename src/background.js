import { app, protocol, BrowserWindow, Menu, dialog, globalShortcut, ipcMain } from 'electron';
import os from 'os';
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import versionManage from '@/versionManage';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isWin7 = os.release().startsWith('6.1');
if (isWin7) {
  // win7下 ，关闭硬件加速,防止打开黑屏
  app.disableHardwareAcceleration();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
/** 自动更新主进程方法* */
app.upgrade = function (url, version, progresscallback) {
  versionManage.upgrade(url, version, progresscallback);
};
app.getNewVersion = function () {
  versionManage.getVersion();
};
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  const config = {
    icon: `${__static}/icon64.ico`,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      webviewTag: true,
    },
  };
  win = new BrowserWindow(config);

  app.win = function () {
    return win;
  };

  win.maximize(); // 窗口最大化
  Menu.setApplicationMenu(null); // 隐藏所有菜单

  // 控制台
  // win.webContents.openDevTools();
  if (process.env.VUE_APP_ENV !== 'production') {
    win.webContents.openDevTools();
  }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  win.on('close', (e) => {
    e.preventDefault();
    dialog.showMessageBox(
      win,
      {
        type: 'info',
        title: '退出系统',
        defaultId: 0,
        message: '确定要关闭吗？',
        cancelId: 2,
        buttons: ['最小化', '直接退出'],
      },
      (index) => {
        if (index === 0) {
          win.minimize(); // 调用 最小化实例方法
        } else if (index === 1) {
          win.webContents.send('before-logout');
          // 等待登出接口调用完毕后再关闭
          ipcMain.on('logout', (event, arg) => {
            win = null;
            app.exit(); // exit()直接关闭客户端，不会执行quit();
          });
        }
      }
    );
  });
  win.on('closed', () => {
    win = null;
  });
}

// 限制只可以打开一个应用
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
      win.show();
    }
  });
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  // 设置ctrl+shift+i可以打开控制台
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    win.webContents.openDevTools();
  });
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
