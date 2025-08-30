Page({
  data: {
    searchText: '',
    recentMembers: [],
    loading: false
  },
  
  async onLoad() {
    this.loadRecentMembers();
  },
  
  async onShow() {
    // 页面显示时重新加载数据
    this.loadRecentMembers();
  },
  
  async loadRecentMembers() {
    this.setData({ loading: true });
    try {
      const result = await wx.cloud.callFunction({
        name: 'getMembers',
        data: { limit: 5 }
      });
      
      if (result.result.success) {
        // 格式化时间显示
        const members = result.result.data.map(item => ({
          ...item,
          createTime: this.formatTime(item.createTime)
        }));
        
        this.setData({
          recentMembers: members
        });
      }
    } catch (error) {
      console.error('加载最近成员失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
  
  formatTime(date) {
    if (!date) return '刚刚';
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    return Math.floor(diff / 86400000) + '天前';
  },
  
  onSearchInput(e) {
    this.setData({ searchText: e.detail.value });
  },
  
  onSearch() {
    const { searchText } = this.data;
    if (!searchText.trim()) {
      wx.showToast({ title: '请输入搜索内容', icon: 'none' });
      return;
    }
    // TODO: 实现搜索功能
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  },
  
  onCreateFamily() {
    wx.navigateTo({ url: '/pages/add-member/index' });
  },
  
  onViewTree() {
    wx.switchTab({ url: '/pages/tree/index' });
  }
});

