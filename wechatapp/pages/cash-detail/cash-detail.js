var api = require("../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        status: -1,
        cash_list: [],
        show_no_data_tip: !1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        is_loading = is_no_more = !1, p = 2, this.LoadCashList(a.status || -1);
    },
    onReady: function() {},
    onShow: function() {},
    LoadCashList: function(a) {
        var t = this;
        t.setData({
            status: parseInt(a || -1)
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.share.cash_detail,
            data: {
                status: t.data.status
            },
            success: function(a) {
                0 == a.code && t.setData({
                    cash_list: a.data.list
                }), t.setData({
                    show_no_data_tip: 0 == t.data.cash_list.length
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var s = this;
        is_loading || is_no_more || (is_loading = !0, app.request({
            url: api.share.cash_detail,
            data: {
                status: s.data.status,
                page: p
            },
            success: function(a) {
                if (0 == a.code) {
                    var t = s.data.cash_list.concat(a.data.list);
                    s.setData({
                        cash_list: t
                    }), 0 == a.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    }
});