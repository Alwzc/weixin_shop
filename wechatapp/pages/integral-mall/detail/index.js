var api = require("../../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1;

Page({
    data: {
        gain: !0,
        p: 1,
        status: 1
    },
    onLoad: function(t) {
        getApp().pageOnLoad(this, t), is_loading = is_no_more = !1;
        t.status && this.setData({
            status: t.status
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        this.loadData();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    income: function() {
        wx.redirectTo({
            url: "/pages/integral-mall/detail/index?status=1"
        });
    },
    expenditure: function() {
        wx.redirectTo({
            url: "/pages/integral-mall/detail/index?status=2"
        });
    },
    loadData: function() {
        var i = this;
        if (!is_loading) {
            is_loading = !0, wx.showLoading({
                title: "加载中"
            });
            var n = i.data.p;
            app.request({
                url: api.integral.integral_detail,
                data: {
                    page: n,
                    status: i.data.status
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = i.data.list;
                        a = a ? a.concat(t.data.list) : t.data.list, t.data.list.length <= 0 && (is_no_more = !0), 
                        i.setData({
                            list: a,
                            is_no_more: is_no_more,
                            p: n + 1
                        });
                    }
                },
                complete: function(t) {
                    is_loading = !1, wx.hideLoading();
                }
            });
        }
    }
});