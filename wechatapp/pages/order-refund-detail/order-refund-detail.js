var api = require("../../api.js"), app = getApp();

Page({
    data: {
        order_refund: null,
        express_index: null
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var d = this;
        wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.order.refund_detail,
            data: {
                order_refund_id: e.id
            },
            success: function(e) {
                0 == e.code && d.setData({
                    order_refund: e.data
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    viewImage: function(e) {
        var d = e.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.order_refund.refund_pic_list[d],
            urls: this.data.order_refund.refund_pic_list
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    copyinfo: function(e) {
        wx.setClipboardData({
            data: e.target.dataset.info,
            success: function(e) {
                wx.showToast({
                    title: "复制成功！",
                    icon: "success",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    bindExpressPickerChange: function(e) {
        this.setData({
            express_index: e.detail.value
        });
    },
    sendFormSubmit: function(e) {
        var n = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: api.order.refund_send,
            method: "POST",
            data: {
                order_refund_id: n.data.order_refund.order_refund_id,
                express: null !== n.data.express_index ? n.data.order_refund.express_list[n.data.express_index].name : "",
                express_no: e.detail.value.express_no
            },
            success: function(d) {
                wx.showModal({
                    title: "提示",
                    content: d.msg,
                    showCancel: !1,
                    success: function(e) {
                        0 == d.code && wx.redirectTo({
                            url: "/pages/order-refund-detail/order-refund-detail?id=" + n.data.order_refund.order_refund_id
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});