Page({
  data: {
    activeTab: 0
  },
  onTab(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({ activeTab: index });
  }
});

