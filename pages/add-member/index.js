Page({
  data: {
    formData: {
      name: '',
      gender: '男',
      birthDate: '',
      location: '',
      generation: 1,
      marry: '是',
      ancestor:'否',
      fatherName:'',
      motherName:'',
      spouseName:'',
      spouseGender: '男',
      spouseBirthDate: '',
      spouseLocation: ''


    },
    isShowSpouseInfo:true,
    isAncestor:true
  },
  
  onLoad() {},
  
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  
  onGenderChange(e) {
    const index = e.detail.value; // 获取的是索引：0 或 1
    const genders = ['男', '女'];
    
    this.setData({
      'formData.gender': genders[index] // 将索引转换为文字
    });
 
  },

  onSpouseGenderChange(e) {
    const index = e.detail.value; // 获取的是索引：0 或 1
    const genders = ['男', '女'];
    
    this.setData({
      'formData.spouseGender': genders[index] // 将索引转换为文字
    });
 
  },

  onMerryChange(e){

    const index = e.detail.value; // 获取的是索引：0 或 1
    const marrys = ['否', '是'];
    
    this.setData({
      'formData.marry':marrys[index],// 将索引转换为文字
      isShowSpouseInfo: index==1
    });
  },
  onAncestorChange(e){

    const index = e.detail.value; // 获取的是索引：0 或 1
    const ancestors = ['否', '是'];
    
    this.setData({
      'formData.ancestor':  ancestors[index],// 将索引转换为文字
      isAncestor:index==0
      
    });
   
  },
  // 
  onBirthDateChange(e) {
    this.setData({
      'formData.birthDate': e.detail.value
    });
  },
  onSpouseBirthDateChange(e) {
    this.setData({
      'formData.spouseBirthDate': e.detail.value
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
    wx.navigateTo({
      url: '/pages/parents/index', // 跳转的页面路径
      success: () => {
        // 跳转成功的回调
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
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

