var api = require("../../api.js"), app = getApp(), WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {
        quick_icon: !0
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
        var a = this;
        app.request({
            url: api.default.topic,
            data: {
                id: t.id
            },
            success: function(t) {
                0 == t.code ? (a.setData(t.data), WxParse.wxParse("content", "html", t.data.content, a)) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
        var i = t.user_id;
        i && app.loginBindParent({
            parent_id: i
        });
    },
    wxParseTagATap: function(t) {
        if (t.currentTarget.dataset.goods) {
            var a = t.currentTarget.dataset.src || !1;
            if (!a) return;
            wx.navigateTo({
                url: a
            });
        }
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
    favoriteClick: function(t) {
        var a = this, i = t.currentTarget.dataset.action;
        app.request({
            url: api.user.topic_favorite,
            data: {
                topic_id: a.data.id,
                action: i
            },
            success: function(t) {
                wx.showToast({
                    title: t.msg
                }), 0 == t.code && a.setData({
                    is_favorite: i
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function() {
        var t = wx.getStorageSync("user_info"), a = this.data.id;
        return {
            title: this.data.title,
            path: "/pages/topic/topic?id=" + a + "&user_id=" + t.id
        };
    }
});