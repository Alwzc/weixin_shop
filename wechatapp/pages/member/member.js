var api = require("../../api.js"), app = getApp();

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}

Page({
    data: {
        list: ""
    },
    onLoad: function(e) {
        var t = this;
        app.pageOnLoad(t, e), t.setData({
            my: "undefined" != typeof my
        }), wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.user.member,
            method: "POST",
            success: function(e) {
                wx.hideLoading(), 0 == e.code && (t.setData(e.data), t.setData({
                    current_key: 0
                }), e.data.next_level && t.setData({
                    buy_price: e.data.next_level.price
                }));
            }
        });
    },
    onReady: function() {},
    showDialogBtn: function() {
        this.setData({
            showModal: !0
        });
    },
    preventTouchMove: function() {},
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    onCancel: function() {
        this.hideModal();
    },
    onShow: function() {},
    pay: function(e) {
        var t = e.currentTarget.dataset.key, a = this.data.list[t].id, n = e.currentTarget.dataset.payment;
        this.hideModal(), app.request({
            url: api.user.submit_member,
            data: {
                level_id: a,
                pay_type: n
            },
            method: "POST",
            success: function(e) {
                if (0 == e.code) {
                    if (setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3), "WECHAT_PAY" == n) return setOnShowScene("pay"), void wx.requestPayment({
                        _res: e,
                        timeStamp: e.data.timeStamp,
                        nonceStr: e.data.nonceStr,
                        package: e.data.package,
                        signType: e.data.signType,
                        paySign: e.data.paySign,
                        complete: function(e) {
                            "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" == e.errMsg && wx.showModal({
                                title: "提示",
                                content: "充值成功",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(e) {
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                }
                            }) : wx.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认"
                            });
                        }
                    });
                    "BALANCE_PAY" == n && wx.showModal({
                        title: "提示",
                        content: "充值成功",
                        showCancel: !1,
                        confirmText: "确认",
                        success: function(e) {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                } else wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                }), wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    changeTabs: function(e) {
        if ("undefined" == typeof my) var t = e.detail.currentItemId; else t = this.data.list[e.detail.current].id;
        for (var a = e.detail.current, n = parseFloat(this.data.next_level.price), o = this.data.list, i = 0; i < a; i++) n += parseFloat(o[i + 1].price);
        this.setData({
            current_id: t,
            current_key: a,
            buy_price: parseFloat(n)
        });
    }
});