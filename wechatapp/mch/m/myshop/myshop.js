var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        is_show: !1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.mch.user.myshop,
            success: function(a) {
                wx.hideLoading(), 0 == a.code && (0 === a.data.mch.is_open && wx.showModal({
                    title: "提示",
                    content: "\b店铺已被关闭！请联系管理员",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack();
                    }
                }), t.setData(a.data), t.setData({
                    is_show: !0
                })), 1 == a.code && wx.redirectTo({
                    url: "/mch/apply/apply"
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
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    navigatorSubmit: function(a) {
        app.request({
            url: api.user.save_form_id + "&form_id=" + a.detail.formId
        }), wx.navigateTo({
            url: a.detail.value.url
        });
    },
    showPcUrl: function() {
        this.setData({
            show_pc_url: !0
        });
    },
    hidePcUrl: function() {
        this.setData({
            show_pc_url: !1
        });
    },
    copyPcUrl: function() {
        var t = this;
        wx.setClipboardData({
            data: t.data.pc_url,
            success: function(a) {
                t.showToast({
                    title: "内容已复制"
                });
            }
        });
    }
});