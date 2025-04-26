import "./capture.js";
(function() {
  const e = document.createElement("link").relList;
  if (!(e && e.supports && e.supports("modulepreload"))) {
    for (const e2 of document.querySelectorAll('link[rel="modulepreload"]')) r(e2);
    new MutationObserver((e2) => {
      for (const t of e2) if ("childList" === t.type) for (const e3 of t.addedNodes) "LINK" === e3.tagName && "modulepreload" === e3.rel && r(e3);
    }).observe(document, { childList: true, subtree: true });
  }
  function r(e2) {
    if (e2.ep) return;
    e2.ep = true;
    const r2 = function(e3) {
      const r3 = {};
      return e3.integrity && (r3.integrity = e3.integrity), e3.referrerPolicy && (r3.referrerPolicy = e3.referrerPolicy), "use-credentials" === e3.crossOrigin ? r3.credentials = "include" : "anonymous" === e3.crossOrigin ? r3.credentials = "omit" : r3.credentials = "same-origin", r3;
    }(e2);
    fetch(e2.href, r2);
  }
})();
