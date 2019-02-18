var util = require('../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    hidden: true
  },
  onLoad: function () {
    var that = this;
    var date = util.formatDate(new Date());
    that.setData({
      date: date
    });
  },
  bindDateChange: function (e) {
    var that = this;
    this.setData({
      date: e.detail.value
    });
  },
  handleClick: function() {
    var date = this.data.date;
    var user_id = wx.getStorageSync('unionId');
    var user_name = wx.getStorageSync('user_name');
    wx.request({
      url: 'https://www.bangbangzhang.cn/downloadVoucherPathForWechat',
      data: {
        bill_date: date,
        is_detail: '0',
        user_id: user_id,
        user_name: user_name
      },
      success: (data) => {
        if(data.data.error_code == '000000') {
          var downLoadUrl = 'https://www.bangbangzhang.cn' + data.data.xls_path;
          console.log('downLoadUrl : ' + downLoadUrl);
          wx.downloadFile({
            url: downLoadUrl,
            success: function (res) {
              var filePath = res.tempFilePath;
              console.log(filePath);
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功')
                }
              });
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前会计期间无记录',
          })
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
});