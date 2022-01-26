import fs from 'fs';
import request from 'request';
import { remote } from 'electron';

const { app, BrowserWindow, getCurrentWindow, screen } = remote;
const docPath = app.getPath('documents');
const appPath = app.getAppPath();
const adDirectory = `${appPath}\\static\\ad_resources`;
let window = null;

/**
 * 判断是否存在广告资源文件夹，如果不存在就创建文件夹
 * 文档/GFCashier
 */
function createWriteDirectory() {
  console.log(__dirname, 'dirname');
  if (!fs.existsSync(adDirectory)) {
    console.log('广告文件夹目录不存在，创建目录');
    fs.mkdirSync(adDirectory);
  }
}

/**
 * 写入广告文件的名称
 * @param {string} url - 广告资源的服务器地址
 * @returns
 */
function getFileName(url) {
  const index = url.lastIndexOf('/');
  const name = url.slice(index + 1);
  return name.replace(/\s/g, '');
}

/**
 * 读取广告文件
 * @param {string} url - 广告资源的服务器地址
 * @returns
 */
function readFile(url) {}

/**
 * 从url下载广告文件并写入本地
 * @param {*} url
 */
export function writeFile(url) {
  const fileName = getFileName(url);
  createWriteDirectory();
  request(url).pipe(fs.createWriteStream(`${adDirectory}/${fileName}`));
}

/**
 * 打开广告屏
 */
export default async () => {
  if (window !== null) return;

  const displays = screen.getAllDisplays();
  console.log(displays);

  // 单屏不显示
  if (displays.length < 2) return;

  const current = getCurrentWindow();

  // 排序取最后一个屏，顺序会因为系统设置或显卡插口而改变，所以这里使用绝对值进行排序
  displays.sort((current, prev) => {
    return Math.abs(current.bounds.x) - Math.abs(prev.bounds.x);
  });

  const extend = displays[displays.length - 1];
  console.log('广告屏', extend);
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
  const key = localStorage.getItem('moduleKey');

  if (process.env.VUE_APP_ENV !== 'production') {
    window.webContents.openDevTools();
  }

  if (process.env.VUE_APP_ENV === 'development') {
    window.loadURL(`http://127.0.0.1:9310/GFAdmin_cashier/#/ad-view?key=${key}`);
  } else {
    window.loadURL(`app://./index.html#/ad-view?key=${key}`);
  }
};
