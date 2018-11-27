module.exports = function(e) {
    var t = getCurrentPages();
    if (t.length) {
        var o = t[t.length - 1];
        if (o && "pages/login/login" != o.route) if ("undefined" != typeof my) {
            var g = wx.getStorageSync("last_page_options"), n = {
                route: t[t.length - 1].route,
                options: g || {}
            };
            wx.setStorageSync("login_pre_page", n);
        } else wx.setStorageSync("login_pre_page", o);
    }
    wx.redirectTo({
        url: "/pages/login/login"
    });
};