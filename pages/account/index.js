
Page({
  data: {
    iconSize: 55,
    iconColor: '#999999',
    balance: 0
  },
  onShow: function (options) {
    var that = this;
    var sessionId = wx.getStorageSync('sessionId');
    var unionId = wx.getStorageSync('unionId');
    wx.request({
      url: 'https://www.bangbangzhang.cn/wechat/getUserAccount',
      data: {
        sessionId: sessionId,
        unionId: unionId
      },
      method: 'get',
      success: function (data) {
        console.log('get balance data: {}', data.data);
        if (data.data.error_code == 10000) {
          that.setData({
            balance: data.data.balance
          });
        }
      }
    })
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