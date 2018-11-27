var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var i = this;
        i.setData({
            order_id: t.id
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.miaosha.comment_preview,
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
                    for (var a in t.data.goods_list) t.data.goods_list[a].score = 3, t.data.goods_list[a].content = "", 
                    t.data.goods_list[a].pic_list = [], t.data.goods_list[a].uploaded_pic_list = [];
                    i.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.score, o = this.data.goods_list;
        o[a].score = i, this.setData({
            goods_list: o
        });
    },
    contentInput: function(t) {
        var a = this, i = t.currentTarget.dataset.index;
        a.data.goods_list[i].content = t.detail.value, a.setData({
            goods_list: a.data.goods_list
        });
    },
    chooseImage: function(t) {
        var a = this, i = t.currentTarget.dataset.index, o = a.data.goods_list, e = o[i].pic_list.length;
        wx.chooseImage({
            count: 6 - e,
            success: function(t) {
                o[i].pic_list = o[i].pic_list.concat(t.tempFilePaths), a.setData({
                    goods_list: o
                });
            }
        });
    },
    deleteImage: function(t) {
        var a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.picIndex, o = this.data.goods_list;
        o[a].pic_list.splice(i, 1), this.setData({
            goods_list: o
        });
    },
    commentSubmit: function(t) {
        var a = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = a.data.goods_list;
        !function o(e) {
            if (e == n.length) return void app.request({
                url: api.miaosha.comment,
                method: "post",
                data: {
                    order_id: a.data.order_id,
                    goods_list: JSON.stringify(n)
                },
                success: function(t) {
                    wx.hideLoading(), 0 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/miaosha/order/order?status=2"
                            });
                        }
                    }), 1 == t.code && wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
            var s = 0;
            if (!n[e].pic_list.length || 0 == n[e].pic_list.length) return o(e + 1);
            for (var t in n[e].pic_list) !function(i) {
                wx.uploadFile({
                    url: api.default.upload_image,
                    name: "image",
                    filePath: n[e].pic_list[i],
                    complete: function(t) {
                        if (t.data) {
                            var a = JSON.parse(t.data);
                            0 == a.code && (n[e].uploaded_pic_list[i] = a.data.url);
                        }
                        if (++s == n[e].pic_list.length) return o(e + 1);
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