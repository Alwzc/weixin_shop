var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        pt_url: !1,
        page: 1,
        is_show: 0,
        quick_icon: !0
    },
    onLoad: function(t) {
        this.systemInfo = wx.getSystemInfoSync(), app.pageOnLoad(this, t);
        var a = wx.getStorageSync("store");
        this.setData({
            store: a
        });
        var o = this;
        if (t.cid) {
            t.cid;
            return this.setData({
                pt_url: !1
            }), wx.showLoading({
                title: "正在加载",
                mask: !0
            }), void app.request({
                url: api.group.index,
                method: "get",
                success: function(a) {
                    o.switchNav({
                        currentTarget: {
                            dataset: {
                                id: t.cid
                            }
                        }
                    }), 0 == a.code && o.setData({
                        banner: a.data.banner,
                        ad: a.data.ad,
                        page: a.data.goods.page,
                        page_count: a.data.goods.page_count
                    });
                }
            });
        }
        this.setData({
            pt_url: !0
        }), this.loadIndexInfo(this);
    },
    onReady: function() {},
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        var a = this.data.store, t = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), o = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), e = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), i = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), n = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), s = -55;
        this.data.quick_icon ? (t.opacity(0).step(), e.opacity(0).step(), o.opacity(0).step(), 
        i.opacity(0).step(), n.opacity(0).step()) : (a.option && a.option.wxapp && a.option.wxapp.pic_url && (n.translateY(s).opacity(1).step(), 
        s -= 55), a.show_customer_service && 1 == a.show_customer_service && a.service && (i.translateY(s).opacity(1).step(), 
        s -= 55), a.option && a.option.web_service && (e.translateY(s).opacity(1).step(), 
        s -= 55), 1 == a.dial && a.dial_pic && (o.translateY(s).opacity(1).step(), s -= 55), 
        t.translateY(s).opacity(1).step()), this.setData({
            animationPlus: t.export(),
            animationPic: o.export(),
            animationcollect: e.export(),
            animationTranspond: i.export(),
            animationInput: n.export()
        });
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        a.setData({
            show_loading_bar: 1
        }), a.data.page < a.data.page_count ? (a.setData({
            page: a.data.page + 1
        }), a.getGoods(a)) : a.setData({
            is_show: 1,
            emptyGoods: 1,
            show_loading_bar: 0
        });
    },
    onShareAppMessage: function() {},
    loadIndexInfo: function(a) {
        var t = a;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.index,
            method: "get",
            data: {
                page: t.data.page
            },
            success: function(a) {
                0 == a.code && (wx.hideLoading(), t.setData({
                    cat: a.data.cat,
                    banner: a.data.banner,
                    ad: a.data.ad,
                    goods: a.data.goods.list,
                    page: a.data.goods.page,
                    page_count: a.data.goods.page_count
                }), a.data.goods.row_count <= 0 && t.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    getGoods: function(a) {
        var t = a;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.list,
            method: "get",
            data: {
                page: t.data.page,
                cid: t.data.cid
            },
            success: function(a) {
                0 == a.code && (wx.hideLoading(), t.data.goods = t.data.goods.concat(a.data.list), 
                t.setData({
                    goods: t.data.goods,
                    page: a.data.page,
                    page_count: a.data.page_count,
                    show_loading_bar: 0
                }));
            }
        });
    },
    switchNav: function(a) {
        var o = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var t = a.currentTarget.dataset.id;
        if (o.setData({
            cid: t
        }), "undefined" == typeof my) {
            var e = this.systemInfo.windowWidth, i = a.currentTarget.offsetLeft, n = this.data.scrollLeft;
            n = e / 2 < i ? i : 0, o.setData({
                scrollLeft: n
            });
        } else {
            for (var s = o.data.cat, d = !0, p = 0; p < s.length; ++p) if (s[p].id === a.currentTarget.id) {
                d = !1, 1 <= p ? o.setData({
                    toView: s[p - 1].id
                }) : o.setData({
                    toView: "0"
                });
                break;
            }
            d && o.setData({
                toView: "0"
            });
        }
        o.setData({
            cid: t,
            page: 1,
            scrollTop: 0,
            emptyGoods: 0,
            goods: [],
            show_loading_bar: 1,
            is_show: 0
        }), app.request({
            url: api.group.list,
            method: "get",
            data: {
                cid: t
            },
            success: function(a) {
                if (wx.hideLoading(), 0 == a.code) {
                    var t = a.data.list;
                    a.data.page_count >= a.data.page ? o.setData({
                        goods: t,
                        page: a.data.page,
                        page_count: a.data.page_count,
                        row_count: a.data.row_count,
                        show_loading_bar: 0
                    }) : o.setData({
                        emptyGoods: 1
                    });
                }
            }
        });
    },
    pullDownLoading: function(a) {
        var o = this;
        if (1 != o.data.emptyGoods && 1 != o.data.show_loading_bar) {
            o.setData({
                show_loading_bar: 1
            });
            var t = parseInt(o.data.page + 1), e = o.data.cid;
            app.request({
                url: api.group.list,
                method: "get",
                data: {
                    page: t,
                    cid: e
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = o.data.goods;
                        a.data.page > o.data.page && Array.prototype.push.apply(t, a.data.list), a.data.page_count >= a.data.page ? o.setData({
                            goods: t,
                            page: a.data.page,
                            page_count: a.data.page_count,
                            row_count: a.data.row_count,
                            show_loading_bar: 0
                        }) : o.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    navigatorClick: function(a) {
        var t = a.currentTarget.dataset.open_type, o = a.currentTarget.dataset.url;
        return "wxapp" != t || ((o = function(a) {
            var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, o = /^[^\?]+\?([\w\W]+)$/.exec(a), e = {};
            if (o && o[1]) for (var i, n = o[1]; null != (i = t.exec(n)); ) e[i[1]] = i[2];
            return e;
        }(o)).path = o.path ? decodeURIComponent(o.path) : "", wx.navigateToMiniProgram({
            appId: o.appId,
            path: o.path,
            complete: function(a) {}
        }), !1);
    },
    to_dial: function() {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    }
});