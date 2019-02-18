Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    var itemId = options.id;
    console.log('detail page item id = ' + itemId);
    wx.request({
      url: 'https://www.bangbangzhang.cn/wechat/getInvoiceItem',
      data: {
        invoiceId: itemId
      },
      method: 'get',
      success: function (data) {
        that.setData({
          invoiceDetail: data.data.invoice_info,
          invoiceItemDetail: data.data.invoice_item_info
        });
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
});