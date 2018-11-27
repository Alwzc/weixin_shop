var api = require("../../api.js"), utils = require("../../utils.js"), app = getApp(), WxParse = require("../../wxParse/wxParse.js"), p = 1, is_loading_comment = !1, is_more_comment = !0, share_count = 0;

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
            s: "--"
        },
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function(t) {
        var a = this;
        app.pageOnLoad(this, t), share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1));
        var o = t.quick;
        if (o) {
            var i = wx.getStorageSync("item");
            if (i) var s = i.total, e = i.carGoods; else s = {
                total_price: 0,
                total_num: 0
            }, e = [];
            a.setData({
                quick: o,
                quick_list: i.quick_list,
                total: s,
                carGoods: e,
                quick_hot_goods_lists: i.quick_hot_goods_lists
            });
        }
        this.setData({
            store: wx.getStorageSync("store")
        });
        var r = 0, d = t.user_id;
        if (void 0 !== d) r = d; else if ("undefined" == typeof my) {
            var n = decodeURIComponent(t.scene);
            if (void 0 !== n) {
                var c = utils.scene_decode(n);
                c.uid && c.gid ? (r = c.uid, t.id = c.gid) : r = n;
            }
        } else if (null !== app.query) {
            var u = app.query;
            app.query = null, t.id = u.gid, r = u.uid;
        }
        app.loginBindParent({
            parent_id: r
        }), a.setData({
            id: t.id
        }), a.getGoods(), a.getCommentList();
    },
    getCacheData: function() {
        var t = wx.getStorageSync("item");
        page.setData({
            total: t.total ? t.total : {
                total_num: 0,
                total_price: 0
            },
            carGoods: t.carGoods ? t.carGoods : [],
            quick_hot_goods_lists: t.quick_hot_goods_lists ? t.quick_hot_goods_lists : [],
            quick_list: t.quick_list ? t.quick_list : [],
            checked_attr: t.checked_attr
        });
    },
    getGoods: function() {
        var o = this;
        if (o.data.quick) {
            var t = o.data.carGoods;
            if (t) {
                for (var a = t.length, i = 0, s = 0; s < a; s++) t[s].goods_id == o.data.id && (i += parseInt(t[s].num));
                o.setData({
                    goods_num: i
                });
            }
        }
        app.request({
            url: api.default.goods,
            data: {
                id: o.data.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.detail;
                    WxParse.wxParse("detail", "html", a, o), o.setData({
                        goods: t.data,
                        attr_group_list: t.data.attr_group_list
                    }), o.goods_recommend({
                        goods_id: t.data.id,
                        reload: !0
                    }), o.data.goods.miaosha && o.setMiaoshaTimeOver(), o.selectDefaultAttr();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    goodsModel: function(t) {
        var a = this, o = (a.data.carGoods, a.data.goodsModel);
        o ? a.setData({
            goodsModel: !1
        }) : a.setData({
            goodsModel: !0
        });
    },
    hideGoodsModel: function() {
        this.setData({
            goodsModel: !1
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    jia: function(t) {
        var a = this, o = a.data.goods, i = a.data.quick_list;
        for (var s in i) for (var e in i[s].goods) if (parseInt(i[s].goods[e].id) === parseInt(o.id)) {
            var r = i[s].goods[e].num ? i[s].goods[e].num + 1 : 1;
            if (r > JSON.parse(i[s].goods[e].attr)[0].num) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void --r;
            i[s].goods[e].num = r;
            var d = a.data.carGoods, n = 1, c = o.price ? o.price : i[s].goods[e].price;
            for (var u in d) {
                if (parseInt(d[u].goods_id) === parseInt(o.id) && 1 === d[u].attr.length) {
                    n = 0, d[u].num = r, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
                if (d[u].price == parseFloat(t.currentTarget.dataset.price)) {
                    n = 0, d[u].num = d[u].num + 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
            }
            if (1 === n || 0 === d.length) {
                var _ = JSON.parse(i[s].goods[e].attr);
                d.push({
                    goods_id: parseInt(i[s].goods[e].id),
                    attr: _[0].attr_list,
                    goods_name: i[s].goods[e].name,
                    goods_price: c,
                    num: 1,
                    price: c
                });
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), a.updateGoodNum(), a.carStatistics(), a.quickHotStatistics();
    },
    jian: function(t) {
        var a = this, o = a.data.goods, i = a.data.quick_list;
        for (var s in i) for (var e in i[s].goods) if (parseInt(i[s].goods[e].id) === parseInt(o.id)) {
            var r = 0 < i[s].goods[e].num ? i[s].goods[e].num - 1 : i[s].goods[e].num;
            i[s].goods[e].num = r;
            var d = a.data.carGoods;
            for (var n in d) {
                o.price ? o.price : i[s].goods[e].price;
                if (parseInt(d[n].goods_id) === parseInt(o.id) && 1 === d[n].attr.length) {
                    0, d[n].num = r, d[n].goods_price = (d[n].num * d[n].price).toFixed(2);
                    break;
                }
                if (d[n].price == parseFloat(t.currentTarget.dataset.price)) {
                    0 < d[n].num && (d[n].num = d[n].num - 1, d[n].goods_price = (d[n].num * d[n].price).toFixed(2));
                    break;
                }
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), a.updateGoodNum(), a.carStatistics(), a.quickHotStatistics();
    },
    carStatistics: function() {
        var t = this.data.carGoods, a = 0, o = 0;
        for (var i in t) a += t[i].num, o = parseFloat(o) + parseFloat(t[i].goods_price);
        var s = {
            total_num: a,
            total_price: o
        };
        0 === a && this.hideGoodsModel(), this.setData({
            total: s
        });
    },
    quickHotStatistics: function() {
        var t = this.data.quick_hot_goods_lists, a = this.data.quick_list;
        for (var o in t) for (var i in a) for (var s in a[i].goods) parseInt(a[i].goods[s].id) === parseInt(t[o].id) && (t[o].num = a[i].goods[s].num);
        this.setData({
            quick_hot_goods_lists: t
        });
    },
    tianjia: function(t) {
        this.jia(t);
    },
    jianshao: function(t) {
        this.jian(t);
    },
    showDialogBtn: function() {
        var a = this, t = a.data.goods;
        app.request({
            url: api.default.goods,
            data: {
                id: t.id
            },
            success: function(t) {
                0 == t.code && (a.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), a.resetData(), a.updateData());
            }
        });
    },
    resetData: function() {
        this.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            temporaryGood: {
                price: "0.00"
            }
        });
    },
    updateData: function() {
        var t = this.data.currentGood, a = this.data.carGoods, o = JSON.parse(t.attr), i = t.attr_group_list;
        for (var s in o) {
            var e = [];
            for (var r in o[s].attr_list) e.push([ o[s].attr_list[r].attr_id, t.id ]);
            for (var d in a) {
                var n = [];
                for (var c in a[d].attr) n.push([ a[d].attr[c].attr_id, a[d].goods_id ]);
                if (e.sort().join() === n.sort().join()) {
                    for (var u in i) for (var _ in i[u].attr_list) for (var g in e) {
                        if (parseInt(i[u].attr_list[_].attr_id) === parseInt(e[g])) {
                            i[u].attr_list[_].checked = !0;
                            break;
                        }
                        i[u].attr_list[_].checked = !1;
                    }
                    var l = {
                        price: a[d].price
                    };
                    return void this.setData({
                        attr_group_list: i,
                        check_num: a[d].num,
                        check_goods_price: a[d].goods_price,
                        checked_attr: e,
                        temporaryGood: l
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var a = this.data.carGoods;
        for (var o in a) {
            var i = [];
            for (var s in a[o].attr) i.push([ a[o].attr[s].attr_id, a[o].goods_id ]);
            i.sort().join() === t.sort().join() && this.setData({
                check_num: a[o].num,
                check_goods_price: a[o].goods_price
            });
        }
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, i = t.target.dataset.id, s = a.data.attr_group_list, e = a.data.currentGood;
        for (var r in s) if (s[r].attr_group_id == o) for (var d in s[r].attr_list) s[r].attr_list[d].attr_id == i ? s[r].attr_list[d].checked = !0 : s[r].attr_list[d].checked = !1;
        var n = [];
        for (var r in s) for (var d in s[r].attr_list) !0 === s[r].attr_list[d].checked && n.push([ s[r].attr_list[d].attr_id, e.id ]);
        var c = JSON.parse(a.data.currentGood.attr), u = a.data.temporaryGood;
        for (var _ in c) {
            var g = [];
            for (var l in c[_].attr_list) g.push([ c[_].attr_list[l].attr_id, e.id ]);
            if (g.sort().join() === n.sort().join()) {
                if (0 === parseInt(c[_].num)) return void wx.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                });
                u = parseFloat(c[_].price) ? {
                    price: c[_].price.toFixed(2)
                } : {
                    price: e.price.toFixed(2)
                };
            }
        }
        a.resetData(), a.checkUpdateData(n), a.setData({
            attr_group_list: s,
            temporaryGood: u,
            checked_attr: n
        });
    },
    onConfirm: function(t) {
        var a = this, o = a.data.attr_group_list, i = a.data.checked_attr, s = a.data.currentGood;
        if (i.length === o.length) {
            var e = a.data.check_num ? a.data.check_num + 1 : 1, r = JSON.parse(s.attr);
            for (var d in r) {
                var n = [];
                for (var c in r[d].attr_list) if (n.push([ r[d].attr_list[c].attr_id, s.id ]), n.sort().join() === i.sort().join()) {
                    var u = r[d].price ? r[d].price : s.price, _ = r[d].attr_list;
                    if (e > r[d].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var g = a.data.carGoods, l = 1, m = (parseFloat(u) * e).toFixed(2);
            for (var h in g) {
                var p = [];
                for (var f in g[h].attr) p.push([ g[h].attr[f].attr_id, g[h].goods_id ]);
                if (p.sort().join() === i.sort().join()) {
                    l = 0, g[h].num = g[h].num + 1, g[h].goods_price = (parseFloat(u) * g[h].num).toFixed(2);
                    break;
                }
            }
            1 !== l && 0 !== g.length || g.push({
                goods_id: s.id,
                attr: _,
                goods_name: s.name,
                goods_price: u,
                num: 1,
                price: u
            }), a.setData({
                carGoods: g,
                check_goods_price: m,
                check_num: e
            }), a.carStatistics(), a.attrGoodStatistics(), a.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var a = this, o = a.data.checked_attr, i = a.data.carGoods, s = a.data.check_num ? --a.data.check_num : 1;
        a.data.currentGood;
        for (var e in i) {
            var r = [];
            for (var d in i[e].attr) r.push([ i[e].attr[d].attr_id, i[e].goods_id ]);
            if (r.sort().join() === o.sort().join()) return 0 < i[e].num && (i[e].num -= 1, 
            i[e].goods_price = (i[e].num * parseFloat(i[e].price)).toFixed(2)), a.setData({
                carGoods: i,
                check_goods_price: i[e].goods_price,
                check_num: s
            }), a.carStatistics(), a.attrGoodStatistics(), void a.updateGoodNum();
        }
    },
    attrGoodStatistics: function() {
        var t = this, a = t.data.currentGood, o = t.data.carGoods, i = t.data.quick_list, s = t.data.quick_hot_goods_lists, e = 0;
        for (var r in o) o[r].goods_id === a.id && (e += o[r].num);
        for (var r in i) for (var d in i[r].goods) parseInt(i[r].goods[d].id) === a.id && (i[r].goods[d].num = e);
        for (var r in s) parseInt(s[r].id) === a.id && (s[r].num = e);
        t.setData({
            quick_list: i,
            quick_hot_goods_lists: s
        });
    },
    updateGoodNum: function() {
        var t = this.data.quick_list, a = this.data.goods;
        for (var o in t) for (var i in t[o].goods) if (parseInt(t[o].goods[i].id) === parseInt(a.id)) {
            var s = t[o].goods[i].num, e = t[o].goods[i].num;
            this.setData({
                goods_num: e,
                goodNumCount: s
            });
            break;
        }
    },
    clearCar: function(t) {
        var a = this.data.quick_hot_goods_lists, o = this.data.quick_list;
        for (var i in a) for (var s in a[i]) a[i].num = 0;
        for (var e in o) for (var r in o[e].goods) o[e].goods[r].num = 0;
        this.setData({
            goodsModel: !1,
            carGoods: [],
            total: {
                total_num: 0,
                total_price: 0
            },
            check_num: 0,
            quick_hot_goods_lists: a,
            quick_list: o,
            currentGood: [],
            checked_attr: [],
            check_goods_price: 0,
            temporaryGood: {},
            goods_num: 0,
            goodNumCount: 0
        }), wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this.data.carGoods;
        this.data.goodsModel;
        this.setData({
            goodsModel: !1
        });
        for (var o = a.length, i = [], s = [], e = 0; e < o; e++) 0 != a[e].num && (s = {
            goods_id: a[e].goods_id,
            num: a[e].num,
            attr: a[e].attr
        }, i.push(s));
        var r = [];
        r.push({
            mch_id: 0,
            goods_list: i
        }), wx.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(r)
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
            url: api.default.comment_list,
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
        for (var i in this.data.goods.pic_list) a.push(this.data.goods.pic_list[i].pic_url);
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
        var t = this.data.form.number;
        t++, this.setData({
            form: {
                number: t
            }
        });
    },
    numberBlur: function(t) {
        var a = t.detail.value;
        a = parseInt(a), isNaN(a) && (a = 1), a <= 0 && (a = 1), this.setData({
            form: {
                number: a
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.submit("BUY_NOW");
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
        var o = a.data.attr_group_list, i = [];
        for (var s in o) {
            var e = !1;
            for (var r in o[s].attr_list) if (o[s].attr_list[r].checked) {
                e = {
                    attr_id: o[s].attr_list[r].attr_id,
                    attr_name: o[s].attr_list[r].attr_name
                };
                break;
            }
            if (!e) return wx.showToast({
                title: "请选择" + o[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            i.push({
                attr_group_id: o[s].attr_group_id,
                attr_group_name: o[s].attr_group_name,
                attr_id: e.attr_id,
                attr_name: e.attr_name
            });
        }
        if ("ADD_CART" == t && (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.id,
                attr: JSON.stringify(i),
                num: a.data.form.number
            },
            success: function(t) {
                wx.hideLoading(), wx.showToast({
                    title: t.msg,
                    duration: 1500
                }), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t) {
            a.setData({
                show_attr_picker: !1
            });
            var d = [];
            d.push({
                goods_id: a.data.id,
                num: a.data.form.number,
                attr: i
            });
            var n = a.data.goods, c = 0;
            null != n.mch && (c = n.mch.id);
            var u = [];
            u.push({
                mch_id: c,
                goods_list: d
            }), wx.redirectTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(u)
            });
        }
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
    onShow: function() {
        var t = wx.getStorageSync("item");
        if (t) var a = t.total, o = t.carGoods, i = this.data.goods_num; else a = {
            total_price: 0,
            total_num: 0
        }, o = [], i = 0;
        this.setData({
            total: a,
            carGoods: o,
            goods_num: i
        });
    },
    onHide: function() {
        app.pageOnHide(this);
        var t = {
            quick_list: this.data.quick_list,
            carGoods: this.data.carGoods,
            total: this.data.total,
            quick_hot_goods_lists: [],
            checked_attr: this.data.checked_attr
        };
        wx.setStorageSync("item", t);
    },
    onUnload: function() {
        app.pageOnUnload(this);
        var t = {
            quick_list: this.data.quick_list,
            carGoods: this.data.carGoods,
            total: this.data.total,
            quick_hot_goods_lists: [],
            checked_attr: this.data.checked_attr
        };
        wx.setStorageSync("item", t);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var a = this, t = wx.getStorageSync("user_info");
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + t.id,
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
            url: api.default.goods_qrcode,
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
        var e = this;
        function t() {
            var t, a, o, i, s = e.data.goods.miaosha.end_time - e.data.goods.miaosha.now_time;
            s = s < 0 ? 0 : s, e.data.goods.miaosha.now_time++, e.setData({
                goods: e.data.goods,
                miaosha_end_time_over: (t = s, a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), 
                i = t % 60, {
                    h: a < 10 ? "0" + a : "" + a,
                    m: o < 10 ? "0" + o : "" + o,
                    s: i < 10 ? "0" + i : "" + i
                })
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
    },
    goods_recommend: function(o) {
        var i = this;
        i.setData({
            is_loading: !0
        });
        var s = i.data.page || 2;
        app.request({
            url: api.default.goods_recommend,
            data: {
                goods_id: o.goods_id,
                page: s
            },
            success: function(t) {
                if (0 == t.code) {
                    if (o.reload) var a = t.data.list;
                    if (o.loadmore) a = i.data.goods_list.concat(t.data.list);
                    i.data.drop = !0, i.setData({
                        goods_list: a
                    }), i.setData({
                        page: s + 1
                    });
                }
            },
            complete: function() {
                i.setData({
                    is_loading: !1
                });
            }
        });
    },
    attrGoodsClick: function(t) {
        var o = this, a = t.target.dataset.groupId, i = t.target.dataset.id, s = o.data.attr_group_list;
        for (var e in s) if (s[e].attr_group_id == a) for (var r in s[e].attr_list) s[e].attr_list[r].attr_id == i ? s[e].attr_list[r].checked = !0 : s[e].attr_list[r].checked = !1;
        o.setData({
            attr_group_list: s
        });
        var d = [], n = !0;
        for (var e in s) {
            var c = !1;
            for (var r in s[e].attr_list) if (s[e].attr_list[r].checked) {
                d.push(s[e].attr_list[r].attr_id), c = !0;
                break;
            }
            if (!c) {
                n = !1;
                break;
            }
        }
        n && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.default.goods_attr_info,
            data: {
                goods_id: o.data.goods.id,
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
    }
});