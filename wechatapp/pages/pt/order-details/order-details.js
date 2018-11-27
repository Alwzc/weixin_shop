var api = require("../../../api.js"), app = getApp();

Page({
    options: "",
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(t) {
        this.options = t, app.pageOnLoad(this, t);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        this.loadOrderDetails();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this, e = "/pages/pt/group/details?oid=" + t.data.order_info.order_id;
        return {
            title: t.data.order_info.goods_list[0].name,
            path: e,
            imageUrl: t.data.order_info.goods_list[0].goods_pic,
            success: function(t) {}
        };
    },
    loadOrderDetails: function() {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.order.detail,
            data: {
                order_id: e.options.id
            },
            success: function(t) {
                0 == t.code ? (3 != t.data.status && e.countDownRun(t.data.limit_time_ms), e.setData({
                    order_info: t.data,
                    limit_time: t.data.limit_time
                })) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    copyText: function(t) {
        var e = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: e,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    countDownRun: function(n) {
        var a = this;
        setInterval(function() {
            var t = new Date(n[0], n[1] - 1, n[2], n[3], n[4], n[5]) - new Date(), e = parseInt(t / 1e3 / 60 / 60 % 24, 10), o = parseInt(t / 1e3 / 60 % 60, 10), i = parseInt(t / 1e3 % 60, 10);
            e = a.checkTime(e), o = a.checkTime(o), i = a.checkTime(i), a.setData({
                limit_time: {
                    hours: 0 < e ? e : 0,
                    mins: 0 < o ? o : 0,
                    secs: 0 < i ? i : 0
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return t < 10 && (t = "0" + t), t;
    },
    toConfirm: function(t) {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.order.confirm,
            data: {
                order_id: e.data.order_info.order_id
            },
            success: function(t) {
                0 == t.code ? wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/order-details/order-details?id=" + e.data.order_info.order_id
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/order-details/order-details?id=" + e.data.order_info.order_id
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goToGroup: function(t) {
        wx.redirectTo({
            url: "/pages/pt/group/details?oid=" + this.data.order_info.order_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    location: function() {
        var t = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address,
            name: t.name
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
    orderRevoke: function() {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmtext: "是",
            success: function(t) {
                t.confirm && (wx.showLoading({
                    title: "操作中"
                }), app.request({
                    url: api.group.order.revoke,
                    data: {
                        order_id: e.data.order_info.order_id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && e.loadOrderDetails();
                            }
                        });
                    }
                }));
            }
        });
    }
});