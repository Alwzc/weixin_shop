var api = require("../../api.js"), app = getApp(), is_more = !1;

Page({
    data: {},
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        t.setData(a), wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.recharge.detail,
            method: "GET",
            data: {
                order_type: a.order_type,
                id: a.id
            },
            success: function(a) {
                wx.hideLoading(), 0 == a.code ? t.setData({
                    list: a.data
                }) : wx.showModal({
                    title: "提示",
                    content: a.msg
                });
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    }
});