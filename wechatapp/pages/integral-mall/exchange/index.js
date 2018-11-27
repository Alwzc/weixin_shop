var api = require("../../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1;

Page({
    data: {
        p: 1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a), is_loading = is_no_more = !1;
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        this.loadData();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    loadData: function() {
        var t = this, i = t.data.p;
        if (!is_loading) {
            is_loading = !0, wx.showLoading({
                title: "加载中"
            });
            var e = Math.round(new Date().getTime() / 1e3).toString();
            app.request({
                url: api.integral.exchange,
                data: {
                    page: i
                },
                success: function(a) {
                    if (0 == a.code) {
                        var o = a.data.list[0].userCoupon;
                        if (o) for (var n in o) parseInt(o[n].end_time) < parseInt(e) ? o[n].status = 2 : o[n].status = "", 
                        1 == o[n].is_use && (o[n].status = 1);
                        t.setData({
                            goods: a.data.list[0].goodsDetail,
                            coupon: o,
                            page: i + 1,
                            is_no_more: is_no_more
                        });
                    }
                },
                complete: function(a) {
                    is_loading = !1, wx.hideLoading();
                }
            });
        }
    }
});