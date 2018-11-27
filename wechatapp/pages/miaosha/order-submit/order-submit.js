var api = require("../../../api.js"), app = getApp(), longitude = "", latitude = "", util = require("../../../utils/utils.js");

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        content: "",
        offline: 0,
        express_price_1: 0,
        name: "",
        mobile: "",
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = util.formatData(new Date());
        wx.removeStorageSync("input_data"), this.setData({
            options: t,
            store: wx.getStorageSync("store"),
            time: a
        });
    },
    bindkeyinput: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function(t) {
        var a = this.data.express_price, e = this.data.express_price_1;
        1 == t.target.dataset.index ? this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: a
        }) : this.setData({
            offline: 0,
            express_price: e
        }), this.getPrice();
    },
    dingwei: function() {
        var a = this;
        wx.chooseLocation({
            success: function(t) {
                longitude = t.longitude, latitude = t.latitude, a.setData({
                    location: t.address
                });
            },
            fail: function(t) {
                app.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? a.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var a = this, e = a.data.offline, i = {};
        if (0 == e) {
            if (!a.data.address || !a.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            i.address_id = a.data.address.id;
        } else {
            if (i.address_name = a.data.name, i.address_mobile = a.data.mobile, !a.data.shop.id) return void wx.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (i.shop_id = a.data.shop.id, !i.address_name || null == i.address_name) return void a.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!i.address_mobile || null == i.address_mobile) return void a.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^\+?\d[\d -]{8,12}\d/.test(i.address_mobile)) return void wx.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
        }
        if (i.offline = e, -1 == a.data.payment) return a.setData({
            show_payment: !0
        }), !1;
        a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)), a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)), 
        a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id), 
        a.data.content && (i.content = a.data.content), 1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2, 
        i.payment = a.data.payment, i.formId = t.detail.formId, a.order_submit(i, "ms");
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var t = this, a = wx.getStorageSync("picker_address");
        a && (t.setData({
            address: a,
            name: a.name,
            mobile: a.mobile
        }), wx.removeStorageSync("picker_address"), t.getInputData()), t.getOrderData(t.data.options);
    },
    getOrderData: function(t) {
        var s = this, a = "";
        s.data.address && s.data.address.id && (a = s.data.address.id), t.goods_info && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.miaosha.submit_preview,
            data: {
                goods_info: t.goods_info,
                address_id: a,
                longitude: longitude,
                latitude: latitude
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.shop_list, e = {};
                    1 == a.length && (e = a[0]);
                    var i = wx.getStorageSync("input_data");
                    i || (i = {
                        address: t.data.address,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        shop: e
                    }, 0 < t.data.pay_type_list.length && (i.payment = t.data.pay_type_list[0].payment, 
                    1 < t.data.pay_type_list.length && (i.payment = -1))), i.total_price = t.data.total_price, 
                    i.goods_list = t.data.list, i.goods_info = t.data.goods_info, i.express_price = parseFloat(t.data.express_price), 
                    i.coupon_list = t.data.coupon_list, i.shop_list = t.data.shop_list, i.send_type = t.data.send_type, 
                    i.level = t.data.level, i.integral = t.data.integral, i.new_total_price = t.data.total_price, 
                    i.is_payment = t.data.is_payment, i.is_coupon = t.data.list[0].coupon, i.is_discount = t.data.list[0].is_discount, 
                    i.is_area = t.data.is_area, i.pay_type_list = t.data.pay_type_list, s.setData(i), 
                    s.getInputData(), 1 == t.data.send_type && s.setData({
                        offline: 0
                    }), 2 == t.data.send_type && s.setData({
                        offline: 1
                    }), s.getPrice();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && (1 == getCurrentPages().length ? wx.redirectTo({
                            url: "/pages/index/index"
                        }) : wx.navigateBack({
                            delta: 1
                        }));
                    }
                });
            }
        }));
    },
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        a && wx.setClipboardData({
            data: a,
            success: function() {
                page.showToast({
                    title: "已复制内容"
                });
            },
            fail: function() {
                page.showToast({
                    title: "复制失败",
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    showCouponPicker: function() {
        this.getInputData(), this.data.coupon_list && 0 < this.data.coupon_list.length && this.setData({
            show_coupon_picker: !0
        });
    },
    pickCoupon: function(t) {
        var a = wx.getStorageSync("input_data");
        wx.removeStorageSync("input_data");
        var e = t.currentTarget.dataset.index;
        a.show_coupon_picker = !1, a.picker_coupon = "-1" != e && -1 != e && this.data.coupon_list[e], 
        this.setData(a), this.getPrice();
    },
    numSub: function(t, a, e) {
        return 100;
    },
    showShop: function(t) {
        var a = this;
        a.getInputData(), a.dingwei(), a.data.shop_list && 1 <= a.data.shop_list.length && a.setData({
            show_shop: !0
        });
    },
    pickShop: function(t) {
        var a = t.currentTarget.dataset.index, e = wx.getStorageSync("input_data");
        wx.removeStorageSync("input_data"), e.show_shop = !1, e.shop = "-1" != a && -1 != a && this.data.shop_list[a], 
        this.setData(e), this.getPrice();
    },
    integralSwitchChange: function(t) {
        0 != t.detail.value ? this.setData({
            integral_radio: 1
        }) : this.setData({
            integral_radio: 2
        }), this.getPrice();
    },
    integration: function(t) {
        var a = this.data.integral.integration;
        wx.showModal({
            title: "积分使用规则",
            content: a,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this, a = t.data.total_price, e = t.data.express_price, i = t.data.picker_coupon, s = t.data.integral, n = t.data.integral_radio, o = t.data.level, d = t.data.offline;
        i && (a -= i.sub_price), s && 1 == n && (a -= parseFloat(s.forehead)), o && (a = a * o.discount / 10), 
        a <= .01 && (a = .01), 0 == d && (a += e), t.setData({
            new_total_price: parseFloat(a.toFixed(2))
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
        var a = t.currentTarget.dataset.index, e = this.data.form, i = e.list;
        i[a].default = t.detail.value, e.list = i, this.setData({
            form: e
        });
    },
    selectForm: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.k, i = this.data.form, s = i.list;
        if ("radio" == s[a].type) {
            var n = s[a].default_list;
            for (var o in n) o == e ? n[e].is_selected = 1 : n[o].is_selected = 0;
            s[a].default_list = n;
        }
        "checkbox" == s[a].type && (1 == (n = s[a].default_list)[e].is_selected ? n[e].is_selected = 0 : n[e].is_selected = 1, 
        s[a].default_list = n);
        i.list = s, this.setData({
            form: i
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            payment: a,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this, a = {
            address: t.data.address,
            name: t.data.name,
            mobile: t.data.mobile,
            content: t.data.content,
            payment: t.data.payment,
            shop: t.data.shop
        };
        wx.setStorageSync("input_data", a);
    },
    onHide: function() {
        app.pageOnHide(this), this.getInputData();
    },
    onUnLoad: function() {
        app.pageOnUnLoad(this), wx.removeStorageSync("input_data");
    }
});