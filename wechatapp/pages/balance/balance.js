var api = require("../../api.js"), app = getApp(), is_more = !1;

Page({
    data: {
        show: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
    },
    getData: function() {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.recharge.record,
            data: {
                date: a.data.date_1 || ""
            },
            success: function(t) {
                a.setData({
                    list: t.data.list
                }), wx.hideLoading(), is_more = !1;
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
        var a = this;
        wx.showLoading({
            title: "加载中"
        });
        var e = wx.getStorageSync("user_info");
        app.request({
            url: api.recharge.index,
            success: function(t) {
                e.money = t.data.money, wx.setStorageSync("user_info", e), a.setData({
                    user_info: e,
                    list: t.data.list,
                    setting: t.data.setting,
                    date_1: t.data.date,
                    date: t.data.date.replace("-", "年") + "月"
                }), wx.hideLoading();
            }
        });
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    dateChange: function(t) {
        if (!is_more) {
            is_more = !0;
            var a = t.detail.value, e = a.replace("-", "年") + "月";
            this.setData({
                date: e,
                date_1: a
            }), this.getData();
        }
    },
    dateUp: function() {
        var t = this;
        if (!is_more) {
            is_more = !0;
            var a = t.data.date_1, e = (t.data.date, new Date(a));
            e.setMonth(e.getMonth() + 1);
            var i = e.getMonth() + 1;
            i = (i = i.toString())[1] ? i : "0" + i, t.setData({
                date: e.getFullYear() + "年" + i + "月",
                date_1: e.getFullYear() + "-" + i
            }), t.getData();
        }
    },
    dateDown: function() {
        var t = this;
        if (!is_more) {
            is_more = !0;
            var a = t.data.date_1, e = (t.data.date, new Date(a));
            e.setMonth(e.getMonth() - 1);
            var i = e.getMonth() + 1;
            i = (i = i.toString())[1] ? i : "0" + i, t.setData({
                date: e.getFullYear() + "年" + i + "月",
                date_1: e.getFullYear() + "-" + i
            }), t.getData();
        }
    },
    click: function() {
        this.setData({
            show: !0
        });
    },
    close: function() {
        this.setData({
            show: !1
        });
    },
    GoToDetail: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.list[a];
        wx.navigateTo({
            url: "/pages/balance/detail?order_type=" + e.order_type + "&id=" + e.id
        });
    }
});