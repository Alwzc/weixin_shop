var api = require("../../../api.js"), app = getApp(), timer = null;

Page({
    data: {
        page_img: {
            bg: app.webRoot + "/statics/images/fxhb/bg.png",
            close: app.webRoot + "/statics/images/fxhb/close.png",
            hongbao_bg: app.webRoot + "/statics/images/fxhb/hongbao_bg.png",
            open_hongbao_btn: app.webRoot + "/statics/images/fxhb/open_hongbao_btn.png",
            wechat: app.webRoot + "/statics/images/fxhb/wechat.png",
            coupon: app.webRoot + "/statics/images/fxhb/coupon.png",
            pointer_r: app.webRoot + "/statics/images/fxhb/pointer_r.png",
            best_icon: app.webRoot + "/statics/images/fxhb/best_icon.png",
            more_l: app.webRoot + "/statics/images/fxhb/more_l.png",
            more_r: app.webRoot + "/statics/images/fxhb/more_r.png",
            cry: app.webRoot + "/statics/images/fxhb/cry.png",
            share_modal_bg: app.webRoot + "/statics/images/fxhb/share_modal_bg.png"
        },
        goods_list: null,
        rest_time_str: "--:--:--"
    },
    onLoad: function(t) {
        var e = this;
        app.pageOnLoad(this, t);
        var a = t.id;
        wx.showLoading({
            title: "加载中",
            mask: !0
        }), app.request({
            url: api.fxhb.detail,
            data: {
                id: a
            },
            success: function(a) {
                wx.hideLoading(), 1 != a.code ? (0 == a.code && (e.setData({
                    rule: a.data.rule,
                    share_pic: a.data.share_pic,
                    share_title: a.data.share_title,
                    coupon_total_money: a.data.coupon_total_money,
                    rest_user_num: a.data.rest_user_num,
                    rest_time: a.data.rest_time,
                    hongbao: a.data.hongbao,
                    hongbao_list: a.data.hongbao_list,
                    is_my_hongbao: a.data.is_my_hongbao,
                    my_coupon: a.data.my_coupon,
                    goods_list: a.data.goods_list
                }), e.setRestTimeStr()), e.showShareModal()) : wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && (1 == a.game_open ? wx.redirectTo({
                            url: "/pages/fxhb/open/open"
                        }) : wx.redirectTo({
                            url: "/pages/index/index"
                        }));
                    }
                });
            }
        });
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    showRule: function() {
        this.setData({
            showRule: !0
        });
    },
    closeRule: function() {
        this.setData({
            showRule: !1
        });
    },
    showShareModal: function() {
        this.setData({
            showShareModal: !0
        });
    },
    closeShareModal: function() {
        this.setData({
            showShareModal: !1
        });
    },
    setRestTimeStr: function() {
        var o = this, s = o.data.rest_time || !1;
        !1 !== s && null !== s && ((s = parseInt(s)) <= 0 ? o.setData({
            rest_time_str: "00:00:00"
        }) : (timer && clearInterval(timer), timer = setInterval(function() {
            if ((s = o.data.rest_time) <= 0) return clearInterval(timer), void o.setData({
                rest_time_str: "00:00:00"
            });
            var t = parseInt(s / 3600), a = parseInt(s % 3600 / 60), e = parseInt(s % 3600 % 60);
            o.setData({
                rest_time: s - 1,
                rest_time_str: (t < 10 ? "0" + t : t) + ":" + (a < 10 ? "0" + a : a) + ":" + (e < 10 ? "0" + e : e)
            });
        }, 1e3)));
    },
    detailSubmit: function(t) {
        var a = this;
        wx.showLoading({
            mask: !0
        }), app.request({
            url: api.fxhb.detail_submit,
            method: "post",
            data: {
                id: a.data.hongbao.id,
                form_id: t.detail.formId
            },
            success: function(t) {
                if (1 == t.code) return wx.hideLoading(), void a.showToast({
                    title: t.msg,
                    complete: function() {
                        0 == t.game_open && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
                0 == t.code && (wx.hideLoading(), a.showToast({
                    title: t.msg,
                    complete: function() {
                        1 == t.reload && wx.redirectTo({
                            url: "/pages/fxhb/detail/detail?id=" + a.options.id
                        });
                    }
                }));
            }
        });
    },
    onShareAppMessage: function() {
        var a = this, t = a.data.__user_info;
        return {
            path: "/pages/fxhb/detail/detail?id=" + a.data.hongbao.id + (t ? "&user_id=" + t.id : ""),
            title: a.data.share_title || null,
            imageUrl: a.data.share_pic || null,
            complete: function(t) {
                a.closeShareModal();
            }
        };
    }
});