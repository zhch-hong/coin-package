/**
 * created by steven
 * electron版本管理工具
 * 自动更新原理 更新app.asar
 * **/
import axios from 'axios';
const progress = require('request-progress');
const request = require('request');
const admZip = require('adm-zip');
// const remote = require('electron').remote;
import { app, dialog, ipcMain, BrowserWindow } from 'electron';
// const FileSystem = require('original-fs')
const fs = require('fs');
let AppPathFolder = app.getAppPath();
let UPDATE_FILE = 'update.asar';
let AppAsar = 'app.asar';
if (AppPathFolder.indexOf('app.asar') > -1) {
  AppPathFolder = AppPathFolder.slice(0, AppPathFolder.indexOf('app.asar'));
} else {
  AppPathFolder += '/';
}
export default {
  setup: {
    url: '',
    version: '',
    progresscallback: '',
  },
  file: null,
  getVersion() {
    console.log('读取更新版本信息');
    console.log(AppPathFolder + 'ver.ini');
    let ver = AppPathFolder + 'ver.ini';
    let that = this;
    fs.readFile(ver, 'utf8', (err, data) => {
      if (err) {
        app.win().webContents.send('getVersion', '');
      } else {
        app.win().webContents.send('getVersion', data);
      }
    });
  },
  upgrade(url, version, progresscallback) {
    let that = this;
    that.setup.progresscallback = progresscallback;
    that.setup.url = url;
    that.setup.version = version;
    progress(
      request(
        {
          uri: that.setup.url,
          encoding: null,
        },
        function (error, response, body) {
          if (error) {
            return console.error('err');
          }
          let updateFile = AppPathFolder + UPDATE_FILE;
          let contentType = response.headers['content-type'];
          console.log('ZipFilePath: ' + AppPathFolder);

          try {
            const zip = new admZip(body);
            zip.extractAllTo(AppPathFolder, true);
            // Store the update file path
            that.file = updateFile;
            console.log('Updater.update.file: ' + updateFile);
            // Success
            console.log('Update Zip downloaded: ' + AppPathFolder);
            fs.writeFile(AppPathFolder + 'ver.ini', version, function (err) {
              if (!err) {
                return console.error(err);
              } else {
                console.log('写入成功');
              }
            });
            if (that.setup.progresscallback) app.win().webContents.send(that.setup.progresscallback, { percent: 1 });

            const mainWindow = BrowserWindow.getAllWindows().find((w) => {
              return w.getParentWindow() === null;
            });
            dialog
              .showMessageBox(mainWindow, {
                type: 'info',
                title: '关闭',
                message: '更新已完成，请重启程序！',
                buttons: ['确定'],
              })
              .then((index) => {
                app.relaunch();
                app.exit();
              });
            // Apply the update
          } catch (error) {
            const mainWindow = BrowserWindow.getAllWindows().find((w) => {
              return w.getParentWindow() === null;
            });
            dialog
              .showMessageBox(mainWindow, {
                type: 'info',
                title: '关闭',
                message: '更新失败，请检查网络！',
                buttons: ['确定'],
              })
              .then((index) => {
                app.exit();
              });
          }
        }
      ),
      {
        throttle: 500, // Throttle the progress event to 500ms, defaults to 1000ms
      }
    )
      .on('progress', function (state) {
        if (that.setup.progresscallback) {
          app.win().webContents.send(that.setup.progresscallback, state);
        }
      })
      .on('error', function (err) {
        dialog
          .showMessageBox(null, {
            type: 'warning',
            title: '关闭',
            message: '更新失败，请检查网络！',
            buttons: ['确定'],
          })
          .then((index) => {
            app.exit();
          });
      })
      .on('end', function (d) {
        console.log('更新包下载完成！');
      });
  },
};
