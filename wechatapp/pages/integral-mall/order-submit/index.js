var api = require("../../../api.js"), app = getApp(), longitude = "", latitude = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = a.goods_info, e = JSON.parse(t);
        e && this.setData({
            goods_info: e,
            offline: 1,
            id: e.goods_id
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this), wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var n = this, a = wx.getStorageSync("picker_address");
        a && (n.setData({
            address: a,
            name: a.name,
            mobile: a.mobile
        }), wx.removeStorageSync("picker_address"));
        var t = "";
        if (n.data.address && n.data.address.id) t = n.data.address.id;
        app.request({
            url: api.integral.submit_preview,
            data: {
                goods_info: JSON.stringify(n.data.goods_info),
                address_id: t
            },
            success: function(a) {
                if (wx.hideLoading(), 0 == a.code) {
                    var t = a.data.shop_list, e = {};
                    t && 1 == t.length && (e = t[0]), a.data.is_shop && (e = a.data.is_shop);
                    var i = a.data.total_price;
                    if (a.data.express_price) s = a.data.express_price; else var s = 0;
                    var o = a.data.goods;
                    n.setData({
                        goods: o,
                        address: a.data.address,
                        express_price: s,
                        shop_list: a.data.shop_list,
                        shop: e,
                        name: a.data.address ? a.data.address.name : "",
                        mobile: a.data.address ? a.data.address.mobile : "",
                        total_price: parseFloat(i).toFixed(2),
                        send_type: a.data.send_type,
                        attr: o.attr,
                        attr_price: o.attr_price,
                        attr_integral: o.attr_integral
                    }), 1 == a.data.send_type && n.setData({
                        offline: 1
                    }), 2 == a.data.send_type && n.setData({
                        offline: 2
                    }), n.getTotalPrice();
                } else wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getOffline: function(a) {
        var t = this, e = (t.data.express_price, t.data.total_price);
        1 == a.currentTarget.dataset.index ? t.setData({
            offline: 1,
            total_price: e
        }) : t.setData({
            offline: 2
        }), t.getTotalPrice();
    },
    showShop: function(a) {
        var t = this;
        t.dingwei(), t.data.shop_list && 1 <= t.data.shop_list.length && t.setData({
            show_shop: !0
        });
    },
    dingwei: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                longitude = a.longitude, latitude = a.latitude, t.setData({
                    location: a.address
                });
            },
            fail: function(a) {
                app.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(a) {
                        a && (a.authSetting["scope.userLocation"] ? t.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    pickShop: function(a) {
        var t = this, e = a.currentTarget.dataset.index;
        "-1" == e || -1 == e ? t.setData({
            shop: !1,
            show_shop: !1
        }) : t.setData({
            shop: t.data.shop_list[e],
            show_shop: !1
        });
    },
    bindkeyinput: function(a) {
        this.setData({
            content: a.detail.value
        });
    },
    KeyName: function(a) {
        this.setData({
            name: a.detail.value
        });
    },
    KeyMobile: function(a) {
        this.setData({
            mobile: a.detail.value
        });
    },
    orderSubmit: function(a) {
        var t = this, e = t.data.offline, i = {};
        if (1 == e) {
            if (!t.data.address || !t.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            if (i.address_id = t.data.address.id, t.data.total_price) {
                if (0 < t.data.total_price) var s = 2; else s = 1;
                i.type = s;
            }
        } else {
            if (i.address_name = t.data.name, i.address_mobile = t.data.mobile, !t.data.shop.id) return void wx.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (i.shop_id = t.data.shop.id, !i.address_name || null == i.address_name) return void t.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!i.address_mobile || null == i.address_mobile) return void t.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
        }
        if (i.offline = e, t.data.content && (i.content = t.data.content), t.data.goods_info) {
            var o = t.data.attr, n = [];
            for (var d in o) {
                var r = {
                    attr_id: o[d].attr_id,
                    attr_name: o[d].attr_name
                };
                n.push(r);
            }
            t.data.goods_info.attr = n, i.goods_info = JSON.stringify(t.data.goods_info);
        }
        t.data.express_price && (i.express_price = t.data.express_price), i.attr = JSON.stringify(o), 
        wx.showLoading({
            title: "提交中",
            mask: !0
        }), i.formId = a.detail.formId, app.request({
            url: api.integral.submit,
            method: "post",
            data: i,
            success: function(a) {
                wx.hideLoading(), 0 == a.code ? 1 == a.type ? wx.redirectTo({
                    url: "/pages/integral-mall/order/order?status=1"
                }) : wx.requestPayment({
                    _res: a,
                    timeStamp: a.data.timeStamp,
                    nonceStr: a.data.nonceStr,
                    package: a.data.package,
                    signType: a.data.signType,
                    paySign: a.data.paySign,
                    complete: function(a) {
                        "requestPayment:fail" != a.errMsg && "requestPayment:fail cancel" != a.errMsg ? "requestPayment:ok" == a.errMsg && wx.redirectTo({
                            url: "/pages/integral-mall/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(a) {
                                a.confirm && wx.redirectTo({
                                    url: "/pages/integral-mall/order/order?status=0"
                                });
                            }
                        });
                    }
                }) : wx.showToast({
                    title: a.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    getTotalPrice: function() {
        var a = parseFloat(this.data.total_price), t = this.data.offline, e = this.data.express_price, i = 0;
        i = 2 == t ? a : a + e, this.setData({
            new_total_price: parseFloat(i).toFixed(2)
        });
    }
});