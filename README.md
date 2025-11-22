# Electron Screen Capture

A lightweight Electron plugin that supports multi-display screenshot capturing with built-in annotation tools. Easy to integrate into your desktop applications.

![screenshot.jpg](/screenshot.jpg)

---

## ✨ Features

- 📸 Multi-display screenshot capturing 
- ✏️ Built-in annotation tools (rectangle, ellipse, arrow, pen, text, mosaic)
- 📋 Auto-copy to clipboard (standard behavior)
- 💾 Save to file option
- 🖌️ Configurable theme color 
- 🌐 Multi-language support (Chinese / English) 
- 🎨 Custom toolbar button support 
- 🛠️ Easy integration with Electron apps
- 💻 Windows 7/10/11 compatible 

---

## 📦 Installation

```bash
npm install @cinc101/electron-capture
```

---

## 🔥 Quick Start

### 1. Initialize in Main Process

```ts
import { app, ipcMain, BrowserWindow, screen, desktopCapturer, dialog, clipboard, nativeImage } from 'electron';
import { onLoad } from 'electron-screen-capture';

let mainWindow: BrowserWindow | null = null;

const pluginContext = {
  electron: { ipcMain, screen, BrowserWindow, desktopCapturer, dialog, clipboard, nativeImage },
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

### 2. Request Screenshot

#### Basic Screenshot (from Renderer Process)

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
  // Note: Image is already copied to clipboard automatically
});
```

#### Screenshot with Custom Toolbar Button (from Main Process)

You can dynamically add a custom button to the toolbar when triggering a screenshot:

```js
// In your main process
ipcMain.on('request-screenshot-with-custom-action', (event) => {
  // Define custom button configuration
  const customButton = {
    icon: 'data:image/svg+xml;base64,...', // SVG/PNG data URL
    title: 'Send to API',
    callback: async (imageData, close) => {
      // imageData: base64 PNG data URL
      // close: function to close the screenshot window
      
      try {
        // Example: Send to API
        await fetch('https://api.example.com/upload', {
          method: 'POST',
          body: JSON.stringify({ image: imageData })
        });
        
        console.log('Image sent successfully');
        
        // Close screenshot window when done
        close();
      } catch (error) {
        console.error('Failed to send image:', error);
        close();
      }
    }
  };

  // Trigger screenshot with custom button
  ipcMain.emit('screenshot-plugin/request-capture', event, {
    customButton: customButton
  });
});
```

**Key Points:**
- Custom button is passed **per screenshot request**, not in initial configuration
- The `callback` receives the screenshot data and a `close()` function
- You control when to close the screenshot window by calling `close()`
- To trigger a screenshot **without** custom button, pass `{ customButton: null }` or omit it

---

## 🔧 API Reference

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lang` | `'zh' \| 'en'` | `'zh'` | UI language (Chinese or English) |
| `color` | `string` | `'#07c160'` | Main theme color (hex color code) |

### Plugin Exports

After calling `onLoad(pluginContext)`, the following methods are available via `pluginContext.exports`:

| Method | Description |
|--------|-------------|
| `prepareCaptureWindow()` | Pre-creates screenshot windows for faster capture |
| `onCaptureDone` | Callback function, set this to handle completed screenshots |

### IPC Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `screenshot-plugin/request-capture` | Main → Plugin | Trigger screenshot (with optional customButton) |
| `screenshot-plugin/capture-done` | Plugin → Main | Screenshot completed (image auto-copied to clipboard) |

### Clipboard Behavior

When the user clicks the **Confirm** button (✓) to complete the screenshot:

1. ✅ The image is **automatically copied to the clipboard**
2. ✅ The `onCaptureDone` callback is triggered with the image data
3. ✅ Users can immediately paste (Ctrl+V / Cmd+V) into other applications

This is standard behavior for most screenshot tools, providing a seamless workflow.

> **Note:** The clipboard contains PNG image data, not a file path. Applications like Word, Photoshop, and web browsers can directly paste this image data.

---

## 🎨 Custom Button API

You can dynamically add a custom button to the screenshot toolbar when triggering a screenshot.

### Custom Button Configuration

```typescript
interface CustomButton {
  icon: string;      // Icon as data URL (SVG/PNG base64) or regular URL
  title: string;     // Tooltip text displayed on hover
  callback: (imageData: string, close: () => void) => void | Promise<void>;
}
```

### Parameters

#### `imageData` (string)
- Base64-encoded PNG data URL
- Format: `data:image/png;base64,iVBORw0KG...`
- Can be used directly in `<img>` tags or sent to APIs

#### `close` (function)
- Call this function to close the screenshot window
- Should be called after your custom action completes
- Window will remain open until you explicitly call `close()`

### Usage Example

```javascript
const customButton = {
  icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjwvc3ZnPg==',
  title: 'Upload to Server',
  callback: async (imageData, close) => {
    try {
      // Your custom logic here
      await uploadToServer(imageData);
      console.log('Upload successful');
      close();
    } catch (error) {
      console.error('Upload failed:', error);
      close(); // Close even on error
    }
  }
};

// Trigger screenshot with custom button
ipcMain.emit('screenshot-plugin/request-capture', event, {
  customButton: customButton
});
```

### Notes

- Custom button is **optional** and passed per screenshot request
- If not provided, only default buttons (rect, ellipse, confirm, cancel, etc.) are shown
- The callback runs in the **main process**, so you have access to Node.js APIs
- To remove a previously set custom button, pass `{ customButton: null }`





---

## 📄 License

MIT License

