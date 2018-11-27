var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        status: 1,
        goods_list: [],
        no_goods: !1,
        no_more_goods: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        a.setData({
            status: parseInt(t.status || 1),
            loading_more: !0
        }), a.loadGoodsList(function() {
            a.setData({
                loading_more: !1
            });
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
    onReachBottom: function(t) {
        var a = this;
        a.data.loading_more || (a.setData({
            loading_more: !0
        }), a.loadGoodsList(function() {
            a.setData({
                loading_more: !1
            });
        }));
    },
    searchSubmit: function(t) {
        var a = this, o = t.detail.value;
        a.setData({
            keyword: o,
            loading_more: !0,
            goods_list: [],
            current_page: 0
        }), a.loadGoodsList(function() {
            a.setData({
                loading_more: !1
            });
        });
    },
    loadGoodsList: function(t) {
        var a = this;
        if (a.data.no_goods || a.data.no_more_goods) "function" == typeof t && t(); else {
            var o = (a.data.current_page || 0) + 1;
            app.request({
                url: api.mch.goods.list,
                data: {
                    page: o,
                    status: a.data.status,
                    keyword: a.data.keyword || ""
                },
                success: function(t) {
                    0 == t.code && (1 != o || t.data.list && t.data.list.length || a.setData({
                        no_goods: !0
                    }), t.data.list && t.data.list.length ? (a.data.goods_list = a.data.goods_list || [], 
                    a.data.goods_list = a.data.goods_list.concat(t.data.list), a.setData({
                        goods_list: a.data.goods_list,
                        current_page: o
                    })) : a.setData({
                        no_more_goods: !0
                    }));
                },
                complete: function() {
                    "function" == typeof t && t();
                }
            });
        }
    },
    showMoreAlert: function(a) {
        var o = this;
        setTimeout(function() {
            var t = a.currentTarget.dataset.index;
            o.data.goods_list[t].show_alert = !0, o.setData({
                goods_list: o.data.goods_list
            });
        }, 50);
    },
    hideMoreAlert: function(t) {
        var a = this, o = !1;
        for (var s in a.data.goods_list) a.data.goods_list[s].show_alert && (o = !(a.data.goods_list[s].show_alert = !1));
        o && setTimeout(function() {
            a.setData({
                goods_list: a.data.goods_list
            });
        }, 100);
    },
    setGoodsStatus: function(t) {
        var a = this, o = t.currentTarget.dataset.targetStatus, s = t.currentTarget.dataset.index;
        wx.showLoading({
            title: "正在处理",
            mask: !0
        }), app.request({
            url: api.mch.goods.set_status,
            data: {
                id: a.data.goods_list[s].id,
                status: o
            },
            success: function(t) {
                0 == t.code && (a.data.goods_list[s].status = o, a.setData({
                    goods_list: a.data.goods_list
                })), a.showToast({
                    title: t.msg,
                    duration: 1500
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goodsDelete: function(t) {
        var a = this, o = t.currentTarget.dataset.index;
        wx.showModal({
            title: "警告",
            content: "确认删除该商品？",
            success: function(t) {
                t.confirm && (wx.showLoading({
                    title: "正在处理",
                    mask: !0
                }), app.request({
                    url: api.mch.goods.delete,
                    data: {
                        id: a.data.goods_list[o].id
                    },
                    success: function(t) {
                        a.showToast({
                            title: t.msg
                        }), 0 == t.code && (a.data.goods_list.splice(o, 1), a.setData({
                            goods_list: a.data.goods_list
                        }));
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    }
});