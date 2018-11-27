var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    formSubmit: function(n) {
        app.saveFormId(n.detail.formId);
    },
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    send: function() {
        app.request({
            url: "",
            success: function(n) {}
        });
    }
});