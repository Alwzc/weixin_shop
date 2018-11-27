var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        hide: 1
    },
    onLoad: function(t) {
        getApp().pageOnLoad(this, t);
        this.loadOrderList(t.status || 0);
    },
    loadOrderList: function(e) {
        var a = this;
        null == e && (e = -1), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.integral.list,
            data: {
                status: e
            },
            success: function(t) {
                0 == t.code && a.setData({
                    order_list: t.data.list,
                    status: e
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    orderSubmitPay: function(t) {
        var e = t.currentTarget.dataset;
        wx.showLoading({
            title: "提交中",
            mask: !0
        }), app.request({
            url: api.integral.order_submit,
            data: {
                id: e.id
            },
            success: function(t) {
                0 == t.code ? (wx.hideLoading(), wx.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && wx.redirectTo({
                            url: "/pages/integral-mall/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认"
                        });
                    }
                })) : (wx.hideLoading(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "确认"
                }));
            }
        });
    },
    orderRevoke: function(e) {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中"
                }), app.request({
                    url: api.integral.revoke,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && a.loadOrderList(a.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    orderConfirm: function(e) {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中"
                }), app.request({
                    url: api.integral.confirm,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showToast({
                            title: t.msg
                        }), 0 == t.code && a.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function(t) {
        var e = this, a = e.data.order_list, i = t.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.integral.get_qrcode,
            data: {
                order_no: a[i].order_no
            },
            success: function(t) {
                0 == t.code ? e.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    }
});