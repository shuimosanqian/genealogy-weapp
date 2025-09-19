const app = getApp();
Page({
  data: {
    isDark: false,
    showLoginModal: false,
    
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
      // 仅使用微信登录：从本地获取微信用户信息
      const wxUser = wx.getStorageSync('wxUser');
      if (wxUser && wxUser.nickName) {
        this.setData({
          'userInfo.name': wxUser.nickName,
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
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
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
  
  // // 登录相关（仅微信登录）
  // onWechatLogin() {
  //   wx.getUserProfile({
  //     desc: '用于完善用户资料',
  //     success: (res) => {
  //       // 可选：获取临时登录凭证 code
  //       wx.login({
  //         success: () => {
  //           // 持久化存储微信用户基本信息
  //           console.log(res.userInfo);
  //           wx.setStorageSync('wxUser', res.userInfo);
  //           this.setData({
  //             'userInfo.name': res.userInfo.nickName,
  //             'userInfo.isLogin': true,
  //             'userInfo.role': '家谱管理员',
  //             showLoginModal: false,
  //             statistics: {
  //               familyCount: 2,
  //               memberCount: 45,
  //               generationCount: 6,
  //               branchCount: 8,
  //               photoCount: 23
  //             },
  //             inviteCount: 3
  //           });
  //           wx.showToast({ title: '微信登录成功', icon: 'success' });
  //         }
  //       });
  //     },
  //     fail: () => {
  //       wx.showToast({ title: '微信登录取消', icon: 'none' });
  //     }
  //   });
  // },
  onWechatLogin(){
         // 查看是否授权
         const that = this;
         wx.getSetting({
          success: function(res) {
              if (res.authSetting['scope.userInfo']) {
                  wx.getUserInfo({
                      success: function(res) {
                     //      console.log(res)
                      that.setData({
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

                      //  res.data.userInfo.nickName;
                          // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                          // 根据自己的需求有其他操作再补充
                          // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                          wx.login({
                              success: res => {
                                  // 获取到用户的 code 之后：res.code
                                  console.log("用户的code:" + res.code);
                                  // 可以传给后台，再经过解析获取用户的 openid
                                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                                  let APPID='';
                                  let SECRET='';
                                  const code=res.code;
                                  const db = wx.cloud.database();

                                  // 获取集合引用
                                  const usersCollection = db.collection('APPInfo');
                                
                                  // 查询所有用户数据
                                  usersCollection.get({
                                    success: res => {
                                     APPID=res.data[0].APPID.replace(/"/g, "'");
                                     SECRET=res.data[0].SECRET.replace(/"/g, "'");

                                          wx.request({
                                            // 自行补上自己的 APPID 和 SECRET
                                          
                                            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`,
                                            success: res => {
                                                // 获取到用户的 openid
                                                console.log("用户的openid:" + res.data.openid);
                                            }
                                        });

                                    //  console.log(APPID);
                                    //  console.log('查询结果：', res.data[0]); // res.data 包含了查询结果
                                    },
                                    fail: err => {
                                      console.error('查询失败：', err);
                                    }
                                  });
                               
                              }
                          });
                      }
                  });
              } else {
                  // 用户没有授权
                  // 改变 isHide 的值，显示授权页面
                  that.setData({
                      isHide: true
                  });
              }
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
          
          // 清除微信登录信息
          wx.removeStorageSync('wxUser');
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

