var app = getApp(), api = require("../../api.js");

Page({
    data: {
        second: 60
    },
    onLoad: function(n) {
        app.pageOnLoad(this, n);
        var e = this;
        app.request({
            url: api.user.sms_setting,
            method: "get",
            data: {
                page: 1
            },
            success: function(n) {
                0 == n.code ? e.setData({
                    status: !0
                }) : e.setData({
                    status: !1
                });
            }
        });
    },
    getPhoneNumber: function(t) {
        var a = this;
        "getPhoneNumber:fail user deny" == t.detail.errMsg ? wx.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权",
            success: function(n) {}
        }) : (wx.showLoading({
            title: "授权中"
        }), wx.login({
            success: function(n) {
                if (n.code) {
                    var e = n.code;
                    app.request({
                        url: api.user.user_binding,
                        method: "POST",
                        data: {
                            iv: t.detail.iv,
                            encryptedData: t.detail.encryptedData,
                            code: e
                        },
                        success: function(n) {
                            if (0 == n.code) {
                                var e = a.data.__user_info;
                                e.binding = n.data.dataObj, wx.setStorageSync("__user_info", e), a.setData({
                                    PhoneNumber: n.data.dataObj,
                                    __user_info: e,
                                    binding: !0,
                                    binding_num: n.data.dataObj
                                });
                            } else wx.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function(n) {
                            wx.hideLoading();
                        }
                    });
                } else wx.showToast({
                    title: "获取用户登录态失败！" + n.errMsg,
                    image: "/images/icon-warning.png"
                });
            }
        }));
    },
    gainPhone: function() {
        this.setData({
            gainPhone: !0,
            handPhone: !1
        });
    },
    handPhone: function() {
        this.setData({
            gainPhone: !1,
            handPhone: !0
        });
    },
    nextStep: function() {
        var e = this, n = this.data.handphone;
        n && 11 == n.length ? app.request({
            url: api.user.user_hand_binding,
            method: "POST",
            data: {
                content: n
            },
            success: function(n) {
                0 == n.code ? (e.timer(), e.setData({
                    content: n.msg,
                    timer: !0
                })) : (n.code, wx.showToast({
                    title: n.msg,
                    image: "/images/icon-warning.png"
                }));
            }
        }) : wx.showToast({
            title: "手机号码错误",
            image: "/images/icon-warning.png"
        });
    },
    timer: function() {
        var a = this;
        new Promise(function(n, e) {
            var t = setInterval(function() {
                a.setData({
                    second: a.data.second - 1
                }), a.data.second <= 0 && (a.setData({
                    timer: !1
                }), n(t));
            }, 1e3);
        }).then(function(n) {
            clearInterval(n);
        });
    },
    HandPhoneInput: function(n) {
        this.setData({
            handphone: n.detail.value
        });
    },
    CodeInput: function(n) {
        this.setData({
            code: n.detail.value
        });
    },
    PhoneInput: function(n) {
        this.setData({
            phoneNum: n.detail.value
        });
    },
    onSubmit: function() {
        var n = this.data.gainPhone, e = this.data.handPhone, t = n ? 1 : e ? 2 : 0;
        if (n) {
            var a = this.data.phoneNum;
            if (a) {
                if (11 != a.length) return void wx.showToast({
                    title: "手机号码错误",
                    image: "/images/icon-warning.png"
                });
                var i = a;
            } else {
                if (!(i = this.data.PhoneNumber)) return void wx.showToast({
                    title: "手机号码错误",
                    image: "/images/icon-warning.png"
                });
            }
        } else {
            i = this.data.handphone;
            if (!/^\+?\d[\d -]{8,12}\d/.test(i)) return void wx.showToast({
                title: "手机号码错误",
                image: "/images/icon-warning.png"
            });
            var o = this.data.code;
            if (!o) return void wx.showToast({
                title: "请输入验证码",
                image: "/images/icon-warning.png"
            });
        }
        var s = this;
        app.request({
            url: api.user.user_empower,
            method: "POST",
            data: {
                phone: i,
                phone_code: o,
                bind_type: t
            },
            success: function(n) {
                0 == n.code ? s.setData({
                    binding: !0,
                    binding_num: i
                }) : 1 == n.code && wx.showToast({
                    title: n.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    renewal: function() {
        this.setData({
            binding: !1,
            gainPhone: !0,
            handPhone: !1
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var n = this, e = n.data.__user_info;
        e && e.binding ? n.setData({
            binding_num: e.binding,
            binding: !0
        }) : n.setData({
            gainPhone: !0,
            handPhone: !1
        });
    },
    onHide: function() {},
    onUnload: function() {}
});