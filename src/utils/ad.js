import { remote } from 'electron';
import router from '@/router';

const { screen, BrowserWindow } = remote;

export default async () => {
  // const key = localStorage.getItem('moduleKey');
  // router.push({ path: '/ad-view', query: { key } });
  const displays = screen.getAllDisplays();
  console.log(displays);
  const extend = displays[1];
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

  const window = new BrowserWindow(config);
  const key = localStorage.getItem('moduleKey');

  if (process.env.VUE_APP_ENV === 'development') {
    window.loadURL(`http://127.0.0.1:9310/GFAdmin_cashier/#/ad-view?key=${key}`);
  } else {
    window.loadURL(`app://./index.html#/ad-view?key=${key}`);
  }
};
