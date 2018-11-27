var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        show_edit_modal: !1,
        order_sub_price: "",
        order_sub_price_mode: !0,
        order_add_price: "",
        order_add_price_mode: !1,
        show_send_modal: !1,
        send_type: "express",
        order: null
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var d = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.mch.order.detail,
            data: {
                id: e.id
            },
            success: function(e) {
                0 == e.code ? d.setData({
                    order: e.data.order
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.navigateBack();
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    copyUserAddress: function() {
        var d = this;
        wx.setClipboardData({
            data: "收货人:" + d.data.order.username + ",联系电话:" + d.data.order.mobile + ",收货地址:" + d.data.order.address,
            success: function(e) {
                wx.getClipboardData({
                    success: function(e) {
                        d.showToast({
                            title: "已复制收货信息"
                        });
                    }
                });
            }
        });
    },
    showEditModal: function(e) {
        this.setData({
            show_edit_modal: !0,
            order_sub_price: "",
            order_add_price: "",
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        });
    },
    hideEditModal: function(e) {
        this.setData({
            show_edit_modal: !1
        });
    },
    tabSwitch: function(e) {
        var d = e.currentTarget.dataset.tab;
        "order_sub_price_mode" == d && this.setData({
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        }), "order_add_price_mode" == d && this.setData({
            order_sub_price_mode: !1,
            order_add_price_mode: !0
        });
    },
    subPriceInput: function(e) {
        this.setData({
            order_sub_price: e.detail.value
        });
    },
    subPriceBlur: function(e) {
        var d = parseFloat(e.detail.value);
        d = isNaN(d) ? "" : d <= 0 ? "" : d.toFixed(2), this.setData({
            order_sub_price: d
        });
    },
    addPriceInput: function(e) {
        this.setData({
            order_add_price: e.detail.value
        });
    },
    addPriceBlur: function(e) {
        var d = parseFloat(e.detail.value);
        d = isNaN(d) ? "" : d <= 0 ? "" : d.toFixed(2), this.setData({
            order_add_price: d
        });
    },
    editPriceSubmit: function() {
        var t = this, e = t.data.order_sub_price_mode ? "sub" : "add";
        wx.showLoading({
            mask: !0,
            title: "正在处理"
        }), app.request({
            url: api.mch.order.edit_price,
            method: "post",
            data: {
                order_id: t.data.order.id,
                type: e,
                price: "sub" == e ? t.data.order_sub_price : t.data.order_add_price
            },
            success: function(d) {
                wx.showModal({
                    title: "提示",
                    content: d.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && 0 == d.code && wx.redirectTo({
                            url: "/mch/m/order-detail/order-detail?id=" + t.data.order.id
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    showSendModal: function() {
        this.setData({
            show_send_modal: !0,
            send_type: "express"
        });
    },
    hideSendModal: function() {
        this.setData({
            show_send_modal: !1
        });
    },
    switchSendType: function(e) {
        var d = e.currentTarget.dataset.type;
        this.setData({
            send_type: d
        });
    },
    sendSubmit: function() {
        var t = this;
        if ("express" == t.data.send_type) return t.hideSendModal(), void wx.navigateTo({
            url: "/mch/m/order-send/order-send?id=" + t.data.order.id
        });
        wx.showModal({
            title: "提示",
            content: "无需物流方式订单将直接标记成已发货，确认操作？",
            success: function(e) {
                e.confirm && (wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: api.mch.order.send,
                    method: "post",
                    data: {
                        send_type: "none",
                        order_id: t.data.order.id
                    },
                    success: function(d) {
                        wx.showModal({
                            title: "提示",
                            content: d.msg,
                            success: function(e) {
                                e.confirm && 0 == d.code && wx.redirectTo({
                                    url: "/mch/m/order-detail/order-detail?id=" + t.data.order.id
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading({
                            title: "正在提交",
                            mask: !0
                        });
                    }
                }));
            }
        });
    }
});