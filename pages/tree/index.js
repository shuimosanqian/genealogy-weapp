Page({
  data: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    viewMode: 0, // 0: 树视图, 1: 列表视图
    genFilter: 0, // 0: 全部, 1: 前5代, 2: 前10代
    viewTypes: ['🌳 树视图', '📋 列表视图'],
    genTypes: ['全部世代', '前5代', '前10代'],
    members: [] // 家谱成员数据
  },
  
  onLoad() {
    this.loadMembers();
  },
  
  async loadMembers() {
    try {
      const result = await wx.cloud.callFunction({
        name: 'getMembers',
        data: { limit: 50 }
      });
      
      if (result.result.success) {
        this.setData({
          members: result.result.data
        });
      }
    } catch (error) {
      console.error('加载家谱成员失败:', error);
    }
  },
  
  onViewChange(e) {
    this.setData({ viewMode: e.detail.value });
    wx.showToast({ 
      title: this.data.viewTypes[e.detail.value], 
      icon: 'none' 
    });
  },
  
  onGenChange(e) {
    this.setData({ genFilter: e.detail.value });
    wx.showToast({ 
      title: this.data.genTypes[e.detail.value], 
      icon: 'none' 
    });
  },
  
  onNodeTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ 
      url: `/pages/member/index?id=${id}` 
    });
  },
  
  onZoomIn() {
    const newScale = Math.min(this.data.scale * 1.2, 2.5);
    this.setData({ scale: newScale });
  },
  
  onZoomOut() {
    const newScale = Math.max(this.data.scale * 0.8, 0.5);
    this.setData({ scale: newScale });
  },
  
  resetView() {
    this.setData({ 
      scale: 1, 
      offsetX: 0, 
      offsetY: 0 
    });
    wx.showToast({ title: '已重置视图', icon: 'success' });
  },
  
  onAddMember() {
    wx.navigateTo({ url: '/pages/add-member/index' });
  }
});

