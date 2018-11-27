Page({
    data: {},
    onLoad: function(n) {
        getApp().pageOnLoad(this, n);
    },
    onReady: function() {
        getApp().pageOnReady(this);
    },
    onShow: function() {
        getApp().pageOnShow(this);
    },
    onHide: function() {
        getApp().pageOnHide(this);
    },
    onUnload: function() {
        getApp().pageOnUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});