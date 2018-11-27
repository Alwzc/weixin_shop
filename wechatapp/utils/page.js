module.exports = {
    currentPage: null,
    onLoad: function(t, e) {
        var a = wx.getStorageSync("store");
        t.setData({
            __platform: getApp().getPlatform(),
            __is_comment: a ? a.is_comment : 1
        }), "undefined" != typeof my && "pages/login/login" != t.route && e && (t.options || (t.options = e), 
        wx.setStorageSync("last_page_options", e)), this.currentPage = t;
        var i = this;
        if (t.options) {
            var n = 0;
            if (t.options.user_id) n = t.options.user_id; else if (t.options.scene) if (isNaN(t.options.scene)) {
                var o = decodeURIComponent(t.options.scene);
                o && (o = getApp().utils.scene_decode(o)) && o.uid && (n = o.uid);
            } else n = t.options.scene; else if (null !== getApp().query) {
                n = getApp().query.uid;
            }
            n && wx.setStorageSync("parent_id", n);
        }
        if (void 0 === t.openWxapp && (t.openWxapp = i.openWxapp), void 0 === t.showToast && (t.showToast = function(e) {
            i.showToast(e);
        }), void 0 === t._formIdFormSubmit) {
            i = this;
            t._formIdFormSubmit = function(e) {
                i.formIdFormSubmit(e);
            };
        }
        getApp().setNavigationBarColor(), this.setPageNavbar(t), t.naveClick = function(e) {
            getApp().navigatorClick(e, t);
        }, this.setDeviceInfo(), this.setPageClasses(), this.setUserInfo(), void 0 === t.showLoadling && (t.showLoading = function(e) {
            i.showLoading(e);
        }), void 0 === t.hideLoading && (t.hideLoading = function(e) {
            i.hideLoading(e);
        }), this.setWxappImg(), this.setAlipayMpConfig(), void 0 === t.setTimeList && (t.setTimeList = function(e) {
            return i.setTimeList(e);
        }), this.setBarTitle();
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().order_pay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    showToast: function(e) {
        var t = this.currentPage, a = e.duration || 2500, i = e.title || "", n = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: i
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof n && n();
        }, a);
    },
    formIdFormSubmit: function(e) {},
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], a = wx.getSystemInfoSync();
        if (a.model) for (var i in 0 <= a.model.indexOf("iPhone X") && (a.model = "iPhone X"), 
        t) t[i].model == a.model && e.setData({
            __device: t[i].id
        });
    },
    setPageNavbar: function(n) {
        var t = this, e = wx.getStorageSync("_navbar");
        e && o(e);
        var a = !1;
        for (var i in this.navbarPages) if (n.route == this.navbarPages[i]) {
            a = !0;
            break;
        }
        function o(e) {
            var t = !1, a = n.route || n.__route__ || null;
            for (var i in e.navs) e.navs[i].url === "/" + a ? t = e.navs[i].active = !0 : e.navs[i].active = !1;
            t && n.setData({
                _navbar: e
            });
        }
        a && getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (o(e.data), wx.setStorageSync("_navbar", e.data), t.setPageClasses());
            }
        });
    },
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list" ],
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (t += " show_navbar"), 
        t && e.setData({
            __page_classes: t
        });
    },
    setUserInfo: function() {
        var e = this.currentPage, t = wx.getStorageSync("user_info");
        t && e.setData({
            __user_info: t
        });
    },
    showLoading: function(e) {
        this.currentPage.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage, a = wx.getStorageSync("wxapp_img");
        a && t.setData({
            __wxapp_img: a
        });
    },
    setTimeList: function(e) {
        function t(e) {
            return e <= 0 && (e = 0), e < 10 ? "0" + e : e;
        }
        var a = "00", i = "00", n = "00", o = 0;
        return 86400 <= e && (o = parseInt(e / 86400), e %= 86400), e < 86400 && (n = parseInt(e / 3600), 
        e %= 3600), e < 3600 && (i = parseInt(e / 60), e %= 60), e < 60 && (a = e), {
            day: o,
            hour: t(n),
            minute: t(i),
            second: t(a)
        };
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, a = wx.getStorageSync("wx_bar_title");
        for (var i in a) a[i].url === t && wx.setNavigationBarTitle({
            title: a[i].title
        });
    },
    setAlipayMpConfig: function() {
        var t = this.currentPage, a = wx.getStorageSync("alipay_mp_config");
        a ? t.setData({
            __alipay_mp_config: a
        }) : getApp().request({
            url: getApp().api.default.store,
            success: function(e) {
                0 == e.code && (a = e.data.alipay_mp_config, wx.setStorageSync("alipay_mp_config", a), 
                t.setData({
                    __alipay_mp_config: a
                }));
            }
        });
    },
    openWxapp: function(e) {
        if (console.log("openWxapp---\x3e", e.currentTarget.dataset), e.currentTarget.dataset.url) {
            var t = e.currentTarget.dataset.url;
            (t = function(e) {
                var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, a = /^[^\?]+\?([\w\W]+)$/.exec(e), i = {};
                if (a && a[1]) for (var n, o = a[1]; null != (n = t.exec(o)); ) i[n[1]] = n[2];
                return i;
            }(t)).path = t.path ? decodeURIComponent(t.path) : "", wx.navigateToMiniProgram({
                appId: t.appId,
                path: t.path,
                complete: function(e) {}
            });
        } else {
            if (!e.currentTarget.dataset.appId || !e.currentTarget.dataset.path) return;
            wx.navigateToMiniProgram({
                appId: e.currentTarget.dataset.appId,
                path: e.currentTarget.dataset.path,
                complete: function(e) {}
            });
        }
    }
};