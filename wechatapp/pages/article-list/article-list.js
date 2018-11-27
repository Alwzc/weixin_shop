var api = require("../../api.js"), app = getApp();

Page({
    data: {
        article_list: []
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        wx.showLoading(), app.request({
            url: api.default.article_list,
            data: {
                cat_id: 2
            },
            success: function(a) {
                wx.hideLoading(), t.setData({
                    article_list: a.data.list
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