var api = require("../../api.js"), app = getApp();

Page({
    data: {
        list: [ {
            id: 1,
            name: "上衣"
        }, {
            id: 2,
            name: "下装",
            list: [ {
                id: 3,
                name: "长裤"
            }, {
                id: 4,
                name: "长裤"
            }, {
                id: 5,
                name: "九分裤"
            }, {
                id: 6,
                name: "短裤"
            } ]
        }, {
            id: 7,
            name: "帽子"
        } ]
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var i = this;
        i.setData({
            mch_id: a.mch_id,
            cat_id: a.cat_id || ""
        });
        var t = "shop_cat_list_mch_id_" + i.data.mch_id, n = wx.getStorageSync(t);
        n && i.setData({
            list: n
        }), wx.showNavigationBarLoading(), app.request({
            url: api.mch.shop_cat,
            data: {
                mch_id: i.data.mch_id
            },
            success: function(a) {
                0 == a.code && (i.setData({
                    list: a.data.list
                }), wx.setStorageSync(t, a.data.list));
            },
            complete: function() {
                wx.hideNavigationBarLoading();
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});