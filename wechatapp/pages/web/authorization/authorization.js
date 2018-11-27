var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        user: {},
        is_bind: "",
        app: {}
    },
    onLoad: function(n) {
        app.pageOnLoad(this, n), this.checkBind();
        var e = wx.getStorageSync("user_info");
        this.setData({
            user: e
        });
    },
    checkBind: function() {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.user.check_bind,
            success: function(n) {
                wx.hideLoading(), 0 === n.code && e.setData({
                    is_bind: n.data.is_bind,
                    app: n.data.app
                });
            }
        });
    },
    getUserInfo: function(t) {
        wx.showLoading({
            title: "加载中"
        });
        var i = this;
        wx.login({
            success: function(n) {
                var e = n.code;
                getApp().request({
                    url: api.passport.login,
                    method: "POST",
                    data: {
                        code: e,
                        user_info: t.detail.rawData,
                        encrypted_data: t.detail.encryptedData,
                        iv: t.detail.iv,
                        signature: t.detail.signature
                    },
                    success: function(n) {
                        wx.hideLoading(), 0 === n.code ? (wx.showToast({
                            title: "登录成功,请稍等...",
                            icon: "none"
                        }), i.bind()) : wx.showToast({
                            title: "服务器出错，请再次点击绑定",
                            icon: "none"
                        });
                    }
                });
            }
        });
    },
    bind: function() {
        app.request({
            url: api.user.authorization_bind,
            data: {},
            success: function(n) {
                if (0 === n.code) {
                    var e = encodeURIComponent(n.data.bind_url);
                    wx.redirectTo({
                        url: "/pages/web/web?url=" + e
                    });
                } else wx.showToast({
                    title: n.msg,
                    icon: "none"
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});