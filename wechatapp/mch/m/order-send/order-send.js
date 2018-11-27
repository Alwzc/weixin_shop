var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        order: {}
    },
    onLoad: function(e) {
        app.pageOnLoad(this, e);
        var a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.mch.order.detail,
            data: {
                id: e.id
            },
            success: function(e) {
                0 == e.code ? a.setData({
                    order: e.data.order
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.navigateBack();
                    }
                });
            },
            complete: function() {
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    expressChange: function(e) {
        var a = this;
        a.data.order.default_express = a.data.order.express_list[e.detail.value].express, 
        a.setData({
            order: a.data.order
        });
    },
    expressInput: function(e) {
        this.data.order.default_express = e.detail.value;
    },
    expressNoInput: function(e) {
        this.data.order.express_no = e.detail.value;
    },
    wordsInput: function(e) {
        this.data.order.words = e.detail.value;
    },
    formSubmit: function(e) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.mch.order.send,
            method: "post",
            data: {
                send_type: "express",
                order_id: this.data.order.id,
                express: e.detail.value.express,
                express_no: e.detail.value.express_no,
                words: e.detail.value.words
            },
            success: function(a) {
                wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && 0 == a.code && wx.navigateBack();
                    }
                });
            },
            complete: function(e) {
                wx.hideLoading();
            }
        });
    }
});