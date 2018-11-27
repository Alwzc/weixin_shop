var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        app.pageOnLoad(this, a), this.loadData(a);
    },
    loadData: function(a) {
        var o = this;
        wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.miaosha.express_detail,
            data: {
                order_id: a.id
            },
            success: function(a) {
                wx.hideLoading(), 0 == a.code && o.setData({
                    data: a.data
                }), 1 == a.code && wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack();
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