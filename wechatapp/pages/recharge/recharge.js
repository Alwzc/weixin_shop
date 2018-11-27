var api = require("../../api.js"), app = getApp();

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}

Page({
    data: {
        selected: -1
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.recharge.list,
            success: function(e) {
                var a = e.data;
                a.balance && 0 != a.balance.status || wx.showModal({
                    title: "提示",
                    content: "充值功能未开启，请联系管理员！",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                }), t.setData(e.data);
            },
            complete: function(e) {
                wx.hideLoading();
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
    click: function(e) {
        this.setData({
            selected: e.currentTarget.dataset.index
        });
    },
    pay: function(e) {
        var a = this, t = {}, n = a.data.selected;
        if (-1 == n) {
            var i = a.data.money;
            if (i < .01) return void wx.showModal({
                title: "提示",
                content: "充值金额不能小于0.01",
                showCancel: !1
            });
            t.pay_price = i, t.send_price = 0;
        } else {
            var o = a.data.list;
            t.pay_price = o[n].pay_price, t.send_price = o[n].send_price;
        }
        t.pay_price ? (t.pay_type = "WECHAT_PAY", wx.showLoading({
            title: "提交中"
        }), app.request({
            url: api.recharge.submit,
            data: t,
            method: "POST",
            success: function(e) {
                if (0 == e.code) return setTimeout(function() {
                    wx.hideLoading();
                }, 1e3), setOnShowScene("pay"), void wx.requestPayment({
                    _res: e,
                    timeStamp: e.data.timeStamp,
                    nonceStr: e.data.nonceStr,
                    package: e.data.package,
                    signType: e.data.signType,
                    paySign: e.data.paySign,
                    success: function(e) {},
                    fail: function(e) {},
                    complete: function(e) {
                        "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? wx.showModal({
                            title: "提示",
                            content: "充值成功",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.navigateBack({
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
                wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                }), wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "请选择充值金额",
            showCancel: !1
        });
    },
    input: function(e) {
        this.setData({
            money: e.detail.value
        });
    }
});