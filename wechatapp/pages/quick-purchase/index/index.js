var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), this.setData({
            store: wx.getStorageSync("store")
        });
    },
    onShow: function() {
        app.pageOnShow(this), this.loadData();
    },
    onHide: function() {
        app.pageOnHide(this);
        var t = this, a = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: t.data.quick_hot_goods_lists,
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", a);
    },
    onUnload: function() {
        app.pageOnUnload(this);
        var t = this, a = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: t.data.quick_hot_goods_lists,
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", a);
    },
    loadData: function(t) {
        var c = this, n = wx.getStorageSync("item");
        c.setData({
            total: void 0 !== n.total ? n.total : {
                total_num: 0,
                total_price: 0
            },
            carGoods: void 0 !== n.carGoods ? n.carGoods : []
        }), wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.quick.quick,
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.list, o = [], i = [];
                    for (var r in a) if (0 < a[r].goods.length) for (var s in i.push(a[r]), a[r].goods) {
                        var e = c.data.carGoods;
                        for (var d in e) n.carGoods[d].goods_id === parseInt(a[r].goods[s].id) && (a[r].goods[s].num = a[r].goods[s].num ? a[r].goods[s].num : 0, 
                        a[r].goods[s].num += n.carGoods[d].num);
                        parseInt(a[r].goods[s].hot_cakes) && o.push(a[r].goods[s]);
                    }
                    c.setData({
                        quick_hot_goods_lists: o,
                        quick_list: i
                    });
                }
            }
        });
    },
    get_goods_info: function(t) {
        var a = this, o = a.data.carGoods, i = a.data.total, r = a.data.quick_hot_goods_lists, s = a.data.quick_list, e = {
            carGoods: o,
            total: i,
            quick_hot_goods_lists: r,
            check_num: a.data.check_num,
            quick_list: s
        };
        wx.setStorageSync("item", e);
        var d = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goods/goods?id=" + d + "&quick=1"
        });
    },
    selectMenu: function(t) {
        var a = t.currentTarget.dataset, o = this.data.quick_list;
        if ("hot_cakes" == a.tag) for (var i = !0, r = o.length, s = 0; s < r; s++) o[s].cat_checked = !1; else {
            var e = a.index;
            for (r = o.length, s = 0; s < r; s++) o[s].cat_checked = !1, o[s].id == o[e].id && (o[s].cat_checked = !0);
            i = !1;
        }
        this.setData({
            toView: a.tag,
            selectedMenuId: a.id,
            quick_list: o,
            cat_checked: i
        });
    },
    onShareAppMessage: function(t) {
        var a = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                share_count++, 1 == share_count && app.shareSendCoupon(a);
            }
        };
    },
    jia: function(t) {
        var a = this, o = t.currentTarget.dataset, i = a.data.quick_list;
        for (var r in i) for (var s in i[r].goods) if (parseInt(i[r].goods[s].id) === parseInt(o.id)) {
            var e = i[r].goods[s].num ? i[r].goods[s].num + 1 : 1;
            if (e > JSON.parse(i[r].goods[s].attr)[0].num) return void wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            });
            i[r].goods[s].num = e;
            var d = a.data.carGoods, c = 1, n = o.price ? o.price : i[r].goods[s].price;
            for (var u in d) {
                if (parseInt(d[u].goods_id) === parseInt(o.id) && 1 === d[u].attr.length) {
                    c = 0, d[u].num = e, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
                if (d[u].price == parseFloat(t.currentTarget.dataset.price)) {
                    c = 0, d[u].num = d[u].num + 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
            }
            if (1 === c || 0 === d.length) {
                var _ = JSON.parse(i[r].goods[s].attr);
                d.push({
                    goods_id: parseInt(i[r].goods[s].id),
                    attr: _[0].attr_list,
                    goods_name: i[r].goods[s].name,
                    goods_price: n,
                    num: 1,
                    price: n
                });
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), a.carStatistics(), a.quickHotStatistics();
    },
    jian: function(t) {
        var a = this, o = t.currentTarget.dataset, i = a.data.quick_list;
        for (var r in i) for (var s in i[r].goods) if (parseInt(i[r].goods[s].id) === parseInt(o.id)) {
            var e = 0 < i[r].goods[s].num ? i[r].goods[s].num - 1 : i[r].goods[s].num;
            i[r].goods[s].num = e;
            var d = a.data.carGoods;
            for (var c in d) {
                o.price ? o.price : i[r].goods[s].price;
                if (parseInt(d[c].goods_id) === parseInt(o.id) && 1 === d[c].attr.length) {
                    0, d[c].num = e, d[c].goods_price = (d[c].num * d[c].price).toFixed(2);
                    break;
                }
                if (d[c].price == parseFloat(t.currentTarget.dataset.price)) {
                    0 < d[c].num && (d[c].num = d[c].num - 1, d[c].goods_price = (d[c].num * d[c].price).toFixed(2));
                    break;
                }
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), a.carStatistics(), a.quickHotStatistics();
    },
    carStatistics: function() {
        var t = this.data.carGoods;
        console.log(t);
        var a = 0, o = 0;
        for (var i in t) a += t[i].num, o = parseFloat(o) + parseFloat(t[i].goods_price);
        var r = {
            total_num: a,
            total_price: o.toFixed(2)
        };
        0 === a && this.hideGoodsModel(), this.setData({
            total: r
        });
    },
    quickHotStatistics: function() {
        var t = this.data.quick_hot_goods_lists, a = this.data.quick_list;
        for (var o in t) for (var i in a) for (var r in a[i].goods) parseInt(a[i].goods[r].id) === parseInt(t[o].id) && (t[o].num = a[i].goods[r].num);
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
    showDialogBtn: function(t) {
        var a = this, o = t.currentTarget.dataset;
        app.request({
            url: api.default.goods,
            data: {
                id: o.id
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
        for (var r in o) {
            var s = [];
            for (var e in o[r].attr_list) s.push([ o[r].attr_list[e].attr_id, t.id ]);
            for (var d in a) {
                var c = [];
                for (var n in a[d].attr) c.push([ a[d].attr[n].attr_id, a[d].goods_id ]);
                if (s.sort().join() === c.sort().join()) {
                    for (var u in i) for (var _ in i[u].attr_list) for (var g in s) {
                        if (parseInt(i[u].attr_list[_].attr_id) === parseInt(s[g])) {
                            i[u].attr_list[_].checked = !0;
                            break;
                        }
                        i[u].attr_list[_].checked = !1;
                    }
                    var h = {
                        price: a[d].price
                    };
                    return void this.setData({
                        attr_group_list: i,
                        check_num: a[d].num,
                        check_goods_price: a[d].goods_price,
                        checked_attr: s,
                        temporaryGood: h
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var a = this.data.carGoods;
        for (var o in a) {
            var i = [];
            for (var r in a[o].attr) i.push([ a[o].attr[r].attr_id, a[o].goods_id ]);
            i.sort().join() === t.sort().join() && this.setData({
                check_num: a[o].num,
                check_goods_price: a[o].goods_price
            });
        }
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, i = t.target.dataset.id, r = a.data.attr_group_list, s = a.data.currentGood;
        for (var e in r) if (r[e].attr_group_id == o) for (var d in r[e].attr_list) r[e].attr_list[d].attr_id == i ? r[e].attr_list[d].checked = !0 : r[e].attr_list[d].checked = !1;
        var c = [];
        for (var e in r) for (var d in r[e].attr_list) !0 === r[e].attr_list[d].checked && c.push([ r[e].attr_list[d].attr_id, s.id ]);
        var n = JSON.parse(a.data.currentGood.attr), u = a.data.temporaryGood;
        for (var _ in n) {
            var g = [];
            for (var h in n[_].attr_list) g.push([ n[_].attr_list[h].attr_id, s.id ]);
            if (g.sort().join() === c.sort().join()) {
                if (0 === parseInt(n[_].num)) return void wx.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                });
                u = parseFloat(n[_].price) ? {
                    price: n[_].price.toFixed(2)
                } : {
                    price: s.price.toFixed(2)
                };
            }
        }
        a.resetData(), a.checkUpdateData(c), a.setData({
            attr_group_list: r,
            temporaryGood: u,
            checked_attr: c
        });
    },
    onConfirm: function(t) {
        var a = this, o = a.data.attr_group_list, i = a.data.checked_attr, r = a.data.currentGood;
        if (i.length === o.length) {
            var s = a.data.check_num ? a.data.check_num + 1 : 1, e = JSON.parse(r.attr);
            for (var d in e) {
                var c = [];
                for (var n in e[d].attr_list) if (c.push([ e[d].attr_list[n].attr_id, r.id ]), c.sort().join() === i.sort().join()) {
                    var u = e[d].price ? e[d].price : r.price, _ = e[d].attr_list;
                    if (s > e[d].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var g = a.data.carGoods, h = 1, p = (parseFloat(u) * s).toFixed(2);
            for (var l in g) {
                var f = [];
                for (var v in g[l].attr) f.push([ g[l].attr[v].attr_id, g[l].goods_id ]);
                if (f.sort().join() === i.sort().join()) {
                    h = 0, g[l].num = g[l].num + 1, g[l].goods_price = (parseFloat(u) * g[l].num).toFixed(2);
                    break;
                }
            }
            1 !== h && 0 !== g.length || g.push({
                goods_id: r.id,
                attr: _,
                goods_name: r.name,
                goods_price: u,
                num: 1,
                price: u
            }), a.setData({
                carGoods: g,
                check_goods_price: p,
                check_num: s
            }), a.carStatistics(), a.attrGoodStatistics();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var a = this, o = a.data.checked_attr, i = a.data.carGoods, r = a.data.check_num ? --a.data.check_num : 1;
        a.data.currentGood;
        for (var s in i) {
            var e = [];
            for (var d in i[s].attr) e.push([ i[s].attr[d].attr_id, i[s].goods_id ]);
            if (e.sort().join() === o.sort().join()) return 0 < i[s].num && (i[s].num -= 1, 
            i[s].goods_price = (i[s].num * parseFloat(i[s].price)).toFixed(2)), a.setData({
                carGoods: i,
                check_goods_price: i[s].goods_price,
                check_num: r
            }), a.carStatistics(), void a.attrGoodStatistics();
        }
    },
    attrGoodStatistics: function() {
        var t = this, a = t.data.currentGood, o = t.data.carGoods, i = t.data.quick_list, r = t.data.quick_hot_goods_lists, s = 0;
        for (var e in o) o[e].goods_id === a.id && (s += o[e].num);
        for (var e in i) for (var d in i[e].goods) parseInt(i[e].goods[d].id) === a.id && (i[e].goods[d].num = s);
        for (var e in r) parseInt(r[e].id) === a.id && (r[e].num = s);
        t.setData({
            quick_list: i,
            quick_hot_goods_lists: r
        });
    },
    goodsModel: function(t) {
        this.data.carGoods;
        var a = this.data.goodsModel;
        a ? this.setData({
            goodsModel: !1
        }) : this.setData({
            goodsModel: !0
        });
    },
    hideGoodsModel: function() {
        this.setData({
            goodsModel: !1
        });
    },
    preventTouchMove: function() {},
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
    clearCar: function(t) {
        var a = this.data.quick_hot_goods_lists, o = this.data.quick_list;
        for (var i in a) for (var r in a[i]) a[i].num = 0;
        for (var s in o) for (var e in o[s].goods) o[s].goods[e].num = 0;
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
            temporaryGood: {}
        }), wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this.data.carGoods;
        this.data.goodsModel;
        this.setData({
            goodsModel: !1
        });
        for (var o = a.length, i = [], r = [], s = 0; s < o; s++) 0 != a[s].num && (r = {
            goods_id: a[s].goods_id,
            num: a[s].num,
            attr: a[s].attr
        }, i.push(r));
        var e = [];
        e.push({
            mch_id: 0,
            goods_list: i
        }), wx.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(e)
        }), this.clearCar();
    }
});