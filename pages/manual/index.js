var util = require('../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    hidden: true,
    buthidden: false,
    kpje_hidden: true,
    jym_hidden: false,
  },
  onLoad: function (options) {
    var id = options.id;
    var is_fa = options.is_fa;
    var date = options.date;
    var fpdm = options.fpdm;
    var fphm = options.fphm;
    var kprq = options.kprq;
    var jym = options.jym;
    var kpje = options.kpje;
    this.setData({
      id: id,
      date: date,
      is_fa: is_fa,
      fpdm: fpdm,
      fphm: fphm,
      kprq: kprq,
      jym: jym,
      kpje: kpje
    });
    var a = this.alxd(fpdm);
    if (a == "01") {
      this.setData({
        kpje_hidden: false,
        jym_hidden: true
      });
    } else if (a == "04") {
      this.setData({
        kpje_hidden: true,
        jym_hidden: false
      });
    }
  },
  fpdm: function (e) {
    this.setData({
      fpdm: e.detail.detail.value
    });
  },
  fphm: function (e) {
    this.setData({
      fphm: e.detail.detail.value
    });
  },
  kprq: function (e) {
    this.setData({
      kprq: e.detail.detail.value
    });
  },
  jym: function (e) {
    this.setData({
      jym: e.detail.detail.value
    });
  },
  kpje: function (e) {
    this.setData({
      kpje: e.detail.detail.value
    });
  },
  handleClick: function () {
    var that = this;
    var fphm = this.data.fphm;
    var fpdm = this.data.fpdm;
    var kprq = this.data.kprq;
    if ((util.getNow() - parseInt(kprq)) >= 10000) {
      wx.showModal({
        title: '提示',
        content: '仅支持一年以内的发票，谢谢合作',
      })
    } else {
      var jym = this.data.jym;
      var kpje = this.data.kpje;
      var balance = wx.getStorageSync('balance');
      if (fphm == undefined || fphm == ''
        || fpdm == undefined || fpdm == ''
        || kprq == undefined || kprq == ''
        || ((jym == undefined || jym == '') && (kpje == undefined || kpje == '0.0'))) {
        wx.showModal({
          title: '提示',
          content: '请完整填写发票信息!',
          showCancel: false
        })
      } else if (balance <= 0) {
        wx.showModal({
          title: '提示',
          content: '抱歉，您的余额不足，\n请充值后操作！',
          showCancel: false
        })
      } else {
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
          url: 'https://www.bangbangzhang.cn/wechat/submitNotRecInvoice',
          data: {
            invoice_id: that.data.id,
            is_fa: that.data.is_fa,
            bill_date: that.data.date,
            user_id: wx.getStorageSync('unionId'),
            user_name: wx.getStorageSync('user_name'),
            user_company_name: wx.getStorageSync('user_company_name'),
            invoice_json_data: invoice_json_data
          },
          method: 'get',
          success: (data) => {
            console.log('data response error_code:' + data.data.error_code);
            if (data.data.error_code == '000000') {
              wx.request({
                url: 'https://www.bangbangzhang.cn/wechat/deduct',
                data: {
                  unionId: wx.getStorageSync('unionId')
                },
                method: 'get',
                success: (data) => {
                  if (data.data.error_code == '000000') {
                    this.setData({
                      hidden: true,
                      buthidden: false
                    });
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }
                }
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '提交信息失败，\n请稍后重试！',
              })
            }
          }
        })
      }
    }
  },
  alxd: function (zCGm42) {
    var LgiBIQrTk43;
    var KIFMnvh44 = "99";
    if (zCGm42["length"] == 12) {
      LgiBIQrTk43 = zCGm42["substring"](7, 8);
      for (var VznVTyb45 = 0; VznVTyb45 < code["length"]; VznVTyb45++) {
        if (zCGm42 == code[VznVTyb45]) {
          KIFMnvh44 = "10";
          break
        }
      }
      if (KIFMnvh44 == "99") {
        if (zCGm42["charAt"](0) == "0"
          && zCGm42["substring"](10, 12) == "11") {
          KIFMnvh44 = "10"
        }
        if (zCGm42["charAt"](0) == "0"
          && (zCGm42["substring"](10, 12) == "04" || zCGm42["substring"]
            (10, 12) == "05")) {
          KIFMnvh44 = "04"
        }
        if (zCGm42["charAt"](0) == "0"
          && (zCGm42["substring"](10, 12) == "06" || zCGm42["substring"]
            (10, 12) == "07")) {
          KIFMnvh44 = "11"
        }
        if (zCGm42["charAt"](0) == "0"
          && zCGm42["substring"](10, 12) == "12") {
          KIFMnvh44 = "14"
        }
      }
      if (KIFMnvh44 == "99") {
        if (zCGm42["substring"](10, 12) == "17"
          && zCGm42["charAt"](0) == "0") {
          KIFMnvh44 = "15"
        }
        if (KIFMnvh44 == "99" && LgiBIQrTk43 == 2
          && zCGm42["charAt"](0) != "0") {
          KIFMnvh44 = "03"
        }
      }
    } else if (zCGm42["length"] == 10) {
      LgiBIQrTk43 = zCGm42["substring"](7, 8);
      if (LgiBIQrTk43 == 1 || LgiBIQrTk43 == 5) {
        KIFMnvh44 = "01"
      } else if (LgiBIQrTk43 == 6 || LgiBIQrTk43 == 3) {
        KIFMnvh44 = "04"
      } else if (LgiBIQrTk43 == 7 || LgiBIQrTk43 == 2) {
        KIFMnvh44 = "02"
      }
    }
    return KIFMnvh44
  },
  blur: function (e) {
    var value = e.detail.detail.value;
    console.log('blur input value:' + value);
    var a = this.alxd(value);
    if (a == "01") {
      this.setData({
        kpje_hidden: false,
        jym_hidden: true
      });
    } else if (a == "04") {
      this.setData({
        kpje_hidden: true,
        jym_hidden: false
      });
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
});