var hj = null, page = null, request = null, api = null, utils = null, order_pay = null, uploader = null, login = null;

"undefined" != typeof wx && (hj = require("./open.js"), page = require("./utils/page.js"), 
request = require("./utils/request.js"), api = require("./api.js"), utils = require("./utils/utils.js"), 
order_pay = require("./commons/order-pay/order-pay.js"), uploader = require("./utils/uploader"), 
login = require("./utils/login.js"));

var _app = App({
    is_on_launch: !0,
    onShowData: null,
    _version: "2.8.9",
    query: null,
    onLaunch: function(e) {
        this.setApi(), api = this.api, this.getNavigationBarColor(), this.getStoreData(), 
        this.getCatList();
    },
    onShow: function(e) {
        e.scene && (this.onShowData = e), e && e.query && (this.query = e.query);
    },
    getStoreData: function() {
        var t = this;
        this.request({
            url: api.default.store,
            success: function(e) {
                0 == e.code && (t.hj.setStorageSync("store", e.data.store), t.hj.setStorageSync("store_name", e.data.store_name), 
                t.hj.setStorageSync("show_customer_service", e.data.show_customer_service), t.hj.setStorageSync("contact_tel", e.data.contact_tel), 
                t.hj.setStorageSync("share_setting", e.data.share_setting), t.permission_list = e.data.permission_list, 
                t.hj.setStorageSync("wxapp_img", e.data.wxapp_img), t.hj.setStorageSync("wx_bar_title", e.data.wx_bar_title));
            },
            complete: function() {}
        });
    },
    getCatList: function() {
        var i = this;
        this.request({
            url: api.default.cat_list,
            success: function(e) {
                if (0 == e.code) {
                    var t = e.data.list || [];
                    i.hj.setStorageSync("cat_list", t);
                }
            }
        });
    },
    saveFormId: function(e) {
        this.request({
            url: api.user.save_form_id,
            data: {
                form_id: e
            }
        });
    },
    loginBindParent: function(e) {
        if ("" == this.hj.getStorageSync("access_token")) return !0;
        this.bindParent(e);
    },
    bindParent: function(e) {
        var t = this;
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var i = t.hj.getStorageSync("user_info");
            if (0 < t.hj.getStorageSync("share_setting").level) 0 != e.parent_id && t.request({
                url: api.share.bind_parent,
                data: {
                    parent_id: e.parent_id
                },
                success: function(e) {
                    0 == e.code && (i.parent = e.data, t.hj.setStorageSync("user_info", i));
                }
            });
        }
    },
    shareSendCoupon: function(i) {
        var a = this;
        a.hj.showLoading({
            mask: !0
        }), i.hideGetCoupon || (i.hideGetCoupon = function(e) {
            var t = e.currentTarget.dataset.url || !1;
            i.setData({
                get_coupon_list: null
            }), t && a.hj.navigateTo({
                url: t
            });
        }), this.request({
            url: api.coupon.share_send,
            success: function(e) {
                0 == e.code && i.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function() {
                a.hj.hideLoading();
            }
        });
    },
    getauth: function(t) {
        var i = this;
        i.hj.showModal({
            title: "是否打开设置页面重新授权",
            content: t.content,
            confirmText: "去设置",
            success: function(e) {
                e.confirm ? i.hj.openSetting({
                    success: function(e) {
                        t.success && t.success(e);
                    },
                    fail: function(e) {
                        t.fail && t.fail(e);
                    },
                    complete: function(e) {
                        t.complete && t.complete(e);
                    }
                }) : t.cancel && i.getauth(t);
            }
        });
    },
    setApi: function() {
        var a = this.siteInfo.siteroot;
        a = a.replace("app/index.php", ""), a += "web/index.php?store_id=-1&r=api/", 
        this.api = function e(t) {
            for (var i in t) "string" == typeof t[i] ? t[i] = t[i].replace("{$_api_root}", a) : t[i] = e(t[i]);
            return t;
        }(this.api);
        var e = this.api.default.index, t = e.substr(0, e.indexOf("/index.php"));
        this.webRoot = t;
    },
    webRoot: null,
    siteInfo: require("./siteinfo.js"),
    currentPage: null,
    pageOnLoad: function(e, t) {
        this.page.onLoad(e, t);
    },
    pageOnReady: function(e) {
        this.page.onReady(e);
    },
    pageOnShow: function(e) {
        this.page.onShow(e);
    },
    pageOnHide: function(e) {
        this.page.onHide(e);
    },
    pageOnUnload: function(e) {
        this.page.onUnload(e);
    },
    getNavigationBarColor: function() {
        var t = this;
        t.request({
            url: api.default.navigation_bar_color,
            success: function(e) {
                0 == e.code && (t.hj.setStorageSync("_navigation_bar_color", e.data), t.setNavigationBarColor());
            }
        });
    },
    setNavigationBarColor: function() {
        var e = this.hj.getStorageSync("_navigation_bar_color");
        e && this.hj.setNavigationBarColor(e);
    },
    loginNoRefreshPage: [ "pages/index/index", "mch/shop/shop" ],
    navigatorClick: function(e, t) {
        var i = e.currentTarget.dataset.open_type;
        if ("redirect" == i) return !0;
        if ("wxapp" == i) {
            var a = e.currentTarget.dataset.path;
            "/" != a.substr(0, 1) && (a = "/" + a), this.hj.navigateToMiniProgram({
                appId: e.currentTarget.dataset.appid,
                path: a,
                complete: function(e) {}
            });
        }
        if ("tel" == i) {
            var n = e.currentTarget.dataset.tel;
            this.hj.makePhoneCall({
                phoneNumber: n
            });
        }
        return !1;
    },
    hj: hj,
    page: page,
    request: request,
    api: api,
    utils: utils,
    order_pay: order_pay,
    uploader: uploader,
    login: login,
    setRequire: function() {
        this.hj = require("./open.js"), this.request = require("./utils/request.js"), this.page = require("./utils/page.js"), 
        this.api = require("./api.js"), this.utils = require("./utils/utils.js"), this.order_pay = require("./commons/order-pay/order-pay.js"), 
        this.uploader = require("./utils/uploader"), this.login = require("./utils/login.js");
    },
    getPlatform: function() {
        return "undefined" != typeof my ? "my" : "undefined" != typeof wx ? "wx" : null;
    }
});

"undefined" != typeof my && (_app.setRequire(), _app.setApi());