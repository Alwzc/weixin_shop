var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        var t = this;
        app.request({
            url: api.integral.explain,
            data: {},
            success: function(n) {
                0 == n.code && t.setData({
                    integral_shuoming: n.data.setting.integral_shuoming
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});