var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(n) {
        app.pageOnLoad(this, n);
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
    },
    loginSubmit: function() {
        var n = this.options.scene || !1;
        if ("undefined" != typeof my && null !== app.query) {
            var e = app.query;
            app.query = null, n = e.token;
        }
        if (!n) return wx.showModal({
            title: "提示",
            content: "无效的Token，请刷新页面后重新扫码登录",
            showCancel: !1,
            success: function(n) {
                n.confirm && wx.redirectTo({
                    url: "/pages/index/index"
                });
            }
        }), !1;
        wx.showLoading({
            title: "正在处理",
            mask: !0
        }), app.request({
            url: api.user.web_login + "&token=" + n,
            success: function(n) {
                wx.hideLoading(), wx.showModal({
                    title: "提示",
                    content: n.msg,
                    showCancel: !1,
                    success: function(n) {
                        n.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    }
});