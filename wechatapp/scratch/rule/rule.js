var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var t = this;
        app.pageOnLoad(this, a), app.request({
            url: api.scratch.setting,
            success: function(a) {
                0 == a.code && t.setData({
                    rule: a.data.setting.rule
                });
            }
        });
    }
});