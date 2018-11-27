var api = require("../../api.js"), app = getApp(), is_loading = !1;

Page({
    data: {
        page: 1,
        show_qrcode: !1,
        status: 1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), t.status && this.setData({
            status: t.status
        }), this.loadData();
    },
    loadData: function() {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.user.card,
            data: {
                page: 1,
                status: a.data.status
            },
            success: function(t) {
                0 == t.code && a.setData(t.data);
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.data.page != this.data.page_count && this.loadMore();
    },
    loadMore: function() {
        var o = this;
        if (!is_loading) {
            is_loading = !0, wx.showLoading({
                title: "加载中"
            });
            var e = o.data.page;
            app.request({
                url: api.user.card,
                data: {
                    page: e + 1,
                    status: o.data.status
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = o.data.list.concat(t.data.list);
                        o.setData({
                            list: a,
                            page_count: t.data.page_count,
                            row_count: t.data.row_count,
                            page: e + 1
                        });
                    }
                },
                complete: function() {
                    is_loading = !1, wx.hideLoading();
                }
            });
        }
    },
    getQrcode: function(t) {
        var a = this, o = t.currentTarget.dataset.index, e = a.data.list[o];
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.user.card_qrcode,
            data: {
                user_card_id: e.id
            },
            success: function(t) {
                0 == t.code ? a.setData({
                    show_qrcode: !0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function() {
        this.setData({
            show_qrcode: !1
        });
    },
    goto: function(t) {
        var a = t.currentTarget.dataset.status;
        wx.redirectTo({
            url: "/pages/card/card?status=" + a
        });
    },
    save: function() {
        var a = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), wx.downloadFile({
            url: a.data.qrcode,
            success: function(t) {
                wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), a.saveImg(t);
            },
            fail: function(t) {
                wx.showModal({
                    title: "下载失败",
                    content: t.errMsg + ";" + a.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。"
        });
    },
    saveImg: function(t) {
        var o = this;
        wx.saveImageToPhotosAlbum({
            filePath: t.tempFilePath,
            success: function() {
                wx.showModal({
                    title: "提示",
                    content: "保存成功",
                    showCancel: !1
                });
            },
            fail: function(a) {
                wx.getSetting({
                    success: function(t) {
                        t.authSetting["scope.writePhotosAlbum"] || app.getauth({
                            content: "小程序需要授权保存到相册",
                            success: function(t) {
                                t && o.saveImg(a);
                            }
                        });
                    }
                });
            },
            complete: function(t) {
                wx.hideLoading();
            }
        });
    }
});