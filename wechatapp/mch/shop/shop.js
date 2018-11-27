var api = require("../../api.js"), utils = require("../../utils.js"), app = getApp();

Page({
    data: {
        tab: 1,
        sort: 1,
        coupon_list: [],
        copy: !1,
        quick_icon: !0
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        if ("undefined" == typeof my) {
            if (t.scene) {
                var o = decodeURIComponent(t.scene);
                o && (o = utils.scene_decode(o)).mch_id && (t.mch_id = o.mch_id);
            }
        } else if (null !== app.query) {
            var i = app.query;
            app.query = null, t.mch_id = i.mch_id;
        }
        a.setData({
            tab: t.tab || 1,
            sort: t.sort || 1,
            mch_id: t.mch_id || !1,
            cat_id: t.cat_id || ""
        }), a.data.mch_id || wx.showModal({
            title: "提示",
            content: "店铺不存在！店铺id为空"
        }), setInterval(function() {
            a.onScroll();
        }, 40), this.getShopData();
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getGoodsList();
    },
    onShareAppMessage: function() {
        return {
            title: this.data.shop ? this.data.shop.name : "商城首页"
        };
    },
    kfuStart: function() {
        this.setData({
            copy: !0
        });
    },
    kfuEnd: function() {
        this.setData({
            copy: !1
        });
    },
    copyinfo: function(t) {
        wx.setClipboardData({
            data: t.target.dataset.info,
            success: function(t) {
                wx.showToast({
                    title: "复制成功！",
                    icon: "success",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    callPhone: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    onScroll: function(t) {
        var o = this;
        wx.createSelectorQuery().selectViewport(".after-navber").scrollOffset(function(t) {
            var a = 2 == o.data.tab ? 136.5333 : 85.3333;
            t.scrollTop >= a ? o.setData({
                fixed: !0
            }) : o.setData({
                fixed: !1
            });
        }).exec();
    },
    getShopData: function() {
        var a = this, o = (a.data.current_page || 0) + 1, i = "shop_data_mch_id_" + a.data.mch_id, t = wx.getStorageSync(i);
        t && a.setData({
            shop: t.shop
        }), wx.showNavigationBarLoading(), a.setData({
            loading: !0
        }), app.request({
            url: api.mch.shop,
            data: {
                mch_id: a.data.mch_id,
                tab: a.data.tab,
                sort: a.data.sort,
                page: o,
                cat_id: a.data.cat_id
            },
            success: function(t) {
                1 != t.code ? 0 == t.code && (a.setData({
                    shop: t.data.shop,
                    coupon_list: t.data.coupon_list,
                    hot_list: t.data.goods_list,
                    goods_list: t.data.goods_list,
                    new_list: t.data.new_list,
                    current_page: o,
                    cs_icon: t.data.shop.cs_icon
                }), wx.setStorageSync(i, t.data)) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading(), a.setData({
                    loading: !1
                });
            }
        });
    },
    getGoodsList: function() {
        var a = this;
        if (3 != a.data.tab && !a.data.loading && !a.data.no_more) {
            a.setData({
                loading: !0
            });
            var o = (a.data.current_page || 0) + 1;
            app.request({
                url: api.mch.shop,
                data: {
                    mch_id: a.data.mch_id,
                    tab: a.data.tab,
                    sort: a.data.sort,
                    page: o,
                    cat_id: a.data.cat_id
                },
                success: function(t) {
                    0 == t.code && (1 == a.data.tab && (t.data.goods_list && t.data.goods_list.length ? (a.data.hot_list = a.data.hot_list.concat(t.data.goods_list), 
                    a.setData({
                        hot_list: a.data.hot_list,
                        current_page: o
                    })) : a.setData({
                        no_more: !0
                    })), 2 == a.data.tab && (t.data.goods_list && t.data.goods_list.length ? (a.data.goods_list = a.data.goods_list.concat(t.data.goods_list), 
                    a.setData({
                        goods_list: a.data.goods_list,
                        current_page: o
                    })) : a.setData({
                        no_more: !0
                    })));
                },
                complete: function() {
                    a.setData({
                        loading: !1
                    });
                }
            });
        }
    }
});