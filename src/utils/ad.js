import { remote } from 'electron';

const { BrowserWindow, getCurrentWindow, screen } = remote;

let window = null;

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
