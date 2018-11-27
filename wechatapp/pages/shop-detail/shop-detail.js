var api = require("../../api.js"), utils = require("../../utils.js"), app = getApp(), WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {
        score: [ 1, 2, 3, 4, 5 ]
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var o = this, e = t.user_id;
        app.loginBindParent({
            parent_id: e
        }), o.setData({
            shop_id: t.shop_id
        }), wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.default.shop_detail,
            method: "GET",
            data: {
                shop_id: t.shop_id
            },
            success: function(t) {
                if (0 == t.code) {
                    o.setData(t.data);
                    var e = t.data.shop.content ? t.data.shop.content : "<span>暂无信息</span>";
                    WxParse.wxParse("detail", "html", e, o);
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/shop/shop"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    mobile: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.shop.mobile
        });
    },
    goto: function() {
        var e = this;
        "undefined" != typeof my ? e.location() : wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userLocation"] ? e.location() : app.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(t) {
                        t.authSetting["scope.userLocation"] && e.location();
                    }
                });
            }
        });
    },
    location: function() {
        var t = this.data.shop;
        wx.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            name: t.name,
            address: t.address
        });
    },
    onShareAppMessage: function(t) {
        var e = wx.getStorageSync("user_info");
        return {
            path: "/pages/shop-detail/shop-detail?shop_id=" + this.data.shop_id + "&user_id=" + e.id
        };
    }
});