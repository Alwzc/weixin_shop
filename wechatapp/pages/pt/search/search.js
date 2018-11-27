var api = require("../../../api.js"), app = getApp(), pageNum = 1;

Page({
    data: {
        history_show: !1,
        search_val: "",
        list: [],
        history_info: [],
        show_loading_bar: !1,
        emptyGoods: !1,
        newSearch: !0
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var a = this;
        wx.getStorage({
            key: "history_info",
            success: function(t) {
                0 < t.data.length && a.setData({
                    history_info: t.data,
                    history_show: !0
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        t.data.emptyGoods || (t.data.page_count <= pageNum && t.setData({
            emptyGoods: !0
        }), pageNum++, t.getSearchGoods());
    },
    onShareAppMessage: function() {},
    toSearch: function(t) {
        var a = t.detail.value, o = this;
        if (a) {
            var e = o.data.history_info;
            for (var s in e.unshift(a), e) {
                if (e.length <= 20) break;
                e.splice(s, 1);
            }
            wx.setStorageSync("history_info", e), o.setData({
                history_info: e,
                history_show: !1,
                keyword: a,
                list: []
            }), o.getSearchGoods();
        }
    },
    cancelSearchValue: function(t) {
        wx.navigateBack({
            delta: 1
        });
    },
    newSearch: function(t) {
        var a = !1;
        0 < this.data.history_info.length && (a = !0), pageNum = 1, this.setData({
            history_show: a,
            list: [],
            newSearch: [],
            emptyGoods: !1
        });
    },
    clearHistoryInfo: function(t) {
        var a = [];
        wx.setStorageSync("history_info", a), this.setData({
            history_info: a,
            history_show: !1
        });
    },
    getSearchGoods: function() {
        var o = this, t = o.data.keyword;
        t && (o.setData({
            show_loading_bar: !0
        }), app.request({
            url: api.group.search,
            data: {
                keyword: t,
                page: pageNum
            },
            success: function(t) {
                if (0 == t.code) {
                    if (o.data.newSearch) var a = t.data.list; else a = o.data.list.concat(t.data.list);
                    o.setData({
                        list: a,
                        page_count: t.data.page_count,
                        emptyGoods: !0,
                        show_loading_bar: !1
                    }), t.data.page_count > pageNum && o.setData({
                        newSearch: !1,
                        emptyGoods: !1
                    });
                }
            },
            complete: function() {}
        }));
    },
    historyItem: function(t) {
        var a = t.currentTarget.dataset.keyword;
        this.setData({
            keyword: a,
            history_show: !1
        }), this.getSearchGoods();
    }
});