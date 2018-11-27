var api = require("../../api.js"), app = getApp();

Page({
    data: {
        args: !1,
        page: 1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onShow: function() {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.scratch.prize,
            data: {
                page: 1
            },
            success: function(a) {
                0 != a.code || t.setData({
                    list: t.setName(a.data)
                });
            },
            complete: function(a) {
                wx.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        var e = this;
        if (!e.data.args) {
            var r = e.data.page + 1;
            app.request({
                url: api.scratch.prize,
                data: {
                    page: r
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = e.setName(a.data);
                        e.setData({
                            list: e.data.list.concat(t),
                            page: r
                        });
                    } else e.data.args = !0;
                }
            });
        }
    },
    setName: function(r) {
        return r.forEach(function(a, t, e) {
            switch (a.type) {
              case 1:
                r[t].name = a.price + "元红包";
                break;

              case 2:
                r[t].name = a.coupon;
                break;

              case 3:
                r[t].name = a.num + "积分";
                break;

              case 4:
                r[t].name = a.gift;
                break;

              case 5:
                r[t].name = "谢谢参与";
            }
        }), r;
    },
    submit: function(a) {
        var t = a.currentTarget.dataset.gift, e = JSON.parse(a.currentTarget.dataset.attr), r = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?scratch_id=" + r + "&goods_info=" + JSON.stringify({
                goods_id: t,
                attr: e,
                num: 1
            })
        });
    },
    onShareAppMessage: function() {
        return {
            path: "/pond/pond/pond?parent_id=" + wx.getStorageSync("user_info").id,
            title: "九宫格抽奖"
        };
    }
});