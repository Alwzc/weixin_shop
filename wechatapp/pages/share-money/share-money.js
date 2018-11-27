var api = require("../../api.js"), app = getApp();

Page({
    data: {
        block: !1,
        active: "",
        total_price: 0,
        price: 0,
        cash_price: 0,
        un_pay: 0
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onReady: function() {},
    onShow: function() {
        var t = this, a = wx.getStorageSync("share_setting"), e = wx.getStorageSync("custom");
        t.setData({
            share_setting: a,
            custom: e
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.share.get_price,
            success: function(a) {
                0 == a.code && t.setData({
                    total_price: a.data.price.total_price,
                    price: a.data.price.price,
                    cash_price: a.data.price.cash_price,
                    un_pay: a.data.price.un_pay
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    tapName: function(a) {
        var t = this, e = "";
        t.data.block || (e = "active"), t.setData({
            block: !t.data.block,
            active: e
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});