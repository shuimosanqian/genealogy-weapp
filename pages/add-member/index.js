Page({
  data: {
    formData: {
      name: '',
      gender: '男',
      birthDate: '',
      location: '',
      generation: 1
    }
  },
  
  onLoad() {},
  
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  
  onGenderChange(e) {
    this.setData({
      'formData.gender': e.detail.value === 0 ? '男' : '女'
    });
  },
  
  onBirthDateChange(e) {
    this.setData({
      'formData.birthDate': e.detail.value
    });
  },
  
  async onSave() {
    const { formData } = this.data;
    
    if (!formData.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'addMember',
        data: {
          memberData: {
            ...formData,
            familyId: 'default' // 可以根据实际需求设置
          }
        }
      });
      
      wx.hideLoading();
      
      if (result.result.success) {
        wx.showToast({ title: '保存成功' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '网络错误', icon: 'none' });
      console.error('保存成员失败:', error);
    }
  },
  
  // 亲属关系按钮处理
  onAddParent() {
    wx.showToast({ title: '添加父母功能开发中', icon: 'none' });
  },
  
  onAddSpouse() {
    wx.showToast({ title: '添加配偶功能开发中', icon: 'none' });
  },
  
  onAddChild() {
    wx.showToast({ title: '添加子女功能开发中', icon: 'none' });
  },
  
  onAddSibling() {
    wx.showToast({ title: '添加兄弟姐妹功能开发中', icon: 'none' });
  }
});

