var app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    hidden: true,
    scrollTop: 0
  },
  onLoad: function (options) {
    var that = this
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecProInfo',
      data: {},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page:1
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecProInfo',
      data: { },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page: 1
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onReachBottom: function () {
    var that = this
    that.setData({
      hidden: false
    });
    var page = that.data.page
    page++
    var url = app.globalData.requestUrl + '/index/getRecProInfo'
    var postData = {
      page: page
    }
    if (that.data.hasMore == true) {
      that.setData({
        hasMore: false
      })
      wx.request({
        url: url,
        data: postData,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var list = that.data.recommend_info;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              recommend_info: list,
              page: page,
              hidden: true,
              hasMore: res.data.has_more
            });
          } else {
            that.setData({
              recommend_info: list,
              hidden: false,
              hasMore: false
            });
          }
        }
      });
    } else {
      that.setData({
        hidden: true
      });
    }
  },
  //获取详情
  getProDetail: function (event) {
    var pro_id = event.currentTarget.dataset.proid
    // 获取该商品bis_id
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBisIDByProId',
      data: { pro_id: pro_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        var bis_id = res.data.bis_id
        app.globalData.bis_id = bis_id
        wx.navigateTo({
          url: '/pages/index/pro_detail/pro_detail?pro_id=' + pro_id,
        })
      }
    })
  },
})