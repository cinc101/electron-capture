const { ipcRenderer: t } = require("electron"), e = (t2) => `screenshot-plugin/${t2}`;
let n, o, i, a, l, r, s = "zh", d = { zh: { rect: "方框", ellipse: "椭圆", arrow: "箭头", pen: "画笔", mosaic: "马赛克", text: "文字", undo: "撤销", download: "下载", cancel: "退出", confirm: "完成", fontSizeSmall: "小", fontSizeMedium: "中", fontSizeLarge: "大" }, en: { rect: "Rectangle", ellipse: "Ellipse", arrow: "Arrow", pen: "Pen", mosaic: "Mosaic", text: "Text", undo: "Undo", download: "Download", cancel: "Cancel", confirm: "Confirm", fontSizeSmall: "Small", fontSizeMedium: "Medium", fontSizeLarge: "Large" } }, c = null, h = null, p = false, u = false, f = null, w = 0, m = 0, g = null, y = 0, x = 0, b = false, v = [], k = false, C = 0, M = 0, S = [], $ = { strokeColor: "#ff4d4f", lineWidth: 2, fontSize: 18 }, _ = false, E = false, W = null, I = false, T = 0, z = 0, R = null, L = null, P = "#07c160";
window.onload = () => {
  p = true, ot(), it(), t.send(e("capture-window-ready"));
};
const D = V("div", "screenshot-editor-toolbar", { position: "absolute", zIndex: 99999, background: "#fff", borderRadius: "6px", padding: "10px 0 10px 15px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", display: "none", color: "#333", fontFamily: "sans-serif", height: "20px", minWidth: "320px", whiteSpace: "nowrap", overflow: "visible" });
document.body.appendChild(D);
const X = V("div", "text-config-panel", { position: "absolute", zIndex: 99999, background: "#fff", border: "1px solid #ccc", padding: "6px 10px", borderRadius: "4px", display: "none", fontSize: "14px" });
document.body.appendChild(X), it();
const Y = document.getElementById("overlay");
let H = null;
const B = V("canvas", null, { position: "fixed", border: "none", zIndex: 9999, pointerEvents: "none", display: "block" });
B.width = 150, B.height = 190, document.body.appendChild(B);
const O = B.getContext("2d"), N = document.querySelectorAll("#colorOptions .color-block");
N.forEach((t2) => {
  t2.addEventListener("click", () => {
    N.forEach((t3) => t3.classList.remove("selected")), t2.classList.add("selected"), $.strokeColor = t2.dataset.color;
  });
});
const J = document.querySelectorAll("#lineWidthOptions .line-dot");
function q() {
  const t2 = document.getElementById("draw-config-panel");
  t2 && (t2.style.display = "none");
}
function A() {
  t.send(e("screenshot-window-unlock")), R && (R.remove(), R = null, L = null), c && (c.remove(), c = null, h = null), window._markupContainer && (window._markupContainer.remove(), window._markupContainer = null), S = [], v = [], v.push(JSON.parse(JSON.stringify(S))), l && (l.remove(), l = null), B && (B.style.display = "none"), D.style.display = "none", window._captureMaskCanvas && (window._captureMaskCanvas.remove(), window._captureMaskCanvas = null, window._captureMaskCtx = null), t.send(e("capture-cancel")), _ = false, E = false, I = false, W = "", $ = { strokeColor: "red", lineWidth: 2 }, n = 0, o = 0, i = 0, a = 0, window._captureTempData = null, document.body.style.backgroundImage = "none";
}
function F(t2) {
  const e2 = window._captureMaskCanvas, n2 = window._captureMaskCtx;
  e2 && n2 && (e2.width = window.innerWidth, e2.height = window.innerHeight, n2.clearRect(0, 0, e2.width, e2.height), n2.fillStyle = "rgba(0, 0, 0, 0.2)", n2.fillRect(0, 0, e2.width, e2.height), n2.globalCompositeOperation = "destination-out", n2.fillStyle = "rgba(0, 0, 0, 1)", n2.fillRect(t2.x, t2.y, t2.width, t2.height), n2.globalCompositeOperation = "source-over", n2.strokeStyle = P || "#409EFF", n2.lineWidth = 2, n2.strokeRect(t2.x + 1, t2.y + 1, t2.width - 2, t2.height - 2));
}
function U() {
  const t2 = window._markupContainer;
  if (t2) {
    t2.innerHTML = "";
    for (const e2 of S) {
      const n2 = V("div", null, { position: "absolute", left: `${e2.x}px`, top: `${e2.y}px`, cursor: "move", pointerEvents: "auto" });
      if (n2.className = "markup-item", n2.setAttribute("draggable", "false"), n2.dataset.index = S.indexOf(e2), n2.addEventListener("mousedown", (t3) => {
        t3.stopPropagation();
        const e3 = n2.getBoundingClientRect();
        (t3.clientX <= e3.left + 6 || t3.clientX >= e3.right - 6 || t3.clientY <= e3.top + 6 || t3.clientY >= e3.bottom - 6) && (g = n2, y = t3.clientX - n2.offsetLeft, x = t3.clientY - n2.offsetTop, b = true);
      }), "rect" === e2.mode) n2.style.width = `${e2.w}px`, n2.style.height = `${e2.h}px`, n2.style.border = `2px solid ${e2.color}`, n2.style.background = "transparent", n2.style.pointerEvents = "none", n2.style.boxSizing = "border-box", n2.style.cursor = "default";
      else if ("ellipse" === e2.mode) n2.style.width = `${e2.w}px`, n2.style.height = `${e2.h}px`, n2.style.border = `2px solid ${e2.color}`, n2.style.borderRadius = "50%", n2.style.background = "transparent", n2.style.pointerEvents = "none", n2.style.boxSizing = "border-box", n2.style.cursor = "default";
      else if ("text" === e2.mode) n2.textContent = e2.text, n2.style.font = `${e2.fontWeight || "400"} ${e2.fontSize}px sans-serif`, n2.style.color = e2.color, n2.style.background = "transparent", n2.style.padding = "2px 4px";
      else if ("arrow" === e2.mode) {
        const n3 = document.createElement("canvas");
        n3.width = window.innerWidth, n3.height = window.innerHeight, n3.style.cssText = "\n        position: absolute;\n        left: 0;\n        top: 0;\n        pointer-events: none;\n        z-index: 9986;\n      ";
        const o2 = n3.getContext("2d");
        o2.strokeStyle = e2.color, o2.lineWidth = e2.width, Z(o2, e2.x1, e2.y1, e2.x2, e2.y2, e2.color, e2.width), t2.appendChild(n3);
      } else if ("pen" === e2.mode) {
        const n3 = document.createElement("canvas");
        n3.width = window.innerWidth, n3.height = window.innerHeight, n3.style.cssText = "\n    position: absolute;\n    left: 0;\n    top: 0;\n    pointer-events: none;\n    z-index: 9986;\n  ";
        const o2 = n3.getContext("2d");
        if (o2.strokeStyle = e2.color, o2.lineWidth = e2.width, o2.beginPath(), e2.path && e2.path.length > 0) {
          o2.moveTo(e2.path[0].x, e2.path[0].y);
          for (let t3 = 1; t3 < e2.path.length; t3++) o2.lineTo(e2.path[t3].x, e2.path[t3].y);
        }
        o2.stroke(), t2.appendChild(n3);
      } else if ("mosaic" === e2.mode) {
        const n3 = document.createElement("canvas");
        n3.width = window.innerWidth, n3.height = window.innerHeight, n3.style.cssText = "\n        position: absolute;\n        left: 0;\n        top: 0;\n        pointer-events: none;\n        z-index: 9986;\n      ";
        const o2 = n3.getContext("2d"), i2 = window._captureHiddenCtx, a2 = 4 * e2.width;
        if (e2.path && i2) for (const t3 of e2.path) {
          const e3 = i2.getImageData(t3.x, t3.y, 1, 1), [n4, l2, r2] = e3.data;
          o2.fillStyle = `rgb(${n4}, ${l2}, ${r2})`, o2.fillRect(t3.x - a2 / 2, t3.y - a2 / 2, a2, a2);
        }
        t2.appendChild(n3);
      }
      t2.appendChild(n2);
    }
  }
}
function j() {
  const t2 = document.getElementById("undoBtn");
  t2 && (t2.disabled = 0 === S.length);
}
function G(t2, e2) {
  const n2 = D.getBoundingClientRect(), o2 = t2.offsetHeight || 50, i2 = n2.bottom + 6, a2 = n2.top - o2 - 6, l2 = i2 + o2 > window.innerHeight ? a2 : i2, r2 = e2.offsetLeft, s2 = n2.left + r2;
  t2.style.left = `${s2}px`, t2.style.top = `${l2}px`;
}
function K() {
  const t2 = l == null ? void 0 : l.getBoundingClientRect();
  return t2 ? { x: Math.round(t2.left), y: Math.round(t2.top), width: Math.round(t2.width), height: Math.round(t2.height) } : null;
}
function Q(t2, e2, n2, o2) {
  const i2 = D.offsetWidth || 200, a2 = D.offsetHeight || 40;
  let l2 = t2 + n2 / 2, r2 = e2 + o2 + 10;
  r2 + a2 > window.innerHeight && (r2 = e2 - a2 - 10);
  const s2 = window.innerWidth - i2 - 10;
  let d2 = true;
  l2 - i2 / 2 < 10 ? (l2 = 10, d2 = false) : l2 + i2 / 2 > window.innerWidth - 10 && (l2 = s2, d2 = false), D.style.left = `${l2}px`, D.style.top = `${r2}px`, D.style.transform = d2 ? "translateX(-50%)" : "none";
}
function V(t2, e2, n2 = {}) {
  const o2 = document.createElement(t2);
  return e2 && (o2.id = e2), Object.assign(o2.style, n2), o2;
}
function Z(t2, e2, n2, o2, i2, a2, l2) {
  const r2 = 10 + 1.5 * l2, s2 = Math.atan2(i2 - n2, o2 - e2), d2 = Math.PI / 9, c2 = o2 - 0.5 * r2 * Math.cos(s2), h2 = i2 - 0.5 * r2 * Math.sin(s2);
  t2.beginPath(), t2.moveTo(e2, n2), t2.lineTo(c2, h2), t2.strokeStyle = a2, t2.lineWidth = l2, t2.stroke(), t2.beginPath(), t2.moveTo(o2, i2), t2.lineTo(o2 - r2 * Math.cos(s2 - d2), i2 - r2 * Math.sin(s2 - d2)), t2.lineTo(o2 - r2 * Math.cos(s2 + d2), i2 - r2 * Math.sin(s2 + d2)), t2.closePath(), t2.fillStyle = a2, t2.fill();
}
function tt(t2) {
  const e2 = 5 * t2, n2 = document.createElement("canvas");
  n2.width = e2, n2.height = e2;
  const o2 = n2.getContext("2d");
  return o2.clearRect(0, 0, e2, e2), o2.beginPath(), o2.arc(e2 / 2, e2 / 2, e2 / 2 - 2, 0, 2 * Math.PI), o2.strokeStyle = "rgba(0, 0, 0, 0.7)", o2.lineWidth = 2, o2.stroke(), n2.toDataURL("image/png");
}
function et() {
  const { cropRegion: t2 } = window._captureTempData || {}, e2 = window._captureHiddenCanvas;
  if (!e2 || !t2) return null;
  const n2 = document.createElement("canvas");
  n2.width = t2.width, n2.height = t2.height;
  const o2 = n2.getContext("2d");
  if (o2.drawImage(e2, t2.x, t2.y, t2.width, t2.height, 0, 0, t2.width, t2.height), window._markupContainer) {
    window._markupContainer.querySelectorAll(".markup-item").forEach((e3) => {
      const n3 = parseInt(e3.dataset.index, 10), i2 = S[n3];
      if (!i2) return;
      const a2 = i2.x - t2.x, l2 = i2.y - t2.y;
      if (o2.save(), "rect" === i2.mode) o2.strokeStyle = i2.color, o2.lineWidth = i2.width, o2.strokeRect(a2, l2, i2.w, i2.h);
      else if ("ellipse" === i2.mode) o2.strokeStyle = i2.color, o2.lineWidth = i2.width, o2.beginPath(), o2.ellipse(a2 + i2.w / 2, l2 + i2.h / 2, i2.w / 2, i2.h / 2, 0, 0, 2 * Math.PI), o2.stroke();
      else if ("text" === i2.mode) o2.font = `${i2.fontWeight || "400"} ${i2.fontSize}px sans-serif`, o2.fillStyle = i2.color, o2.fillText(i2.text, a2, l2 + i2.fontSize);
      else if ("arrow" === i2.mode) o2.strokeStyle = i2.color, o2.lineWidth = i2.width, Z(o2, i2.x1 - t2.x, i2.y1 - t2.y, i2.x2 - t2.x, i2.y2 - t2.y, i2.color, i2.width);
      else if ("pen" === i2.mode) {
        if (o2.strokeStyle = i2.color, o2.lineWidth = i2.width, o2.beginPath(), i2.path && i2.path.length > 0) {
          o2.moveTo(i2.path[0].x - t2.x, i2.path[0].y - t2.y);
          for (let e4 = 1; e4 < i2.path.length; e4++) o2.lineTo(i2.path[e4].x - t2.x, i2.path[e4].y - t2.y);
        }
        o2.stroke();
      } else if ("mosaic" === i2.mode) {
        const e4 = window._captureHiddenCtx, n4 = 4 * i2.width;
        if (i2.path && e4) for (const a3 of i2.path) {
          const i3 = e4.getImageData(a3.x, a3.y, 1, 1), [l3, r2, s2] = i3.data;
          o2.fillStyle = `rgb(${l3}, ${r2}, ${s2})`, o2.fillRect(a3.x - t2.x - n4 / 2, a3.y - t2.y - n4 / 2, n4, n4);
        }
      }
      o2.restore();
    });
  }
  return n2.toDataURL("image/png");
}
function nt() {
  window._captureMaskCanvas && (window._captureMaskCanvas.remove(), window._captureMaskCanvas = null, window._captureMaskCtx = null), D.style.display = "none";
  const { cropRegion: n2 } = window._captureTempData || {};
  if (!window._captureHiddenCanvas || !n2) return;
  const o2 = et();
  o2 && (A(), setTimeout(() => {
    t.send(e("capture-done"), o2);
  }, 0));
}
function ot() {
  D.innerHTML = `
    <button data-action="rect" title="${d[s].rect}"><img src="icons/rect.svg" alt="${d[s].rect}" /></button>
    <button data-action="ellipse" title="${d[s].ellipse}"><img src="icons/ellipse.svg" alt="${d[s].ellipse}" /></button>
    <button data-action="arrow" title="${d[s].arrow}"><img src="icons/arrow.svg" alt="${d[s].arrow}" /></button>
    <button data-action="pen" title="${d[s].pen}"><img src="icons/pen.svg" alt="${d[s].pen}" /></button>
    <button data-action="mosaic" title="${d[s].mosaic}"><img src="icons/mosaic.svg" alt="${d[s].mosaic}" /></button>
    <button data-action="text" title="${d[s].text}"><img src="icons/text.svg" alt="${d[s].text}" /></button>
    <button data-action="undo" id="undoBtn" title="${d[s].undo}" disabled><img src="icons/undo.svg" alt="${d[s].undo}" /></button>
    <button data-action="download" title="${d[s].download}"><img src="icons/download.svg" alt="${d[s].download}" /></button>
    <button data-action="cancel" title="${d[s].cancel}" style="color: red;"><img src="icons/cancel.svg" alt="${d[s].cancel}" /></button>
    <button data-action="confirm" title="${d[s].confirm}"><img src="icons/confirm.svg" alt="${d[s].confirm}" /></button>
  `;
}
function it() {
  const t2 = d[s];
  X.innerHTML = `
    <div style="display: flex; column-gap: 10px; align-items: center">
      <label style="margin-right: 12px;">
        <select id="textFontSize">
          <option value="14">${t2.fontSizeSmall}</option>
          <option value="18">${t2.fontSizeMedium}</option>
          <option value="24">${t2.fontSizeLarge}</option>
        </select>
      </label>
      <div id="colorOptions" style="display: flex; gap: 6px;">
        <div class="color-block" data-color="#ff4d4f" style="background: #ff4d4f;"></div>
        <!-- … 其他颜色块 … -->
      </div>
    </div>
  `, document.getElementById("textFontSize").value = $.fontSize, document.getElementById("textFontSize").addEventListener("change", (t3) => {
    $.fontSize = parseInt(t3.target.value, 10);
  });
}
J.forEach((t2) => {
  t2.addEventListener("click", () => {
    if (J.forEach((t3) => t3.classList.remove("selected")), t2.classList.add("selected"), $.lineWidth = parseInt(t2.dataset.width, 10), "mosaic" === W) {
      const t3 = tt($.lineWidth);
      document.body.style.cursor = `url(${t3}) ${2 * $.lineWidth} ${2 * $.lineWidth}, auto`, l && (l.style.cursor = `url(${t3}) ${2 * $.lineWidth} ${2 * $.lineWidth}, auto`);
    }
  });
}), t.on(e("set-main-color"), (t2, e2) => {
  "string" == typeof e2 && (P = e2);
}), t.on(e("set-lang"), (t2, e2) => {
  d[e2] && (s = e2, ot(), it());
}), t.on(e("set-window-index"), (t2, e2) => {
  H = e2;
}), t.on(e("set-crop-limit"), (t2, e2) => {
  window._captureTempData = window._captureTempData || {}, window._captureTempData.cropRegionLimit = e2;
}), t.on(e("highlight-border"), (t2, e2) => {
  H === e2 ? (Y.style.border = `2px solid ${P}`, Y.style.background = "rgba(0, 0, 0, 0.2)") : (Y.style.border = "none", Y.style.background = "rgba(0, 0, 0, 0.4)");
}), t.on(e("screenshot-lock-state"), (t2, { locked: e2, isSelf: n2 }) => {
  u = e2 && !n2;
}), t.on(e("display-screenshot"), (t2, e2, s2, d2) => {
  R && (R.remove(), R = null, L = null), c && (c.remove(), c = null, h = null), window._markupContainer && (window._markupContainer.remove(), window._markupContainer = null), r = d2;
  const p2 = new Image();
  p2.src = e2, l && (document.body.removeChild(l), l = null), D.style.display = "none", q(), n = o = i = a = 0, p2.onload = () => {
    document.body.style.backgroundImage = `url(${e2})`, document.body.style.backgroundSize = "cover", document.body.style.userSelect = "none", document.body.style.backgroundColor = "transparent";
    const t3 = document.createElement("canvas");
    t3.width = p2.width, t3.height = p2.height;
    const n2 = t3.getContext("2d");
    n2.imageSmoothingEnabled = false, n2.webkitImageSmoothingEnabled = false, n2.mozImageSmoothingEnabled = false, n2.msImageSmoothingEnabled = false, n2.drawImage(p2, 0, 0), window._captureHiddenCanvas = t3, window._captureHiddenCtx = n2;
    const o2 = V("canvas", "maskCanvas", { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9980, backgroundColor: "transparent" });
    document.body.appendChild(o2), window._captureMaskCanvas = o2, window._captureMaskCtx = o2.getContext("2d");
  };
}), document.addEventListener("mousedown", (t2) => {
  var _a, _b, _c, _d;
  if (!p) return;
  if (0 !== t2.button) return;
  const e2 = document.querySelectorAll(".markup-item");
  for (const n2 of e2) {
    const e3 = n2.getBoundingClientRect(), o2 = 6;
    if (t2.clientX >= e3.left && t2.clientX <= e3.right && t2.clientY >= e3.top && t2.clientY <= e3.bottom && (Math.abs(t2.clientX - e3.left) <= o2 || Math.abs(t2.clientX - e3.right) <= o2 || Math.abs(t2.clientY - e3.top) <= o2 || Math.abs(t2.clientY - e3.bottom) <= o2)) return g = n2, y = t2.clientX - n2.offsetLeft, x = t2.clientY - n2.offsetTop, b = true, void t2.preventDefault();
  }
  if (t2.target.classList.contains("markup-item")) return g = t2.target, y = t2.clientX - g.offsetLeft, x = t2.clientY - g.offsetTop, b = true, void t2.preventDefault();
  const r2 = (_a = l == null ? void 0 : l.getBoundingClientRect) == null ? void 0 : _a.call(l), s2 = r2 && t2.clientX >= r2.left && t2.clientX <= r2.right && t2.clientY >= r2.top && t2.clientY <= r2.bottom;
  if (E && s2 && !W && 0 === S.length && 0 === t2.button) return k = true, C = t2.clientX - r2.left, void (M = t2.clientY - r2.top);
  if (t2.target.closest("#screenshot-editor-toolbar")) return;
  if (t2.target.closest("#text-config-panel")) return;
  if (f && f.contains(t2.target)) return;
  if (b) return;
  const d2 = (_b = window._captureTempData) == null ? void 0 : _b.cropRegion, c2 = t2.clientX, h2 = t2.clientY;
  if ("text" === W && E && 0 === t2.button) {
    if (!(c2 >= d2.x && c2 <= d2.x + d2.width && h2 >= d2.y && h2 <= d2.y + d2.height)) return;
    const t3 = $.fontSize, e3 = $.strokeColor, n2 = V("input", null, { position: "fixed", left: `${c2}px`, top: `${h2}px`, zIndex: 99999, border: "1px solid red", backgroundColor: "transparent", outline: "none", padding: "2px 4px", borderRadius: "4px", caretColor: e3, fontWeight: "bold", font: `${$.fontWeight || "400"} ${t3}px sans-serif`, color: e3 });
    return n2.type = "text", document.body.appendChild(n2), setTimeout(() => {
      n2.focus();
    }, 0), f = n2, n2.addEventListener("keydown", (e4) => {
      if ("Enter" === e4.key) {
        const e5 = n2.value.trim();
        if ("" !== e5) {
          const o2 = { mode: "text", x: parseInt(n2.style.left, 10), y: parseInt(n2.style.top, 10), text: e5, color: n2.style.color, fontSize: t3, fontWeight: $.fontWeight || "400" };
          S.push(o2), j(), v.push(JSON.parse(JSON.stringify(S))), L.font = `${o2.fontWeight || "400"} ${o2.fontSize}px sans-serif`, L.fillStyle = o2.color, U();
        }
        n2.remove(), f = null;
      }
    }), void n2.addEventListener("blur", () => {
      if (!n2.value.trim()) return n2.remove(), void (f = null);
      const t4 = n2.value.trim(), e4 = { mode: "text", x: parseInt(n2.style.left, 10), y: parseInt(n2.style.top, 10), text: t4, color: n2.style.color, fontSize: $.fontSize, fontWeight: $.fontWeight || "400" };
      S.push(e4), j(), v.push(JSON.parse(JSON.stringify(S))), L.font = `${e4.fontWeight || "400"} ${e4.fontSize}px sans-serif`, L.fillStyle = e4.color, U(), n2.remove(), f = null;
    });
  }
  if (["rect", "ellipse", "arrow", "pen", "mosaic"].includes(W) && E) {
    const t3 = (_c = window._captureTempData) == null ? void 0 : _c.cropRegion;
    c2 >= t3.x && c2 <= t3.x + t3.width && h2 >= t3.y && h2 <= t3.y + t3.height && (I = true, T = c2, z = h2, "pen" !== W && "mosaic" !== W || (window._currentPenPath = [{ x: c2, y: h2 }]));
  } else if (!E || 0 !== t2.button) {
    if (u && 0 === t2.button) return t2.preventDefault(), void t2.stopPropagation();
    if (W && E) {
      const e3 = (_d = window._captureTempData) == null ? void 0 : _d.cropRegion;
      t2.clientX >= e3.x && t2.clientX <= e3.x + e3.width && t2.clientY >= e3.y && t2.clientY <= e3.y + e3.height && (I = true, T = t2.clientX, z = t2.clientY);
    } else {
      if (!window._captureMaskCanvas) {
        const t3 = V("canvas", "maskCanvas", { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9980, backgroundColor: "transparent" });
        document.body.appendChild(t3), window._captureMaskCanvas = t3, window._captureMaskCtx = t3.getContext("2d");
      }
      if (l && (document.body.removeChild(l), l = null), 0 === t2.button && (D.style.display = "none", q()), 0 === t2.button) _ = true, n = t2.clientX, o = t2.clientY, i = t2.clientX, a = t2.clientY, l = V("div", "selectionBox", { position: "absolute", left: `${n}px`, top: `${o}px`, border: `2px solid ${P}`, background: "rgba(255, 255, 255, 0)", zIndex: 9982, boxSizing: "border-box", pointerEvents: "none", width: "1px", height: "1px" }), document.body.appendChild(l);
    }
  }
}), window.addEventListener("mousemove", (r2) => {
  var _a, _b, _c, _d, _e, _f;
  if (!p) return;
  const s2 = document.querySelectorAll(".markup-item");
  let d2 = false;
  for (const t2 of s2) {
    const e2 = t2.getBoundingClientRect(), n2 = 6;
    if (r2.clientX >= e2.left && r2.clientX <= e2.right && r2.clientY >= e2.top && r2.clientY <= e2.bottom && (Math.abs(r2.clientX - e2.left) <= n2 || Math.abs(r2.clientX - e2.right) <= n2 || Math.abs(r2.clientY - e2.top) <= n2 || Math.abs(r2.clientY - e2.bottom) <= n2)) {
      document.body.style.cursor = "move", d2 = true;
      break;
    }
  }
  if (d2 || "mosaic" === W || (document.body.style.cursor = "default"), g) {
    const t2 = (_a = window._captureTempData) == null ? void 0 : _a.cropRegion;
    if (!t2) return;
    let e2 = r2.clientX - y, n2 = r2.clientY - x;
    const o2 = g.offsetWidth, i2 = g.offsetHeight;
    return e2 = Math.max(t2.x, Math.min(t2.x + t2.width - o2, e2)), n2 = Math.max(t2.y, Math.min(t2.y + t2.height - i2, n2)), g.style.left = `${e2}px`, void (g.style.top = `${n2}px`);
  }
  if (E && l && (r2.target.classList.contains("markup-item") ? l.style.cursor = "default" : !W && 0 === S.length && l.contains(r2.target) ? l.style.cursor = "move" : l.style.cursor = "default"), k && l) {
    const t2 = ((_b = window._captureTempData) == null ? void 0 : _b.cropRegionLimit) || { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }, e2 = l.offsetWidth, n2 = l.offsetHeight;
    let o2 = r2.clientX - C, i2 = r2.clientY - M;
    o2 = Math.max(t2.x, Math.min(t2.x + t2.width - e2, o2)), i2 = Math.max(t2.y, Math.min(t2.y + t2.height - n2, i2)), l.style.left = `${o2}px`, l.style.top = `${i2}px`, l.style.opacity = "0.8", l.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.15)", window._captureTempData.cropRegion = { x: o2, y: i2, width: e2, height: n2 }, F(window._captureTempData.cropRegion), Q(o2, i2, e2, n2);
  }
  const u2 = { x: r2.screenX, y: r2.screenY };
  t.send(e("check-display"), u2);
  const f2 = window._captureHiddenCanvas, b2 = window._captureHiddenCtx;
  if (w = r2.clientX, m = r2.clientY, f2 && b2) {
    const t2 = 50, e2 = t2 * 3, n2 = 40;
    B.width = e2, B.height = e2 + n2, B.style.width = `${B.width}px`, B.style.height = `${B.height}px`;
    const o2 = Math.floor(r2.clientX), i2 = Math.floor(r2.clientY), a2 = b2.getImageData(o2 - t2 / 2, i2 - t2 / 2, t2, t2), l2 = document.createElement("canvas");
    l2.width = t2, l2.height = t2;
    l2.getContext("2d").putImageData(a2, 0, 0), O.clearRect(0, 0, B.width, B.height), O.imageSmoothingEnabled = false, O.drawImage(l2, 0, 0, t2, t2, 0, 0, e2, e2), O.strokeStyle = P, O.lineWidth = 1, O.strokeRect(0, 0, e2, e2);
    const s3 = e2 / 2;
    O.beginPath(), O.moveTo(s3, 0), O.lineTo(s3, e2), O.moveTo(0, s3), O.lineTo(e2, s3), O.strokeStyle = P, O.stroke();
    const d3 = 20, c2 = window.innerWidth, h2 = window.innerHeight;
    let p2 = r2.clientX + d3, u3 = r2.clientY + d3;
    p2 + B.width > c2 && (p2 = r2.clientX - B.width - d3), u3 + B.height > h2 && (u3 = r2.clientY - B.height - d3), B.style.left = `${p2}px`, B.style.top = `${u3}px`;
    const f3 = function(t3, e3, n3) {
      const o3 = t3.canvas;
      if (e3 < 0 || n3 < 0 || e3 >= o3.width || n3 >= o3.height) return { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)", hex: "#000000" };
      const i3 = t3.getImageData(e3, n3, 1, 1);
      let [a3, l3, r3] = i3.data;
      const s4 = (t4) => t4 >= 253 ? 255 : t4;
      a3 = s4(a3), l3 = s4(l3), r3 = s4(r3);
      const d4 = (t4) => t4.toString(16).padStart(2, "0"), c3 = `#${d4(a3)}${d4(l3)}${d4(r3)}`;
      return { r: a3, g: l3, b: r3, rgb: `rgb(${a3}, ${l3}, ${r3})`, hex: c3 };
    }(b2, o2, i2), { r: w2, g: m2, b: g2 } = f3;
    O.font = "14px sans-serif";
    const y2 = `x: ${o2}, y: ${i2}`, x2 = `rgb(${w2}, ${m2}, ${g2})`, v3 = O.measureText(y2).width, k2 = O.measureText(x2).width, C2 = 4, M2 = 16;
    O.fillStyle = "#000", O.fillRect(0, e2 + 2, v3 + 2 * C2, M2), O.fillStyle = "#fff", O.fillText(y2, C2, e2 + 14), O.fillStyle = "#000", O.fillRect(0, e2 + 20, k2 + 2 * C2, M2), O.fillStyle = "#fff", O.fillText(x2, C2, e2 + 32);
  }
  if (I && W && h) {
    const t2 = (_c = window._captureTempData) == null ? void 0 : _c.cropRegion, e2 = Math.min(Math.max(w, t2.x), t2.x + t2.width), n2 = Math.min(Math.max(m, t2.y), t2.y + t2.height), o2 = Math.min(T, e2), i2 = Math.min(z, n2), a2 = Math.abs(e2 - T), l2 = Math.abs(n2 - z);
    if (h.clearRect(0, 0, c.width, c.height), h.strokeStyle = $.strokeColor, h.lineWidth = $.lineWidth, "rect" === W) h.strokeRect(o2, i2, a2, l2);
    else if ("ellipse" === W) h.beginPath(), h.ellipse(o2 + a2 / 2, i2 + l2 / 2, a2 / 2, l2 / 2, 0, 0, 2 * Math.PI), h.stroke();
    else if ("arrow" === W) Z(h, T, z, e2, n2, $.strokeColor, $.lineWidth);
    else if ("pen" === W) {
      const t3 = (_d = window._captureTempData) == null ? void 0 : _d.cropRegion, e3 = Math.min(Math.max(w, t3.x), t3.x + t3.width), n3 = Math.min(Math.max(m, t3.y), t3.y + t3.height);
      window._currentPenPath.push({ x: e3, y: n3 }), h.clearRect(0, 0, c.width, c.height), h.strokeStyle = $.strokeColor, h.lineWidth = $.lineWidth, h.beginPath();
      const o3 = window._currentPenPath;
      h.moveTo(o3[0].x, o3[0].y);
      for (let t4 = 1; t4 < o3.length; t4++) h.lineTo(o3[t4].x, o3[t4].y);
      h.stroke();
    } else if ("mosaic" === W) {
      const t3 = (_e = window._captureTempData) == null ? void 0 : _e.cropRegion, e3 = Math.min(Math.max(w, t3.x), t3.x + t3.width), n3 = Math.min(Math.max(m, t3.y), t3.y + t3.height), o3 = window._currentPenPath[window._currentPenPath.length - 1], i3 = e3 - o3.x, a3 = n3 - o3.y, l3 = Math.sqrt(i3 * i3 + a3 * a3), r3 = 2 * $.lineWidth, s3 = Math.floor(l3 / r3);
      for (let t4 = 1; t4 <= s3; t4++) {
        const e4 = o3.x + i3 * t4 / s3, n4 = o3.y + a3 * t4 / s3;
        window._currentPenPath.push({ x: e4, y: n4 });
      }
      window._currentPenPath.push({ x: e3, y: n3 }), h.clearRect(0, 0, c.width, c.height);
      const d3 = 4 * $.lineWidth, p2 = window._captureHiddenCtx;
      if (!p2) return;
      for (const t4 of window._currentPenPath) {
        const e4 = p2.getImageData(t4.x, t4.y, 1, 1), [n4, o4, i4] = e4.data;
        h.fillStyle = `rgb(${n4}, ${o4}, ${i4})`, h.fillRect(t4.x - d3 / 2, t4.y - d3 / 2, d3, d3);
      }
    }
  }
  if (!_ || 1 !== r2.buttons) return;
  const v2 = ((_f = window._captureTempData) == null ? void 0 : _f.cropRegionLimit) || { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
  i = Math.min(Math.max(r2.clientX, v2.x), v2.x + v2.width), a = Math.min(Math.max(r2.clientY, v2.y), v2.y + v2.height);
  const R2 = Math.min(n, i), L2 = Math.min(o, a), D2 = Math.abs(i - n), X2 = Math.abs(a - o);
  l.style.left = `${R2}px`, l.style.top = `${L2}px`, l.style.width = `${D2}px`, l.style.height = `${X2}px`;
  F(K());
}), window.addEventListener("mouseup", (s2) => {
  var _a;
  if (!p) return;
  if (0 !== s2.button) return;
  if (k = false, g) {
    const t2 = parseInt(g.dataset.index, 10);
    isNaN(t2) || (S[t2].x = parseInt(g.style.left, 10), S[t2].y = parseInt(g.style.top, 10)), g = null, b = false, v.push(JSON.parse(JSON.stringify(S))), j();
  }
  if (I) {
    I = false;
    const t2 = (_a = window._captureTempData) == null ? void 0 : _a.cropRegion, e2 = 1, n2 = Math.min(Math.max(s2.clientX, t2.x + e2), t2.x + t2.width - e2), o2 = Math.min(Math.max(s2.clientY, t2.y + e2), t2.y + t2.height - e2), i2 = Math.min(T, n2), a2 = Math.min(z, o2), l2 = Math.abs(n2 - T), r2 = Math.abs(o2 - z);
    return "pen" === W ? (S.push({ mode: "pen", path: window._currentPenPath || [], color: $.strokeColor, width: $.lineWidth }), window._currentPenPath = null) : "arrow" === W ? S.push({ mode: "arrow", x1: T, y1: z, x2: n2, y2: o2, color: $.strokeColor, width: $.lineWidth }) : "mosaic" === W ? (S.push({ mode: "mosaic", path: window._currentPenPath || [], width: $.lineWidth }), window._currentPenPath = null) : S.push({ mode: W, x: i2, y: a2, w: l2, h: r2, color: $.strokeColor, width: $.lineWidth }), j(), U(), h && h.clearRect(0, 0, c.width, c.height), v.push(JSON.parse(JSON.stringify(S))), void j();
  }
  if (!_) return;
  _ = false, B.style.display = "none";
  const d2 = K();
  if (n === i && o === a) ;
  else {
    window._captureTempData = { cropRegion: d2, thumbnailSize: r, currentWindowIndex: H };
    const s3 = Math.min(n, i), p2 = Math.min(o, a), u2 = Math.abs(i - n), f2 = Math.abs(a - o);
    if (!R) {
      R = V("canvas", null, { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9985 }), R.id = "markupCanvas", R.width = window.innerWidth, R.height = window.innerHeight, document.body.appendChild(R), L = R.getContext("2d");
      const t2 = document.createElement("div");
      t2.id = "markup-container", t2.style.cssText = "\n        position: fixed;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        z-index: 9986;\n        pointer-events: none;\n      ", document.body.appendChild(t2), window._markupContainer = t2, c || (c = V("canvas", "previewCanvas", { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9986 }), c.width = window.innerWidth, c.height = window.innerHeight, document.body.appendChild(c), h = c.getContext("2d"));
    }
    D.style.display = "block", Q(s3, p2, u2, f2), E = true, l.style.opacity = "", l.style.boxShadow = "", t.send(e("screenshot-window-lock"), H);
  }
}), document.addEventListener("contextmenu", (n2) => {
  if (n2.preventDefault(), E) {
    if (S.length > 0) return;
    if (W) return;
    return E = false, l && (l.remove(), l = null), window._captureMaskCanvas && (window._captureMaskCanvas.remove(), window._captureMaskCanvas = null, window._captureMaskCtx = null), L && L.clearRect(0, 0, R.width, R.height), D.style.display = "none", q(), B.style.display = "block", void t.send(e("screenshot-window-unlock"));
  }
  A();
}), document.addEventListener("keydown", (t2) => {
  "Escape" === t2.key && A();
}), D.addEventListener("click", (n2) => {
  const o2 = n2.target.closest("button[data-action]");
  if (!o2) return;
  const i2 = o2.dataset.action;
  if ("cancel" === i2 && A(), "confirm" === i2 && nt(), "text" === i2) {
    const t2 = document.getElementById("text-config-panel");
    if ("text" === W) W = null, t2.style.display = "none", U();
    else {
      W = "text", q(), G(t2, o2), t2.style.display = "block";
      const e2 = t2.querySelectorAll(".color-block");
      e2.forEach((t3) => {
        t3.addEventListener("click", () => {
          e2.forEach((t4) => t4.classList.remove("selected")), t3.classList.add("selected"), $.strokeColor = t3.dataset.color;
        });
      }), l && (l.style.cursor = "default"), document.getElementById("textFontSize").value = $.fontSize, document.getElementById("textFontSize").addEventListener("change", (t3) => {
        $.fontSize = parseInt(t3.target.value, 10);
      });
    }
  }
  if (["rect", "ellipse", "arrow", "pen", "mosaic"].includes(i2)) if (document.getElementById("text-config-panel").style.display = "none", W === i2) W = null, q(), U();
  else if (W = i2, function(t2) {
    const e2 = document.getElementById("draw-config-panel");
    G(e2, t2), e2.style.display = "block";
    const n3 = document.getElementById("colorOptions");
    n3 && (n3.style.display = "mosaic" === W ? "none" : "flex");
    const o3 = document.querySelectorAll("#colorOptions .color-block");
    o3.forEach((t3) => {
      t3.classList.toggle("selected", t3.dataset.color.toLowerCase() === $.strokeColor.toLowerCase());
    });
    const i3 = document.querySelectorAll("#lineWidthOptions .line-dot");
    i3.forEach((t3) => {
      t3.classList.toggle("selected", parseInt(t3.dataset.width) === $.lineWidth);
    });
  }(o2), "mosaic" === W) {
    const t2 = tt($.lineWidth);
    document.body.style.cursor = `url(${t2}) ${2 * $.lineWidth} ${2 * $.lineWidth}, auto`, l && (l.style.cursor = `url(${t2}) ${2 * $.lineWidth} ${2 * $.lineWidth}, auto`);
  } else document.body.style.cursor = "default", l && (l.style.cursor = "default");
  if ("undo" === i2 && v.length > 0) {
    v.pop();
    const t2 = v[v.length - 1] || [];
    S = JSON.parse(JSON.stringify(t2)), U(), j();
  }
  if ("download" === i2) {
    const n3 = et();
    n3 && t.invoke(e("save-capture-image"), { base64Data: n3, windowIndex: H }).then((t2) => {
      t2 && A();
    });
  }
}), document.addEventListener("dblclick", (t2) => {
  var _a;
  if (!p) return;
  if (!E) return;
  const e2 = (_a = window._captureTempData) == null ? void 0 : _a.cropRegion;
  if (!e2) return;
  const n2 = t2.clientX, o2 = t2.clientY;
  n2 >= e2.x && n2 <= e2.x + e2.width && o2 >= e2.y && o2 <= e2.y + e2.height && nt();
}), document.getElementById("colorPicker").addEventListener("input", (t2) => {
  $.strokeColor = t2.target.value;
}), document.getElementById("lineWidth").addEventListener("input", (t2) => {
  $.lineWidth = parseInt(t2.target.value, 10);
});
