var api = require("../../api.js"), app = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var i = this;
        if (t.inId) var a = {
            order_id: t.inId,
            type: "IN"
        }; else a = {
            order_id: t.id,
            type: "mall"
        };
        i.setData({
            order_id: a.order_id,
            type: a.type
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.order.comment_preview,
            data: a,
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
        var a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.score, e = this.data.goods_list;
        e[a].score = i, this.setData({
            goods_list: e
        });
    },
    contentInput: function(t) {
        var a = this, i = t.currentTarget.dataset.index;
        a.data.goods_list[i].content = t.detail.value, a.setData({
            goods_list: a.data.goods_list
        });
    },
    chooseImage: function(t) {
        var a = this, i = t.currentTarget.dataset.index, e = a.data.goods_list, o = e[i].pic_list.length;
        wx.chooseImage({
            count: 6 - o,
            success: function(t) {
                e[i].pic_list = e[i].pic_list.concat(t.tempFilePaths), a.setData({
                    goods_list: e
                });
            }
        });
    },
    deleteImage: function(t) {
        var a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.picIndex, e = this.data.goods_list;
        e[a].pic_list.splice(i, 1), this.setData({
            goods_list: e
        });
    },
    commentSubmit: function(t) {
        var a = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = a.data.goods_list, i = app.siteInfo, d = {};
        -1 != i.uniacid && "-1" != i.acid && (d._uniacid = i.uniacid, d._acid = i.acid), 
        function e(o) {
            if (o == n.length) return void app.request({
                url: api.order.comment,
                method: "post",
                data: {
                    order_id: a.data.order_id,
                    goods_list: JSON.stringify(n),
                    type: a.data.type
                },
                success: function(a) {
                    wx.hideLoading(), 0 == a.code && wx.showModal({
                        title: "提示",
                        content: a.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && ("IN" == a.type ? wx.redirectTo({
                                url: "/pages/integral-mall/order/order?status=3"
                            }) : wx.redirectTo({
                                url: "/pages/order/order?status=3"
                            }));
                        }
                    }), 1 == a.code && wx.showToast({
                        title: a.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
            var s = 0;
            if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return e(o + 1);
            for (var t in n[o].pic_list) !function(i) {
                wx.uploadFile({
                    url: api.default.upload_image,
                    name: "image",
                    formData: d,
                    filePath: n[o].pic_list[i],
                    complete: function(t) {
                        if (t.data) {
                            var a = JSON.parse(t.data);
                            0 == a.code && (n[o].uploaded_pic_list[i] = a.data.url);
                        }
                        if (++s == n[o].pic_list.length) return e(o + 1);
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