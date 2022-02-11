/* eslint-disable import/no-extraneous-dependencies */

import { BrowserWindow, ipcMain, screen } from 'electron';

let extendWindow = null;
let type = 'package';
let packageList = [];
let goodsList = [];
let haspackageList = [];

export default function () {
  ipcMain.on('open-extend-screen', (event, key) => {
    if (extendWindow !== null) return;

    const displays = screen.getAllDisplays();

    // 单屏不显示广告
    if (process.env.VUE_APP_ENV !== 'development') {
      if (displays.length < 2) return;
    }

    const current = BrowserWindow.getFocusedWindow();

    // 排序取最后一个屏，顺序会因为系统设置或显卡插口而改变，所以这里使用绝对值进行排序
    displays.sort((cur, prev) => {
      return Math.abs(cur.bounds.x) - Math.abs(prev.bounds.x);
    });

    const extend = displays[displays.length - 1];
    const config = {
      x: extend.bounds.x,
      y: extend.bounds.y,
      movable: false,
      fullscreen: true,
      frame: false,
      parent: current,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        webviewTag: true,
      },
    };

    if (process.env.VUE_APP_ENV === 'development') {
      config.width = 1200;
      config.height = 675;
      config.frame = true;
      config.movable = true;
      config.fullscreen = false;
    }

    extendWindow = new BrowserWindow(config);

    if (process.env.VUE_APP_ENV !== 'production') {
      extendWindow.webContents.openDevTools();
    }

    if (process.env.VUE_APP_ENV === 'development') {
      extendWindow.loadURL(`http://localhost:9310/GFAdmin_cashier/#/ad-view?key=${key}`);
    } else {
      extendWindow.loadURL(`app://./index.html#/ad-view?key=${key}`);
    }
  });

  ipcMain.on('package-list-change', (event, value) => {
    if (!extendWindow) return;

    type = 'package';
    packageList = value;
    extendWindow.webContents.send('package-list-change', value);
  });

  ipcMain.on('goods-list-change', (event, value) => {
    if (!extendWindow) return;

    type = 'goods';
    goodsList = value;
    extendWindow.webContents.send('goods-list-change', value);
  });

  ipcMain.on('haspackage-list-change', (event, value) => {
    if (!extendWindow) return;

    type = 'haspackage';
    haspackageList = value;
    extendWindow.webContents.send('haspackage-list-change', value);
  });

  ipcMain.on('extend-mode-change', (event, value) => {
    if (value === 'ad') {
      extendWindow.webContents.send('redirect-adview');
    }

    if (value === 'in') {
      extendWindow.webContents.send('redirect-custview');
      setTimeout(() => {
        if (type === 'package') extendWindow.webContents.send('package-list-change', packageList);
        if (type === 'goods') extendWindow.webContents.send('goods-list-change', goodsList);
        if (type === 'haspackage') extendWindow.webContents.send('haspackage-list-change', haspackageList);
      }, 500);
    }
  });
}
