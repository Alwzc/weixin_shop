var api = require("../../api.js"), app = getApp(), WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        app.request({
            url: api.default.article_detail,
            data: {
                id: t.id
            },
            success: function(t) {
                0 == t.code && (wx.setNavigationBarTitle({
                    title: t.data.title
                }), WxParse.wxParse("content", "html", t.data.content, a)), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirm: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});