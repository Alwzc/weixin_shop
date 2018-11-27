var api = require("../../api.js"), app = getApp();

Page({
    data: {
        cat_id: "",
        keyword: "",
        list: [],
        page: 1,
        no_more: !1,
        loading: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), t.cat_id && (this.data.cat_id = t.cat_id), this.loadShopList();
    },
    loadShopList: function(t) {
        var a = this;
        a.data.no_more ? "function" == typeof t && t() : a.data.loading || (a.setData({
            loading: !0
        }), app.request({
            url: api.mch.shop_list,
            data: {
                keyword: a.data.keyword,
                cat_id: a.data.cat_id,
                page: a.data.page
            },
            success: function(t) {
                if (0 == t.code) {
                    if (!t.data.list || !t.data.list.length) return void a.setData({
                        no_more: !0,
                        cat_list: t.data.cat_list
                    });
                    a.data.list || (a.data.list = []), a.data.list = a.data.list.concat(t.data.list), 
                    a.setData({
                        list: a.data.list,
                        page: a.data.page + 1,
                        cat_list: t.data.cat_list
                    });
                }
            },
            complete: function() {
                a.setData({
                    loading: !1
                }), "function" == typeof t && t();
            }
        }));
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
        this.loadShopList();
    },
    searchSubmit: function(t) {
        var a = t.detail.value;
        this.setData({
            list: [],
            keyword: a,
            page: 1,
            no_more: !1
        }), this.loadShopList(function() {});
    },
    showCatList: function() {
        this.setData({
            show_cat_list: !0
        });
    },
    hideCatList: function() {
        this.setData({
            show_cat_list: !1
        });
    }
});