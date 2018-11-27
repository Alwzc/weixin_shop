var api = require("../../api.js"), app = getApp();

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}

var pay = {
    init: function(l, e) {
        var _ = this;
        _.page = l, app = e, _.page.orderPay = function(e) {
            var t = e.currentTarget.dataset.index, a = _.page.data.order_list[t], o = new Array();
            if (void 0 !== _.page.data.pay_type_list) o = _.page.data.pay_type_list; else if (void 0 !== a.pay_type_list) o = a.pay_type_list; else if (void 0 !== a.goods_list[0].pay_type_list) o = a.goods_list[0].pay_type_list; else {
                var i = {
                    payment: 0
                };
                o.push(i);
            }
            var r = getCurrentPages(), s = r[r.length - 1].route, n = {};
            if (-1 != s.indexOf("pt")) d = api.group.pay_data, n.order_id = a.order_id; else if (-1 != s.indexOf("miaosha")) d = api.miaosha.pay_data, 
            n.order_id = a.order_id; else if (-1 != s.indexOf("book")) d = api.book.order_pay, 
            n.id = a.id; else {
                var d = api.order.pay_data;
                n.order_id = a.order_id;
            }
            function c(e, t, a) {
                e.pay_type = "WECHAT_PAY", app.request({
                    url: t,
                    data: e,
                    complete: function() {
                        wx.hideLoading();
                    },
                    success: function(e) {
                        0 == e.code && (setOnShowScene("pay"), wx.requestPayment({
                            _res: e,
                            timeStamp: e.data.timeStamp,
                            nonceStr: e.data.nonceStr,
                            package: e.data.package,
                            signType: e.data.signType,
                            paySign: e.data.paySign,
                            success: function(e) {},
                            fail: function(e) {},
                            complete: function(e) {
                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? wx.redirectTo({
                                    url: "/" + a + "?status=1"
                                }) : wx.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(e) {
                                        e.confirm && wx.redirectTo({
                                            url: "/" + a + "?status=0"
                                        });
                                    }
                                });
                            }
                        })), 1 == e.code && wx.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            function p(t, a, o) {
                t.pay_type = "BALANCE_PAY";
                var e = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + e.money,
                    content: "是否使用余额",
                    success: function(e) {
                        e.confirm && (wx.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), app.request({
                            url: a,
                            data: t,
                            complete: function() {
                                wx.hideLoading();
                            },
                            success: function(e) {
                                0 == e.code && wx.redirectTo({
                                    url: "/" + o + "?status=1"
                                }), 1 == e.code && wx.showModal({
                                    title: "提示",
                                    content: e.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            1 == o.length ? (wx.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == o[0].payment && c(n, d, s), 3 == o[0].payment && p(n, d, s)) : wx.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "线上支付",
                success: function(e) {
                    e.confirm ? (wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), c(n, d, s)) : e.cancel && p(n, d, s);
                }
            });
        }, _.page.order_submit = function(i, g) {
            var e = api.order.submit, r = api.order.pay_data, u = "/pages/order/order";
            if ("pt" == g ? (e = api.group.submit, r = api.group.pay_data, u = "/pages/pt/order/order") : "ms" == g ? (e = api.miaosha.submit, 
            r = api.miaosha.pay_data, u = "/pages/miaosha/order/order") : "pond" == g ? (e = api.pond.submit, 
            r = api.order.pay_data, u = "/pages/order/order") : "scratch" == g ? (e = api.scratch.submit, 
            r = api.order.pay_data, u = "/pages/order/order") : "s" == g && (e = api.order.new_submit, 
            r = api.order.pay_data, u = "/pages/order/order"), 3 == i.payment) {
                var t = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + t.money,
                    content: "是否确定使用余额支付",
                    success: function(e) {
                        e.confirm && a();
                    }
                });
            } else a();
            function a() {
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: e,
                    method: "post",
                    data: i,
                    success: function(e) {
                        if (0 == e.code) {
                            var t = function() {
                                app.request({
                                    url: r,
                                    data: {
                                        order_id: p,
                                        order_id_list: a,
                                        pay_type: o,
                                        form_id: i.formId
                                    },
                                    success: function(e) {
                                        if (0 != e.code) return wx.hideLoading(), void wx.showModal({
                                            title: "提示",
                                            content: e.msg,
                                            showCancel: !1,
                                            confirmText: "确认",
                                            success: function(e) {
                                                e.confirm && wx.redirectTo({
                                                    url: u + "?status=0"
                                                });
                                            }
                                        });
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), "pt" == g ? "ONLY_BUY" == _.page.data.type ? wx.redirectTo({
                                            url: u + "?status=2"
                                        }) : wx.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + p
                                        }) : void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length && 2 != i.payment ? _.page.setData({
                                            show_card: !0
                                        }) : wx.redirectTo({
                                            url: u + "?status=-1"
                                        });
                                    }
                                });
                            };
                            if (null != e.data.p_price && 0 === e.data.p_price) return l.showToast({
                                title: "提交成功"
                            }), void setTimeout(function() {
                                wx.navigateBack();
                            }, 2e3);
                            setTimeout(function() {
                                _.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var p = e.data.order_id || "", a = e.data.order_id_list ? JSON.stringify(e.data.order_id_list) : "", o = "";
                            0 == i.payment ? app.request({
                                url: r,
                                data: {
                                    order_id: p,
                                    order_id_list: a,
                                    pay_type: "WECHAT_PAY"
                                },
                                success: function(e) {
                                    if (0 != e.code) {
                                        if (1 == e.code) return wx.hideLoading(), void _.page.showToast({
                                            title: e.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), setOnShowScene("pay"), e.data && 0 == e.data.price ? void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                            show_card: !0
                                        }) : wx.redirectTo({
                                            url: u + "?status=1"
                                        }) : wx.requestPayment({
                                            _res: e,
                                            timeStamp: e.data.timeStamp,
                                            nonceStr: e.data.nonceStr,
                                            package: e.data.package,
                                            signType: e.data.signType,
                                            paySign: e.data.paySign,
                                            success: function(e) {},
                                            fail: function(e) {},
                                            complete: function(e) {
                                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" != e.errMsg || (void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                                    show_card: !0
                                                }) : "pt" == g ? "ONLY_BUY" == _.page.data.type ? wx.redirectTo({
                                                    url: u + "?status=2"
                                                }) : wx.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + p
                                                }) : wx.redirectTo({
                                                    url: u + "?status=1"
                                                })) : wx.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(e) {
                                                        e.confirm && wx.redirectTo({
                                                            url: u + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var t = wx.getStorageSync("quick_list");
                                        if (t) {
                                            for (var a = t.length, o = 0; o < a; o++) for (var i = t[o].goods, r = i.length, s = 0; s < r; s++) i[s].num = 0;
                                            wx.setStorageSync("quick_lists", t);
                                            var n = wx.getStorageSync("carGoods");
                                            for (a = n.length, o = 0; o < a; o++) n[o].num = 0, n[o].goods_price = 0, l.setData({
                                                carGoods: n
                                            });
                                            wx.setStorageSync("carGoods", n);
                                            var d = wx.getStorageSync("total");
                                            d && (d.total_num = 0, d.total_price = 0, wx.setStorageSync("total", d));
                                            wx.getStorageSync("check_num");
                                            0, wx.setStorageSync("check_num", 0);
                                            var c = wx.getStorageSync("quick_hot_goods_lists");
                                            for (a = c.length, o = 0; o < a; o++) c[o].num = 0, l.setData({
                                                quick_hot_goods_lists: c
                                            });
                                            wx.setStorageSync("quick_hot_goods_lists", c);
                                        }
                                    }
                                }
                            }) : 2 == i.payment ? (o = "HUODAO_PAY", t()) : 3 == i.payment && (o = "BALANCE_PAY", 
                            t());
                        }
                        if (1 == e.code) return wx.hideLoading(), void _.page.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
        };
    }
};

module.exports = pay;