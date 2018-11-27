var _Page;

function _defineProperty(t, a, o) {
    return a in t ? Object.defineProperty(t, a, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = o, t;
}

var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp();

Page((_defineProperty(_Page = {
    data: {
        groupFail: 0,
        show_attr_picker: !1,
        form: {
            number: 1
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = 0, o = t.user_id, e = decodeURIComponent(t.scene);
        if (void 0 !== o) a = o; else if (void 0 !== e) {
            var i = utils.scene_decode(e);
            i.uid && i.oid ? (a = i.uid, t.oid = i.oid) : a = e;
        } else if ("undefined" != typeof my && null !== app.query) {
            var r = app.query;
            app.query = null, t.oid = r.oid, a = r.uid;
        }
        app.loginBindParent({
            parent_id: a
        }), this.setData({
            oid: t.oid
        }), this.getInfo(t);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        var a = this, o = wx.getStorageSync("user_info"), e = "/pages/pt/group/details?oid=" + a.data.oid + "&user_id=" + o.id;
        return {
            title: "快来" + a.data.goods.price + "元拼  " + a.data.goods.name,
            path: e,
            success: function(t) {}
        };
    },
    getInfo: function(t) {
        var a = t.oid, o = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.group_info,
            method: "get",
            data: {
                oid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    0 == t.data.groupFail && o.countDownRun(t.data.limit_time_ms);
                    var a = (t.data.goods.original_price - t.data.goods.price).toFixed(2);
                    o.setData({
                        goods: t.data.goods,
                        groupList: t.data.groupList,
                        surplus: t.data.surplus,
                        limit_time_ms: t.data.limit_time_ms,
                        goods_list: t.data.goodsList,
                        group_fail: t.data.groupFail,
                        oid: t.data.oid,
                        in_group: t.data.inGroup,
                        attr_group_list: t.data.attr_group_list,
                        group_rule_id: t.data.groupRuleId,
                        reduce_price: a < 0 ? 0 : a,
                        group_id: t.data.goods.class_group
                    }), 0 != t.data.groupFail && t.data.inGroup && o.setData({
                        oid: !1,
                        group_id: !1
                    }), o.selectDefaultAttr();
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/index/index"
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
        if (!t.data.goods || 0 === t.data.goods.use_attr) for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDownRun: function(r) {
        var s = this;
        setInterval(function() {
            var t = new Date(r[0], r[1] - 1, r[2], r[3], r[4], r[5]) - new Date(), a = parseInt(t / 1e3 / 60 / 60 / 24, 10), o = parseInt(t / 1e3 / 60 / 60 % 24, 10), e = parseInt(t / 1e3 / 60 % 60, 10), i = parseInt(t / 1e3 % 60, 10);
            a = s.checkTime(a), o = s.checkTime(o), e = s.checkTime(e), i = s.checkTime(i), 
            s.setData({
                limit_time: {
                    days: a,
                    hours: o,
                    mins: e,
                    secs: i
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = 0 < t ? t : 0) < 10 && (t = "0" + t), t;
    },
    goToHome: function() {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGoodsDetails: function(t) {
        wx.redirectTo({
            url: "/pages/pt/details/details?gid=" + this.data.goods.id
        });
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
        for (var r in i) if (i[r].attr_group_id == a) for (var s in i[r].attr_list) i[r].attr_list[s].attr_id == e ? i[r].attr_list[s].checked = !0 : i[r].attr_list[s].checked = !1;
        o.setData({
            attr_group_list: i
        });
        var d = [], n = !0;
        for (var r in i) {
            var u = !1;
            for (var s in i[r].attr_list) if (i[r].attr_list[s].checked) {
                d.push(i[r].attr_list[s].attr_id), u = !0;
                break;
            }
            if (!u) {
                n = !1;
                break;
            }
        }
        n && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.goods_attr_info,
            data: {
                goods_id: o.data.goods.id,
                group_id: o.data.goods.class_group,
                attr_list: JSON.stringify(d)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = o.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, o.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY_C");
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.form.number > a.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var o = a.data.attr_group_list, e = [];
        for (var i in o) {
            var r = !1;
            for (var s in o[i].attr_list) if (o[i].attr_list[s].checked) {
                r = {
                    attr_id: o[i].attr_list[s].attr_id,
                    attr_name: o[i].attr_list[s].attr_name
                };
                break;
            }
            if (!r) return wx.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: r.attr_id,
                attr_name: r.attr_name
            });
        }
        a.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.goods.id,
                attr: e,
                num: a.data.form.number,
                type: t,
                parent_id: a.data.oid,
                deliver_type: a.data.goods.type,
                group_id: a.data.goods.class_group
            })
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
        ++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit ? wx.showModal({
            title: "提示",
            content: "最多只允许购买" + t.data.goods.one_buy_limit + "件",
            showCancel: !1
        }) : t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, o = t.detail.value;
        if (o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), o > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit) return wx.showModal({
            title: "提示",
            content: "最多只允许购买" + a.data.goods.one_buy_limit + "件",
            showCancel: !1
        }), void a.setData({
            form: {
                number: o
            }
        });
        a.setData({
            form: {
                number: o
            }
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && wx.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    showShareModal: function(t) {
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
            url: api.group.order.goods_qrcode,
            data: {
                order_id: a.data.oid
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
}), _Page));