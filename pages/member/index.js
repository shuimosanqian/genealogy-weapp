Page({
  data: {
    activeTab: 0,
    memberData: {
      name: '张三',
      gender: '男',
      birthYear: '1988',
      location: '浙江 宁波',
      generation: 5,
      status: '在世',
      role: '长子',
      spouse: '李四',
      children: '张五、张六',
      parents: '张大年、王氏'
    }
  },
  
  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadMemberData(id);
    }
  },
  
  async loadMemberData(id) {
    try {
      // TODO: 根据ID加载具体成员数据
      wx.showLoading({ title: '加载中...' });
      
      // 模拟数据加载
      setTimeout(() => {
        wx.hideLoading();
      }, 500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },
  
  onTab(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({ activeTab: index });
  },
  
  onEdit() {
    wx.navigateTo({ url: '/pages/add-member/index?mode=edit' });
  },
  
  onAddRelation() {
    wx.showActionSheet({
      itemList: ['添加父母', '添加配偶', '添加子女', '添加兄弟姐妹'],
      success: (res) => {
        const relations = ['parents', 'spouse', 'children', 'siblings'];
        const relation = relations[res.tapIndex];
        wx.navigateTo({ 
          url: `/pages/add-member/index?relation=${relation}` 
        });
      }
    });
  },
  
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  onAddEvent() {
    wx.showToast({ title: '时间轴功能开发中', icon: 'none' });
  },
  
  onAddPhoto() {
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showToast({ title: '上传功能开发中', icon: 'none' });
      }
    });
  },
  
  onAddDoc() {
    wx.showToast({ title: '文档功能开发中', icon: 'none' });
  }
});

