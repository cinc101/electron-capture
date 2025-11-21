import { ipcMain, screen, BrowserWindow, desktopCapturer, dialog } from 'electron';

export interface CapturePluginExports {
  prepareCaptureWindow: () => void;
  onCaptureDone?: (imageDataUrl: string) => void;
  onCaptureCancel?: () => void;
}

export interface PluginContext {
  electron: {
    ipcMain: typeof ipcMain;
    screen: typeof screen;
    BrowserWindow: typeof BrowserWindow;
    desktopCapturer: typeof desktopCapturer;
    dialog: typeof dialog;
  };
  ipc: {
    registerCommand: (channel: string, handler: (...args: any[]) => any) => void;
  };
  exports?: CapturePluginExports;
  logger?: (msg: string) => void;
  config?: {
    color?: string;
    lang?: 'zh' | 'en';
    customButton?: {
      icon?: string;
      title?: string;
      callback?: (imageData: string, close: () => void) => void;
    };
  };
}

export declare function onLoad(ctx: PluginContext): void;