var api = require("../../api.js"), app = getApp();

Page({
    data: {
        address_list: []
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var s = this;
        wx.showNavigationBarLoading(), app.request({
            url: api.user.address_list,
            success: function(a) {
                wx.hideNavigationBarLoading(), 0 == a.code && s.setData({
                    address_list: a.data.list
                }), s.setData({
                    show_no_data_tip: 0 == s.data.address_list.length
                });
            }
        });
    },
    setDefaultAddress: function(a) {
        var t = this, d = a.currentTarget.dataset.index, s = t.data.address_list[d];
        wx.showLoading({
            title: "正在保存",
            mask: !0
        }), app.request({
            url: api.user.address_set_default,
            data: {
                address_id: s.id
            },
            success: function(a) {
                if (wx.hideLoading(), 0 == a.code) {
                    var s = t.data.address_list;
                    for (var e in s) s[e].is_default = e == d ? 1 : 0;
                    t.setData({
                        address_list: s
                    });
                }
            }
        });
    },
    deleteAddress: function(a) {
        var s = a.currentTarget.dataset.id;
        a.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确认删除改收货地址？",
            success: function(a) {
                a.confirm && (wx.showLoading({
                    title: "正在删除",
                    mask: !0
                }), app.request({
                    url: api.user.address_delete,
                    data: {
                        address_id: s
                    },
                    success: function(a) {
                        0 == a.code && wx.redirectTo({
                            url: "/pages/address/address"
                        }), 1 == a.code && (wx.hideLoading(), wx.showToast({
                            title: a.msg,
                            image: "/images/icon-warning.png"
                        }));
                    }
                }));
            }
        });
    }
});