var _Page;

function _defineProperty(t, a, o) {
    return a in t ? Object.defineProperty(t, a, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = o, t;
}

var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp(), WxParse = require("../../../wxParse/wxParse.js"), p = 1, is_loading_comment = !1, is_more_comment = !0;

Page((_defineProperty(_Page = {
    data: {
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = 0, o = t.user_id, e = decodeURIComponent(t.scene);
        if (void 0 !== o) a = o; else if (void 0 !== e) {
            var i = utils.scene_decode(e);
            i.uid && i.gid ? (a = i.uid, t.id = i.gid) : a = e;
        } else if (null !== app.query) {
            var s = app.query;
            app.query = null, t.id = s.gid, a = s.uid;
        }
        app.loginBindParent({
            parent_id: a
        }), this.setData({
            id: t.id
        }), p = 1, this.getGoodsInfo(t), this.getCommentList(!1);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("user_info");
        return {
            title: t.data.goods.name,
            path: "/pages/book/details/details?id=" + t.data.goods.id + "&user_id=" + a.id,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var a = t.id, e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.details,
            method: "get",
            data: {
                gid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.info.detail;
                    WxParse.wxParse("detail", "html", a, e);
                    var o = parseInt(t.data.info.virtual_sales) + parseInt(t.data.info.sales);
                    t.data.attr_group_list.length <= 0 && (t.data.attr_group_list = [ {
                        attr_group_name: "规格",
                        attr_list: [ {
                            attr_id: 0,
                            attr_name: "默认",
                            checked: !0
                        } ]
                    } ]), e.setData({
                        goods: t.data.info,
                        shop: t.data.shopList,
                        sales: o,
                        attr_group_list: t.data.attr_group_list
                    }), e.selectDefaultAttr();
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 == t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
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
    bespeakNow: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        for (var o = [], e = !0, i = a.data.attr_group_list, s = 0; s < i.length; s++) {
            var r = i[s].attr_list;
            e = !0;
            for (var n = 0; n < r.length; n++) r[n].checked && (o.push({
                attr_group_id: i[s].attr_group_id,
                attr_id: r[n].attr_id,
                attr_group_name: i[s].attr_group_name,
                attr_name: r[n].attr_name
            }), e = !1);
            if (e) return void wx.showModal({
                title: "提示",
                content: "请选择" + i[s].attr_group_name,
                showCancel: !1
            });
        }
        var c = [ {
            id: a.data.goods.id,
            attr: o
        } ];
        wx.redirectTo({
            url: "/pages/book/submit/submit?goods_info=" + JSON.stringify(c)
        });
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    attrGoodsClick: function(t) {
        var i = this, a = t.target.dataset.groupId, o = t.target.dataset.id, e = i.data.attr_group_list;
        for (var s in e) if (e[s].attr_group_id == a) for (var r in e[s].attr_list) e[s].attr_list[r].checked = e[s].attr_list[r].attr_id == o;
        i.setData({
            attr_group_list: e
        });
        var n = [], c = 0;
        for (s = 0; s < e.length; s++) {
            var d = e[s].attr_list;
            for (r = c = 0; r < d.length; r++) d[r].checked && (c = d[r].attr_id);
            if (!c) return;
            n.push(c);
        }
        var l = i.data.goods;
        l.attr.forEach(function(t, a, o) {
            var e = [];
            t.attr_list.forEach(function(t, a, o) {
                e.push(t.attr_id);
            }), n.sort().toString() == e.sort().toString() && (l.attr_pic = t.pic, l.stock = t.num, 
            l.price = t.price, i.setData({
                goods: l
            }));
        });
    },
    goToShopList: function(t) {
        wx.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    getCommentList: function(a) {
        var o = this;
        a && "active" != o.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0, 
        app.request({
            url: api.book.goods_comment,
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
            url: api.book.goods_qrcode,
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
    }
}, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), _defineProperty(_Page, "saveGoodsQrcode", function() {
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
}), _defineProperty(_Page, "goodsQrcodeClick", function(t) {
    var a = t.currentTarget.dataset.src;
    wx.previewImage({
        urls: [ a ]
    });
}), _defineProperty(_Page, "goHome", function(t) {
    wx.redirectTo({
        url: "/pages/book/index/index",
        success: function(t) {},
        fail: function(t) {},
        complete: function(t) {}
    });
}), _Page));