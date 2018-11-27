var api = require("../../api.js"), area_picker = require("../../area-picker/area-picker.js"), app = getApp();

Page({
    data: {
        name: "",
        mobile: "",
        detail: "",
        district: null
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        t.getDistrictData(function(a) {
            area_picker.init({
                page: t,
                data: a
            });
        }), t.setData({
            address_id: a.id
        }), a.id && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.user.address_detail,
            data: {
                id: a.id
            },
            success: function(a) {
                wx.hideLoading(), 0 == a.code && t.setData(a.data);
            }
        }));
    },
    getDistrictData: function(t) {
        var i = wx.getStorageSync("district");
        if (!i) return wx.showLoading({
            title: "正在加载",
            mask: !0
        }), void app.request({
            url: api.default.district,
            success: function(a) {
                wx.hideLoading(), 0 == a.code && (i = a.data, wx.setStorageSync("district", i), 
                t(i));
            }
        });
        t(i);
    },
    onAreaPickerConfirm: function(a) {
        this.setData({
            district: {
                province: {
                    id: a[0].id,
                    name: a[0].name
                },
                city: {
                    id: a[1].id,
                    name: a[1].name
                },
                district: {
                    id: a[2].id,
                    name: a[2].name
                }
            }
        });
    },
    saveAddress: function() {
        var a = this;
        if (!/^([0-9]{6,12})$/.test(a.data.mobile) && !/^(\d{3,4}-\d{6,9})$/.test(a.data.mobile) && !/^\+?\d[\d -]{8,12}\d/.test(a.data.mobile)) return wx.showToast({
            title: "联系电话格式不正确",
            image: "/images/icon-warning.png"
        }), !1;
        wx.showLoading({
            title: "正在保存",
            mask: !0
        });
        var t = a.data.district;
        t || (t = {
            province: {
                id: ""
            },
            city: {
                id: ""
            },
            district: {
                id: ""
            }
        }), app.request({
            url: api.user.address_save,
            method: "post",
            data: {
                address_id: a.data.address_id || "",
                name: a.data.name,
                mobile: a.data.mobile,
                province_id: t.province.id,
                city_id: t.city.id,
                district_id: t.district.id,
                detail: a.data.detail
            },
            success: function(a) {
                wx.hideLoading(), 0 == a.code && wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack();
                    }
                }), 1 == a.code && wx.showToast({
                    title: a.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    inputBlur: function(a) {
        var t = '{"' + a.currentTarget.dataset.name + '":"' + a.detail.value + '"}';
        this.setData(JSON.parse(t));
    },
    getWechatAddress: function(a) {
        var i = this;
        wx.chooseAddress({
            success: function(t) {
                "chooseAddress:ok" == t.errMsg && (wx.showLoading(), app.request({
                    url: api.user.wechat_district,
                    data: {
                        national_code: t.nationalCode,
                        province_name: t.provinceName,
                        city_name: t.cityName,
                        county_name: t.countyName
                    },
                    success: function(a) {
                        1 == a.code && wx.showModal({
                            title: "提示",
                            content: a.msg,
                            showCancel: !1
                        }), i.setData({
                            name: t.userName || "",
                            mobile: t.telNumber || "",
                            detail: t.detailInfo || "",
                            district: a.data.district
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    }
});