var api = require("../../../api.js"), area_picker = require("../../../area-picker/area-picker.js"), app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        t.getDistrictData(function(a) {
            area_picker.init({
                page: t,
                data: a
            });
        }), wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.mch.user.setting,
            success: function(a) {
                wx.hideLoading(), t.setData(a.data);
            }
        });
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
            edit_district: {
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
    mchCommonCatChange: function(a) {
        this.setData({
            mch_common_cat_index: a.detail.value
        });
    },
    formSubmit: function(a) {
        var t = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.detail.value.form_id = a.detail.formId, a.detail.value.mch_common_cat_id = t.data.mch_common_cat_index ? t.data.mch_common_cat_list[t.data.mch_common_cat_index].id : t.data.mch && t.data.mch.mch_common_cat_id ? t.data.mch.mch_common_cat_id : "", 
        app.request({
            url: api.mch.user.setting_submit,
            method: "post",
            data: a.detail.value,
            success: function(a) {
                wx.hideLoading(), 0 == a.code ? wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                }) : t.showToast({
                    title: a.msg
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
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    uploadLogo: function() {
        var t = this;
        app.uploader.upload({
            start: function(a) {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(a) {
                0 == a.code ? (t.data.mch.logo = a.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: a.msg
                });
            },
            error: function(a) {
                t.showToast({
                    title: a
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    uploadHeaderBg: function() {
        var t = this;
        app.uploader.upload({
            start: function(a) {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(a) {
                0 == a.code ? (t.data.mch.header_bg = a.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: a.msg
                });
            },
            error: function(a) {
                t.showToast({
                    title: a
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});