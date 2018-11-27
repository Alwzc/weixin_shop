var api = require("../../api.js"), app = getApp();

function min(a, e) {
    return a = parseFloat(a), (e = parseFloat(e)) < a ? e : a;
}

Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: -1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onReady: function() {},
    onShow: function() {
        var c = this, a = wx.getStorageSync("share_setting"), e = wx.getStorageSync("custom");
        c.setData({
            share_setting: a,
            custom: e
        }), app.request({
            url: api.share.get_price,
            success: function(a) {
                if (0 == a.code) {
                    var e = a.data.cash_last, t = "", i = "", n = "", s = "", o = c.data.selected;
                    e && (t = e.name, i = e.mobile, n = e.bank_name, s = e.type), c.setData({
                        price: a.data.price.price,
                        cash_max_day: a.data.cash_max_day,
                        pay_type: a.data.pay_type,
                        bank: a.data.bank,
                        remaining_sum: a.data.remaining_sum,
                        name: t,
                        mobile: i,
                        bank_name: n,
                        selected: o,
                        check: s
                    });
                }
            }
        });
    },
    onPullDownRefresh: function() {},
    formSubmit: function(a) {
        var e = this, t = parseFloat(parseFloat(a.detail.value.cash).toFixed(2)), i = e.data.price;
        if (-1 != e.data.cash_max_day && (i = min(i, e.data.cash_max_day)), t) if (i < t) wx.showToast({
            title: "提现金额不能超过" + i + "元",
            image: "/images/icon-warning.png"
        }); else if (t < parseFloat(e.data.share_setting.min_money)) wx.showToast({
            title: "提现金额不能低于" + e.data.share_setting.min_money + "元",
            image: "/images/icon-warning.png"
        }); else {
            var n = e.data.selected;
            if (0 == n || 1 == n || 2 == n || 3 == n) {
                if (0 == n || 1 == n || 2 == n) {
                    if (!(c = a.detail.value.name) || null == c) return void wx.showToast({
                        title: "姓名不能为空",
                        image: "/images/icon-warning.png"
                    });
                    if (!(o = a.detail.value.mobile) || null == o) return void wx.showToast({
                        title: "账号不能为空",
                        image: "/images/icon-warning.png"
                    });
                }
                if (2 == n) {
                    if (!(s = a.detail.value.bank_name) || null == s) return void wx.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    });
                } else var s = "";
                if (3 == n) {
                    s = "";
                    var o = "", c = "";
                }
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: api.share.apply,
                    method: "POST",
                    data: {
                        cash: t,
                        name: c,
                        mobile: o,
                        bank_name: s,
                        pay_type: n,
                        scene: "CASH",
                        form_id: a.detail.formId
                    },
                    success: function(e) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(a) {
                                a.confirm && 0 == e.code && wx.redirectTo({
                                    url: "/pages/cash-detail/cash-detail"
                                });
                            }
                        });
                    }
                });
            } else wx.showToast({
                title: "请选择提现方式",
                image: "/images/icon-warning.png"
            });
        } else wx.showToast({
            title: "请输入提现金额",
            image: "/images/icon-warning.png"
        });
    },
    showCashMaxDetail: function() {
        wx.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        });
    },
    select: function(a) {
        var e = a.currentTarget.dataset.index;
        e != this.data.check && this.setData({
            name: "",
            mobile: "",
            bank_name: ""
        }), this.setData({
            selected: e
        });
    }
});