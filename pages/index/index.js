var util = require('../../utils/util.js');
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    is_fa: false,
    hidden: true,
    buthidden: false,
    balance: 0
  },
  onShow: function() {
    var that = this;
    var date = util.formatDate(new Date());
    that.setData({
      date: date
    });
    var unionId = wx.getStorageSync('unionId');
    wx.request({
      url: 'https://www.bangbangzhang.cn/wechat/getUserAccount',
      data: {
        unionId: unionId
      },
      method: 'get',
      success: function(data) {
        console.log('get balance data: {}', data.data);
        if (data.data.error_code == 10000) {
          that.setData({
            balance: data.data.balance
          });
          wx.setStorageSync('balance', data.data.balance);
          wx.setStorageSync('user_name', data.data.user_name);
          wx.setStorageSync('user_company_name', data.data.user_company_name);
        }
      }
    })
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      'is_fa': detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  camera: function() {
    var user_name = wx.getStorageSync('user_name');
    var user_company_name = wx.getStorageSync('user_company_name');
    if (user_name == undefined || user_name == '' ||
      user_company_name == undefined || user_company_name == '') {
      wx.showModal({
        title: '提示',
        content: '抱歉，您的信息不完整，请至 账户-完善信息 中完善后操作！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/info/index',
            })
          }
        }
      })
    } else if (this.data.balance <= 0) {
      wx.showModal({
        title: '提示',
        content: '抱歉，您的余额不足，\n请充值后操作！',
        showCancel: false
      })
    } else {
      var that = this;
      var date = this.data.date;
      var is_fa = this.data.is_fa;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图
        sourceType: ['album', 'camera'],
        success: function(res) {
          var filePath = res.tempFilePaths[0];
          that.upload(that, filePath);
        }
      })
    }
  },
  upload: function(page, filePath) {
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: "https://www.bangbangzhang.cn/wechat/uploadImage",
      filePath: filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        unionId: wx.getStorageSync("unionId"),
        userName: wx.getStorageSync("user_name"),
        userCompanyName: wx.getStorageSync("user_company_name"),
        billDate: page.data.date,
        is_fa: (page.data.is_fa?1:0)
      },
      success: (res) => {
        var data = JSON.parse(res.data);
        if (data.error_code != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        } else {
          wx.request({
            url: 'https://www.bangbangzhang.cn/wechat/deduct',
            data: {
              unionId: wx.getStorageSync('unionId')
            },
            success: (data) => {
              if (data.data.error_code == '000000') {
                wx.hideToast(); 
                this.setData({
                  is_fa: false,
                  hidden: true,
                  buthidden: false,
                  balance: (this.data.balance * 10 - 1) / 10
                });
              }
            }
          });
        }
      },
      fail: function(e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function() {
        wx.hideToast(); 
      }
    })
  },
  handleClick() {
    var user_name = wx.getStorageSync('user_name');
    var user_company_name = wx.getStorageSync('user_company_name');
    if (user_name == undefined || user_name == '' ||
      user_company_name == undefined || user_company_name == '') {
      wx.showModal({
        title: '提示',
        content: '抱歉，您的信息不完整，请至 账户-完善信息 中完善后操作！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/info/index',
            })
          }
        }
      })
    } else if (this.data.balance <= 0) {
      wx.showModal({
        title: '提示',
        content: '抱歉，您的余额不足，\n请充值后操作！',
        showCancel: false
      })
    } else {
      wx.scanCode({
        success: (res) => {
          var data = res.result;
          console.log('scan result: {}', data);
          var dataArr = data.split(',');
          console.log('dataArr length : ' + dataArr.length);
          if (dataArr.length >= 8) {
            var fpdm = dataArr[2];
            var fphm = dataArr[3];
            var kprq = dataArr[5];
            if ((util.getNow() - parseInt(kprq)) >= 10000) {
              wx.showModal({
                title: '提示',
                content: '仅支持开票日期距当前时间\n一年以内的发票',
              })
            } else {
              var jym;
              var kpje;
              if (util.alxd(fpdm) != '01' && util.alxd(fpdm) != '04') {
                wx.showModal({
                  title: '提示',
                  content: '请扫描正确的发票二维码',
                })
              } else {
                if (util.alxd(fpdm) == '01') {
                  kpje = dataArr[4];
                  jym = '';
                } else if (util.alxd(fpdm) == '04') {
                  kpje = '0.0';
                  jym = dataArr[6].substring(dataArr[6].length - 6);
                }
                var url = 'https://www.bangbangzhang.cn/wechat/submitInvoice';
                this.setData({
                  hidden: false,
                  buthidden: true
                });
                var invoice_json_data = {
                  'fpdm': fpdm,
                  'fphm': fphm,
                  'kprq': kprq,
                  'kpje': kpje,
                  'jym': jym
                };
                wx.request({
                  url: url,
                  data: {
                    is_fa: (this.data.is_fa) ? '1' : '0',
                    bill_date: this.data.date,
                    user_id: wx.getStorageSync('unionId'),
                    user_name: wx.getStorageSync('user_name'),
                    user_company_name: wx.getStorageSync('user_company_name'),
                    invoice_json_data: invoice_json_data
                  },
                  method: 'get',
                  success: (data) => {
                    console.log('scan raw response data : ' + data.data.error_code);
                    if (data.data.error_code == '000000') {
                      wx.request({
                        url: 'https://www.bangbangzhang.cn/wechat/deduct',
                        data: {
                          unionId: wx.getStorageSync('unionId')
                        },
                        success: (data) => {
                          if (data.data.error_code == '000000') {
                            this.setData({
                              is_fa: false,
                              hidden: true,
                              buthidden: false,
                              balance: (this.data.balance * 10 - 1) / 10
                            });
                          }
                        }
                      });
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '提交信息失败，\n请稍后重试！',
                      });
                      this.setData({
                        is_fa: false,
                        hidden: true,
                        buthidden: false
                      });
                    }
                  }
                })
              }
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '请扫描发票二维码',
            })
          }
        }
      })
    }
  },
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '帮帮账智能发票识别',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
});