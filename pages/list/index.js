var util = require('../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    hidden: true, //无数据提示
    navbar: ['识别成功', '识别失败'],
    currentTab: 0
  },
  //切换顶部导航tab
  navbarTap: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    that.setData({
      currentTab: idx
    });
    getApp().globalData.index = 1;
    var url = (idx == 0 ? 'https://www.bangbangzhang.cn/wechat/getAllInvoice' : 'https://www.bangbangzhang.cn/wechat/getUnrecognizedInvoice');
    wx.request({
      url: url,
      data: {
        date: that.data.date,
        unionId: wx.getStorageSync('unionId'),
        index: 1
      },
      method: 'get',
      success: function (data) {
        if (data.data.error_code == 10000) {
          getApp().globalData.index++;
          if(idx == 0) {
            that.setData({
              hidden: true,
              invoiceList: data.data.data,
              failList: []
            });
          } else {
            that.setData({
              hidden: true,
              invoiceList: [],
              failList: data.data.data
            });
          }
        } else {
          that.setData({
            hidden: false,
            invoiceList: [],
            failList: []
          });
        }
      }
    });
  },
  onLoad: function () {
    var that = this;
    var date = util.formatDate(new Date());
    that.setData({
      date: date,
      invoiceList: [],
      failList: []
    });
    getApp().globalData.index = 1;
    wx.request({
      url: 'https://www.bangbangzhang.cn/wechat/getAllInvoice',
      data: {
        date: date,
        unionId: wx.getStorageSync('unionId'),
        index: 1
      },
      method: 'get',
      success: function (data) {
        if (data.data.error_code == 10000) {
          getApp().globalData.index++;
          that.setData({
            hidden: true,
            invoiceList: data.data.data
          });
        } else {
          that.setData({
            hidden: false,
            invoiceList: []
          });
        }
      }
    })
  },
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value
    });
    getApp().globalData.index = 1;
    var url = (that.data.currentTab == 0 ? 'https://www.bangbangzhang.cn/wechat/getAllInvoice' :'https://www.bangbangzhang.cn/wechat/getUnrecognizedInvoice');
    wx.request({
      url: url,
      data: {
        date: e.detail.value,
        unionId: wx.getStorageSync('unionId'),
        index: 1
      },
      method: 'get',
      success: function (data) {
        if (data.data.error_code == 10000) {
          getApp().globalData.index++;
          if (that.data.currentTab == 0) {
            that.setData({
              hidden: true,
              invoiceList: data.data.data,
              failList: []
            });
          } else {
            that.setData({
              hidden: true,
              invoiceList: [],
              failList: data.data.data
            });
          }
        } else {
          that.setData({
            hidden: false,
            invoiceList: [],
            failList: []
          });
        }
      }
    })
  },
  skip: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('item has chosen, id=' + id);
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  },
  manual: function(e) {
    var id = e.currentTarget.dataset.id;
    var is_fa = e.currentTarget.dataset.fa;
    var date = e.currentTarget.dataset.date;
    var fpdm = e.currentTarget.dataset.fpdm;
    var fphm = e.currentTarget.dataset.fphm;
    var kprq = e.currentTarget.dataset.kprq;
    var jym = e.currentTarget.dataset.jym;
    var kpje = e.currentTarget.dataset.kpje;
    wx.navigateTo({
      url: '/pages/manual/index?id=' + id + '&is_fa=' + is_fa + '&date=' + date + '&fpdm=' + fpdm + '&fphm=' + fphm + '&kprq=' + kprq + '&jym=' + jym + '&kpje=' + kpje,
    })
  },
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    }),
    wx.request({
      url: that.data.currentTab == 0 ? 'https://www.bangbangzhang.cn/wechat/getAllInvoice' : 'https://www.bangbangzhang.cn/wechat/getUnrecognizedInvoice',
      data: {
        date: that.data.date,
        unionId: wx.getStorageSync('unionId'),
        index: getApp().globalData.index
      },
      method: "GET",
      success: function (data) {
        getApp().globalData.index++;
        if (that.data.currentTab == 0) {
          that.setData({
            hidden: true,
            invoiceList: data.data.data,
            failList: []
          })
        } else {
          that.setData({
            hidden: true,
            invoiceList: [],
            failList: data.data.data
          })
        }
        wx.hideLoading();
      }
    })
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: (that.data.currentTab == 0 ? 'https://www.bangbangzhang.cn/wechat/getAllInvoice' : 'https://www.bangbangzhang.cn/wechat/getUnrecognizedInvoice'),
      data: {
        date: that.data.date,
        unionId: wx.getStorageSync('unionId'),
        index: 1
      },
      method: "GET",
      success: function (data) {
        if (data.data.data == null || data.data.data.length == 0) {
          that.setData({
            hidden: false
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          if (that.data.currentTab == 0){
            that.setData({
              invoiceList: []
            })
          } else {
            that.setData({
              failList: []
            })
          }
          return;
        } else {
          getApp().globalData.index++;
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          that.setData({
            hidden: true,
            invoiceList: (that.data.currentTab == 0 ? data.data.data : []),
            failList: (that.data.currentTab == 0 ? [] : data.data.data)
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
});