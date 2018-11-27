var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        page_img: {
            bg: app.webRoot + "/statics/images/fxhb/bg.png",
            close: app.webRoot + "/statics/images/fxhb/close.png",
            hongbao_bg: app.webRoot + "/statics/images/fxhb/hongbao_bg.png",
            open_hongbao_btn: app.webRoot + "/statics/images/fxhb/open_hongbao_btn.png"
        }
    },
    onLoad: function(a) {
        var o = this;
        app.pageOnLoad(this, a), wx.showLoading({
            title: "加载中",
            mask: !0
        }), app.request({
            url: api.fxhb.open,
            success: function(a) {
                wx.hideLoading(), 0 == a.code && (a.data.hongbao_id ? wx.redirectTo({
                    url: "/pages/fxhb/detail/detail?id=" + a.data.hongbao_id
                }) : o.setData(a.data)), 1 == a.code && wx.showModal({
                    content: a.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    showRule: function() {
        this.setData({
            showRule: !0
        });
    },
    closeRule: function() {
        this.setData({
            showRule: !1
        });
    },
    openHongbao: function(a) {
        wx.showLoading({
            title: "抢红包中",
            mask: !0
        }), app.request({
            url: api.fxhb.open_submit,
            method: "post",
            data: {
                form_id: a.detail.formId
            },
            success: function(a) {
                0 == a.code ? wx.redirectTo({
                    url: "/pages/fxhb/detail/detail?id=" + a.data.hongbao_id
                }) : (wx.hideLoading(), wx.showModal({
                    content: a.msg,
                    showCancel: !1
                }));
            }
        });
    }
});