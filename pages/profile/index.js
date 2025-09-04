const app = getApp();
Page({
  data: {
    isDark: false,
    showLoginModal: false,
    showRegisterModal:false,
    loginForm: {
      username: '',
      password: '',
      remember: false
    },
    registerForm:{
      username: '',
      password: '',
      verifyPassword: '',
    },

    userInfo: {
      name: '未登录',
      isLogin: false,
      role: '游客'
    },
    statistics: {
      familyCount: 0,
      memberCount: 0,
      generationCount: 0,
      branchCount: 0,
      photoCount: 0
    },
    inviteCount: 0
  },
  
  onShow() {
    const saved = wx.getStorageSync('theme') || app.globalData.theme || 'light';
    this.setData({ isDark: saved === 'dark' });
    this.applyRootTheme(saved);
    this.loadUserData();
  },
  
  async loadUserData() {
    try {
      // 检查是否有保存的登录信息
      const savedLogin = wx.getStorageSync('loginInfo');
      if (savedLogin && savedLogin.remember) {
        this.setData({
          'loginForm.username': savedLogin.username,
          'loginForm.password': savedLogin.password,
          'loginForm.remember': true
        });
        
        // 自动登录
        this.autoLogin(savedLogin.username);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },
  
  async autoLogin(username) {
    try {
      // 模拟自动登录
      this.setData({
        'userInfo.name': username,
        'userInfo.isLogin': true,
        'userInfo.role': '家谱管理员',
        statistics: {
          familyCount: 2,
          memberCount: 45,
          generationCount: 6,
          branchCount: 8,
          photoCount: 23
        },
        inviteCount: 3
      });
    } catch (error) {
      console.error('自动登录失败:', error);
    }
  },
  
  onToggleTheme(e) {
    const isDark = e.detail.value;
    const theme = isDark ? 'dark' : 'light';
    app.applyTheme(theme);
    this.applyRootTheme(theme);
    this.setData({ isDark });
  },
  
  applyRootTheme(theme) {
    const pages = getCurrentPages();
    if (pages && pages.length) {
      const page = pages[pages.length - 1];
      page.setData && page.setData({ __theme__: theme });
    }
  },
  
  // 登录弹窗控制
  showLoginModal() {
    this.setData({ showLoginModal: true });
  },
  
  hideLoginModal() {
    this.setData({ showLoginModal: false });
  },
  showRegisterModal(){
    this.setData({ showRegisterModal: true });
  },
  hideRegisterModal(){
    this.setData({ showRegisterModal: false });
  },
  
  // 表单输入处理
  onUsernameInput(e) {
    this.setData({ 'loginForm.username': e.detail.value });
  },
  
  onPasswordInput(e) {
    this.setData({ 'loginForm.password': e.detail.value });
  },
  
  onRememberChange(e) {
    this.setData({ 'loginForm.remember': e.detail.value });
  },
  
  // 用户操作
  onAvatarTap() {
    if (!this.data.userInfo.isLogin) {
      this.showLoginModal();
    } else {
      wx.showActionSheet({
        itemList: ['更换头像', '修改昵称'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.changeAvatar();
          } else if (res.tapIndex === 1) {
            this.changeNickname();
          }
        }
      });
    }
  },
  
  // 登录相关
  async onLoginSubmit() {
    const { username, password } = this.data.loginForm;
    
    if (!username.trim()) {
      wx.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '登录中...' });
    
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 登录成功
      this.setData({
        'userInfo.name': username,
        'userInfo.isLogin': true,
        'userInfo.role': '家谱管理员',
        showLoginModal: false,
        statistics: {
          familyCount: 2,
          memberCount: 45,
          generationCount: 6,
          branchCount: 8,
          photoCount: 23
        },
        inviteCount: 3
      });
      
      // 保存登录状态
      if (this.data.loginForm.remember) {
        wx.setStorageSync('loginInfo', {
          username,
          password,
          remember: true
        });
      }
      
      wx.hideLoading();
      wx.showToast({ title: '登录成功', icon: 'success' });
      
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '登录失败，请检查账户密码', icon: 'none' });
    }
  },
  
  onRegister() {
    wx.showToast({ title: '注册功能开发中', icon: 'none' });
  },
  
  onForgotPassword() {
    wx.showToast({ title: '找回密码功能开发中', icon: 'none' });
  },
  async onRegisterSave() {
    const { formData } = this.data.registerForm;
    
    if (!formData.uername.trim()) {
      wx.showToast({ title: '请输入用户名', icon: 'none' });
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
  onWechatLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          'userInfo.name': res.userInfo.nickName,
          'userInfo.isLogin': true,
          'userInfo.role': '家谱管理员',
          showLoginModal: false,
          statistics: {
            familyCount: 2,
            memberCount: 45,
            generationCount: 6,
            branchCount: 8,
            photoCount: 23
          },
          inviteCount: 3
        });
        wx.showToast({ title: '微信登录成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '微信登录取消', icon: 'none' });
      }
    });
  },
  
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '退出后需要重新登录才能同步数据',
      confirmColor: '#EB5757',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            'userInfo.isLogin': false,
            'userInfo.name': '未登录',
            'userInfo.role': '游客',
            statistics: {
              familyCount: 0,
              memberCount: 0,
              generationCount: 0,
              branchCount: 0,
              photoCount: 0
            },
            inviteCount: 0
          });
          
          // 清除登录信息
          wx.removeStorageSync('loginInfo');
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  },
  
  // 家谱管理
  onMyFamilies() {
    wx.showToast({ title: '我的家谱功能开发中', icon: 'none' });
  },
  
  onJoinedFamilies() {
    wx.showToast({ title: '参与家谱功能开发中', icon: 'none' });
  },
  
  onFamilyInvite() {
    wx.showToast({ title: '邀请管理功能开发中', icon: 'none' });
  },
  
  // 工具与设置
  onImportExport() {
    wx.showActionSheet({
      itemList: ['导入 GEDCOM', '导出 GEDCOM', '导入 Excel', '导出 Excel'],
      success: (res) => {
        const actions = ['导入 GEDCOM', '导出 GEDCOM', '导入 Excel', '导出 Excel'];
        wx.showToast({ 
          title: `${actions[res.tapIndex]}功能开发中`, 
          icon: 'none' 
        });
      }
    });
  },
  
  onBackupRestore() {
    wx.showActionSheet({
      itemList: ['备份到云端', '从云端恢复', '本地备份', '查看备份历史'],
      success: (res) => {
        const actions = ['云端备份', '云端恢复', '本地备份', '备份历史'];
        wx.showToast({ 
          title: `${actions[res.tapIndex]}功能开发中`, 
          icon: 'none' 
        });
      }
    });
  },
  
  onPrivacySettings() {
    wx.showToast({ title: '隐私设置功能开发中', icon: 'none' });
  },
  
  // 帮助与反馈
  onHelp() {
    wx.showToast({ title: '使用帮助功能开发中', icon: 'none' });
  },
  
  onFeedback() {
    wx.showToast({ title: '意见反馈功能开发中', icon: 'none' });
  },
  
  onAbout() {
    wx.showModal({
      title: '关于家谱小程序',
      content: '版本：v1.0.0\n开发者：家谱团队\n\n专业的家族族谱管理工具，帮助您记录和传承家族历史。',
      showCancel: false,
      confirmText: '知道了'
    });
  },
  
  // 辅助方法
  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showToast({ title: '头像上传功能开发中', icon: 'none' });
      }
    });
  },
  
  changeNickname() {
    wx.showToast({ title: '修改昵称功能开发中', icon: 'none' });
  }
});

