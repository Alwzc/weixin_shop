var api = require("../../api.js"), app = getApp(), share_count = 0;

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var o = this;
        wx.showLoading({
            mask: !0
        }), app.request({
            url: api.default.coupon_list,
            success: function(t) {
                0 == t.code && o.setData({
                    coupon_list: t.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    receive: function(t) {
        var n = this, o = t.target.dataset.index;
        wx.showLoading({
            mask: !0
        }), n.hideGetCoupon || (n.hideGetCoupon = function(t) {
            var o = t.currentTarget.dataset.url || !1;
            n.setData({
                get_coupon_list: null
            }), o && wx.navigateTo({
                url: o
            });
        }), app.request({
            url: api.coupon.receive,
            data: {
                id: o
            },
            success: function(t) {
                0 == t.code && n.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    goodsList: function(t) {
        var o = t.currentTarget.dataset.goods, n = [];
        for (var a in o) n.push(o[a].id);
        wx.navigateTo({
            url: "/pages/list/list?goods_id=" + n,
            success: function(t) {},
            fail: function(t) {}
        });
    }
});