var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var e = this;
        app.pageOnLoad(this, a), app.request({
            url: api.pond.setting,
            success: function(a) {
                0 != a.code || e.setData({
                    rule: a.data.rule
                });
            }
        });
    }
});