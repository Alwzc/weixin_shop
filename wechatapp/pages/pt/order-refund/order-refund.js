var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, api = require("../../../api.js"), app = getApp();

Page({
    data: {
        switch_tab_1: "active",
        switch_tab_2: "",
        goods: {
            goods_pic: "https://goss1.vcg.com/creative/vcg/800/version23/VCG21f302700c4.jpg"
        },
        refund_data_1: {},
        refund_data_2: {}
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        app.request({
            url: api.group.order.refund_preview,
            data: {
                order_id: t.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    goods: t.data
                }), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    image: "/images/icon-warning.png",
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    switchTab: function(t) {
        1 == t.currentTarget.dataset.id ? this.setData({
            switch_tab_1: "active",
            switch_tab_2: ""
        }) : this.setData({
            switch_tab_1: "",
            switch_tab_2: "active"
        });
    },
    descInput: function(t) {
        var a = this, e = t.currentTarget.dataset.type, i = t.detail.value;
        if (1 == e) {
            var d = a.data.refund_data_1;
            d.desc = i, a.setData({
                refund_data_1: d
            });
        }
        if (2 == e) {
            var n = a.data.refund_data_2;
            n.desc = i, a.setData({
                refund_data_2: n
            });
        }
    },
    chooseImage: function(t) {
        var a = this, e = t.currentTarget.dataset.type;
        if (1 == e) {
            var i = a.data.refund_data_1, d = 0;
            i.pic_list && (d = i.pic_list.length || 0);
            var n = 6 - d;
            wx.chooseImage({
                count: n,
                success: function(t) {
                    i.pic_list || (i.pic_list = []), i.pic_list = i.pic_list.concat(t.tempFilePaths), 
                    a.setData({
                        refund_data_1: i
                    });
                }
            });
        }
        if (2 == e) {
            var s = a.data.refund_data_2;
            d = 0;
            s.pic_list && (d = s.pic_list.length || 0);
            n = 6 - d;
            wx.chooseImage({
                count: n,
                success: function(t) {
                    s.pic_list || (s.pic_list = []), s.pic_list = s.pic_list.concat(t.tempFilePaths), 
                    a.setData({
                        refund_data_2: s
                    });
                }
            });
        }
    },
    deleteImage: function(t) {
        var a = this, e = t.currentTarget.dataset.type, i = t.currentTarget.dataset.index;
        if (1 == e) {
            var d = a.data.refund_data_1;
            d.pic_list.splice(i, 1), a.setData({
                refund_data_1: d
            });
        }
        if (2 == e) {
            var n = a.data.refund_data_2;
            n.pic_list.splice(i, 1), a.setData({
                refund_data_2: n
            });
        }
    },
    refundSubmit: function(t) {
        var i = this, a = t.currentTarget.dataset.type;
        if (1 == a) {
            var e = function() {
                var e = function() {
                    wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), app.request({
                        url: api.group.order.refund,
                        method: "post",
                        data: {
                            type: 1,
                            order_detail_id: i.data.goods.order_detail_id,
                            desc: d,
                            pic_list: JSON.stringify(n)
                        },
                        success: function(t) {
                            wx.hideLoading(), 0 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.redirectTo({
                                        url: "/pages/pt/order/order?status=4"
                                    });
                                }
                            }), 1 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (d = i.data.refund_data_1.desc || "").length) return wx.showToast({
                    title: "请填写退款原因",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (n = [], s = 0, i.data.refund_data_1.pic_list && 0 < i.data.refund_data_1.pic_list.length) for (o in wx.showLoading({
                    title: "正在上传图片",
                    mask: !0
                }), i.data.refund_data_1.pic_list) !function(a) {
                    wx.uploadFile({
                        url: api.default.upload_image,
                        filePath: i.data.refund_data_1.pic_list[a],
                        name: "image",
                        success: function(t) {},
                        complete: function(t) {
                            s++, 200 == t.statusCode && 0 == (t = JSON.parse(t.data)).code && (n[a] = t.data.url), 
                            s == i.data.refund_data_1.pic_list.length && (wx.hideLoading(), e());
                        }
                    });
                }(o); else e();
            }();
            if ("object" === (void 0 === e ? "undefined" : _typeof(e))) return e.v;
        }
        if (2 == a) {
            var d, n, s, o, c = function() {
                var e = function() {
                    wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), app.request({
                        url: api.group.order.refund,
                        method: "post",
                        data: {
                            type: 2,
                            order_detail_id: i.data.goods.order_detail_id,
                            desc: d,
                            pic_list: JSON.stringify(n)
                        },
                        success: function(t) {
                            wx.hideLoading(), 0 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.redirectTo({
                                        url: "/pages/pt/order/order?status=4"
                                    });
                                }
                            }), 1 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (d = i.data.refund_data_2.desc || "").length) return wx.showToast({
                    title: "请填写换货说明",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (n = [], s = 0, i.data.refund_data_2.pic_list && 0 < i.data.refund_data_2.pic_list.length) for (o in wx.showLoading({
                    title: "正在上传图片",
                    mask: !0
                }), i.data.refund_data_2.pic_list) !function(a) {
                    wx.uploadFile({
                        url: api.default.upload_image,
                        filePath: i.data.refund_data_2.pic_list[a],
                        name: "image",
                        success: function(t) {},
                        complete: function(t) {
                            s++, 200 == t.statusCode && 0 == (t = JSON.parse(t.data)).code && (n[a] = t.data.url), 
                            s == i.data.refund_data_2.pic_list.length && (wx.hideLoading(), e());
                        }
                    });
                }(o); else e();
            }();
            if ("object" === (void 0 === c ? "undefined" : _typeof(c))) return c.v;
        }
    }
});