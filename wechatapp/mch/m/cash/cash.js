var api = require("../../../api.js"), app = getApp();

function min(a, e) {
    return a = parseFloat(a), (e = parseFloat(e)) < a ? e : a;
}

Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: 0
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var i = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.mch.user.cash_preview,
            success: function(a) {
                if (0 == a.code) {
                    var e = {};
                    e.price = a.data.money, e.type_list = a.data.type_list, i.setData(e);
                }
            },
            complete: function(a) {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
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
    },
    formSubmit: function(a) {
        var e = this, i = parseFloat(parseFloat(a.detail.value.cash).toFixed(2)), t = e.data.price;
        if (i) if (t < i) wx.showToast({
            title: "提现金额不能超过" + t + "元",
            image: "/images/icon-warning.png"
        }); else if (i < 1) wx.showToast({
            title: "提现金额不能低于1元",
            image: "/images/icon-warning.png"
        }); else {
            var n = e.data.selected;
            if (0 == n || 1 == n || 2 == n || 3 == n || 4 == n) {
                if ("my" == e.data.__platform && 0 == n && (n = 2), 1 == n || 2 == n || 3 == n) {
                    if (!(c = a.detail.value.name) || null == c) return void wx.showToast({
                        title: "姓名不能为空",
                        image: "/images/icon-warning.png"
                    });
                    if (!(s = a.detail.value.mobile) || null == s) return void wx.showToast({
                        title: "账号不能为空",
                        image: "/images/icon-warning.png"
                    });
                }
                if (3 == n) {
                    if (!(o = a.detail.value.bank_name) || null == o) return void wx.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    });
                } else var o = "";
                if (4 == n || 0 == n) {
                    o = "";
                    var s = "", c = "";
                }
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: api.mch.user.cash,
                    method: "POST",
                    data: {
                        cash_val: i,
                        nickname: c,
                        account: s,
                        bank_name: o,
                        type: n,
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
                                    url: "/mch/m/cash-log/cash-log"
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
    }
});