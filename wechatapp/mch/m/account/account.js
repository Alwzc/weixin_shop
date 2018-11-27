var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        cash_val: ""
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this, s = "mch_account_data", o = wx.getStorageSync(s);
        o && t.setData(o), wx.showNavigationBarLoading(), app.request({
            url: api.mch.user.account,
            success: function(a) {
                0 == a.code ? (t.setData(a.data), wx.setStorageSync(s, a.data)) : wx.showModal({
                    title: "提示",
                    content: a.msg,
                    success: function() {}
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading();
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    showDesc: function() {
        wx.showModal({
            title: "交易手续费说明",
            content: this.data.desc,
            showCancel: !1
        });
    },
    showCash: function() {
        wx.navigateTo({
            url: "/mch/m/cash/cash"
        });
    },
    hideCash: function() {
        this.setData({
            show_cash: !1
        });
    },
    cashInput: function(a) {
        var t = a.detail.value;
        t = parseFloat(t), isNaN(t) && (t = 0), t = t.toFixed(2), this.setData({
            cash_val: t || ""
        });
    },
    cashSubmit: function(a) {
        var t = this;
        t.data.cash_val ? t.data.cash_val <= 0 ? t.showToast({
            title: "请输入提现金额。"
        }) : (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.mch.user.cash,
            method: "POST",
            data: {
                cash_val: t.data.cash_val
            },
            success: function(a) {
                wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function() {
                        0 == a.code && wx.redirectTo({
                            url: "/mch/m/account/account"
                        });
                    }
                });
            },
            complete: function(a) {
                wx.hideLoading();
            }
        })) : t.showToast({
            title: "请输入提现金额。"
        });
    }
});