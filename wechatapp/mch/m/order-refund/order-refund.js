var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var e = this;
        e.setData({
            id: t.id || 0
        }), wx.showLoading({
            title: "加载中",
            mask: !0
        }), app.request({
            url: api.mch.order.refund_detail,
            data: {
                id: e.data.id
            },
            success: function(t) {
                0 == t.code && e.setData(t.data), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            },
            complete: function(t) {
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
    showPicList: function(t) {
        wx.previewImage({
            urls: this.data.pic_list,
            current: this.data.pic_list[t.currentTarget.dataset.pindex]
        });
    },
    refundPass: function(t) {
        var e = this, a = e.data.id, o = e.data.type;
        wx.showModal({
            title: "提示",
            content: "确认同意" + (1 == o ? "退款？资金将原路返回！" : "换货？"),
            success: function(t) {
                t.confirm && (wx.showLoading({
                    title: "正在处理",
                    mask: !0
                }), app.request({
                    url: api.mch.order.refund,
                    method: "post",
                    data: {
                        id: a,
                        action: "pass"
                    },
                    success: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                wx.redirectTo({
                                    url: "/" + e.route + "?" + getApp().utils.objectToUrlParams(e.options)
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    },
    refundDeny: function(t) {
        var e = this, a = e.data.id;
        wx.showModal({
            title: "提示",
            content: "确认拒绝？",
            success: function(t) {
                t.confirm && (wx.showLoading({
                    title: "正在处理",
                    mask: !0
                }), app.request({
                    url: api.mch.order.refund,
                    method: "post",
                    data: {
                        id: a,
                        action: "deny"
                    },
                    success: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                wx.redirectTo({
                                    url: "/" + e.route + "?" + getApp().utils.objectToUrlParams(e.options)
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    }
});