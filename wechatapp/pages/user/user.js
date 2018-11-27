var api = require("../../api.js"), app = getApp();

Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    loadData: function(a) {
        var e = this;
        e.setData({
            store: wx.getStorageSync("store")
        }), app.request({
            url: api.user.index,
            success: function(n) {
                if (0 == n.code) {
                    if ("my" == e.data.__platform) n.data.menus.forEach(function(a, e, t) {
                        "bangding" === a.id && n.data.menus.splice(e, 1, 0);
                    });
                    e.setData(n.data), wx.setStorageSync("pages_user_user", n.data), wx.setStorageSync("share_setting", n.data.share_setting), 
                    wx.setStorageSync("user_info", n.data.user_info);
                }
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        this.loadData();
    },
    callTel: function(a) {
        var e = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    apply: function(e) {
        var t = wx.getStorageSync("share_setting"), n = wx.getStorageSync("user_info");
        1 == t.share_condition ? wx.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != t.share_condition && 2 != t.share_condition || (0 == n.is_distributor ? wx.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(a) {
                a.confirm && (wx.showLoading({
                    title: "正在加载",
                    mask: !0
                }), app.request({
                    url: api.share.join,
                    method: "POST",
                    data: {
                        form_id: e.detail.formId
                    },
                    success: function(a) {
                        0 == a.code && (0 == t.share_condition ? (n.is_distributor = 2, wx.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (n.is_distributor = 1, wx.navigateTo({
                            url: "/pages/share/index"
                        })), wx.setStorageSync("user_info", n));
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        }) : wx.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(a) {
        wx.scanCode({
            onlyFromCamera: !1,
            success: function(a) {
                wx.navigateTo({
                    url: "/" + a.path
                });
            },
            fail: function(a) {
                wx.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        wx.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function(a) {
        var e, t;
        app.permission_list && app.permission_list.length && (e = app.permission_list, t = "integralmall", 
        -1 != ("," + e.join(",") + ",").indexOf("," + t + ",")) && wx.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    }
});