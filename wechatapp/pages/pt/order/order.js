var api = require("../../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        hide: 1,
        qrcode: "",
        scrollLeft: 0,
        scrollTop: 0
    },
    onLoad: function(t) {
        this.systemInfo = wx.getSystemInfoSync();
        var e = wx.getStorageSync("store");
        this.setData({
            store: e
        }), app.pageOnLoad(this, t);
        is_loading = is_no_more = !1, p = 2, this.loadOrderList(t.status || -1);
        var a = 0;
        a = 2 <= t.status ? 600 : 0, this.setData({
            scrollLeft: a
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onShareAppMessage: function(t) {
        var e = t.target.dataset.index, a = "/pages/pt/group/details?oid=" + t.target.dataset.id;
        return {
            title: this.data.order_list[e].goods_list[0].goods_name,
            path: a,
            imageUrl: this.data.order_list[e].goods_list[0].goods_pic,
            success: function(t) {}
        };
    },
    loadOrderList: function(e) {
        null == e && (e = -1);
        var a = this;
        a.setData({
            status: e
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.order.list,
            data: {
                status: a.data.status
            },
            success: function(t) {
                0 == t.code && a.setData({
                    order_list: t.data.list
                }), a.setData({
                    show_no_data_tip: 0 == t.data.list.length
                }), 4 != e && a.countDown();
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    countDown: function() {
        var r = this;
        setInterval(function() {
            var t = r.data.order_list;
            for (var e in t) {
                var a = new Date(t[e].limit_time_ms[0], t[e].limit_time_ms[1] - 1, t[e].limit_time_ms[2], t[e].limit_time_ms[3], t[e].limit_time_ms[4], t[e].limit_time_ms[5]) - new Date(), i = parseInt(a / 1e3 / 60 / 60 / 24, 10), o = parseInt(a / 1e3 / 60 / 60 % 24, 10), s = parseInt(a / 1e3 / 60 % 60, 10), n = parseInt(a / 1e3 % 60, 10);
                i = r.checkTime(i), o = r.checkTime(o), s = r.checkTime(s), n = r.checkTime(n), 
                t[e].limit_time = {
                    days: i,
                    hours: 0 < o ? o : "00",
                    mins: 0 < s ? s : "00",
                    secs: 0 < n ? n : "00"
                }, r.setData({
                    order_list: t
                });
            }
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = 0 < t ? t : 0) < 10 && (t = "0" + t), t;
    },
    onReachBottom: function() {
        var a = this;
        is_loading || is_no_more || (is_loading = !0, app.request({
            url: api.group.order.list,
            data: {
                status: a.data.status,
                page: p
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = a.data.order_list.concat(t.data.list);
                    a.setData({
                        order_list: e
                    }), 0 == t.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    goHome: function(t) {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    orderPay_1: function(t) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.group.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
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
                            url: "/pages/pt/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/pt/order/order?status=0"
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
    goToGroup: function(t) {
        wx.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    getOfflineQrcode: function(t) {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.order.get_qrcode,
            data: {
                order_no: t.currentTarget.dataset.id
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
    goToCancel: function(e) {
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
                    url: api.group.order.revoke,
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
    switchNav: function(t) {
        var e = t.currentTarget.dataset.status;
        wx.redirectTo({
            url: "/pages/pt/order/order?status=" + e
        });
    },
    goToRefundDetail: function(t) {
        var e = t.currentTarget.dataset.refund_id;
        wx.navigateTo({
            url: "/pages/pt/order-refund-detail/order-refund-detail?id=" + e
        });
    }
});