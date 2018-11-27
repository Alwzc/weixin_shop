var api = require("../../api.js"), app = getApp();

Page({
    onLoad: function(a) {
        var t = this;
        app.pageOnLoad(this, a), wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.setting,
            success: function(a) {
                0 == a.code ? t.setData(a.data) : t.showLoading({
                    title: a.msg
                });
            },
            complete: function(a) {
                wx.hideLoading();
            }
        });
    }
});