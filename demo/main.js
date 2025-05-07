const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  desktopCapturer,
  dialog
} = require('electron');
const path = require('path');

const { onLoad } = require('../dist/main.js');

let mainWindow = null;

// 构造假的 context
const pluginContext = {
  electron: {
    ipcMain,
    screen,
    BrowserWindow,
    desktopCapturer,
    dialog,
  },
  ipc: {
    registerCommand: (channel, handler) => {
      ipcMain.handle(channel, async (_, args) => await handler(args));
    },
  },
  logger: (msg) => {
    console.log(`[plugin log] ${msg}`);
  },
  config: {
    lang: 'en', // 'zh' or 'en'
    color: '#409EFF',
  },
};

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await mainWindow.loadFile(path.resolve(__dirname, 'renderer.html'));

  await onLoad(pluginContext);

  if (pluginContext.exports) {
    const exports = pluginContext.exports;

    exports.onCaptureDone = (finalImageDataURL) => {
      console.log('✅ Capture completed, imageDataURL:', finalImageDataURL);
    };

    // 启动截图
    exports.prepareCaptureWindow();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
