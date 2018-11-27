var api = require("../../api.js"), app = getApp();

Page({
    data: {
        load_more_count: 0,
        last_load_more_time: 0,
        is_loading: !1,
        loading_class: "",
        cat_id: !1,
        keyword: !1,
        page: 1,
        limit: 20,
        goods_list: [],
        show_history: !0,
        show_result: !1,
        history_list: [],
        is_search: !0,
        is_show: !1,
        cats: [],
        default_cat: []
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), this.cats();
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        this.setData({
            history_list: this.getHistoryList(!0)
        });
    },
    onReachBottom: function() {
        this.getMoreGoodsList();
    },
    cats: function() {
        var a = this;
        app.request({
            url: api.default.cats,
            success: function(t) {
                0 == t.code && a.setData({
                    cats: t.data.list,
                    default_cat: t.data.default_cat
                });
            }
        });
    },
    change_cat: function(t) {
        var a = this.data.cats, s = t.currentTarget.dataset.id;
        for (var i in a) if (s === a[i].id) var e = {
            id: a[i].id,
            name: a[i].name,
            key: a[i].key,
            url: a[i].url
        };
        this.setData({
            default_cat: e
        });
    },
    pullDown: function() {
        var t = this, a = t.data.cats, s = t.data.default_cat;
        for (var i in a) a[i].id === s.id ? a[i].is_active = !0 : a[i].is_active = !1;
        t.setData({
            is_show: !t.data.is_show,
            cats: a
        });
    },
    inputFocus: function() {
        this.setData({
            show_history: !0,
            show_result: !1
        });
    },
    inputBlur: function() {
        var t = this;
        0 < t.data.goods_list.length && setTimeout(function() {
            t.setData({
                show_history: !1,
                show_result: !0
            });
        }, 300);
    },
    inputConfirm: function(t) {
        var a = this, s = t.detail.value;
        0 != s.length && (a.setData({
            page: 1,
            keyword: s
        }), a.setHistory(s), a.getGoodsList());
    },
    searchCancel: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    historyClick: function(t) {
        var a = t.currentTarget.dataset.value;
        0 != a.length && (this.setData({
            page: 1,
            keyword: a
        }), this.getGoodsList());
    },
    getGoodsList: function() {
        var a = this;
        a.setData({
            show_history: !1,
            show_result: !0,
            is_search: !0
        }), a.setData({
            page: 1,
            scroll_top: 0
        }), a.setData({
            goods_list: []
        });
        var t = {};
        a.data.cat_id && (t.cat_id = a.data.cat_id, a.setActiveCat(t.cat_id)), a.data.keyword && (t.keyword = a.data.keyword), 
        t.defaultCat = JSON.stringify(a.data.default_cat), a.showLoadingBar(), a.is_loading = !0, 
        app.request({
            url: api.default.search,
            data: t,
            success: function(t) {
                0 == t.code && (a.setData({
                    goods_list: t.data.list
                }), 0 == t.data.list.length ? a.setData({
                    is_search: !1
                }) : a.setData({
                    is_search: !0
                })), t.code;
            },
            complete: function() {
                a.hideLoadingBar(), a.is_loading = !1;
            }
        });
    },
    getHistoryList: function(t) {
        t = t || !1;
        var a = wx.getStorageSync("search_history_list");
        if (!a) return [];
        if (!t) return a;
        for (var s = [], i = a.length - 1; 0 <= i; i--) s.push(a[i]);
        return s;
    },
    setHistory: function(t) {
        var a = this.getHistoryList();
        for (var s in a.push({
            keyword: t
        }), a) {
            if (a.length <= 20) break;
            a.splice(s, 1);
        }
        wx.setStorageSync("search_history_list", a);
    },
    getMoreGoodsList: function() {
        var i = this, e = {};
        i.data.cat_id && (e.cat_id = i.data.cat_id, i.setActiveCat(e.cat_id)), i.data.keyword && (e.keyword = i.data.keyword), 
        e.page = i.data.page || 1, i.showLoadingMoreBar(), i.setData({
            is_loading: !0
        }), i.setData({
            load_more_count: i.data.load_more_count + 1
        }), e.page = i.data.page + 1, e.defaultCat = i.data.default_cat, i.setData({
            page: e.page
        }), e.defaultCat = JSON.stringify(i.data.default_cat), app.request({
            url: api.default.search,
            data: e,
            success: function(t) {
                if (0 == t.code) {
                    var a = i.data.goods_list;
                    if (0 < t.data.list.length) {
                        for (var s in t.data.list) a.push(t.data.list[s]);
                        i.setData({
                            goods_list: a
                        });
                    } else i.setData({
                        page: e.page - 1
                    });
                }
                t.code;
            },
            complete: function() {
                i.setData({
                    is_loading: !1
                }), i.hideLoadingMoreBar();
            }
        });
    },
    showLoadingBar: function() {
        this.setData({
            loading_class: "active"
        });
    },
    hideLoadingBar: function() {
        this.setData({
            loading_class: ""
        });
    },
    showLoadingMoreBar: function() {
        this.setData({
            loading_more_active: "active"
        });
    },
    hideLoadingMoreBar: function() {
        this.setData({
            loading_more_active: ""
        });
    },
    deleteSearchHistory: function() {
        this.setData({
            history_list: null
        }), wx.removeStorageSync("search_history_list");
    }
});