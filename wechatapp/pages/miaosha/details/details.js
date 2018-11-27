var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp(), WxParse = require("../../../wxParse/wxParse.js"), p = 1, is_loading_comment = !1, is_more_comment = !0, share_count = 0;

Page({
    data: {
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight - 20,
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1)), 
        this.setData({
            store: wx.getStorageSync("store")
        });
        var a = 0, o = t.user_id, e = decodeURIComponent(t.scene), i = 0;
        if (void 0 !== o) a = o; else if (i = 1, "undefined" == typeof my) {
            if (void 0 !== (e = decodeURIComponent(t.scene))) {
                var s = utils.scene_decode(e);
                s.uid && s.gid ? (a = s.uid, t.id = s.gid) : a = e;
            }
        } else if (null !== app.query) {
            var r = app.query;
            app.query = null, t.id = r.gid;
        }
        app.loginBindParent({
            parent_id: a
        });
        var n = this;
        n.setData({
            id: t.id,
            scene_type: i
        }), n.getGoods(), n.getCommentList();
    },
    getGoods: function() {
        var o = this;
        app.request({
            url: api.miaosha.details,
            data: {
                id: o.data.id,
                scene_type: o.data.scene_type
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.detail;
                    WxParse.wxParse("detail", "html", a, o), o.setData({
                        goods: t.data,
                        attr_group_list: t.data.attr_group_list,
                        miaosha_data: t.data.miaosha.miaosha_data
                    }), 1 == o.data.scene_type && o.setData({
                        id: t.data.miaosha.miaosha_goods_id
                    }), o.data.goods.miaosha && o.setMiaoshaTimeOver(), o.selectDefaultAttr();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(a) {
        var o = this;
        a && "active" != o.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0, 
        app.request({
            url: api.miaosha.comment_list,
            data: {
                goods_id: o.data.id,
                page: p
            },
            success: function(t) {
                0 == t.code && (is_loading_comment = !1, p++, o.setData({
                    comment_count: t.data.comment_count,
                    comment_list: a ? o.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (is_more_comment = !1));
            }
        }));
    },
    onGoodsImageClick: function(t) {
        var a = [], o = t.currentTarget.dataset.index;
        for (var e in this.data.goods.pic_list) a.push(this.data.goods.pic_list[e].pic_url);
        wx.previewImage({
            urls: a,
            current: a[o]
        });
    },
    numberSub: function() {
        var t = this.data.form.number;
        if (t <= 1) return !0;
        t--, this.setData({
            form: {
                number: t
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        if (++a > t.data.goods.miaosha.buy_max && 0 != t.data.goods.miaosha.buy_max) return wx.showToast({
            title: "一单限购" + t.data.goods.miaosha.buy_max + "件",
            image: "/images/icon-warning.png"
        }), !0;
        t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, o = t.detail.value;
        o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), o > a.data.goods.miaosha.buy_max && 0 != a.data.goods.miaosha.buy_max && (wx.showToast({
            title: "一单限购" + a.data.goods.miaosha.buy_max + "件",
            image: "/images/icon-warning.png"
        }), o = a.data.goods.miaosha.buy_max), a.setData({
            form: {
                number: o
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.goods.miaosha ? this.submit("BUY_NOW") : wx.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function(t) {}
        });
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.miaosha_data && 0 < a.data.miaosha_data.rest_num && a.data.form.number > a.data.miaosha_data.rest_num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (a.data.form.number > a.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var o = a.data.attr_group_list, e = [];
        for (var i in o) {
            var s = !1;
            for (var r in o[i].attr_list) if (o[i].attr_list[r].checked) {
                s = {
                    attr_id: o[i].attr_list[r].attr_id,
                    attr_name: o[i].attr_list[r].attr_name
                };
                break;
            }
            if (!s) return wx.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        "ADD_CART" == t && (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.id,
                attr: JSON.stringify(e),
                num: a.data.form.number
            },
            success: function(t) {
                wx.showToast({
                    title: t.msg,
                    duration: 1500
                }), wx.hideLoading(), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t && (a.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/miaosha/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.id,
                attr: e,
                num: a.data.form.number
            })
        }));
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    attrClick: function(t) {
        var o = this, a = t.target.dataset.groupId, e = t.target.dataset.id, i = o.data.attr_group_list;
        for (var s in i) if (i[s].attr_group_id == a) for (var r in i[s].attr_list) i[s].attr_list[r].attr_id == e ? i[s].attr_list[r].checked = !0 : i[s].attr_list[r].checked = !1;
        o.setData({
            attr_group_list: i
        });
        var n = [], d = !0;
        for (var s in i) {
            var c = !1;
            for (var r in i[s].attr_list) if (i[s].attr_list[r].checked) {
                n.push(i[s].attr_list[r].attr_id), c = !0;
                break;
            }
            if (!c) {
                d = !1;
                break;
            }
        }
        d && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.default.goods_attr_info,
            data: {
                goods_id: o.data.id,
                attr_list: JSON.stringify(n),
                type: "ms"
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = o.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, o.setData({
                        goods: a,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        }));
    },
    favoriteAdd: function() {
        var o = this;
        app.request({
            url: api.user.favorite_add,
            method: "post",
            data: {
                goods_id: o.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = o.data.goods;
                    a.is_favorite = 1, o.setData({
                        goods: a
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var o = this;
        app.request({
            url: api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: o.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = o.data.goods;
                    a.is_favorite = 0, o.setData({
                        goods: a
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        "detail" == t.currentTarget.dataset.tab ? this.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : this.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var a = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        wx.previewImage({
            current: this.data.comment_list[a].pic_list[o],
            urls: this.data.comment_list[a].pic_list
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var a = this, t = wx.getStorageSync("user_info");
        return {
            path: "/pages/miaosha/details/details?id=" + this.data.id + "&user_id=" + t.id,
            success: function(t) {
                1 == ++share_count && app.shareSendCoupon(a);
            },
            title: a.data.goods.name,
            imageUrl: a.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), wx.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), wx.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var a = this;
        if (a.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), a.data.goods_qrcode) return !0;
        app.request({
            url: api.miaosha.goods_qrcode,
            data: {
                goods_id: a.data.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
        var a = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), wx.downloadFile({
            url: a.data.goods_qrcode,
            success: function(t) {
                wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        wx.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(t) {
                        wx.hideLoading();
                    }
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "图片下载失败",
                    content: t.errMsg + ";" + a.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [ a ]
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        var a = this;
        function t() {
            var t = a.data.goods.miaosha.end_time - a.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, a.data.goods.miaosha.now_time++, a.setData({
                goods: a.data.goods,
                miaosha_end_time_over: function(t) {
                    var a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), e = t % 60, i = 0;
                    1 <= a && (a -= 1, i = 1);
                    return {
                        h: a < 10 ? "0" + a : "" + a,
                        m: o < 10 ? "0" + o : "" + o,
                        s: e < 10 ? "0" + e : "" + e,
                        type: i
                    };
                }(t)
            });
        }
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    }
});