var api = require("../../api.js"), utils = require("../../utils.js"), app = getApp(), videoContext = "", setIntval = null, WxParse = require("../../wxParse/wxParse.js"), userIntval = null, scrollIntval = null, is_loading = !1;

Page({
    data: {
        hide: "hide",
        time_list: {
            day: 0,
            hour: "00",
            minute: "00",
            second: "00"
        },
        p: 1,
        user_index: 0,
        show_content: !1
    },
    onLoad: function(t) {
        if (app.pageOnLoad(this, t), "undefined" == typeof my) {
            var e = decodeURIComponent(t.scene);
            if (void 0 !== e) {
                var a = utils.scene_decode(e);
                a.gid && (t.goods_id = a.gid);
            }
        } else if (null !== app.query) {
            var i = app.query;
            app.query = null, t.goods_id = i.gid;
        }
        this.getGoods(t.goods_id);
    },
    getGoods: function(t) {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.goods,
            data: {
                goods_id: t,
                page: 1
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = t.data.goods.detail;
                    WxParse.wxParse("detail", "html", e, a), a.setData(t.data), a.setData({
                        reset_time: a.data.goods.reset_time,
                        time_list: a.setTimeList(t.data.goods.reset_time),
                        p: 1
                    }), a.setTimeOver(), t.data.bargain_info && a.getUserTime();
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: -1
                        });
                    }
                });
            },
            complete: function(t) {
                wx.hideLoading();
            }
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
        app.pageOnUnload(this), clearInterval(setIntval), setIntval = null, clearInterval(userIntval), 
        userIntval = null, clearInterval(scrollIntval), scrollIntval = null;
    },
    play: function(t) {
        var e = t.target.dataset.url;
        this.setData({
            url: e,
            hide: "",
            show: !0
        }), (videoContext = wx.createVideoContext("video")).play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), videoContext.pause();
    },
    onGoodsImageClick: function(t) {
        var e = [], a = t.currentTarget.dataset.index;
        for (var i in this.data.goods.pic_list) e.push(this.data.goods.pic_list[i].pic_url);
        wx.previewImage({
            urls: e,
            current: e[a]
        });
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    setTimeOver: function() {
        var a = this;
        setIntval = setInterval(function() {
            a.data.resset_time <= 0 && clearInterval(setIntval);
            var t = a.data.reset_time - 1, e = a.setTimeList(t);
            a.setData({
                reset_time: t,
                time_list: e
            });
        }, 1e3);
    },
    orderSubmit: function() {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.bargain.bargain_submit,
            method: "POST",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                0 == t.code ? wx.redirectTo({
                    url: "/bargain/activity/activity?order_id=" + t.data.order_id
                }) : e.showToast({
                    title: t.msg
                });
            },
            complete: function(t) {
                wx.hideLoading();
            }
        });
    },
    buyNow: function() {
        var t = [], e = [], a = this.data.bargain_info;
        a && (e.push({
            bargain_order_id: a.order_id
        }), t.push({
            mch_id: 0,
            goods_list: e
        }), wx.redirectTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(t)
        }));
    },
    getUserTime: function() {
        var e = this;
        userIntval = setInterval(function() {
            e.loadData();
        }, 1e3), scrollIntval = setInterval(function() {
            var t = e.data.user_index;
            3 < e.data.bargain_info.bargain_info.length - t ? t += 3 : t = 0, e.setData({
                user_index: t
            });
        }, 3e3);
    },
    loadData: function() {
        var i = this, n = i.data.p;
        is_loading || (is_loading = !0, app.request({
            url: api.bargain.goods_user,
            data: {
                page: n + 1,
                goods_id: i.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = i.data.bargain_info.bargain_info, a = t.data.bargain_info;
                    0 == a.bargain_info.length && (clearInterval(userIntval), userIntval = null), a.bargain_info = e.concat(a.bargain_info), 
                    i.setData({
                        bargain_info: a,
                        p: n + 1
                    });
                } else i.showToast({
                    title: t.msg
                });
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    contentClose: function() {
        this.setData({
            show_content: !1
        });
    },
    contentOpen: function() {
        this.setData({
            show_content: !0
        });
    },
    onShareAppMessage: function() {
        return {
            path: "/bargain/list/list?goods_id=" + this.data.goods.id + "&user_id=" + this.data.__user_info.id,
            success: function(t) {}
        };
    }
});