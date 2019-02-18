var data = {
  Marr: ['10元/100次', '20元/200次', '50元/500次', '100元/1000次', '200元/2000次', '500元/5000次'],
  money: "",
  close: false
}
Page({
  data: data,
  actionFn(e) {   // 选择金额
    var Doid = e.target.id;
    var Marr = this.data.Marr;
    this.setData({
      value: Doid,
      money: Marr[Doid].split("元")[0]
    })
  },
  inputFn(e) {    // 输入金额
    var value = e.detail.value;
    console.log('input other money: {}', value);
    this.setData({
      money: value
    })
  },
  otherFn() {    // 其他金额
    this.setData({ close: true });
  },
  closeFn() {     //关闭其他金额的弹层 
    this.setData({ close: false });
  },
  sumbtn() {
    var that = this;
    var money = this.data.money;
    var openId = wx.getStorageSync('openId');
    var unionId = wx.getStorageSync('unionId');
    console.log('wxpay param: money---{}, openId---{}, unonId---{}', money, openId, unionId);
    wx.request({
      url: 'https://www.bangbangzhang.cn/wechat/wxPay',
      data: {
        money: money*100,
        openId: openId,
        unionId: unionId
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        that.doWxPay(res.data);
      }
    });
  },
  doWxPay(param) {
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      success: function (event) {
        console.log(event);
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '/pages/index/index'
        })
      },
      fail: function (error) {
        // fail   
        console.log("支付失败")
        console.log(error)
      },
      complete: function () {
        // complete   
        console.log("pay complete")
      }
    });
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