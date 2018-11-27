var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        order_refund: null
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var n = this;
        wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.group.order.refund_detail,
            data: {
                order_refund_id: e.id
            },
            success: function(e) {
                0 == e.code && n.setData({
                    order_refund: e.data
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    viewImage: function(e) {
        var n = e.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.order_refund.refund_pic_list[n],
            urls: this.data.order_refund.refund_pic_list
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});