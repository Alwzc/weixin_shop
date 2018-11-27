var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        if (app.pageOnLoad(this, t), t.inId) var a = {
            order_id: t.inId,
            type: "IN"
        }; else a = {
            order_id: t.id,
            type: "mall"
        };
        this.loadData(a);
    },
    loadData: function(t) {
        var a = this;
        wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.order.express_detail,
            data: t,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && a.setData({
                    data: t.data
                }), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
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
    onReachBottom: function() {},
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: a,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    }
});