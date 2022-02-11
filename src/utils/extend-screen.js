/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-async-promise-executor */

import fs from 'fs';
import path from 'path';
import request from 'request';
import Vue from 'vue';
import { ipcRenderer, remote } from 'electron';

const { app } = remote;
const docPath = app.getPath('documents');
const adDirectory = `${docPath}\\GFCashier\\ad_files`;
/**
 * ad 广告，in 数据
 */
const observable = Vue.observable({ mode: 'ad' });

const vm = new Vue({
  computed: {
    mode() {
      return observable.mode;
    },
  },
  watch: {
    mode: {
      handler(value) {
        ipcRenderer.send('extend-mode-change', value);
      },
    },
  },
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
  const key = localStorage.getItem('moduleKey');
  ipcRenderer.send('open-extend-screen', key);
};

export { observable };
