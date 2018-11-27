var api = require("../../api.js"), app = getApp(), is_loading = !1, is_no_more = !0, intval = null;

Page({
    data: {
        naver: "order",
        status: -1,
        intval: [],
        p: 1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        null == t.status && (t.status = -1), this.setData(t), this.getList();
    },
    getList: function() {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.order_list,
            data: {
                status: a.data.status || -1
            },
            success: function(t) {
                0 == t.code ? (a.setData(t.data), a.setData({
                    p: 1
                }), a.getTimeList()) : a.showLoading({
                    title: t.msg
                });
            },
            complete: function(t) {
                wx.hideLoading(), is_no_more = !1;
            }
        });
    },
    getTimeList: function() {
        clearInterval(intval);
        var s = this, e = s.data.list;
        intval = setInterval(function() {
            for (var t in e) if (0 < e[t].reset_time) {
                var a = e[t].reset_time - 1, i = s.setTimeList(a);
                e[t].reset_time = a, e[t].time_list = i;
            }
            s.setData({
                list: e
            });
        }, 1e3);
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
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    loadData: function() {
        var i = this;
        if (!is_loading) {
            is_loading = !0, wx.showLoading({
                title: "加载中"
            });
            var s = i.data.p + 1;
            app.request({
                url: api.bargain.order_list,
                data: {
                    status: i.data.status,
                    page: s
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = i.data.list.concat(t.data.list);
                        i.setData({
                            list: a,
                            p: s
                        }), 0 == t.data.list.length && (is_no_more = !0), i.getTimeList();
                    } else i.showLoading({
                        title: t.msg
                    });
                },
                complete: function(t) {
                    wx.hideLoading(), is_loading = !0;
                }
            });
        }
    },
    submit: function(t) {
        var a = [], i = [];
        i.push({
            bargain_order_id: t.currentTarget.dataset.index
        }), a.push({
            mch_id: 0,
            goods_list: i
        }), wx.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(a)
        });
    }
});