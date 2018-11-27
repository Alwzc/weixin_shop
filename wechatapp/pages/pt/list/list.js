var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        cid: 0
    },
    onLoad: function(n) {
        app.pageOnLoad(this, n);
    },
    onReady: function() {},
    onShow: function(n) {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    lower: function(n) {}
});