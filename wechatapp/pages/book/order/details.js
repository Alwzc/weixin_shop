var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp();

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(o) {
        app.pageOnLoad(this, o), this.getOrderDetails(o);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderDetails: function(o) {
        var e = o.oid, t = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.order_details,
            method: "get",
            data: {
                id: e
            },
            success: function(o) {
                0 == o.code ? t.setData({
                    attr: JSON.parse(o.data.attr),
                    goods: o.data
                }) : wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        });
                    }
                });
            },
            complete: function(o) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    goToGoodsDetails: function(o) {
        wx.redirectTo({
            url: "/pages/book/details/details?id=" + this.data.goods.goods_id
        });
    },
    orderCancel: function(o) {
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var e = o.currentTarget.dataset.id;
        app.request({
            url: api.book.order_cancel,
            data: {
                id: e
            },
            success: function(o) {
                0 == o.code && wx.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    GoToPay: function(o) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.book.order_pay,
            data: {
                id: o.currentTarget.dataset.id
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(o) {
                0 == o.code && wx.requestPayment({
                    _res: o,
                    timeStamp: o.data.timeStamp,
                    nonceStr: o.data.nonceStr,
                    package: o.data.package,
                    signType: o.data.signType,
                    paySign: o.data.paySign,
                    success: function(o) {},
                    fail: function(o) {},
                    complete: function(o) {
                        "requestPayment:fail" != o.errMsg && "requestPayment:fail cancel" != o.errMsg ? wx.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(o) {
                                o.confirm && wx.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == o.code && wx.showToast({
                    title: o.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToShopList: function(o) {
        wx.redirectTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id
        });
    },
    orderQrcode: function(o) {
        var e = this;
        o.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.goods.offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.goods.offline_qrcode
        }), wx.hideLoading()) : app.request({
            url: api.book.get_qrcode,
            data: {
                order_no: e.data.goods.order_no
            },
            success: function(o) {
                0 == o.code ? e.setData({
                    hide: 0,
                    qrcode: o.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: o.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(o) {
        this.setData({
            hide: 1
        });
    },
    comment: function(o) {
        wx.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + o.target.dataset.id,
            success: function(o) {},
            fail: function(o) {},
            complete: function(o) {}
        });
    }
});