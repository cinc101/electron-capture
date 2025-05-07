// demo/boot.cjs
(async () => {
  try {
    // 动态导入 ESM 模块 main.js
    await import('./main.js');
  } catch (err) {
    console.error('[boot.cjs] Failed to start main.js:', err);
    process.exit(1);
  }
})();
