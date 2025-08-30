Page({
  data: {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  },
  onViewChange() {},
  onGenChange() {},
  resetView() {
    this.setData({ scale: 1, offsetX: 0, offsetY: 0 });
  }
});

