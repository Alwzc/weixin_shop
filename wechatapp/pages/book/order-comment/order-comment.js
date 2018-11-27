var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        a.setData({
            order_id: t.id
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.comment_preview,
            data: {
                order_id: t.id
            },
            success: function(t) {
                if (wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code) {
                    for (var o in t.data.goods_list) t.data.goods_list[o].score = 3, t.data.goods_list[o].content = "", 
                    t.data.goods_list[o].pic_list = [], t.data.goods_list[o].uploaded_pic_list = [];
                    a.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.score, i = this.data.goods_list;
        i[o].score = a, this.setData({
            goods_list: i
        });
    },
    contentInput: function(t) {
        var o = this, a = t.currentTarget.dataset.index;
        o.data.goods_list[a].content = t.detail.value, o.setData({
            goods_list: o.data.goods_list
        });
    },
    chooseImage: function(t) {
        var o = this, a = t.currentTarget.dataset.index, i = o.data.goods_list, e = i[a].pic_list.length;
        wx.chooseImage({
            count: 6 - e,
            success: function(t) {
                i[a].pic_list = i[a].pic_list.concat(t.tempFilePaths), o.setData({
                    goods_list: i
                });
            }
        });
    },
    deleteImage: function(t) {
        var o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex, i = this.data.goods_list;
        i[o].pic_list.splice(a, 1), this.setData({
            goods_list: i
        });
    },
    commentSubmit: function(t) {
        var o = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = o.data.goods_list;
        !function i(e) {
            if (e == n.length) return void app.request({
                url: api.book.submit_comment,
                method: "post",
                data: {
                    order_id: o.data.order_id,
                    goods_list: JSON.stringify(n)
                },
                success: function(t) {
                    wx.hideLoading(), 0 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/book/order/order?status=2"
                            });
                        }
                    }), 1 == t.code && wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
            var s = 0;
            if (!n[e].pic_list.length || 0 == n[e].pic_list.length) return i(e + 1);
            for (var t in n[e].pic_list) !function(a) {
                wx.uploadFile({
                    url: api.default.upload_image,
                    name: "image",
                    filePath: n[e].pic_list[a],
                    complete: function(t) {
                        if (t.data) {
                            var o = JSON.parse(t.data);
                            0 == o.code && (n[e].uploaded_pic_list[a] = o.data.url);
                        }
                        if (++s == n[e].pic_list.length) return i(e + 1);
                    }
                });
            }(t);
        }(0);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});