
Page({
  data: {
    remind: '加载中',
    angle: 0,
    globalBGColor: '#1b82d1',
    bgRed: 27,
    bgGreen: 130,
    bgBlue: 209,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },
  onLoad: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          var unionId = wx.getStorageSync('unionId')
          if (unionId == undefined || unionId == null || unionId == '') {
            that.login();
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
          // wx.getUserInfo({
          //   success: function (res) {
          //     console.log('authorize onLoad userInfo : {}', res.userInfo);
          //     console.log('authorize onLoad unionId:{}, openId:{}', wx.getStorageSync('unionId'), wx.getStorageSync('openId'));
          //     wx.switchTab({
          //       url: '/pages/index/index'
          //     })
          //   }
          // })
        }
      }
    })
  },
  bindGetUserInfo: function (event) {
    var that = this;
    console.log(event.detail.userInfo)
    //使用
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          that.login();
        } else {
          console.log('获取用户信息失败')
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
  },
  login: function() {
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          wx.getUserInfo({
            success: function (res) {
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code });
              wx.request({
                url: 'https://www.bangbangzhang.cn/wechat/getUserInfo',
                data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                method: 'get',
                success: function (data) {
                  if (data.data.error_code == 1) {
                    console.log('授权成功');
                    wx.setStorageSync("openId", data.data.openId);
                    wx.setStorageSync("unionId", data.data.unionId);
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  } else {
                    console.log('解密失败')
                  }
                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })
        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  }
})