import { ipcMain, screen, BrowserWindow, desktopCapturer, dialog, clipboard, nativeImage } from 'electron';

/**
 * Custom button configuration for screenshot toolbar
 */
export interface CustomButton {
  /** Button icon (SVG/PNG data URL or regular URL) */
  icon: string;
  /** Tooltip text displayed on hover */
  title: string;
  /** 
   * Callback function when button is clicked
   * @param imageData - Base64 PNG data URL of the screenshot
   * @param close - Function to close the screenshot window
   */
  callback: (imageData: string, close: () => void) => void | Promise<void>;
}

/**
 * Options for requesting a screenshot
 */
export interface RequestCaptureOptions {
  /** Optional screen ID to capture specific screen */
  screenId?: string | number;
  /** Optional custom button to add to the toolbar */
  customButton?: CustomButton | null;
}

/**
 * Plugin exports available after calling onLoad()
 */
export interface CapturePluginExports {
  /** Pre-create screenshot windows for faster capture */
  prepareCaptureWindow: () => void;
  /** Callback triggered when screenshot is completed (image auto-copied to clipboard) */
  onCaptureDone?: (imageDataUrl: string) => void;
  /** Callback triggered when screenshot is cancelled */
  onCaptureCancel?: () => void;
}

/**
 * Plugin context passed to onLoad()
 */
export interface PluginContext {
  electron: {
    ipcMain: typeof ipcMain;
    screen: typeof screen;
    BrowserWindow: typeof BrowserWindow;
    desktopCapturer: typeof desktopCapturer;
    dialog: typeof dialog;
    clipboard: typeof clipboard;
    nativeImage: typeof nativeImage;
  };
  ipc: {
    registerCommand: (channel: string, handler: (...args: any[]) => any) => void;
  };
  exports?: CapturePluginExports;
  logger?: (msg: string) => void;
  config?: {
    /** Main theme color (hex color code) */
    color?: string;
    /** UI language */
    lang?: 'zh' | 'en';
  };
}

/**
 * Initialize the screenshot plugin
 * @param ctx - Plugin context with electron APIs and configuration
 */
export declare function onLoad(ctx: PluginContext): void;