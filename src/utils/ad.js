import fs from 'fs';
import path from 'path';
import request from 'request';
import { remote } from 'electron';

const { app, BrowserWindow, getCurrentWindow, screen } = remote;
const docPath = app.getPath('documents');
const adDirectory = `${docPath}\\GFCashier\\ad_files`;
let window = null;

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
  createWriteDirectory();
  request(url).pipe(fs.createWriteStream(`${adDirectory}/${fileName}`));
}

/**
 * 读取广告文件
 * @param {string} url - 广告资源的服务器地址
 * @returns
 */
export function readFile(url) {
  const fileName = getFileName(url);
  const result = fs.readdirSync(adDirectory).find((p) => p === fileName);
  if (typeof result === 'undefined') {
    writeFile(url);
  }
  // const filePath = path.resolve(adDirectory, fileName);
  const filePath = path.resolve(adDirectory, 'mmexport1642832202042_1643185502843.mp4');
  console.log(filePath);
  let content = null;
  try {
    content = fs.readFileSync(filePath);
    const f = new Blob([content], { type: 'video/mp4' });
    content = URL.createObjectURL(f);
    debugger;
    // const b = new Blob(content, { encoding: 'binary', type: 'video/mp4' });
    // content = new Blob(content);

    // console.log('content', typeof content, content.length);
  } catch (error) {
    console.error(error);
  }
  return content;
}

/**
 * 打开广告屏
 */
export default async () => {
  if (window !== null) return;

  const displays = screen.getAllDisplays();

  // 单屏不显示广告
  if (displays.length < 2) return;

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
    config.width = 1600;
    config.height = 900;
    config.frame = true;
    config.fullscreen = false;
  }

  window = new BrowserWindow(config);

  if (process.env.VUE_APP_ENV !== 'production') {
    window.webContents.openDevTools();
  }

  const key = localStorage.getItem('moduleKey');
  if (process.env.VUE_APP_ENV === 'development') {
    window.loadURL(`http://127.0.0.1:9310/GFAdmin_cashier/#/ad-view?key=${key}`);
  } else {
    window.loadURL(`app://./index.html#/ad-view?key=${key}`);
  }
};
