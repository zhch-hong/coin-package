import { remote } from 'electron';
import router from '@/router';

const { screen, BrowserWindow } = remote;

export default async () => {
  // const key = localStorage.getItem('moduleKey');
  // router.push({ path: '/ad-view', query: { key } });
  const displays = screen.getAllDisplays();
  const extend = displays[1];
  const window = new BrowserWindow({
    x: extend.bounds.x,
    y: extend.bounds.y,
    width: 1600,
    height: 900,
    movable: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      webviewTag: true,
    },
  });
  const key = localStorage.getItem('moduleKey');
  window.loadURL(`http://127.0.0.1:9310/GFAdmin_cashier/#/ad-view?key=${key}`);
};
