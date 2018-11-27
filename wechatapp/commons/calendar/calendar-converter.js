var calendarSignData, date, calendarSignDay, app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var n = new Date(), e = n.getFullYear(), t = n.getMonth() + 1;
        date = n.getDate();
        var r, c = n.getDay(), g = 7 - (date - c) % 7;
        1 == t || 3 == t || 5 == t || 7 == t || 8 == t || 10 == t || 12 == t ? r = 31 : 4 == t || 6 == t || 9 == t || 11 == t ? r = 30 : 2 == t && (r = (e - 2e3) % 4 == 0 ? 29 : 28), 
        null != wx.getStorageSync("calendarSignData") && "" != wx.getStorageSync("calendarSignData") || wx.setStorageSync("calendarSignData", new Array(r)), 
        null != wx.getStorageSync("calendarSignDay") && "" != wx.getStorageSync("calendarSignDay") || wx.setStorageSync("calendarSignDay", 0), 
        calendarSignData = wx.getStorageSync("calendarSignData"), calendarSignDay = wx.getStorageSync("calendarSignDay"), 
        this.setData({
            year: e,
            month: t,
            nbsp: g,
            monthDaySize: r,
            date: date,
            calendarSignData: calendarSignData,
            calendarSignDay: calendarSignDay
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    register_rule: function() {
        this.setData({
            register_rule: !0
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        calendarSignData[date] = date, calendarSignDay += 1, wx.setStorageSync("calendarSignData", calendarSignData), 
        wx.setStorageSync("calendarSignDay", calendarSignDay), wx.showToast({
            title: "签到成功",
            icon: "success",
            duration: 2e3
        }), this.setData({
            calendarSignData: calendarSignData,
            calendarSignDay: calendarSignDay
        });
    }
});