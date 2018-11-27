var api = require("../../api.js"), app = getApp(), is_loading_more = !1, is_no_more = !1;

Page({
    data: {
        cat_id: "",
        page: 1,
        cat_list: [],
        goods_list: [],
        sort: 0,
        sort_type: -1,
        quick_icon: !0
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), this.loadData(t);
    },
    loadData: function(t) {
        var a = wx.getStorageSync("cat_list"), i = "";
        if (t.cat_id) for (var o in a) {
            var s = !1;
            for (var e in a[o].id == t.cat_id && (a[o].checked = !0, 0 < a[o].list.length && (i = "height-bar")), 
            a[o].list) a[o].list[e].id == t.cat_id && (s = a[o].list[e].checked = !0, i = "height-bar");
            s && (a[o].checked = !0);
        }
        if (t.goods_id) var d = t.goods_id;
        this.setData({
            cat_list: a,
            cat_id: t.cat_id || "",
            height_bar: i,
            goods_id: d || ""
        }), this.reloadGoodsList();
    },
    catClick: function(t) {
        var a = this, i = "", o = t.currentTarget.dataset.index, s = a.data.cat_list;
        for (var e in s) {
            for (var d in s[e].list) s[e].list[d].checked = !1;
            e == o ? (s[e].checked = !0, i = s[e].id) : s[e].checked = !1;
        }
        var r = "";
        0 < s[o].list.length && (r = "height-bar"), a.setData({
            cat_list: s,
            cat_id: i,
            height_bar: r
        }), a.reloadGoodsList();
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    subCatClick: function(t) {
        var a = this, i = "", o = t.currentTarget.dataset.index, s = t.currentTarget.dataset.parentIndex, e = a.data.cat_list;
        for (var d in e) for (var r in e[d].list) d == s && r == o ? (e[d].list[r].checked = !0, 
        i = e[d].list[r].id) : e[d].list[r].checked = !1;
        a.setData({
            cat_list: e,
            cat_id: i
        }), a.reloadGoodsList();
    },
    allClick: function() {
        var t = this, a = t.data.cat_list;
        for (var i in a) {
            for (var o in a[i].list) a[i].list[o].checked = !1;
            a[i].checked = !1;
        }
        t.setData({
            cat_list: a,
            cat_id: "",
            height_bar: ""
        }), t.reloadGoodsList();
    },
    reloadGoodsList: function() {
        var a = this;
        is_no_more = !1, a.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1
        });
        var t = a.data.cat_id || "", i = a.data.page || 1;
        app.request({
            url: api.default.goods_list,
            data: {
                cat_id: t,
                page: i,
                sort: a.data.sort,
                sort_type: a.data.sort_type,
                goods_id: a.data.goods_id
            },
            success: function(t) {
                0 == t.code && (0 == t.data.list.length && (is_no_more = !0), a.setData({
                    page: i + 1
                }), a.setData({
                    goods_list: t.data.list
                })), a.setData({
                    show_no_data_tip: 0 == a.data.goods_list.length
                });
            },
            complete: function() {}
        });
    },
    loadMoreGoodsList: function() {
        var i = this;
        if (!is_loading_more) {
            i.setData({
                show_loading_bar: !0
            }), is_loading_more = !0;
            var t = i.data.cat_id || "", o = i.data.page || 2, a = i.data.goods_id;
            app.request({
                url: api.default.goods_list,
                data: {
                    page: o,
                    cat_id: t,
                    sort: i.data.sort,
                    sort_type: i.data.sort_type,
                    goods_id: a
                },
                success: function(t) {
                    0 == t.data.list.length && (is_no_more = !0);
                    var a = i.data.goods_list.concat(t.data.list);
                    i.setData({
                        goods_list: a,
                        page: o + 1
                    });
                },
                complete: function() {
                    is_loading_more = !1, i.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    onReachBottom: function() {
        is_no_more || this.loadMoreGoodsList();
    },
    onShow: function(t) {
        app.pageOnShow(this);
        var a = this;
        if (wx.getStorageSync("list_page_reload")) {
            var i = wx.getStorageSync("list_page_options");
            wx.removeStorageSync("list_page_options"), wx.removeStorageSync("list_page_reload");
            var o = i.cat_id || "";
            a.setData({
                cat_id: o
            });
            var s = a.data.cat_list;
            for (var e in s) {
                var d = !1;
                for (var r in s[e].list) s[e].list[r].id == o ? d = s[e].list[r].checked = !0 : s[e].list[r].checked = !1;
                d || o == s[e].id ? (s[e].checked = !0, s[e].list && 0 < s[e].list.length && a.setData({
                    height_bar: "height-bar"
                })) : s[e].checked = !1;
            }
            a.setData({
                cat_list: s
            }), a.reloadGoodsList();
        }
    },
    sortClick: function(t) {
        var a = this, i = t.currentTarget.dataset.sort, o = null == t.currentTarget.dataset.default_sort_type ? -1 : t.currentTarget.dataset.default_sort_type, s = a.data.sort_type;
        if (a.data.sort == i) {
            if (-1 == o) return;
            s = -1 == a.data.sort_type ? o : 0 == s ? 1 : 0;
        } else s = o;
        a.setData({
            sort: i,
            sort_type: s
        }), a.reloadGoodsList();
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function(t) {
        return {
            path: "/pages/list/list?user_id=" + wx.getStorageSync("user_info").id + "&cat_id=" + this.data.cat_id,
            success: function(t) {}
        };
    },
    onPullDownRefresh: function() {}
});