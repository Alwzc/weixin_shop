var api = require("../../api.js"), app = getApp();

Page({
    data: {
        list: []
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), this.setData({
            status: t.status || 0
        }), this.loadData(t);
    },
    loadData: function(t) {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.coupon.index,
            data: {
                status: a.data.status
            },
            success: function(t) {
                0 == t.code && a.setData({
                    list: t.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goodsList: function(t) {
        var a = t.currentTarget.dataset.goods_id, s = t.currentTarget.dataset.id, i = this.data.list;
        for (var e in i) if (parseInt(i[e].user_coupon_id) === parseInt(s)) return void (2 == i[e].appoint_type && 0 < i[e].goods.length && wx.navigateTo({
            url: "/pages/list/list?goods_id=" + a
        }));
    },
    onShow: function() {},
    xia: function(t) {
        var a = t.target.dataset.index;
        this.setData({
            check: a
        });
    },
    shou: function() {
        this.setData({
            check: -1
        });
    }
});