const app = getApp();
Page({
  data: {
    isDark: false
  },
  onShow() {
    const saved = wx.getStorageSync('theme') || app.globalData.theme || 'light';
    this.setData({ isDark: saved === 'dark' });
    this.applyRootTheme(saved);
  },
  onToggleTheme(e) {
    const isDark = e.detail.value;
    const theme = isDark ? 'dark' : 'light';
    app.applyTheme(theme);
    this.applyRootTheme(theme);
    this.setData({ isDark });
  },
  applyRootTheme(theme) {
    // 小程序不支持直接设置 :root 属性，这里通过页面根 view 的 data-theme 方案
    const pages = getCurrentPages();
    if (pages && pages.length) {
      const page = pages[pages.length - 1];
      page.setData && page.setData({ __theme__: theme });
    }
  }
});

