var _Page;

function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp(), WxParse = require("../../../wxParse/wxParse.js");

Page((_defineProperty(_Page = {
    data: {
        show_attr_picker: !1,
        form: {
            number: 1,
            pt_detail: !1
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = 0, e = t.user_id, i = decodeURIComponent(t.scene);
        if (void 0 !== e) a = e; else if (void 0 !== i) {
            var o = utils.scene_decode(i);
            o.uid && o.gid ? (a = o.uid, t.gid = o.gid) : a = i;
        } else if ("undefined" != typeof my && null !== app.query) {
            var r = app.query;
            app.query = null, t.id = r.gid;
        }
        app.loginBindParent({
            parent_id: a
        }), this.setData({
            id: t.gid,
            oid: t.oid,
            group_checked: t.group_id
        }), this.getGoodsInfo(t);
        var s = wx.getStorageSync("store");
        this.setData({
            store: s
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {
        wx.removeStorageSync("pt_group_detail");
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("user_info"), e = "/pages/pt/details/details?gid=" + t.data.goods.id + "&user_id=" + a.id;
        return {
            title: t.data.goods.name,
            path: e,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var a = t.gid, i = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), wx.showNavigationBarLoading(), app.request({
            url: api.group.details,
            method: "get",
            data: {
                gid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    i.countDownRun(t.data.info.limit_time_ms);
                    var a = t.data.info.detail;
                    WxParse.wxParse("detail", "html", a, i), wx.setNavigationBarTitle({
                        title: t.data.info.name
                    }), wx.hideNavigationBarLoading();
                    var e = (t.data.info.original_price - t.data.info.price).toFixed(2);
                    i.setData({
                        group_checked: i.data.group_checked ? i.data.group_checked : 0,
                        goods: t.data.info,
                        attr_group_list: t.data.attr_group_list,
                        attr_group_num: t.data.attr_group_num,
                        limit_time: t.data.limit_time_res,
                        group_list: t.data.groupList,
                        group_num: t.data.groupList.length,
                        group_rule_id: t.data.groupRuleId,
                        comment: t.data.comment,
                        comment_num: t.data.commentNum,
                        reduce_price: e < 0 ? 0 : e
                    }), i.countDown(), i.selectDefaultAttr();
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
    more: function() {
        this.setData({
            pt_detail: !0
        });
    },
    end_more: function() {
        this.setData({
            pt_detail: !1
        });
    },
    previewImage: function(t) {
        var a = t.currentTarget.dataset.url;
        wx.previewImage({
            urls: [ a ]
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (!t.data.goods || "0" === t.data.goods.use_attr) for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDown: function(t) {},
    countDownRun: function(r) {
        var s = this;
        setInterval(function() {
            var t = new Date(r[0], r[1] - 1, r[2], r[3], r[4], r[5]) - new Date(), a = parseInt(t / 1e3 / 60 / 60 / 24, 10), e = parseInt(t / 1e3 / 60 / 60 % 24, 10), i = parseInt(t / 1e3 / 60 % 60, 10), o = parseInt(t / 1e3 % 60, 10);
            a = s.checkTime(a), e = s.checkTime(e), i = s.checkTime(i), o = s.checkTime(o), 
            s.setData({
                limit_time: {
                    days: a < 0 ? "00" : a,
                    hours: e < 0 ? "00" : e,
                    mins: i < 0 ? "00" : i,
                    secs: o < 0 ? "00" : o
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return t < 0 ? "00" : (t < 10 && (t = "0" + t), t);
    },
    goHome: function(t) {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGroup: function(t) {
        wx.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    goToComment: function(t) {
        wx.navigateTo({
            url: "/pages/pt/comment/comment?id=" + this.data.goods.id
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && wx.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
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
    groupCheck: function() {
        var e = this, t = e.data.attr_group_num, a = e.data.attr_group_num.attr_list;
        for (var i in a) a[i].checked = !1;
        t.attr_list = a;
        e.data.goods;
        e.setData({
            group_checked: 0,
            attr_group_num: t
        });
        var o = e.data.attr_group_list, r = [], s = !0;
        for (var i in o) {
            var n = !1;
            for (var d in o[i].attr_list) if (o[i].attr_list[d].checked) {
                r.push(o[i].attr_list[d].attr_id), n = !0;
                break;
            }
            if (!n) {
                s = !1;
                break;
            }
        }
        s && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.group_checked,
                attr_list: JSON.stringify(r)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    e.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    attrNumClick: function(t) {
        var e = this, a = t.target.dataset.id, i = e.data.attr_group_num, o = i.attr_list;
        for (var r in o) o[r].id == a ? o[r].checked = !0 : o[r].checked = !1;
        i.attr_list = o, e.setData({
            attr_group_num: i,
            group_checked: a
        });
        var s = e.data.attr_group_list, n = [], d = !0;
        for (var r in s) {
            var c = !1;
            for (var u in s[r].attr_list) if (s[r].attr_list[u].checked) {
                n.push(s[r].attr_list[u].attr_id), c = !0;
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
            url: api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    e.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    attrClick: function(t) {
        var e = this, a = t.target.dataset.groupId, i = t.target.dataset.id, o = e.data.attr_group_list;
        for (var r in o) if (o[r].attr_group_id == a) for (var s in o[r].attr_list) o[r].attr_list[s].attr_id == i ? o[r].attr_list[s].checked = !0 : o[r].attr_list[s].checked = !1;
        e.setData({
            attr_group_list: o
        });
        var n = [], d = !0;
        for (var r in o) {
            var c = !1;
            for (var s in o[r].attr_list) if (o[r].attr_list[s].checked) {
                n.push(o[r].attr_list[s].attr_id), c = !0;
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
            url: api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    e.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY", this.data.group_checked);
    },
    onlyBuy: function() {
        this.submit("ONLY_BUY", 0);
    },
    submit: function(t, a) {
        var e = this, i = "GROUP_BUY" == t;
        if (!e.data.show_attr_picker || i != e.data.groupNum) return e.setData({
            show_attr_picker: !0,
            groupNum: i
        }), !0;
        if (e.data.form.number > e.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var o = e.data.attr_group_list, r = [];
        for (var s in o) {
            var n = !1;
            for (var d in o[s].attr_list) if (o[s].attr_list[d].checked) {
                n = {
                    attr_id: o[s].attr_list[d].attr_id,
                    attr_name: o[s].attr_list[d].attr_name
                };
                break;
            }
            if (!n) return wx.showToast({
                title: "请选择" + o[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: o[s].attr_group_id,
                attr_group_name: o[s].attr_group_name,
                attr_id: n.attr_id,
                attr_name: n.attr_name
            });
        }
        e.setData({
            show_attr_picker: !1
        });
        var c = 0;
        e.data.oid && (t = "GROUP_BUY_C", c = e.data.oid), wx.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: e.data.goods.id,
                attr: r,
                num: e.data.form.number,
                type: t,
                deliver_type: e.data.goods.type,
                group_id: a,
                parent_id: c
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
        var t = this.data.form.number;
        ++t > this.data.goods.one_buy_limit && 0 != this.data.goods.one_buy_limit ? wx.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }) : this.setData({
            form: {
                number: t
            }
        });
    },
    numberBlur: function(t) {
        var a = t.detail.value;
        a = parseInt(a), isNaN(a) && (a = 1), a <= 0 && (a = 1), a > this.data.goods.one_buy_limit && 0 != this.data.goods.one_buy_limit && (wx.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), a = this.data.goods.one_buy_limit), this.setData({
            form: {
                number: a
            }
        });
    }
}, "countDown", function() {
    var n = this;
    setInterval(function() {
        var t = n.data.group_list;
        for (var a in t) {
            var e = new Date(t[a].limit_time_ms[0], t[a].limit_time_ms[1] - 1, t[a].limit_time_ms[2], t[a].limit_time_ms[3], t[a].limit_time_ms[4], t[a].limit_time_ms[5]) - new Date(), i = parseInt(e / 1e3 / 60 / 60 / 24, 10), o = parseInt(e / 1e3 / 60 / 60 % 24, 10), r = parseInt(e / 1e3 / 60 % 60, 10), s = parseInt(e / 1e3 % 60, 10);
            i = n.checkTime(i), o = n.checkTime(o), r = n.checkTime(r), s = n.checkTime(s), 
            t[a].limit_time = {
                days: i,
                hours: 0 < o ? o : "00",
                mins: 0 < r ? r : "00",
                secs: 0 < s ? s : "00"
            }, n.setData({
                group_list: t
            });
        }
    }, 1e3);
}), _defineProperty(_Page, "bigToImage", function(t) {
    var a = this.data.comment[t.target.dataset.index].pic_list;
    wx.previewImage({
        current: t.target.dataset.url,
        urls: a
    });
}), _defineProperty(_Page, "showShareModal", function() {
    this.setData({
        share_modal_active: "active",
        no_scroll: !0
    });
}), _defineProperty(_Page, "shareModalClose", function() {
    this.setData({
        share_modal_active: "",
        no_scroll: !1
    });
}), _defineProperty(_Page, "getGoodsQrcode", function() {
    var a = this;
    if (a.setData({
        goods_qrcode_active: "active",
        share_modal_active: ""
    }), a.data.goods_qrcode) return !0;
    app.request({
        url: api.group.goods_qrcode,
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
}), _defineProperty(_Page, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), _defineProperty(_Page, "goodsQrcodeClose", function() {
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
}), _defineProperty(_Page, "to_dial", function() {
    var t = this.data.store.contact_tel;
    wx.makePhoneCall({
        phoneNumber: t
    });
}), _Page));