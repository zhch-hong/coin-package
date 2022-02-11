/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-async-promise-executor */

import fs from 'fs';
import path from 'path';
import request from 'request';
import Vue from 'vue';
import { remote } from 'electron';

const { app, BrowserWindow, getCurrentWindow, ipcMain, screen } = remote;
const docPath = app.getPath('documents');
const adDirectory = `${docPath}\\GFCashier\\ad_files`;
/**
 * ad 广告，in 数据
 */
const observable = Vue.observable({ mode: 'ad' });

let type = 'package'; // package 套餐，goods 物品，haspackage 已购买套餐
let packageList = [];
let goodsList = [];
let haspackageList = [];

let extendWindow = null;

const vm = new Vue({
  computed: {
    mode() {
      return observable.mode;
    },
  },
  watch: {
    mode: {
      handler(value) {
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
      },
    },
  },
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

/**
 * 判断是否存在广告资源文件夹，如果不存在就创建文件夹
 * 文档/GFCashier
 */
function createWriteDirectory() {
  if (!fs.existsSync(adDirectory)) {
    fs.mkdirSync(adDirectory, { recursive: true });
  }
}

/**
 * 获取文件名
 * @param {string} url - 广告资源的服务器地址
 * @returns {string}
 */
function getFileName(url) {
  const index = url.lastIndexOf('/');
  const name = url.slice(index + 1);
  return name.replace(/\s/g, '');
}

/**
 * 从url下载广告文件并写入本地
 * @param {string} url - 广告资源的服务器地址
 */
export function writeFile(url) {
  const fileName = getFileName(url);
  return new Promise((resolve) => {
    request(url, resolve).pipe(fs.createWriteStream(path.resolve(adDirectory, fileName)));
  });
}

/**
 * 读取广告文件
 * @param {string} url - 广告资源的服务器地址
 * @returns
 */
export function readFile(url) {
  createWriteDirectory();
  const fileName = getFileName(url);
  const result = fs.readdirSync(adDirectory).find((p) => p === fileName);
  return new Promise(async (resolve) => {
    if (typeof result === 'undefined') {
      await writeFile(url);
    }
    const filePath = path.resolve(adDirectory, fileName);
    let content = null;
    try {
      content = fs.readFileSync(filePath);
      const blob = new Blob([content], { type: 'video/mp4' });
      content = URL.createObjectURL(blob);
    } catch (error) {
      console.error(error);
    }
    resolve(content);
  });
}

/**
 * 打开广告屏
 */
export default async () => {
  if (extendWindow !== null) return;

  const displays = screen.getAllDisplays();

  // 单屏不显示广告
  if (process.env.VUE_APP_ENV !== 'development') {
    if (displays.length < 2) return;
  }

  const current = getCurrentWindow();

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

  const key = localStorage.getItem('moduleKey');
  if (process.env.VUE_APP_ENV === 'development') {
    extendWindow.loadURL(`http://127.0.0.1:9310/GFAdmin_cashier/#/ad-view?key=${key}`);
  } else {
    extendWindow.loadURL(`app://./index.html#/ad-view?key=${key}`);
  }
};

export { observable };
