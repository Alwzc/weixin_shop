var api = require("../../api.js"), app = getApp();

Page({
    data: {
        qrcode: ""
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var e = this;
        wx.getStorageSync("share_setting");
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.share.get_qrcode,
            success: function(t) {
                0 == t.code ? e.setData({
                    qrcode: t.data
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = wx.getStorageSync("user_info");
        this.setData({
            user_info: t
        });
    },
    click: function() {
        wx.previewImage({
            current: this.data.qrcode,
            urls: [ this.data.qrcode ]
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});