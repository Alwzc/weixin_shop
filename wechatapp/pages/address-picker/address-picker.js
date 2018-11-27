var api = require("../../api.js"), app = getApp();

Page({
    data: {
        address_list: null
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var e = this;
        wx.showNavigationBarLoading(), app.request({
            url: api.user.address_list,
            success: function(a) {
                wx.hideNavigationBarLoading(), 0 == a.code && e.setData({
                    address_list: a.data.list
                });
            }
        });
    },
    pickAddress: function(a) {
        var e = a.currentTarget.dataset.index, s = this.data.address_list[e];
        wx.setStorageSync("picker_address", s), wx.navigateBack();
    },
    getWechatAddress: function(a) {
        wx.chooseAddress({
            success: function(a) {
                "chooseAddress:ok" == a.errMsg && (wx.showLoading(), app.request({
                    url: api.user.add_wechat_address,
                    method: "post",
                    data: {
                        national_code: a.nationalCode,
                        name: a.userName,
                        mobile: a.telNumber,
                        detail: a.detailInfo,
                        province_name: a.provinceName,
                        city_name: a.cityName,
                        county_name: a.countyName
                    },
                    success: function(a) {
                        1 != a.code ? 0 == a.code && (wx.setStorageSync("picker_address", a.data), wx.navigateBack()) : wx.showModal({
                            title: "提示",
                            content: a.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    }
});