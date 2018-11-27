var api = require("../../api.js"), app = getApp(), longitude = "", latitude = "", util = require("../../utils/utils.js"), is_loading_show = !1;

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        express_price_1: 0,
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1,
        show_more: !1,
        index: -1,
        mch_offline: !0
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var e = util.formatData(new Date());
        wx.removeStorageSync("input_data"), this.setData({
            options: t,
            store: wx.getStorageSync("store"),
            time: e
        }), is_loading_show = !1;
    },
    bindContentInput: function(t) {
        this.data.mch_list[t.currentTarget.dataset.index].content = t.detail.value, this.setData({
            mch_list: this.data.mch_list
        });
    },
    KeyName: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_name = t.detail.value, this.setData({
            mch_list: e
        });
    },
    KeyMobile: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_mobile = t.detail.value, this.setData({
            mch_list: e
        });
    },
    getOffline: function(t) {
        var e = this, a = t.currentTarget.dataset.offline, i = t.currentTarget.dataset.index, s = e.data.mch_list;
        s[i].offline = a, e.setData({
            mch_list: s
        }), 1 == s.length && 0 == s[0].mch_id && 1 == s[0].offline ? e.setData({
            mch_offline: !1
        }) : e.setData({
            mch_offline: !0
        }), e.getPrice();
    },
    dingwei: function() {
        var e = this;
        wx.chooseLocation({
            success: function(t) {
                longitude = t.longitude, latitude = t.latitude, e.setData({
                    location: t.address
                }), e.getOrderData(e.data.options);
            },
            fail: function(t) {
                app.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? e.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var e = this, a = {}, i = e.data.mch_list;
        for (var s in i) {
            var n = i[s].form;
            if (n && 1 == n.is_form && 0 == i[s].mch_id) {
                var o = n.list;
                for (var r in o) if (1 == o[r].required) if ("radio" == o[r].type || "checkbox" == o[r].type) {
                    var d = !1;
                    for (var l in o[r].default_list) 1 == o[r].default_list[l].is_selected && (d = !0);
                    if (!d) return wx.showModal({
                        title: "提示",
                        content: "请填写" + n.name + "，加‘*’为必填项",
                        showCancel: !1
                    }), !1;
                } else if (!o[r].default || null == o[r].default) return wx.showModal({
                    title: "提示",
                    content: "请填写" + n.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            }
            if (1 == i.length && 0 == i[s].mch_id && 1 == i[s].offline) ; else {
                if (!e.data.address) return wx.showModal({
                    title: "提示",
                    content: "请选择收货地址",
                    showCancel: !1
                }), !1;
                a.address_id = e.data.address.id;
            }
        }
        if (a.mch_list = JSON.stringify(i), 0 < e.data.pond_id) {
            if (0 < e.data.express_price && -1 == e.data.payment) return e.setData({
                show_payment: !0
            }), !1;
        } else if (-1 == e.data.payment) return e.setData({
            show_payment: !0
        }), !1;
        1 == e.data.integral_radio ? a.use_integral = 1 : a.use_integral = 2, a.payment = e.data.payment, 
        a.formId = t.detail.formId, e.order_submit(a, "s");
    },
    onReady: function() {},
    onShow: function(t) {
        if (!is_loading_show) {
            is_loading_show = !0, app.pageOnShow(this);
            var e = this, a = wx.getStorageSync("picker_address");
            a && e.setData({
                address: a
            }), e.getOrderData(e.data.options);
        }
    },
    getOrderData: function(t) {
        var _ = this, e = {}, a = "";
        _.data.address && _.data.address.id && (a = _.data.address.id), e.address_id = a, 
        e.longitude = longitude, e.latitude = latitude, wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.mch_list = t.mch_list, app.request({
            url: api.order.new_submit_preview,
            method: "POST",
            data: e,
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var e = wx.getStorageSync("input_data"), a = t.data, i = -1, s = 1, n = a.mch_list, o = [];
                    for (var r in e && (o = e.mch_list, i = e.payment, s = e.integral_radio), a.integral_radio = s, 
                    a.pay_type_list) {
                        if (i == a.pay_type_list[r].payment) {
                            a.payment = i;
                            break;
                        }
                        if (1 == a.pay_type_list.length) {
                            a.payment = a.pay_type_list[r].payment;
                            break;
                        }
                    }
                    for (var r in n) {
                        var d = {}, l = {};
                        if (n[r].show = !1, n[r].show_length = n[r].goods_list.length - 1, 0 != o.length) for (var c in o) n[r].mch_id == o[c].mch_id && (n[r].content = o[c].content, 
                        n[r].form = o[c].form, d = o[c].shop, l = o[c].picker_coupon, n[r].offline_name = o[c].offline_name, 
                        n[r].offline_mobile = o[c].offline_mobile);
                        for (var c in n[r].shop_list) {
                            if (d && d.id == n[r].shop_list[c].id) {
                                n[r].shop = d;
                                break;
                            }
                            if (1 == n[r].shop_list.length) {
                                n[r].shop = n[r].shop_list[c];
                                break;
                            }
                            if (1 == n[r].shop_list[c].is_default) {
                                n[r].shop = n[r].shop_list[c];
                                break;
                            }
                        }
                        if (l) for (var c in n[r].coupon_list) if (l.id == n[r].coupon_list[c].id) {
                            n[r].picker_coupon = l;
                            break;
                        }
                        n[r].send_type && 2 == n[r].send_type ? (n[r].offline = 1, _.setData({
                            mch_offline: !1
                        })) : n[r].offline = 0;
                    }
                    a.mch_list = n;
                    var h = _.data.index;
                    -1 != h && n[h].shop_list && 0 < n[h].shop_list.length && _.setData({
                        show_shop: !0,
                        shop_list: n[h].shop_list
                    }), _.setData(a), _.getPrice();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    showCouponPicker: function(t) {
        var e = t.currentTarget.dataset.index, a = this.data.mch_list;
        this.getInputData(), a[e].coupon_list && 0 < a[e].coupon_list.length && this.setData({
            show_coupon_picker: !0,
            coupon_list: a[e].coupon_list,
            index: e
        });
    },
    pickCoupon: function(t) {
        var e = t.currentTarget.dataset.index, a = this.data.index, i = wx.getStorageSync("input_data");
        wx.removeStorageSync("input_data");
        var s = i.mch_list;
        s[a].picker_coupon = "-1" != e && -1 != e && this.data.coupon_list[e], i.show_coupon_picker = !1, 
        i.mch_list = s, i.index = -1, this.setData(i), this.getPrice();
    },
    showShop: function(t) {
        var e = t.currentTarget.dataset.index;
        this.getInputData(), this.setData({
            index: e
        }), this.dingwei();
    },
    pickShop: function(t) {
        var e = t.currentTarget.dataset.index, a = this.data.index, i = wx.getStorageSync("input_data"), s = i.mch_list;
        s[a].shop = "-1" != e && -1 != e && this.data.shop_list[e], i.show_shop = !1, i.mch_list = s, 
        i.index = -1, this.setData(i), this.getPrice();
    },
    integralSwitchChange: function(t) {
        0 != t.detail.value ? this.setData({
            integral_radio: 1
        }) : this.setData({
            integral_radio: 2
        }), this.getPrice();
    },
    integration: function(t) {
        var e = this.data.integral.integration;
        wx.showModal({
            title: "积分使用规则",
            content: e,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this.data.mch_list, e = this.data.integral_radio, a = (this.data.integral, 
        0), i = 0, s = {};
        for (var n in t) {
            var o = t[n], r = (parseFloat(o.total_price), parseFloat(o.level_price));
            o.picker_coupon && 0 < o.picker_coupon.sub_price && (r -= o.picker_coupon.sub_price), 
            o.integral && 0 < o.integral.forehead && 1 == e && (r -= parseFloat(o.integral.forehead)), 
            0 == o.offline && (o.express_price && (r += o.express_price), o.offer_rule && 1 == o.offer_rule.is_allowed && (s = o.offer_rule), 
            1 == o.is_area && (i = 1)), a += parseFloat(r);
        }
        a = 0 <= a ? a : 0, this.setData({
            new_total_price: parseFloat(a.toFixed(2)),
            offer_rule: s,
            is_area: i
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var e = t.currentTarget.dataset.index, a = t.currentTarget.dataset.formId, i = this.data.mch_list, s = i[e].form, n = s.list;
        n[a].default = t.detail.value, s.list = n, this.setData({
            mch_list: i
        });
    },
    selectForm: function(t) {
        var e = this.data.mch_list, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.formId, s = t.currentTarget.dataset.k, n = e[a].form, o = n.list, r = o[i].default_list;
        if ("radio" == o[i].type) {
            for (var d in r) d == s ? r[s].is_selected = 1 : r[d].is_selected = 0;
            o[i].default_list = r;
        }
        "checkbox" == o[i].type && (1 == r[s].is_selected ? r[s].is_selected = 0 : r[s].is_selected = 1, 
        o[i].default_list = r), n.list = o, e[a].form = n, this.setData({
            mch_list: e
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var e = t.currentTarget.dataset.index;
        this.setData({
            payment: e,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this.data.mch_list, e = {
            integral_radio: this.data.integral_radio,
            payment: this.data.payment,
            mch_list: t
        };
        wx.setStorageSync("input_data", e);
    },
    onHide: function() {
        app.pageOnHide(this);
        this.getInputData();
    },
    onUnload: function() {
        app.pageOnUnload(this), wx.removeStorageSync("input_data");
    },
    uploadImg: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.formId, s = e.data.mch_list, n = s[a].form;
        is_loading_show = !0, app.uploader.upload({
            start: function() {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (n.list[i].default = t.data.url, e.setData({
                    mch_list: s
                })) : e.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                e.showToast({
                    title: t
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goToAddress: function() {
        is_loading_show = !1, wx.navigateTo({
            url: "/pages/address-picker/address-picker"
        });
    },
    showMore: function(t) {
        var e = this.data.mch_list, a = t.currentTarget.dataset.index;
        e[a].show = !e[a].show, this.setData({
            mch_list: e
        });
    }
});