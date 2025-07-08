# Electron Screen Capture

A lightweight Electron plugin that supports multi-display screenshot capturing with built-in annotation tools. Easy to integrate into your desktop applications.

![screenshot.jpg](/screenshot.jpg)

---

## 📢 Notice

- Currently supports **Windows 7 to Windows 11**
- macOS support is under development

---

## ✨ Features

- 📸 Multi-display screenshot capturing
- ✏️ Built-in annotation tools: rectangle, ellipse, arrow, pen, mosaic, text
- 🖌️ Configurable theme color
- 🌐 Multi-language support (Chinese/English)
- 🛠️ Easy integration with Electron apps

---

## 📦 Installation

```bash
npm install @cinc101/electron-capture
```

---

## 🔥 Quick Start

### 1. Initialize in Main Process

```ts
import { app, ipcMain, BrowserWindow, screen, desktopCapturer, dialog } from 'electron';
import { onLoad } from 'electron-screen-capture';

let mainWindow: BrowserWindow | null = null;

const pluginContext = {
  electron: { ipcMain, screen, BrowserWindow, desktopCapturer, dialog },
  ipc: {
    registerCommand: (channel, handler) => {
      ipcMain.handle(channel, async (_, args) => await handler(args));
    },
  },
  logger: (msg) => {
    console.log(`[plugin log] ${msg}`);
  },
  config: {
    lang: 'zh', // Optional: 'zh' | 'en' 
    color: '#409EFF', // Optional: customize main theme color
  },
};

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await mainWindow.loadURL('your app entry point');

  // Initialize the screenshot plugin
  await onLoad(pluginContext);

  if (pluginContext.exports) {
    const exports = pluginContext.exports;
    
    // Handle capture completion
    exports.onCaptureDone = (finalImageDataURL) => {
      console.log('Capture completed:', finalImageDataURL);
      mainWindow?.webContents.send('your-custom-capture-done-event', { image: finalImageDataURL });
    };
    
    // Prepare capture window
    exports.prepareCaptureWindow();
  }
});
```

### 2. Request Screenshot from Renderer Process

```js
const { ipcRenderer } = require('electron');

function requestCapture() {
  ipcRenderer.send('screenshot-plugin/request-capture');
}

// Example: Bind to a button click
document.getElementById('captureButton').addEventListener('click', requestCapture);

// Listen for capture completion
ipcRenderer.on('your-custom-capture-done-event', (event, data) => {
  console.log('Screenshot received:', data.image);
  // Handle the captured image data URL
});
```

---

## 🔧 API Reference

### Configuration Options

- `lang`: Language setting ('zh' for Chinese, 'en' for English)
- `color`: Main theme color (hex color code)

### Key Methods

- `prepareCaptureWindow()`: Creates and prepares capture windows for screenshot functionality
- `onCaptureDone(callback)`: Callback function called when screenshot is completed, returns the final image data URL

### IPC Events

- `screenshot-plugin/request-capture`: Send this event from renderer to initiate screenshot capture

---

## 📄 License

MIT License

