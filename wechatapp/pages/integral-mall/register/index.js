var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        currentDate: "",
        dayList: "",
        currentDayList: "",
        currentObj: "",
        currentDay: "",
        selectCSS: "bk-color-day",
        weeks: [ {
            day: "日"
        }, {
            day: "一"
        }, {
            day: "二"
        }, {
            day: "三"
        }, {
            day: "四"
        }, {
            day: "五"
        }, {
            day: "六"
        } ]
    },
    doDay: function(t) {
        var e = this, a = e.data.currentObj, r = a.getFullYear(), n = a.getMonth() + 1, i = a.getDate(), s = "";
        s = "left" == t.currentTarget.dataset.key ? (n -= 1) <= 0 ? r - 1 + "/12/" + i : r + "/" + n + "/" + i : (n += 1) <= 12 ? r + "/" + n + "/" + i : r + 1 + "/1/" + i, 
        a = new Date(s), this.setData({
            currentDate: a.getFullYear() + "年" + (a.getMonth() + 1) + "月",
            currentObj: a,
            currentYear: a.getFullYear(),
            currentMonth: a.getMonth() + 1
        });
        var o = a.getFullYear() + "/" + (a.getMonth() + 1) + "/";
        this.setSchedule(a);
        var u = wx.getStorageSync("currentDayList");
        for (var g in u) ;
        var c = [], d = e.data.registerTime;
        for (var g in u) u[g] && c.push(o + u[g]);
        var l = function(t, e) {
            for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length; ) {
                var i = new Date(t[a]).getTime(), s = new Date(e[r]).getTime();
                i < s ? a++ : (s < i || (n.push(e[r]), a++), r++);
            }
            return n;
        }(c, d), h = [];
        for (var g in u) u[g] && (u[g] = {
            date: u[g],
            is_re: 0
        });
        for (var g in l) for (var g in h = l[g].split("/"), u) u[g].date == h[2] && (u[g].is_re = 1);
        e.setData({
            currentDayList: u
        });
    },
    setSchedule: function(t) {
        for (var e = t.getMonth() + 1, a = t.getFullYear(), r = t.getDate(), n = (t.getDate(), 
        new Date(a, e, 0).getDate()), i = t.getUTCDay() + 1 - (r % 7 - 1), s = i <= 0 ? 7 + i : i, o = [], u = 0, g = 0; g < 42; g++) {
            g < s ? o[g] = "" : u < n ? (o[g] = u + 1, u = o[g]) : n <= u && (o[g] = "");
        }
        wx.setStorageSync("currentDayList", o);
    },
    selectDay: function(t) {
        var e = this;
        e.setData({
            currentDay: t.target.dataset.day,
            currentDa: t.target.dataset.day,
            currentDate: e.data.currentYear + "年" + e.data.currentMonth + "月",
            checkDay: e.data.currentYear + "" + e.data.currentMonth + t.target.dataset.day
        });
    },
    onLoad: function(t) {
        getApp().pageOnLoad(this, t);
        var e = this.getCurrentDayString();
        this.setData({
            currentDate: e.getFullYear() + "年" + (e.getMonth() + 1) + "月",
            today: e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate(),
            yearmonth: e.getFullYear() + "/" + (e.getMonth() + 1) + "/",
            today_time: e.getFullYear() + "" + (e.getMonth() + 1) + e.getDate(),
            currentDay: e.getDate(),
            currentObj: e,
            currentYear: e.getFullYear(),
            currentMonth: e.getMonth() + 1
        }), this.setSchedule(e);
    },
    getCurrentDayString: function() {
        var t = this.data.currentObj;
        if ("" != t) return t;
        var e = new Date(), a = e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate();
        return new Date(a);
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        var o = this;
        app.request({
            url: api.integral.explain,
            data: {
                today: o.data.today
            },
            success: function(t) {
                if (0 == t.code) {
                    if (t.data.register) e = t.data.register.continuation; else var e = 0;
                    o.setData({
                        register: t.data.setting,
                        continuation: e,
                        registerTime: t.data.registerTime
                    }), t.data.today && o.setData({
                        status: 1
                    });
                    var a = wx.getStorageSync("currentDayList"), r = [];
                    for (var n in a) r.push(o.data.yearmonth + a[n]);
                    var i = function(t, e) {
                        for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length; ) {
                            var i = new Date(t[a]).getTime(), s = new Date(e[r]).getTime();
                            i < s ? a++ : (s < i || (n.push(e[r]), a++), r++);
                        }
                        return n;
                    }(r, t.data.registerTime), s = [];
                    for (var n in a) a[n] && (a[n] = {
                        date: a[n],
                        is_re: 0
                    });
                    for (var n in i) for (var n in s = i[n].split("/"), a) a[n].date == s[2] && (a[n].is_re = 1);
                    o.setData({
                        currentDayList: a
                    });
                }
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    register_rule: function() {
        this.setData({
            register_rule: !0,
            status_show: 2
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        var r = this, t = r.data.today_time, n = r.data.today, i = r.data.currentDay, e = r.data.checkDay;
        if (e && parseInt(t) != parseInt(e)) wx.showToast({
            title: "日期不对哦",
            image: "/images/icon-warning.png"
        }); else {
            var s = r.data.currentDayList;
            app.request({
                url: api.integral.register,
                data: {
                    today: n
                },
                success: function(t) {
                    if (0 == t.code) {
                        r.data.registerTime.push(n);
                        var e = t.data.continuation;
                        for (var a in s) s[a].date == i && (s[a].is_re = 1);
                        r.setData({
                            register_rule: !0,
                            status_show: 1,
                            continuation: e,
                            status: 1,
                            currentDayList: s,
                            registerTime: r.data.registerTime
                        }), parseInt(e) >= parseInt(r.data.register.register_continuation) && r.setData({
                            jiangli: 1
                        });
                    } else wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
    }
});