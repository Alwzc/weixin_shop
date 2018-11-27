var api = require("../../api.js"), app = getApp(), is_loading = !1, is_no_more = !0;

Page({
    data: {
        p: 1,
        naver: "list"
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        void 0 !== a.order_id && wx.navigateTo({
            url: "/bargain/activity/activity?order_id=" + a.order_id + "&user_id=" + a.user_id
        }), void 0 !== a.goods_id && wx.navigateTo({
            url: "/bargain/goods/goods?goods_id=" + a.goods_id + "&user_id=" + a.user_id
        }), this.loadDataFirst(a);
    },
    loadDataFirst: function(o) {
        var i = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.index,
            type: "get",
            success: function(a) {
                0 == a.code && (i.setData(a.data), i.setData({
                    p: 2
                }), 0 < a.data.goods_list.length && (is_no_more = !1));
            },
            complete: function(a) {
                void 0 === o.order_id && wx.hideLoading(), wx.stopPullDownRefresh();
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
    onPullDownRefresh: function() {
        this.loadDataFirst({});
    },
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    loadData: function() {
        if (!is_loading) {
            is_loading = !0, wx.showLoading({
                title: "加载中"
            });
            var i = this, t = i.data.p;
            app.request({
                url: api.bargain.index,
                data: {
                    page: t
                },
                success: function(a) {
                    if (0 == a.code) {
                        var o = i.data.goods_list;
                        0 == a.data.goods_list.length && (is_no_more = !0), o = o.concat(a.data.goods_list), 
                        i.setData({
                            goods_list: o,
                            p: t + 1
                        });
                    } else i.showToast({
                        title: a.msg
                    });
                },
                complete: function(a) {
                    wx.hideLoading(), is_loading = !1;
                }
            });
        }
    },
    goToGoods: function(a) {
        var o = a.currentTarget.dataset.index;
        wx.navigateTo({
            url: "/bargain/goods/goods?goods_id=" + o
        });
    },
    onShareAppMessage: function() {
        return {
            path: "/bargain/list/list?user_id=" + this.data.__user_info.id,
            success: function(a) {}
        };
    }
});