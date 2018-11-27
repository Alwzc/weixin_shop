var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        order_refund: null
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var a = this;
        wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.miaosha.refund_detail,
            data: {
                order_refund_id: e.id
            },
            success: function(e) {
                0 == e.code && a.setData({
                    order_refund: e.data
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    viewImage: function(e) {
        var a = e.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.order_refund.refund_pic_list[a],
            urls: this.data.order_refund.refund_pic_list
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});