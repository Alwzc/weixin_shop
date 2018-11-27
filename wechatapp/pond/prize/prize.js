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
            url: api.pond.prize,
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
            var s = e.data.page + 1;
            app.request({
                url: api.pond.prize,
                data: {
                    page: s
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = e.setName(a.data);
                        e.setData({
                            list: e.data.list.concat(t),
                            page: s
                        });
                    } else e.data.args = !0;
                }
            });
        }
    },
    setName: function(s) {
        return s.forEach(function(a, t, e) {
            switch (a.type) {
              case 1:
                s[t].name = a.price + "元红包";
                break;

              case 2:
                s[t].name = a.coupon;
                break;

              case 3:
                s[t].name = a.num + "积分";
                break;

              case 4:
                s[t].name = a.gift;
                break;

              case 5:
                s[t].name = "谢谢参与";
            }
        }), s;
    },
    send: function(a) {
        var t = a.currentTarget.dataset.id, e = (a.currentTarget.dataset.type, this);
        app.request({
            url: api.pond.send,
            data: {
                id: t
            },
            success: function(s) {
                var a = "";
                if (0 == s.code) {
                    var n = e.data.list;
                    n.forEach(function(a, t, e) {
                        a.id == s.data.id && (n[t].status = 1);
                    }), e.setData({
                        list: n
                    }), a = "恭喜你";
                } else a = "很抱歉";
                wx.showModal({
                    title: a,
                    content: s.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm;
                    }
                });
            }
        });
    },
    submit: function(a) {
        var t = a.currentTarget.dataset.gift, e = JSON.parse(a.currentTarget.dataset.attr), s = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?pond_id=" + s + "&goods_info=" + JSON.stringify({
                goods_id: t,
                attr: e,
                num: 1
            })
        });
    }
});