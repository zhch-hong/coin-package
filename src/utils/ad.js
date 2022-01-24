import { remote } from 'electron';
import $api from '@/api';

const { screen, BrowserWindow } = remote;

function createExtendWindow() {
  const displays = screen.getAllDisplays();
  const extend = displays[1];
  // const window = new BrowserWindow({});
}

export default async function startAd() {
  createExtendWindow();

  const key = localStorage.getItem('moduleKey');
  const { body, errCode } = await $api.readModuleAd(key);
  if (errCode === 0) {
    console.log(body);
  }
}
