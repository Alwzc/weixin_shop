var api = require("../../../api.js"), app = getApp();

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page: 1,
        pageCount: 0,
        cat_show: 1,
        cid_url: !1,
        quick_icon: !0
    },
    onLoad: function(a) {
        if (this.systemInfo = wx.getSystemInfoSync(), app.pageOnLoad(this, a), a.cid) {
            a.cid;
            return this.setData({
                cid_url: !1
            }), void this.switchNav({
                currentTarget: {
                    dataset: {
                        id: a.cid
                    }
                }
            });
        }
        this.setData({
            cid_url: !0
        }), this.loadIndexInfo(this);
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var a = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? a.opacity(0).step() : a.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: a.export()
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onShareAppMessage: function() {},
    loadIndexInfo: function() {
        var t = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.index,
            method: "get",
            success: function(a) {
                0 == a.code && (wx.hideLoading(), t.setData({
                    cat: a.data.cat,
                    goods: a.data.goods.list,
                    cat_show: a.data.cat_show,
                    page: a.data.goods.page,
                    pageCount: a.data.goods.page_count
                }), 0 < !a.data.goods.list.length && t.setData({
                    emptyGoods: 1
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
        var t = 0;
        if (t != a.currentTarget.dataset.id || 0 == a.currentTarget.dataset.id) {
            if (t = a.currentTarget.dataset.id, "wx" == this.data.__platform) {
                var e = o.systemInfo.windowWidth, i = a.currentTarget.offsetLeft, s = o.data.scrollLeft;
                s = e / 2 < i ? i : 0, o.setData({
                    scrollLeft: s
                });
            }
            if ("my" == this.data.__platform) {
                for (var d = o.data.cat, n = !0, c = 0; c < d.length; ++c) if (d[c].id === a.currentTarget.id) {
                    n = !1, 1 <= c ? o.setData({
                        toView: d[c - 1].id
                    }) : o.setData({
                        toView: "0"
                    });
                    break;
                }
                n && o.setData({
                    toView: "0"
                });
            }
            o.setData({
                cid: t,
                page: 1,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1
            }), app.request({
                url: api.book.list,
                method: "get",
                data: {
                    cid: t
                },
                success: function(a) {
                    if (0 == a.code) {
                        wx.hideLoading();
                        var t = a.data.list;
                        a.data.page_count >= a.data.page ? o.setData({
                            goods: t,
                            page: a.data.page,
                            pageCount: a.data.page_count,
                            show_loading_bar: 0
                        }) : o.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    pullDownLoading: function(a) {
        var o = this, t = o.data.page, e = o.data.pageCount, i = o.data.cid;
        o.setData({
            show_loading_bar: 1
        }), ++t > e ? o.setData({
            emptyGoods: 1,
            show_loading_bar: 0
        }) : app.request({
            url: api.book.list,
            method: "get",
            data: {
                page: t,
                cid: i
            },
            success: function(a) {
                if (0 == a.code) {
                    var t = o.data.goods;
                    Array.prototype.push.apply(t, a.data.list), o.setData({
                        show_loading_bar: 0,
                        goods: t,
                        page: a.data.page,
                        pageCount: a.data.page_count,
                        emptyGoods: 0
                    });
                }
            }
        });
    }
});