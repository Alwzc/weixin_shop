var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        showModel: !1
    },
    onLoad: function(t) {
        if (getApp().pageOnLoad(this, t), t.coupon_id) {
            var n = t.coupon_id, e = this;
            app.request({
                url: api.integral.coupon_info,
                data: {
                    coupon_id: n
                },
                success: function(t) {
                    0 == t.code && e.setData({
                        coupon: t.data.coupon,
                        info: t.data.info
                    });
                }
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    exchangeCoupon: function(t) {
        var e = this, a = e.data.coupon, o = e.data.__user_info.integral;
        if (parseInt(a.integral) > parseInt(o)) e.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1
        }); else {
            if (0 < parseFloat(a.price)) var n = "需要" + a.integral + "积分+￥" + parseFloat(a.price); else n = "需要" + a.integral + "积分";
            if (parseInt(a.total_num) <= 0) return void e.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1
            });
            if (parseInt(a.num) >= parseInt(a.user_num)) return a.type = 1, void e.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1
            });
            wx.showModal({
                title: "确认兑换",
                content: n,
                success: function(t) {
                    t.confirm && (0 < parseFloat(a.price) ? (wx.showLoading({
                        title: "提交中"
                    }), app.request({
                        url: api.integral.exchange_coupon,
                        data: {
                            id: a.id,
                            type: 2
                        },
                        success: function(n) {
                            0 == n.code ? wx.requestPayment({
                                _res: n,
                                timeStamp: n.data.timeStamp,
                                nonceStr: n.data.nonceStr,
                                package: n.data.package,
                                signType: n.data.signType,
                                paySign: n.data.paySign,
                                complete: function(t) {
                                    "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && (a.num = parseInt(a.num), 
                                    a.num += 1, a.total_num = parseInt(a.total_num), a.total_num -= 1, o = parseInt(o), 
                                    o -= parseInt(a.integral), e.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: n.msg,
                                        coupon: a
                                    })) : wx.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            }) : e.setData({
                                showModel: !0,
                                content: n.msg,
                                status: 1
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
                            id: a.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code ? (a.num = parseInt(a.num), a.num += 1, a.total_num = parseInt(a.total_num), 
                            a.total_num -= 1, o = parseInt(o), o -= parseInt(a.integral), e.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon: a
                            })) : e.setData({
                                showModel: !0,
                                content: t.msg,
                                status: 1
                            });
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
    }
});