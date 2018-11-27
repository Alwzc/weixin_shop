var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        getApp().pageOnLoad(this, e);
        var t = this;
        if (e.scene) {
            var o = e.scene;
            t.setData({
                type: ""
            });
        } else if (e.type) {
            t.setData({
                type: e.type,
                status: 1
            });
            o = e.id;
        } else {
            o = e.id;
            t.setData({
                status: 1,
                type: ""
            });
        }
        if ("undefined" == typeof my) {
            o = e.scene;
            t.setData({
                type: ""
            });
        } else if (t.setData({
            type: ""
        }), null !== app.query) {
            var a = app.query;
            app.query = null;
            o = a.order_no;
        }
        o && (t.setData({
            order_id: o
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.integral.clerk_order_details,
            data: {
                id: o,
                type: t.data.type
            },
            success: function(e) {
                0 == e.code ? t.setData({
                    order_info: e.data
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "/pages/integral-mall/order/order?status=2"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var e = this, t = "/pages/pt/group/details?oid=" + e.data.order_info.order_id;
        return {
            title: e.data.order_info.goods_list[0].name,
            path: t,
            imageUrl: e.data.order_info.goods_list[0].goods_pic,
            success: function(e) {}
        };
    },
    clerkOrder: function(e) {
        var t = this;
        wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), app.request({
                    url: api.integral.clerk,
                    data: {
                        order_id: t.data.order_id
                    },
                    success: function(e) {
                        0 == e.code ? wx.showModal({
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : e.cancel;
            }
        });
    },
    location: function() {
        var e = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            address: e.address,
            name: e.name
        });
    },
    copyText: function(e) {
        var t = e.currentTarget.dataset.text;
        wx.setClipboardData({
            data: t,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    }
});