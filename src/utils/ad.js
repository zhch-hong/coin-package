import { remote } from 'electron';

const { screen, BrowserWindow } = remote;

let window = null;

export default async () => {
  if (window !== null) return;

  const displays = screen.getAllDisplays();

  // 排序取最后一个屏
  displays.sort((current, prev) => {
    return current.bounds.x - prev.bounds.x;
  });

  const extend = displays[displays.length - 1];
  const config = {
    x: extend.bounds.x,
    y: extend.bounds.y,
    movable: false,
    fullscreen: true,
    frame: false,
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
