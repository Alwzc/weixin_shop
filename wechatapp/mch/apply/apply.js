var api = require("../../api.js"), area_picker = require("../../area-picker/area-picker.js"), app = getApp();

Page({
    data: {
        is_form_show: !1
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        var t = this;
        t.getDistrictData(function(a) {
            area_picker.init({
                page: t,
                data: a
            });
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.mch.apply,
            success: function(a) {
                wx.hideLoading(), 0 == a.code && (a.data.apply && (a.data.show_result = !0), t.setData(a.data), 
                a.data.apply || t.setData({
                    is_form_show: !0
                }));
            }
        });
    },
    getDistrictData: function(t) {
        var e = wx.getStorageSync("district");
        if (!e) return wx.showLoading({
            title: "正在加载",
            mask: !0
        }), void app.request({
            url: api.default.district,
            success: function(a) {
                wx.hideLoading(), 0 == a.code && (e = a.data, wx.setStorageSync("district", e), 
                t(e));
            }
        });
        t(e);
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    mchCommonCatChange: function(a) {
        this.setData({
            mch_common_cat_index: a.detail.value
        });
    },
    applySubmit: function(a) {
        var t = this;
        !t.data.entry_rules || t.data.agree_entry_rules ? (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 === t.data.mch_common_cat_index && (t.data.mch_common_cat_index = "0"), app.request({
            url: api.mch.apply_submit,
            method: "post",
            data: {
                realname: a.detail.value.realname,
                tel: a.detail.value.tel,
                name: a.detail.value.name,
                province_id: a.detail.value.province_id,
                city_id: a.detail.value.city_id,
                district_id: a.detail.value.district_id,
                address: a.detail.value.address,
                mch_common_cat_id: t.data.mch_common_cat_index ? t.data.mch_common_cat_list[t.data.mch_common_cat_index].id : t.data.apply && t.data.apply.mch_common_cat_id ? t.data.apply.mch_common_cat_id : "",
                service_tel: a.detail.value.service_tel,
                form_id: a.detail.formId,
                wechat_name: a.detail.value.wechat_name
            },
            success: function(a) {
                wx.hideLoading(), 0 == a.code && wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.redirectTo({
                            url: "/mch/apply/apply"
                        });
                    }
                }), 1 == a.code && t.showToast({
                    title: a.msg
                });
            }
        })) : wx.showModal({
            title: "提示",
            content: "请先阅读并同意《入驻协议》。",
            showCancel: !1
        });
    },
    hideApplyResult: function() {
        this.setData({
            show_result: !1,
            is_form_show: !0
        });
    },
    showApplyResult: function() {
        this.setData({
            show_result: !0
        });
    },
    showEntryRules: function() {
        this.setData({
            show_entry_rules: !0
        });
    },
    disagreeEntryRules: function() {
        this.setData({
            agree_entry_rules: !1,
            show_entry_rules: !1
        });
    },
    agreeEntryRules: function() {
        this.setData({
            agree_entry_rules: !0,
            show_entry_rules: !1
        });
    }
});