var api = require("../../../api.js"), app = getApp(), integral_catId = 0, integral_index = -1;

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this, t), wx.showLoading({
            title: "加载中"
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        var c = this;
        app.request({
            url: api.integral.index,
            data: {
                page: 1
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = [], e = t.data.goods_list, n = [];
                    if (e) for (var o in e) 0 < e[o].goods.length && n.push(e[o]);
                    if (0 < n.length) for (var i in n) {
                        var s = n[i].goods;
                        for (var r in s) 1 == s[r].is_index && a.push(s[r]);
                    }
                    if (t.data.today && c.setData({
                        register_day: 1
                    }), c.setData({
                        banner_list: t.data.banner_list,
                        coupon_list: t.data.coupon_list,
                        goods_list: n,
                        index_goods: a,
                        integral: t.data.user.integral
                    }), -1 != integral_index) {
                        var d = [];
                        d.index = integral_index, d.catId = integral_catId, c.catGoods({
                            currentTarget: {
                                dataset: d
                            }
                        });
                    }
                }
            },
            complete: function(t) {
                wx.hideLoading();
            }
        });
    },
    exchangeCoupon: function(t) {
        var e = this, n = e.data.coupon_list, a = t.currentTarget.dataset.index, o = n[a], i = e.data.integral;
        if (parseInt(o.integral) > parseInt(i)) e.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1
        }); else {
            if (0 < parseFloat(o.price)) var s = "需要" + o.integral + "积分+￥" + parseFloat(o.price); else s = "需要" + o.integral + "积分";
            if (parseInt(o.total_num) <= 0) return void e.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1
            });
            if (parseInt(o.num) >= parseInt(o.user_num)) return o.type = 1, void e.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1,
                coupon_list: n
            });
            wx.showModal({
                title: "确认兑换",
                content: s,
                success: function(t) {
                    t.confirm && (0 < parseFloat(o.price) ? (wx.showLoading({
                        title: "提交中"
                    }), app.request({
                        url: api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 2
                        },
                        success: function(a) {
                            0 == a.code && wx.requestPayment({
                                _res: a,
                                timeStamp: a.data.timeStamp,
                                nonceStr: a.data.nonceStr,
                                package: a.data.package,
                                signType: a.data.signType,
                                paySign: a.data.paySign,
                                complete: function(t) {
                                    "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && (o.num = parseInt(o.num), 
                                    o.num += 1, o.total_num = parseInt(o.total_num), o.total_num -= 1, i = parseInt(i), 
                                    i -= parseInt(o.integral), e.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: a.msg,
                                        coupon_list: n,
                                        integral: i
                                    })) : wx.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            });
                        },
                        complete: function() {
                            wx.hideLoading();
                        }
                    })) : (wx.showLoading({
                        title: "提交中"
                    }), app.request({
                        url: api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code && (o.num = parseInt(o.num), o.num += 1, o.total_num = parseInt(o.total_num), 
                            o.total_num -= 1, i = parseInt(i), i -= parseInt(o.integral), e.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon_list: n,
                                integral: i
                            }));
                        },
                        complete: function() {
                            wx.hideLoading();
                        }
                    })));
                }
            });
        }
    },
    hideModal: function() {
        this.setData({
            showModel: !1
        });
    },
    couponInfo: function(t) {
        var a = t.currentTarget.dataset;
        wx.navigateTo({
            url: "/pages/integral-mall/coupon-info/index?coupon_id=" + a.id
        });
    },
    goodsAll: function() {
        var t = this.data.goods_list, a = [];
        for (var e in t) {
            var n = t[e].goods;
            for (var o in t[e].cat_checked = !1, n) a.push(n[o]);
        }
        this.setData({
            index_goods: a,
            cat_checked: !0,
            goods_list: t
        });
    },
    catGoods: function(t) {
        var a = t.currentTarget.dataset, e = this.data.goods_list, n = e.find(function(t) {
            return t.id == a.catId;
        });
        integral_catId = a.catId, integral_index = a.index;
        var o = a.index;
        for (var i in e) e[i].id == e[o].id ? e[i].cat_checked = !0 : e[i].cat_checked = !1;
        this.setData({
            index_goods: n.goods,
            goods_list: e,
            cat_checked: !1
        });
    },
    goodsInfo: function(t) {
        var a = t.currentTarget.dataset.goodsId;
        wx.navigateTo({
            url: "/pages/integral-mall/goods-info/index?goods_id=" + a + "&integral=" + this.data.integral
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    shuoming: function() {
        wx.navigateTo({
            url: "/pages/integral-mall/shuoming/index"
        });
    },
    detail: function() {
        wx.navigateTo({
            url: "/pages/integral-mall/detail/index"
        });
    },
    exchange: function() {
        wx.navigateTo({
            url: "/pages/integral-mall/exchange/index"
        });
    },
    register: function() {
        wx.navigateTo({
            url: "/pages/integral-mall/register/index"
        });
    }
});