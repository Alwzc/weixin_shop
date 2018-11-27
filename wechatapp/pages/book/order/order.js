var api = require("../../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        is_loading = is_no_more = !1, p = 2, this.loadOrderList(t.status || -1);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        is_loading || is_no_more || (is_loading = !0, app.request({
            url: api.book.order_list,
            data: {
                status: a.data.status,
                page: p
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = a.data.order_list.concat(t.data.list);
                    a.setData({
                        order_list: e,
                        pay_type_list: t.data.pay_type_list
                    }), 0 == t.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    onShareAppMessage: function() {},
    loadOrderList: function(t) {
        null == t && (t = -1);
        var e = this;
        e.setData({
            status: t
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.order_list,
            data: {
                status: e.data.status
            },
            success: function(t) {
                0 == t.code && e.setData({
                    order_list: t.data.list,
                    pay_type_list: t.data.pay_type_list
                }), e.setData({
                    show_no_data_tip: 0 == e.data.order_list.length
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    orderCancel: function(t) {
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var e = t.currentTarget.dataset.id;
        app.request({
            url: api.book.order_cancel,
            data: {
                id: e
            },
            success: function(t) {
                0 == t.code && wx.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    GoToPay: function(t) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.book.order_pay,
            data: {
                id: t.currentTarget.dataset.id
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                0 == t.code && wx.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? wx.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && wx.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToDetails: function(t) {
        wx.navigateTo({
            url: "/pages/book/order/details?oid=" + t.currentTarget.dataset.id
        });
    },
    orderQrcode: function(t) {
        var e = this, a = t.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.order_list[a].offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.order_list[a].offline_qrcode
        }), wx.hideLoading()) : app.request({
            url: api.book.get_qrcode,
            data: {
                order_no: e.data.order_list[a].order_no
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
    },
    applyRefund: function(t) {
        var e = t.target.dataset.id;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.apply_refund,
            data: {
                order_id: e
            },
            success: function(t) {
                0 == t.code ? wx.showModal({
                    title: "提示",
                    content: "申请退款成功",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/book/order/order?status=3"
                        });
                    }
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
    comment: function(t) {
        wx.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + t.target.dataset.id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    }
});