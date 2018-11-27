var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        current_year: "",
        current_month: "",
        month_scroll_x: 1e5,
        year_list: [],
        daily_avg: "-",
        month_count: "-",
        up_rate: "-"
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        wx.showNavigationBarLoading(), app.request({
            url: api.mch.user.tongji_year_list,
            success: function(a) {
                t.setData({
                    year_list: a.data.year_list,
                    current_year: a.data.current_year,
                    current_month: a.data.current_month
                }), t.setMonthScroll(), t.getMonthData();
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
    onReachBottom: function() {},
    changeMonth: function(a) {
        var t = this, e = a.currentTarget.dataset.yearIndex, n = a.currentTarget.dataset.monthIndex;
        for (var r in t.data.year_list) for (var i in r == e ? (t.data.year_list[r].active = !0, 
        t.data.current_year = t.data.year_list[r].year) : t.data.year_list[r].active = !1, 
        t.data.year_list[r].month_list) r == e && i == n ? (t.data.year_list[r].month_list[i].active = !0, 
        t.data.current_month = t.data.year_list[r].month_list[i].month) : t.data.year_list[r].month_list[i].active = !1;
        t.setData({
            year_list: t.data.year_list,
            current_year: t.data.current_year
        }), t.setMonthScroll(), t.getMonthData();
    },
    setMonthScroll: function() {
        var a = this, t = wx.getSystemInfoSync().screenWidth / 5, e = 0;
        for (var n in a.data.year_list) {
            var r = !1;
            for (var i in a.data.year_list[n].month_list) {
                if (a.data.year_list[n].month_list[i].active) {
                    r = !0;
                    break;
                }
                e++;
            }
            if (r) break;
        }
        a.setData({
            month_scroll_x: (e - 0) * t
        });
    },
    setCurrentYear: function() {
        var a = this;
        for (var t in a.data.year_list) if (a.data.year_list[t].active) {
            a.data.current_year = a.data.year_list[t].year;
            break;
        }
        a.setData({
            current_year: a.data.current_year
        });
    },
    getMonthData: function() {
        var t = this;
        wx.showNavigationBarLoading(), t.setData({
            daily_avg: "-",
            month_count: "-",
            up_rate: "-"
        }), app.request({
            url: api.mch.user.tongji_month_data,
            data: {
                year: t.data.current_year,
                month: t.data.current_month
            },
            success: function(a) {
                0 == a.code ? t.setData({
                    daily_avg: a.data.daily_avg,
                    month_count: a.data.month_count,
                    up_rate: a.data.up_rate
                }) : wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading();
            }
        });
    }
});