import e from "path";
import n from "fs";
import { fileURLToPath as t } from "url";
const o = (e2) => `screenshot-plugin/${e2}`, s = [];
async function i(i2) {
  var _a, _b;
  const { ipcMain: a2, screen: r2, desktopCapturer: c, BrowserWindow: l, dialog: d } = i2.electron;
  let p = false;
  const h = t(import.meta.url), u = e.dirname(h), w = e.join(u, "index.html"), g = () => {
    var _a2, _b2;
    p || (!function(e2, n2, t2 = "zh") {
      const { screen: o2, BrowserWindow: i3 } = e2;
      o2.getAllDisplays().forEach((e3) => {
        const { width: o3, height: a3, x: r3, y: c2 } = e3.bounds, l2 = new i3({ width: o3, height: a3, x: r3, y: c2, frame: false, transparent: true, fullscreen: false, alwaysOnTop: true, resizable: false, movable: false, skipTaskbar: true, focusable: true, webPreferences: { webSecurity: false, nodeIntegration: true, contextIsolation: false } });
        l2.setBounds({ x: r3, y: c2, width: o3, height: a3 }), l2.setAlwaysOnTop(true, "screen-saver"), l2._captureLang = t2, l2.captureWindowIndex = e3.id, l2.setOpacity(0), l2.loadFile(n2), l2.hide(), l2.on("close", (e4) => {
          e4.preventDefault(), l2.hide();
        }), s.push(l2);
      });
    }(i2.electron, w, ((_a2 = i2.config) == null ? void 0 : _a2.lang) || "zh"), (_b2 = i2.logger) == null ? void 0 : _b2.call(i2, "[plugin] window created"), p = true);
  };
  i2.ipc.registerCommand("screenshot.prepareWindows", g), i2.exports = { prepareCaptureWindow: g, onCaptureDone: void 0, onCaptureCancel: void 0 }, (_a = i2.logger) == null ? void 0 : _a.call(i2, "[screenshot-plugin] begin register ipc"), a2.on(o("capture-window-ready"), (e2) => {
    var _a2;
    const n2 = l.fromWebContents(e2.sender), t2 = s.findIndex((e3) => e3 === n2);
    if (-1 !== t2) {
      const e3 = r2.getAllDisplays()[t2];
      n2.webContents.send(o("set-window-index"), e3.id), n2.webContents.send(o("set-main-color"), ((_a2 = i2.config) == null ? void 0 : _a2.color) || "#07c160");
    }
  }), a2.on(o("screenshot-window-lock"), (e2, n2) => {
    s.forEach((e3, t2) => {
      const s2 = t2 === n2;
      e3.webContents.send(o("screenshot-lock-state"), { locked: true, isSelf: s2 });
    });
  }), a2.on(o("screenshot-window-unlock"), () => {
    s.forEach((e2) => {
      e2.webContents.send(o("screenshot-lock-state"), { locked: false, isSelf: false });
    });
  }), a2.on(o("request-capture"), async (e2, n2) => {
    const t2 = r2.getAllDisplays(), i3 = { types: ["screen"] };
    (await Promise.all(t2.map(async (e3) => {
      i3.thumbnailSize = e3.size;
      const n3 = (await c.getSources(i3)).find((n4) => n4.name === e3.id.toString() || n4.display_id === e3.id.toString());
      return n3 ? n3.thumbnail.toDataURL() : null;
    }))).forEach((e3, n3) => {
      const i4 = s[n3], a3 = t2[n3].scaleFactor;
      e3 && i4 && (i4.webContents.removeAllListeners("did-finish-load"), i4.webContents.once("did-finish-load", () => {
        i4.setOpacity(1), i4.showInactive(), i4.webContents.send(o("display-screenshot"), e3, a3, t2[n3].size), i4.webContents.send(o("set-lang"), i4._captureLang || "zh");
      }), i4.loadFile(w));
    });
  }), a2.on(o("capture-done"), (e2, n2) => {
    var _a2, _b2;
    s.forEach((e3) => {
      e3.setOpacity(0), e3.hide();
    }), (_b2 = (_a2 = i2.exports) == null ? void 0 : _a2.onCaptureDone) == null ? void 0 : _b2.call(_a2, n2);
  }), a2.on(o("capture-cancel"), () => {
    s.forEach((e2) => {
      e2.setOpacity(0), e2.hide();
    });
  }), a2.handle(o("save-capture-image"), async (e2, { base64Data: t2, windowIndex: o2 }) => {
    const s2 = l.getAllWindows().find((e3) => e3.captureWindowIndex === o2), i3 = await d.showSaveDialog(s2, { title: "保存截图", defaultPath: `screenshot-${Date.now()}.png`, filters: [{ name: "PNG 图片", extensions: ["png"] }], modal: true, alwaysOnTop: true });
    if (i3.canceled) return false;
    const a3 = i3.filePath;
    if (a3) {
      const e3 = t2.replace(/^data:image\/\w+;base64,/, "");
      return n.writeFileSync(a3, e3, "base64"), true;
    }
    return false;
  }), a2.on(o("check-display"), (e2, n2) => {
    const t2 = r2.getAllDisplays();
    let i3 = null;
    t2.forEach((e3) => {
      const { x: t3, y: o2, width: s2, height: a3 } = e3.bounds;
      n2.x >= t3 && n2.x <= t3 + s2 && n2.y >= o2 && n2.y <= o2 + a3 && (i3 = e3);
    }), s.forEach((e3) => {
      const n3 = (i3 == null ? void 0 : i3.id) === e3.displayId;
      e3.webContents.send(o("highlight-border"), (i3 == null ? void 0 : i3.id) ?? null), n3 && i3 && e3.webContents.send(o("set-crop-limit"), i3.bounds);
    });
  }), a2.handle(o("get-screenshot"), async (e2, n2) => {
    var _a2;
    try {
      const e3 = (await c.getSources(n2)).find((e4) => String(e4.display_id) === String(n2.currentWindowIndex));
      return e3 ? e3.thumbnail.toDataURL() : null;
    } catch (e3) {
      return (_a2 = i2.logger) == null ? void 0 : _a2.call(i2, "[screenshot-plugin] screenshot fail：" + e3.message), null;
    }
  }), (_b = i2.logger) == null ? void 0 : _b.call(i2, "[screenshot-plugin] finished ipc register");
}
function a() {
}
const r = { onLoad: i };
export {
  r as default,
  i as onLoad,
  a as onUnload
};
