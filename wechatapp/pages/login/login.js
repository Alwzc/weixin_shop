var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        app.pageOnLoad(this), "undefined" == typeof my ? this.setData({
            platform: "wx"
        }) : this.setData({
            platform: "my"
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
    },
    getUserInfo: function(n) {
        var o = this;
        "getUserInfo:ok" == n.detail.errMsg && wx.login({
            success: function(e) {
                var t = e.code;
                o.unionLogin({
                    code: t,
                    user_info: n.detail.rawData,
                    encrypted_data: n.detail.encryptedData,
                    iv: n.detail.iv,
                    signature: n.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        var t = this;
        "undefined" != typeof my && my.getAuthCode({
            scopes: "auth_user",
            success: function(e) {
                t.unionLogin({
                    code: e.authCode
                });
            }
        });
    },
    unionLogin: function(e) {
        wx.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data);
                    var t = wx.getStorageSync("login_pre_page");
                    t && t.route || wx.redirectTo({
                        url: "/pages/index/index"
                    });
                    var n = 0;
                    (n = t.options && t.options.user_id ? t.options.user_id : t.options && t.options.scene ? t.options.scene : wx.getStorageSync("parent_id")) && 0 != n && getApp().bindParent({
                        parent_id: n
                    }), wx.redirectTo({
                        url: "/" + t.route + "?" + getApp().utils.objectToUrlParams(t.options)
                    });
                } else wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});