App({
  globalData: {
    theme: 'light'
  },
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-8gr8ucme12e1d53f', // 请替换为你的真实环境ID
        traceUser: true
      });
    }
    
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

