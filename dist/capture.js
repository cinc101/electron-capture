const { ipcRenderer: t } = require("electron"), e = (t2) => `screenshot-plugin/${t2}`;
let n, o, i, a, l, s, r = "zh", d = { zh: { rect: "方框", ellipse: "椭圆", arrow: "箭头", pen: "画笔", mosaic: "马赛克", text: "文字", undo: "撤销", download: "下载", cancel: "退出", confirm: "完成" }, en: { rect: "Rectangle", ellipse: "Ellipse", arrow: "Arrow", pen: "Pen", mosaic: "Mosaic", text: "Text", undo: "Undo", download: "Download", cancel: "Cancel", confirm: "Confirm" } }, c = null, h = null, p = false, u = false, w = null, f = 0, g = 0, m = null, y = 0, x = 0, b = false, v = [], k = false, C = 0, M = 0, $ = [], S = { strokeColor: "#ff4d4f", lineWidth: 2, fontSize: 18 }, _ = false, W = false, E = null, I = false, T = 0, R = 0, P = null, L = null, z = "#07c160";
window.onload = () => {
  p = true, ot(), t.send(e("capture-window-ready"));
};
const D = V("div", "screenshot-editor-toolbar", { position: "absolute", zIndex: 99999, background: "#fff", borderRadius: "6px", padding: "10px 0 10px 15px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", display: "none", color: "#333", fontFamily: "sans-serif", height: "20px", minWidth: "320px", whiteSpace: "nowrap", overflow: "visible" });
document.body.appendChild(D);
const X = V("div", "text-config-panel", { position: "absolute", zIndex: 99999, background: "#fff", border: "1px solid #ccc", padding: "6px 10px", borderRadius: "4px", display: "none", fontSize: "14px" });
X.innerHTML = '\n  <div style="display: flex; column-gap: 10px; align-items: center">\n    <label style="margin-right: 12px;">\n      <select id="textFontSize">\n        <option value="14">小</option>\n        <option value="18" selected>中</option>\n        <option value="24">大</option>\n      </select>\n    </label>\n    <div id="colorOptions" style="display: flex; gap: 6px;">\n      <div class="color-block" data-color="#ff4d4f" style="background: #ff4d4f;"></div>\n      <div class="color-block" data-color="#fadb14" style="background: #fadb14;"></div>\n      <div class="color-block" data-color="#1890ff" style="background: #1890ff;"></div>\n      <div class="color-block" data-color="#52c41a" style="background: #52c41a;"></div>\n      <div class="color-block" data-color="#000000" style="background: #000000;"></div>\n    </div>\n  </div>\n', document.body.appendChild(X);
const Y = document.getElementById("overlay");
let H = null;
const O = V("canvas", null, { position: "fixed", border: "none", zIndex: 9999, pointerEvents: "none", display: "block" });
O.width = 150, O.height = 190, document.body.appendChild(O);
const B = O.getContext("2d"), N = document.querySelectorAll("#colorOptions .color-block");
N.forEach((t2) => {
  t2.addEventListener("click", () => {
    N.forEach((t3) => t3.classList.remove("selected")), t2.classList.add("selected"), S.strokeColor = t2.dataset.color;
  });
});
const J = document.querySelectorAll("#lineWidthOptions .line-dot");
function q() {
  const t2 = document.getElementById("draw-config-panel");
  t2 && (t2.style.display = "none");
}
function A() {
  t.send(e("screenshot-window-unlock")), P && (P.remove(), P = null, L = null), c && (c.remove(), c = null, h = null), window._markupContainer && (window._markupContainer.remove(), window._markupContainer = null), $ = [], v = [], v.push(JSON.parse(JSON.stringify($))), l && (l.remove(), l = null), O && (O.style.display = "none"), D.style.display = "none", window._captureMaskCanvas && (window._captureMaskCanvas.remove(), window._captureMaskCanvas = null, window._captureMaskCtx = null), t.send(e("capture-cancel")), _ = false, W = false, I = false, E = "", S = { strokeColor: "red", lineWidth: 2 }, n = 0, o = 0, i = 0, a = 0, window._captureTempData = null, document.body.style.backgroundImage = "none";
}
function F(t2) {
  const e2 = window._captureMaskCanvas, n2 = window._captureMaskCtx;
  e2 && n2 && (e2.width = window.innerWidth, e2.height = window.innerHeight, n2.clearRect(0, 0, e2.width, e2.height), n2.fillStyle = "rgba(0, 0, 0, 0.2)", n2.fillRect(0, 0, e2.width, e2.height), n2.globalCompositeOperation = "destination-out", n2.fillStyle = "rgba(0, 0, 0, 1)", n2.fillRect(t2.x, t2.y, t2.width, t2.height), n2.globalCompositeOperation = "source-over", n2.strokeStyle = z || "#409EFF", n2.lineWidth = 2, n2.strokeRect(t2.x + 1, t2.y + 1, t2.width - 2, t2.height - 2));
}
function U() {
  const t2 = window._markupContainer;
  if (t2) {
    t2.innerHTML = "";
    for (const e2 of $) {
      const n2 = V("div", null, { position: "absolute", left: `${e2.x}px`, top: `${e2.y}px`, cursor: "move", pointerEvents: "auto" });
      if (n2.className = "markup-item", n2.setAttribute("draggable", "false"), n2.dataset.index = $.indexOf(e2), n2.addEventListener("mousedown", (t3) => {
        t3.stopPropagation();
        const e3 = n2.getBoundingClientRect();
        (t3.clientX <= e3.left + 6 || t3.clientX >= e3.right - 6 || t3.clientY <= e3.top + 6 || t3.clientY >= e3.bottom - 6) && (m = n2, y = t3.clientX - n2.offsetLeft, x = t3.clientY - n2.offsetTop, b = true);
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
          const e3 = i2.getImageData(t3.x, t3.y, 1, 1), [n4, l2, s2] = e3.data;
          o2.fillStyle = `rgb(${n4}, ${l2}, ${s2})`, o2.fillRect(t3.x - a2 / 2, t3.y - a2 / 2, a2, a2);
        }
        t2.appendChild(n3);
      }
      t2.appendChild(n2);
    }
  }
}
function j() {
  const t2 = document.getElementById("undoBtn");
  t2 && (t2.disabled = 0 === $.length);
}
function G(t2, e2) {
  const n2 = D.getBoundingClientRect(), o2 = t2.offsetHeight || 50, i2 = n2.bottom + 6, a2 = n2.top - o2 - 6, l2 = i2 + o2 > window.innerHeight ? a2 : i2, s2 = e2.offsetLeft, r2 = n2.left + s2;
  t2.style.left = `${r2}px`, t2.style.top = `${l2}px`;
}
function K() {
  const t2 = l == null ? void 0 : l.getBoundingClientRect();
  return t2 ? { x: Math.round(t2.left), y: Math.round(t2.top), width: Math.round(t2.width), height: Math.round(t2.height) } : null;
}
function Q(t2, e2, n2, o2) {
  const i2 = D.offsetWidth || 200, a2 = D.offsetHeight || 40;
  let l2 = t2 + n2 / 2, s2 = e2 + o2 + 10;
  s2 + a2 > window.innerHeight && (s2 = e2 - a2 - 10);
  const r2 = window.innerWidth - i2 - 10;
  let d2 = true;
  l2 - i2 / 2 < 10 ? (l2 = 10, d2 = false) : l2 + i2 / 2 > window.innerWidth - 10 && (l2 = r2, d2 = false), D.style.left = `${l2}px`, D.style.top = `${s2}px`, D.style.transform = d2 ? "translateX(-50%)" : "none";
}
function V(t2, e2, n2 = {}) {
  const o2 = document.createElement(t2);
  return e2 && (o2.id = e2), Object.assign(o2.style, n2), o2;
}
function Z(t2, e2, n2, o2, i2, a2, l2) {
  const s2 = 10 + 1.5 * l2, r2 = Math.atan2(i2 - n2, o2 - e2), d2 = Math.PI / 9, c2 = o2 - 0.5 * s2 * Math.cos(r2), h2 = i2 - 0.5 * s2 * Math.sin(r2);
  t2.beginPath(), t2.moveTo(e2, n2), t2.lineTo(c2, h2), t2.strokeStyle = a2, t2.lineWidth = l2, t2.stroke(), t2.beginPath(), t2.moveTo(o2, i2), t2.lineTo(o2 - s2 * Math.cos(r2 - d2), i2 - s2 * Math.sin(r2 - d2)), t2.lineTo(o2 - s2 * Math.cos(r2 + d2), i2 - s2 * Math.sin(r2 + d2)), t2.closePath(), t2.fillStyle = a2, t2.fill();
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
      const n3 = parseInt(e3.dataset.index, 10), i2 = $[n3];
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
          const i3 = e4.getImageData(a3.x, a3.y, 1, 1), [l3, s2, r2] = i3.data;
          o2.fillStyle = `rgb(${l3}, ${s2}, ${r2})`, o2.fillRect(a3.x - t2.x - n4 / 2, a3.y - t2.y - n4 / 2, n4, n4);
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
    <button data-action="rect" title="${d[r].rect}"><img src="icons/rect.svg" alt="${d[r].rect}" /></button>
    <button data-action="ellipse" title="${d[r].ellipse}"><img src="icons/ellipse.svg" alt="${d[r].ellipse}" /></button>
    <button data-action="arrow" title="${d[r].arrow}"><img src="icons/arrow.svg" alt="${d[r].arrow}" /></button>
    <button data-action="pen" title="${d[r].pen}"><img src="icons/pen.svg" alt="${d[r].pen}" /></button>
    <button data-action="mosaic" title="${d[r].mosaic}"><img src="icons/mosaic.svg" alt="${d[r].mosaic}" /></button>
    <button data-action="text" title="${d[r].text}"><img src="icons/text.svg" alt="${d[r].text}" /></button>
    <button data-action="undo" id="undoBtn" title="${d[r].undo}" disabled><img src="icons/undo.svg" alt="${d[r].undo}" /></button>
    <button data-action="download" title="${d[r].download}"><img src="icons/download.svg" alt="${d[r].download}" /></button>
    <button data-action="cancel" title="${d[r].cancel}" style="color: red;"><img src="icons/cancel.svg" alt="${d[r].cancel}" /></button>
    <button data-action="confirm" title="${d[r].confirm}"><img src="icons/confirm.svg" alt="${d[r].confirm}" /></button>
  `;
}
J.forEach((t2) => {
  t2.addEventListener("click", () => {
    if (J.forEach((t3) => t3.classList.remove("selected")), t2.classList.add("selected"), S.lineWidth = parseInt(t2.dataset.width, 10), "mosaic" === E) {
      const t3 = tt(S.lineWidth);
      document.body.style.cursor = `url(${t3}) ${2 * S.lineWidth} ${2 * S.lineWidth}, auto`, l && (l.style.cursor = `url(${t3}) ${2 * S.lineWidth} ${2 * S.lineWidth}, auto`);
    }
  });
}), t.on(e("set-main-color"), (t2, e2) => {
  "string" == typeof e2 && (z = e2);
}), t.on(e("set-lang"), (t2, e2) => {
  d[e2] && (r = e2, ot());
}), t.on(e("set-window-index"), (t2, e2) => {
  H = e2;
}), t.on(e("set-crop-limit"), (t2, e2) => {
  window._captureTempData = window._captureTempData || {}, window._captureTempData.cropRegionLimit = e2;
}), t.on(e("highlight-border"), (t2, e2) => {
  H === e2 ? (Y.style.border = `2px solid ${z}`, Y.style.background = "rgba(0, 0, 0, 0.2)") : (Y.style.border = "none", Y.style.background = "rgba(0, 0, 0, 0.4)");
}), t.on(e("screenshot-lock-state"), (t2, { locked: e2, isSelf: n2 }) => {
  u = e2 && !n2;
}), t.on(e("display-screenshot"), (t2, e2, r2, d2) => {
  P && (P.remove(), P = null, L = null), c && (c.remove(), c = null, h = null), window._markupContainer && (window._markupContainer.remove(), window._markupContainer = null), s = d2;
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
    if (t2.clientX >= e3.left && t2.clientX <= e3.right && t2.clientY >= e3.top && t2.clientY <= e3.bottom && (Math.abs(t2.clientX - e3.left) <= o2 || Math.abs(t2.clientX - e3.right) <= o2 || Math.abs(t2.clientY - e3.top) <= o2 || Math.abs(t2.clientY - e3.bottom) <= o2)) return m = n2, y = t2.clientX - n2.offsetLeft, x = t2.clientY - n2.offsetTop, b = true, void t2.preventDefault();
  }
  if (t2.target.classList.contains("markup-item")) return m = t2.target, y = t2.clientX - m.offsetLeft, x = t2.clientY - m.offsetTop, b = true, void t2.preventDefault();
  const s2 = (_a = l == null ? void 0 : l.getBoundingClientRect) == null ? void 0 : _a.call(l), r2 = s2 && t2.clientX >= s2.left && t2.clientX <= s2.right && t2.clientY >= s2.top && t2.clientY <= s2.bottom;
  if (W && r2 && !E && 0 === $.length && 0 === t2.button) return k = true, C = t2.clientX - s2.left, void (M = t2.clientY - s2.top);
  if (t2.target.closest("#screenshot-editor-toolbar")) return;
  if (t2.target.closest("#text-config-panel")) return;
  if (w && w.contains(t2.target)) return;
  if (b) return;
  const d2 = (_b = window._captureTempData) == null ? void 0 : _b.cropRegion, c2 = t2.clientX, h2 = t2.clientY;
  if ("text" === E && W && 0 === t2.button) {
    if (!(c2 >= d2.x && c2 <= d2.x + d2.width && h2 >= d2.y && h2 <= d2.y + d2.height)) return;
    const t3 = S.fontSize, e3 = S.strokeColor, n2 = V("input", null, { position: "fixed", left: `${c2}px`, top: `${h2}px`, zIndex: 99999, border: "1px solid red", backgroundColor: "transparent", outline: "none", padding: "2px 4px", borderRadius: "4px", caretColor: e3, fontWeight: "bold", font: `${S.fontWeight || "400"} ${t3}px sans-serif`, color: e3 });
    return n2.type = "text", document.body.appendChild(n2), setTimeout(() => {
      n2.focus();
    }, 0), w = n2, n2.addEventListener("keydown", (e4) => {
      if ("Enter" === e4.key) {
        const e5 = n2.value.trim();
        if ("" !== e5) {
          const o2 = { mode: "text", x: parseInt(n2.style.left, 10), y: parseInt(n2.style.top, 10), text: e5, color: n2.style.color, fontSize: t3, fontWeight: S.fontWeight || "400" };
          $.push(o2), j(), v.push(JSON.parse(JSON.stringify($))), L.font = `${o2.fontWeight || "400"} ${o2.fontSize}px sans-serif`, L.fillStyle = o2.color, U();
        }
        n2.remove(), w = null;
      }
    }), void n2.addEventListener("blur", () => {
      if (!n2.value.trim()) return n2.remove(), void (w = null);
      const t4 = n2.value.trim(), e4 = { mode: "text", x: parseInt(n2.style.left, 10), y: parseInt(n2.style.top, 10), text: t4, color: n2.style.color, fontSize: S.fontSize, fontWeight: S.fontWeight || "400" };
      $.push(e4), j(), v.push(JSON.parse(JSON.stringify($))), L.font = `${e4.fontWeight || "400"} ${e4.fontSize}px sans-serif`, L.fillStyle = e4.color, U(), n2.remove(), w = null;
    });
  }
  if (["rect", "ellipse", "arrow", "pen", "mosaic"].includes(E) && W) {
    const t3 = (_c = window._captureTempData) == null ? void 0 : _c.cropRegion;
    c2 >= t3.x && c2 <= t3.x + t3.width && h2 >= t3.y && h2 <= t3.y + t3.height && (I = true, T = c2, R = h2, "pen" !== E && "mosaic" !== E || (window._currentPenPath = [{ x: c2, y: h2 }]));
  } else if (!W || 0 !== t2.button) {
    if (u && 0 === t2.button) return t2.preventDefault(), void t2.stopPropagation();
    if (E && W) {
      const e3 = (_d = window._captureTempData) == null ? void 0 : _d.cropRegion;
      t2.clientX >= e3.x && t2.clientX <= e3.x + e3.width && t2.clientY >= e3.y && t2.clientY <= e3.y + e3.height && (I = true, T = t2.clientX, R = t2.clientY);
    } else {
      if (!window._captureMaskCanvas) {
        const t3 = V("canvas", "maskCanvas", { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9980, backgroundColor: "transparent" });
        document.body.appendChild(t3), window._captureMaskCanvas = t3, window._captureMaskCtx = t3.getContext("2d");
      }
      if (l && (document.body.removeChild(l), l = null), 0 === t2.button && (D.style.display = "none", q()), 0 === t2.button) _ = true, n = t2.clientX, o = t2.clientY, i = t2.clientX, a = t2.clientY, l = V("div", "selectionBox", { position: "absolute", left: `${n}px`, top: `${o}px`, border: `2px solid ${z}`, background: "rgba(255, 255, 255, 0)", zIndex: 9982, boxSizing: "border-box", pointerEvents: "none", width: "1px", height: "1px" }), document.body.appendChild(l);
    }
  }
}), window.addEventListener("mousemove", (s2) => {
  var _a, _b, _c, _d, _e, _f;
  if (!p) return;
  const r2 = document.querySelectorAll(".markup-item");
  let d2 = false;
  for (const t2 of r2) {
    const e2 = t2.getBoundingClientRect(), n2 = 6;
    if (s2.clientX >= e2.left && s2.clientX <= e2.right && s2.clientY >= e2.top && s2.clientY <= e2.bottom && (Math.abs(s2.clientX - e2.left) <= n2 || Math.abs(s2.clientX - e2.right) <= n2 || Math.abs(s2.clientY - e2.top) <= n2 || Math.abs(s2.clientY - e2.bottom) <= n2)) {
      document.body.style.cursor = "move", d2 = true;
      break;
    }
  }
  if (d2 || "mosaic" === E || (document.body.style.cursor = "default"), m) {
    const t2 = (_a = window._captureTempData) == null ? void 0 : _a.cropRegion;
    if (!t2) return;
    let e2 = s2.clientX - y, n2 = s2.clientY - x;
    const o2 = m.offsetWidth, i2 = m.offsetHeight;
    return e2 = Math.max(t2.x, Math.min(t2.x + t2.width - o2, e2)), n2 = Math.max(t2.y, Math.min(t2.y + t2.height - i2, n2)), m.style.left = `${e2}px`, void (m.style.top = `${n2}px`);
  }
  if (W && l && (s2.target.classList.contains("markup-item") ? l.style.cursor = "default" : !E && 0 === $.length && l.contains(s2.target) ? l.style.cursor = "move" : l.style.cursor = "default"), k && l) {
    const t2 = ((_b = window._captureTempData) == null ? void 0 : _b.cropRegionLimit) || { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }, e2 = l.offsetWidth, n2 = l.offsetHeight;
    let o2 = s2.clientX - C, i2 = s2.clientY - M;
    o2 = Math.max(t2.x, Math.min(t2.x + t2.width - e2, o2)), i2 = Math.max(t2.y, Math.min(t2.y + t2.height - n2, i2)), l.style.left = `${o2}px`, l.style.top = `${i2}px`, l.style.opacity = "0.8", l.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.15)", window._captureTempData.cropRegion = { x: o2, y: i2, width: e2, height: n2 }, F(window._captureTempData.cropRegion), Q(o2, i2, e2, n2);
  }
  const u2 = { x: s2.screenX, y: s2.screenY };
  t.send(e("check-display"), u2);
  const w2 = window._captureHiddenCanvas, b2 = window._captureHiddenCtx;
  if (f = s2.clientX, g = s2.clientY, w2 && b2) {
    const t2 = 50, e2 = t2 * 3, n2 = 40;
    O.width = e2, O.height = e2 + n2, O.style.width = `${O.width}px`, O.style.height = `${O.height}px`;
    const o2 = Math.floor(s2.clientX), i2 = Math.floor(s2.clientY), a2 = b2.getImageData(o2 - t2 / 2, i2 - t2 / 2, t2, t2), l2 = document.createElement("canvas");
    l2.width = t2, l2.height = t2;
    l2.getContext("2d").putImageData(a2, 0, 0), B.clearRect(0, 0, O.width, O.height), B.imageSmoothingEnabled = false, B.drawImage(l2, 0, 0, t2, t2, 0, 0, e2, e2), B.strokeStyle = z, B.lineWidth = 1, B.strokeRect(0, 0, e2, e2);
    const r3 = e2 / 2;
    B.beginPath(), B.moveTo(r3, 0), B.lineTo(r3, e2), B.moveTo(0, r3), B.lineTo(e2, r3), B.strokeStyle = z, B.stroke();
    const d3 = 20, c2 = window.innerWidth, h2 = window.innerHeight;
    let p2 = s2.clientX + d3, u3 = s2.clientY + d3;
    p2 + O.width > c2 && (p2 = s2.clientX - O.width - d3), u3 + O.height > h2 && (u3 = s2.clientY - O.height - d3), O.style.left = `${p2}px`, O.style.top = `${u3}px`;
    const w3 = function(t3, e3, n3) {
      const o3 = t3.canvas;
      if (e3 < 0 || n3 < 0 || e3 >= o3.width || n3 >= o3.height) return { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)", hex: "#000000" };
      const i3 = t3.getImageData(e3, n3, 1, 1);
      let [a3, l3, s3] = i3.data;
      const r4 = (t4) => t4 >= 253 ? 255 : t4;
      a3 = r4(a3), l3 = r4(l3), s3 = r4(s3);
      const d4 = (t4) => t4.toString(16).padStart(2, "0"), c3 = `#${d4(a3)}${d4(l3)}${d4(s3)}`;
      return { r: a3, g: l3, b: s3, rgb: `rgb(${a3}, ${l3}, ${s3})`, hex: c3 };
    }(b2, o2, i2), { r: f2, g: g2, b: m2 } = w3;
    B.font = "14px sans-serif";
    const y2 = `x: ${o2}, y: ${i2}`, x2 = `rgb(${f2}, ${g2}, ${m2})`, v3 = B.measureText(y2).width, k2 = B.measureText(x2).width, C2 = 4, M2 = 16;
    B.fillStyle = "#000", B.fillRect(0, e2 + 2, v3 + 2 * C2, M2), B.fillStyle = "#fff", B.fillText(y2, C2, e2 + 14), B.fillStyle = "#000", B.fillRect(0, e2 + 20, k2 + 2 * C2, M2), B.fillStyle = "#fff", B.fillText(x2, C2, e2 + 32);
  }
  if (I && E && h) {
    const t2 = (_c = window._captureTempData) == null ? void 0 : _c.cropRegion, e2 = Math.min(Math.max(f, t2.x), t2.x + t2.width), n2 = Math.min(Math.max(g, t2.y), t2.y + t2.height), o2 = Math.min(T, e2), i2 = Math.min(R, n2), a2 = Math.abs(e2 - T), l2 = Math.abs(n2 - R);
    if (h.clearRect(0, 0, c.width, c.height), h.strokeStyle = S.strokeColor, h.lineWidth = S.lineWidth, "rect" === E) h.strokeRect(o2, i2, a2, l2);
    else if ("ellipse" === E) h.beginPath(), h.ellipse(o2 + a2 / 2, i2 + l2 / 2, a2 / 2, l2 / 2, 0, 0, 2 * Math.PI), h.stroke();
    else if ("arrow" === E) Z(h, T, R, e2, n2, S.strokeColor, S.lineWidth);
    else if ("pen" === E) {
      const t3 = (_d = window._captureTempData) == null ? void 0 : _d.cropRegion, e3 = Math.min(Math.max(f, t3.x), t3.x + t3.width), n3 = Math.min(Math.max(g, t3.y), t3.y + t3.height);
      window._currentPenPath.push({ x: e3, y: n3 }), h.clearRect(0, 0, c.width, c.height), h.strokeStyle = S.strokeColor, h.lineWidth = S.lineWidth, h.beginPath();
      const o3 = window._currentPenPath;
      h.moveTo(o3[0].x, o3[0].y);
      for (let t4 = 1; t4 < o3.length; t4++) h.lineTo(o3[t4].x, o3[t4].y);
      h.stroke();
    } else if ("mosaic" === E) {
      const t3 = (_e = window._captureTempData) == null ? void 0 : _e.cropRegion, e3 = Math.min(Math.max(f, t3.x), t3.x + t3.width), n3 = Math.min(Math.max(g, t3.y), t3.y + t3.height), o3 = window._currentPenPath[window._currentPenPath.length - 1], i3 = e3 - o3.x, a3 = n3 - o3.y, l3 = Math.sqrt(i3 * i3 + a3 * a3), s3 = 2 * S.lineWidth, r3 = Math.floor(l3 / s3);
      for (let t4 = 1; t4 <= r3; t4++) {
        const e4 = o3.x + i3 * t4 / r3, n4 = o3.y + a3 * t4 / r3;
        window._currentPenPath.push({ x: e4, y: n4 });
      }
      window._currentPenPath.push({ x: e3, y: n3 }), h.clearRect(0, 0, c.width, c.height);
      const d3 = 4 * S.lineWidth, p2 = window._captureHiddenCtx;
      if (!p2) return;
      for (const t4 of window._currentPenPath) {
        const e4 = p2.getImageData(t4.x, t4.y, 1, 1), [n4, o4, i4] = e4.data;
        h.fillStyle = `rgb(${n4}, ${o4}, ${i4})`, h.fillRect(t4.x - d3 / 2, t4.y - d3 / 2, d3, d3);
      }
    }
  }
  if (!_ || 1 !== s2.buttons) return;
  const v2 = ((_f = window._captureTempData) == null ? void 0 : _f.cropRegionLimit) || { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
  i = Math.min(Math.max(s2.clientX, v2.x), v2.x + v2.width), a = Math.min(Math.max(s2.clientY, v2.y), v2.y + v2.height);
  const P2 = Math.min(n, i), L2 = Math.min(o, a), D2 = Math.abs(i - n), X2 = Math.abs(a - o);
  l.style.left = `${P2}px`, l.style.top = `${L2}px`, l.style.width = `${D2}px`, l.style.height = `${X2}px`;
  F(K());
}), window.addEventListener("mouseup", (r2) => {
  var _a;
  if (!p) return;
  if (0 !== r2.button) return;
  if (k = false, m) {
    const t2 = parseInt(m.dataset.index, 10);
    isNaN(t2) || ($[t2].x = parseInt(m.style.left, 10), $[t2].y = parseInt(m.style.top, 10)), m = null, b = false, v.push(JSON.parse(JSON.stringify($))), j();
  }
  if (I) {
    I = false;
    const t2 = (_a = window._captureTempData) == null ? void 0 : _a.cropRegion, e2 = 1, n2 = Math.min(Math.max(r2.clientX, t2.x + e2), t2.x + t2.width - e2), o2 = Math.min(Math.max(r2.clientY, t2.y + e2), t2.y + t2.height - e2), i2 = Math.min(T, n2), a2 = Math.min(R, o2), l2 = Math.abs(n2 - T), s2 = Math.abs(o2 - R);
    return "pen" === E ? ($.push({ mode: "pen", path: window._currentPenPath || [], color: S.strokeColor, width: S.lineWidth }), window._currentPenPath = null) : "arrow" === E ? $.push({ mode: "arrow", x1: T, y1: R, x2: n2, y2: o2, color: S.strokeColor, width: S.lineWidth }) : "mosaic" === E ? ($.push({ mode: "mosaic", path: window._currentPenPath || [], width: S.lineWidth }), window._currentPenPath = null) : $.push({ mode: E, x: i2, y: a2, w: l2, h: s2, color: S.strokeColor, width: S.lineWidth }), j(), U(), h && h.clearRect(0, 0, c.width, c.height), v.push(JSON.parse(JSON.stringify($))), void j();
  }
  if (!_) return;
  _ = false, O.style.display = "none";
  const d2 = K();
  if (n === i && o === a) ;
  else {
    window._captureTempData = { cropRegion: d2, thumbnailSize: s, currentWindowIndex: H };
    const r3 = Math.min(n, i), p2 = Math.min(o, a), u2 = Math.abs(i - n), w2 = Math.abs(a - o);
    if (!P) {
      P = V("canvas", null, { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9985 }), P.id = "markupCanvas", P.width = window.innerWidth, P.height = window.innerHeight, document.body.appendChild(P), L = P.getContext("2d");
      const t2 = document.createElement("div");
      t2.id = "markup-container", t2.style.cssText = "\n        position: fixed;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        z-index: 9986;\n        pointer-events: none;\n      ", document.body.appendChild(t2), window._markupContainer = t2, c || (c = V("canvas", "previewCanvas", { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: 9986 }), c.width = window.innerWidth, c.height = window.innerHeight, document.body.appendChild(c), h = c.getContext("2d"));
    }
    D.style.display = "block", Q(r3, p2, u2, w2), W = true, l.style.opacity = "", l.style.boxShadow = "", t.send(e("screenshot-window-lock"), H);
  }
}), document.addEventListener("contextmenu", (n2) => {
  if (n2.preventDefault(), W) {
    if ($.length > 0) return;
    if (E) return;
    return W = false, l && (l.remove(), l = null), window._captureMaskCanvas && (window._captureMaskCanvas.remove(), window._captureMaskCanvas = null, window._captureMaskCtx = null), L && L.clearRect(0, 0, P.width, P.height), D.style.display = "none", q(), O.style.display = "block", void t.send(e("screenshot-window-unlock"));
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
    if ("text" === E) E = null, t2.style.display = "none", U();
    else {
      E = "text", q(), G(t2, o2), t2.style.display = "block";
      const e2 = t2.querySelectorAll(".color-block");
      e2.forEach((t3) => {
        t3.addEventListener("click", () => {
          e2.forEach((t4) => t4.classList.remove("selected")), t3.classList.add("selected"), S.strokeColor = t3.dataset.color;
        });
      }), l && (l.style.cursor = "default"), document.getElementById("textFontSize").value = S.fontSize, document.getElementById("textFontSize").addEventListener("change", (t3) => {
        S.fontSize = parseInt(t3.target.value, 10);
      });
    }
  }
  if (["rect", "ellipse", "arrow", "pen", "mosaic"].includes(i2)) if (document.getElementById("text-config-panel").style.display = "none", E === i2) E = null, q(), U();
  else if (E = i2, function(t2) {
    const e2 = document.getElementById("draw-config-panel");
    G(e2, t2), e2.style.display = "block";
    const n3 = document.getElementById("colorOptions");
    n3 && (n3.style.display = "mosaic" === E ? "none" : "flex");
    const o3 = document.querySelectorAll("#colorOptions .color-block");
    o3.forEach((t3) => {
      t3.classList.toggle("selected", t3.dataset.color.toLowerCase() === S.strokeColor.toLowerCase());
    });
    const i3 = document.querySelectorAll("#lineWidthOptions .line-dot");
    i3.forEach((t3) => {
      t3.classList.toggle("selected", parseInt(t3.dataset.width) === S.lineWidth);
    });
  }(o2), "mosaic" === E) {
    const t2 = tt(S.lineWidth);
    document.body.style.cursor = `url(${t2}) ${2 * S.lineWidth} ${2 * S.lineWidth}, auto`, l && (l.style.cursor = `url(${t2}) ${2 * S.lineWidth} ${2 * S.lineWidth}, auto`);
  } else document.body.style.cursor = "default", l && (l.style.cursor = "default");
  if ("undo" === i2 && v.length > 0) {
    v.pop();
    const t2 = v[v.length - 1] || [];
    $ = JSON.parse(JSON.stringify(t2)), U(), j();
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
  if (!W) return;
  const e2 = (_a = window._captureTempData) == null ? void 0 : _a.cropRegion;
  if (!e2) return;
  const n2 = t2.clientX, o2 = t2.clientY;
  n2 >= e2.x && n2 <= e2.x + e2.width && o2 >= e2.y && o2 <= e2.y + e2.height && nt();
}), document.getElementById("colorPicker").addEventListener("input", (t2) => {
  S.strokeColor = t2.target.value;
}), document.getElementById("lineWidth").addEventListener("input", (t2) => {
  S.lineWidth = parseInt(t2.target.value, 10);
});
