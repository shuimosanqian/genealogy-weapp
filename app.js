App({
  globalData: {
    theme: 'light'
  },
  onLaunch() {
    this.applyTheme(this.globalData.theme);
  },
  applyTheme(theme) {
    this.globalData.theme = theme;
    const pages = getCurrentPages();
    // 通过在根节点设置自定义 attr 控制 :root[theme="dark"]
    wx.setStorageSync('theme', theme);
    if (pages && pages.length) {
      pages.forEach(p => p.setData && p.setData({ __theme__: theme }));
    }
  }
});

