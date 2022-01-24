import { remote } from 'electron';
import $api from '@/api';

const { screen, BrowserWindow } = remote;
// protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

export default async () => {
  const displays = screen.getAllDisplays();
  const extend = displays[1];
  const window = new BrowserWindow({
    x: extend.bounds.x,
    y: extend.bounds.y,
    movable: false,
    // fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      webviewTag: true,
    },
  });
  const key = localStorage.getItem('moduleKey');
  const { body, errCode } = await $api.readModuleAd(key);
  if (errCode === 0) {
    console.log(body);
  }
  window.webContents.openDevTools();
  // window.loadURL('http://127.0.0.1:9310/ad.html');
  window.loadURL('http://127.0.0.1:9310/GFAdmin_cashier/#/ad-view');
  // window.loadURL('"http://localhost:9310/GFAdmin_cashier/#/login"');
  // window.loadFile('index.html');
};

// export default async function startAd() {
//   createExtendWindow();

// }
