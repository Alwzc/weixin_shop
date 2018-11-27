var api = require("../../api.js"), app = getApp(), share_count = 0, width = 260, int = 1, interval = 0, page_first_init = !0, timer = 1, msgHistory = "", fullScreen = !1;

Page({
    data: {
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {},
        play: -1,
        time: 0,
        buy_user: "",
        buy_address: "",
        buy_time: 0,
        buy_type: "",
        opendate: !1
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t), this.loadData(t);
        var a = 0, e = t.user_id, i = decodeURIComponent(t.scene);
        if (void 0 !== e) a = e; else if (void 0 !== i) a = i; else if (null !== app.query) {
            var r = app.query;
            app.query = null, a = r.uid, t.id = r.gid;
        }
        app.loginBindParent({
            parent_id: a
        });
    },
    suspension: function() {
        var n = this;
        interval = setInterval(function() {
            app.request({
                url: api.default.buy_data,
                data: {
                    time: n.data.time
                },
                method: "POST",
                success: function(t) {
                    if (0 == t.code) {
                        var a = !1;
                        msgHistory == t.md5 && (a = !0);
                        var e = "", i = t.cha_time, r = Math.floor(i / 60 - 60 * Math.floor(i / 3600));
                        e = 0 == r ? i % 60 + "秒" : r + "分" + i % 60 + "秒";
                        var s = "购买了", o = "/pages/goods/goods?id=" + t.data.goods;
                        2 === t.data.type ? (s = "预约了", o = "/pages/book/details/details?id=" + t.data.goods) : 3 === t.data.type ? (s = "秒杀了", 
                        o = "/pages/miaosha/details/details?id=" + t.data.goods) : 4 === t.data.type && (s = "拼团了", 
                        o = "/pages/pt/details/details?gid=" + t.data.goods), !a && t.cha_time <= 300 ? (n.setData({
                            buy_time: e,
                            buy_type: s,
                            buy_url: o,
                            buy_user: 5 <= t.data.user.length ? t.data.user.slice(0, 4) + "..." : t.data.user,
                            buy_avatar_url: t.data.avatar_url,
                            buy_address: 8 <= t.data.address.length ? t.data.address.slice(0, 7) + "..." : t.data.address
                        }), msgHistory = t.md5) : n.setData({
                            buy_user: "",
                            buy_type: "",
                            buy_url: o,
                            buy_address: "",
                            buy_avatar_url: "",
                            buy_time: ""
                        });
                    }
                }
            });
        }, 1e4);
    },
    loadData: function(t) {
        var o = this, a = wx.getStorageSync("pages_index_index");
        a && (a.act_modal_list = [], o.setData(a)), app.request({
            url: api.default.index,
            success: function(t) {
                if (0 == t.code) {
                    page_first_init ? page_first_init = !1 : t.data.act_modal_list = [];
                    var a = t.data.topic_list, e = new Array();
                    if (a && 1 != t.data.update_list.topic.count) {
                        if (1 == a.length) e[0] = new Array(), e[0] = a; else for (var i = 0, r = 0; i < a.length; i += 2, 
                        r++) null != a[i + 1] && (e[r] = new Array(), e[r][0] = a[i], e[r][1] = a[i + 1]);
                        t.data.topic_list = e;
                    }
                    o.setData(t.data), wx.setStorageSync("store", t.data.store), wx.setStorageSync("pages_index_index", t.data);
                    var s = wx.getStorageSync("user_info");
                    s && o.setData({
                        _user_info: s
                    }), o.miaoshaTimer();
                }
            },
            complete: function() {
                wx.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        app.pageOnShow(this), share_count = 0;
        var t = wx.getStorageSync("store");
        t && t.name && wx.setNavigationBarTitle({
            title: t.name
        }), t && 1 === t.purchase_frame ? this.suspension(this.data.time) : this.setData({
            buy_user: ""
        }), clearInterval(int), this.notice();
    },
    onPullDownRefresh: function() {
        clearInterval(timer), this.loadData();
    },
    onShareAppMessage: function(t) {
        var a = this;
        return {
            path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++share_count && app.shareSendCoupon(a);
            },
            title: a.data.store.name
        };
    },
    showshop: function(t) {
        var a = this, e = t.currentTarget.dataset.id, i = t.currentTarget.dataset;
        app.request({
            url: api.default.goods,
            data: {
                id: e
            },
            success: function(t) {
                0 == t.code && a.setData({
                    data: i,
                    attr_group_list: t.data.attr_group_list,
                    goods: t.data,
                    showModal: !0
                });
            }
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    attrClick: function(t) {
        var a = this, e = t.target.dataset.groupId, i = t.target.dataset.id, r = a.data.attr_group_list;
        for (var s in r) if (r[s].attr_group_id == e) for (var o in r[s].attr_list) r[s].attr_list[o].attr_id == i ? r[s].attr_list[o].checked = !0 : r[s].attr_list[o].checked = !1;
        for (var n = r.length, d = 0; d < n; d++) var l = (u = r[d].attr_list).length;
        var c = [];
        for (d = 0; d < n; d++) {
            var u;
            for (l = (u = r[d].attr_list).length, s = 0; s < l; s++) if (1 == u[s].checked) {
                var _ = {
                    attr_id: u[s].attr_id,
                    attr_name: u[s].attr_name
                };
                c.push(_);
            }
        }
        for (var p = JSON.parse(a.data.goods.attr), h = p.length, g = 0; g < h; g++) if (JSON.stringify(p[g].attr_list) == JSON.stringify(c)) var f = p[g].price;
        a.setData({
            attr_group_list: r,
            check_goods_price: f,
            check_attr_list: c
        }), a.setData({
            attr_group_list: r
        });
    },
    onConfirm: function(t) {
        var a = this, e = a.data.attr_group_list, i = JSON.parse(a.data.goods.attr), r = [];
        for (var s in e) {
            i = !1;
            for (var o in e[s].attr_list) if (e[s].attr_list[o].checked) {
                i = {
                    attr_id: e[s].attr_list[o].attr_id,
                    attr_name: e[s].attr_list[o].attr_name
                };
                break;
            }
            if (!i) return wx.showToast({
                title: "请选择" + e[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: e[s].attr_group_id,
                attr_group_name: e[s].attr_group_name,
                attr_id: i.attr_id,
                attr_name: i.attr_name
            });
        }
        a.setData({
            attr_group_list: e
        });
        for (var n = a.data.check_attr_list, d = i.length, l = 0; l < d; l++) if (JSON.stringify(i[l].attr_list) == JSON.stringify(n)) var c = i[l].num;
        var u = wx.getStorageSync("item").quick_list, _ = a.data.goods, p = u.length, h = [];
        for (s = 0; s < p; s++) for (var g = u[s].goods, f = g.length, m = 0; m < f; m++) h.push(g[m]);
        var v = h.length, y = [];
        for (l = 0; l < v; l++) h[l].id == _.id && y.push(h[l]);
        a.setData({
            checked_attr_list: r
        });
        d = r.length;
        var w = [];
        for (m = 0; m < d; m++) w.push(r[m].attr_id);
        var x = a.data.carGoods, S = a.data.check_goods_price;
        if (0 == S) var D = parseFloat(y[0].price); else D = parseFloat(S);
        y[0].id, y[0].name;
        var b = 0;
        if (c < b) {
            wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), b = c;
            f = y.length;
            for (var k = 0; k < f; k++) y[k].num += 1;
            var I = a.data.total;
            I.total_num += 1, I.total_price = parseFloat(I.total_price), I.total_price += D, 
            I.total_price = I.total_price.toFixed(2);
            var T = a.data.quick_hot_goods_lists;
            T.find(function(t) {
                return t.id == _.id;
            });
            a.setData({
                quick_hot_goods_lists: T,
                quick_list: u,
                carGoods: x,
                total: I,
                check_num: b
            });
        }
    },
    receive: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        wx.showLoading({
            title: "领取中",
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(t) {
            var a = t.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), wx.navigateTo({
                url: a || "/pages/list/list"
            });
        }), app.request({
            url: api.coupon.receive,
            data: {
                id: a
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code ? e.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (wx.showToast({
                    title: t.msg,
                    duration: 2e3
                }), e.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, e = t.currentTarget.dataset.url;
        return "wxapp" != a || ((e = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, e = /^[^\?]+\?([\w\W]+)$/.exec(t), i = {};
            if (e && e[1]) for (var r, s = e[1]; null != (r = a.exec(s)); ) i[r[1]] = r[2];
            return i;
        }(e)).path = e.path ? decodeURIComponent(e.path) : "", wx.navigateToMiniProgram({
            appId: e.appId,
            path: e.path,
            complete: function(t) {}
        }), !1);
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    notice: function() {
        var t = this.data.notice;
        if (void 0 !== t) t.length;
    },
    miaoshaTimer: function() {
        var t = this;
        if (t.data.miaosha.ms_next) {
            if (!t.data.miaosha) return;
            t.setData({
                opendate: t.data.miaosha.date,
                miaosha: t.data.miaosha,
                ms_next: t.data.miaosha.ms_next
            });
        } else {
            if (!t.data.miaosha || !t.data.miaosha.rest_time) return;
            timer = setInterval(function() {
                0 < t.data.miaosha.rest_time ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1, 
                t.data.miaosha.times = t.getTimesBySecond(t.data.miaosha.rest_time), t.setData({
                    opendate: t.data.miaosha.date,
                    miaosha: t.data.miaosha,
                    ms_next: t.data.miaosha.ms_next
                })) : clearInterval(timer);
            }, 1e3);
        }
    },
    onHide: function() {
        app.pageOnHide(this), this.setData({
            play: -1
        }), clearInterval(int), clearInterval(interval);
    },
    onUnload: function() {
        app.pageOnUnload(this), this.setData({
            play: -1
        }), clearInterval(timer), clearInterval(int), clearInterval(interval);
    },
    showNotice: function() {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.setData({
            show_notice: !1
        });
    },
    getTimesBySecond: function(t) {
        if (t = parseInt(t), isNaN(t)) return {
            h: "00",
            m: "00",
            s: "00"
        };
        var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), i = t % 60;
        return 1 <= a && (a -= 1), {
            h: a < 10 ? "0" + a : "" + a,
            m: e < 10 ? "0" + e : "" + e,
            s: i < 10 ? "0" + i : "" + i
        };
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    closeActModal: function() {
        var t, a = this, e = a.data.act_modal_list, i = !0;
        for (var r in e) {
            var s = parseInt(r);
            e[s].show && (e[s].show = !1, void 0 !== e[t = s + 1] && i && (i = !1, setTimeout(function() {
                a.data.act_modal_list[t].show = !0, a.setData({
                    act_modal_list: a.data.act_modal_list
                });
            }, 500)));
        }
        a.setData({
            act_modal_list: e
        });
    },
    naveClick: function(t) {
        app.navigatorClick(t, this);
    },
    play: function(t) {
        this.setData({
            play: t.currentTarget.dataset.index
        });
    },
    onPageScroll: function(t) {
        var a = this;
        if (!fullScreen && -1 != a.data.play) {
            var e = wx.getSystemInfoSync().windowHeight;
            "undefined" == typeof my ? wx.createSelectorQuery().select(".video").fields({
                rect: !0
            }, function(t) {
                (t.top <= -200 || t.top >= e - 57) && a.setData({
                    play: -1
                });
            }).exec() : wx.createSelectorQuery().select(".video").boundingClientRect().scrollOffset().exec(function(t) {
                (t[0].top <= -200 || t[0].top >= e - 57) && a.setData({
                    play: -1
                });
            });
        }
    },
    fullscreenchange: function(t) {
        fullScreen = !!t.detail.fullScreen;
    }
});