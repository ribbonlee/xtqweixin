Page({
  data: {
  },
  onShow: function() {
    this.setData({
      user_name: wx.getStorageSync('user_name'),
      user_company_name: wx.getStorageSync('user_company_name'),
    })
  },
  userNameInput: function(e) {
    this.setData({
      user_name: e.detail.detail.value
    });
  },
  userCompanyNameInput: function (e) {
    this.setData({
      user_company_name: e.detail.detail.value
    });
  },
  handleClick() {
    var user_name = this.data.user_name;
    var user_company_name = this.data.user_company_name;
    var union_id = wx.getStorageSync('unionId');
    console.log('fufill user info: user_name=' + user_name+', user_company_name=' + user_company_name);
    if(user_name == undefined || user_name == ''
          || user_company_name == undefined || user_company_name == '') {
      wx.showModal({
        title: '提示',
        content: '请完整填写所有信息!',
        showCancel: false
      })
    } else {
      wx.request({
        url: 'https://www.bangbangzhang.cn/wechat/updateUserInfo',
        data: {
          user_name: user_name,
          user_company_name: user_company_name,
          union_id: union_id
        },
        method: 'get',
        success: function (data) {
          console.log('return data=' + data.data);
          if(data.data.error_code == 10000) {
            wx.setStorageSync('user_name', user_name);
            wx.setStorageSync('user_company_name', user_company_name);
            console.log('switch tab to home page.....');
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
    }
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '帮帮账智能发票识别',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})