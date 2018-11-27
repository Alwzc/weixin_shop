var api = require("../../api.js"), time = require("../commons/time.js"), app = getApp(), setIntval = null, is_loading = !1, is_no_more = !0;

Page({
    data: {
        show_more: !0,
        p: 1,
        show_modal: !1,
        show: !1,
        show_more_btn: !0,
        animationData: null,
        show_modal_a: !1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        t.setData({
            order_id: a.order_id
        }), t.joinBargain(), time.init(t);
    },
    joinBargain: function() {
        var t = this;
        app.request({
            url: api.bargain.bargain,
            data: {
                order_id: t.data.order_id
            },
            success: function(a) {
                0 == a.code ? (t.getOrderInfo(), t.setData(a.data)) : (t.showToast({
                    title: a.msg
                }), wx.hideLoading());
            }
        });
    },
    getOrderInfo: function() {
        var t = this;
        app.request({
            url: api.bargain.activity,
            data: {
                order_id: t.data.order_id,
                page: 1
            },
            success: function(a) {
                0 == a.code ? (t.setData(a.data), t.setData({
                    time_list: t.setTimeList(a.data.reset_time),
                    show: !0
                }), t.data.bargain_status && t.setData({
                    show_modal: !0
                }), t.setTimeOver(), is_no_more = !1, t.animationCr()) : t.showToast({
                    title: a.msg
                });
            },
            complete: function(a) {
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
        app.pageOnUnload(this), clearInterval(setIntval), setIntval = null;
    },
    onShareAppMessage: function() {
        return {
            path: "/bargain/activity/activity?order_id=" + this.data.order_id + "&user_id=" + this.data.__user_info.id,
            success: function(a) {}
        };
    },
    loadData: function() {
        var i = this;
        if (wx.showLoading({
            title: "加载中"
        }), !is_loading) {
            is_loading = !0, wx.showNavigationBarLoading();
            var o = i.data.p + 1;
            app.request({
                url: api.bargain.activity,
                data: {
                    order_id: i.data.order_id,
                    page: o
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = i.data.bargain_info;
                        t = t.concat(a.data.bargain_info), i.setData(a.data), i.setData({
                            bargain_info: t,
                            p: o
                        }), 0 == a.data.bargain_info.length && (is_no_more = !0, i.setData({
                            show_more_btn: !1,
                            show_more: !0
                        }));
                    } else i.showToast({
                        title: a.msg
                    });
                },
                complete: function(a) {
                    wx.hideLoading(), wx.hideNavigationBarLoading(), is_loading = !1;
                }
            });
        }
    },
    showMore: function(a) {
        this.data.show_more_btn && (is_no_more = !1), is_no_more || this.loadData();
    },
    hideMore: function() {
        this.setData({
            show_more_btn: !0,
            show_more: !1
        });
    },
    orderSubmit: function() {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), wx.redirectTo({
            url: "/bargain/goods/goods?goods_id=" + a.data.goods_id
        });
    },
    close: function() {
        this.setData({
            show_modal: !1
        });
    },
    buyNow: function() {
        var t = [], a = [];
        a.push({
            bargain_order_id: this.data.order_id
        }), t.push({
            mch_id: 0,
            goods_list: a
        }), wx.showModal({
            title: "提示",
            content: "是否确认购买？",
            success: function(a) {
                a.confirm && wx.redirectTo({
                    url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(t)
                });
            }
        });
    },
    goToList: function() {
        wx.redirectTo({
            url: "/bargain/list/list"
        });
    },
    animationCr: function() {
        var a = this;
        a.animationT(), setTimeout(function() {
            a.setData({
                show_modal_a: !0
            }), a.animationBig(), a.animationS();
        }, 800);
    },
    animationBig: function() {
        var a = wx.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%"
        }), t = this, i = 0;
        setInterval(function() {
            i % 2 == 0 ? a.scale(.9).step() : a.scale(1).step(), t.setData({
                animationData: a.export()
            }), 500 == ++i && (i = 0);
        }, 500);
    },
    animationS: function() {
        var a = wx.createAnimation({
            duration: 500
        });
        a.width("512rpx").height("264rpx").step(), a.rotate(-2).step(), a.rotate(4).step(), 
        a.rotate(-2).step(), a.rotate(0).step(), this.setData({
            animationDataHead: a.export()
        });
    },
    animationT: function() {
        var a = wx.createAnimation({
            duration: 200
        });
        a.width("500rpx").height("500rpx").step(), this.setData({
            animationDataT: a.export()
        });
    }
});