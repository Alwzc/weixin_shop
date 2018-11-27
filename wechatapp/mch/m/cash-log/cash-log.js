var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        list: [],
        current_page: 0,
        loading: !1,
        no_more: !1
    },
    getList: function() {
        var t = this;
        if (!t.data.loading && !t.data.no_more) {
            t.setData({
                loading: !0
            });
            var n = t.data.current_page + 1;
            app.request({
                url: api.mch.user.cash_log,
                data: {
                    page: n,
                    year: "",
                    month: ""
                },
                success: function(a) {
                    0 == a.code && (a.data.list && a.data.list.length ? (t.data.list = t.data.list.concat(a.data.list), 
                    t.setData({
                        list: t.data.list,
                        current_page: n
                    })) : t.setData({
                        no_more: !0
                    })), 1 == a.code && wx.showModal({
                        title: "提示",
                        content: a.msg,
                        showCancel: !1
                    });
                },
                complete: function(a) {
                    t.setData({
                        loading: !1
                    });
                }
            });
        }
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        this.getList();
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
    onReachBottom: function() {
        this.getList();
    }
});