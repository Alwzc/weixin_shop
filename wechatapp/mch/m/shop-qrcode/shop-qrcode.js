var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        qrcode_pic: ""
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var o = this;
        app.request({
            url: api.mch.user.shop_qrcode,
            success: function(a) {
                0 == a.code ? o.setData({
                    header_bg: a.data.header_bg,
                    shop_logo: a.data.shop_logo,
                    shop_name: a.data.shop_name,
                    qrcode_pic: a.data.qrcode_pic
                }) : wx.showModal({
                    title: "提示",
                    content: a.msg,
                    success: function() {}
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
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});