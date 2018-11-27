var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp();

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(e) {
        getApp().pageOnLoad(this, e), this.getOrderDetails(e);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderDetails: function(e) {
        var o = "";
        if ("undefined" == typeof my) o = e.scene; else if (null !== app.query) {
            var t = app.query;
            app.query = null, o = t.order_id;
        }
        var n = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.clerk_order_details,
            method: "get",
            data: {
                id: o
            },
            success: function(e) {
                0 == e.code ? n.setData({
                    goods: e.data
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "/pages/user/user"
                        });
                    }
                });
            },
            complete: function(e) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    goToGoodsDetails: function(e) {
        wx.redirectTo({
            url: "/pages/book/details/details?id=" + this.data.goods.goods_id
        });
    },
    nowWriteOff: function(e) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), app.request({
                    url: api.book.clerk,
                    data: {
                        order_id: o.data.goods.id
                    },
                    success: function(e) {
                        0 == e.code ? wx.redirectTo({
                            url: "/pages/user/user"
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : e.cancel;
            }
        });
    }
});