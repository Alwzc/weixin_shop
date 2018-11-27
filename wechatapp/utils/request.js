module.exports = function(o) {
    o.data || (o.data = {});
    var a = wx.getStorageSync("access_token");
    a && (o.data.access_token = a), o.data._uniacid = this.siteInfo.uniacid, o.data._acid = this.siteInfo.acid, 
    o.data._version = this._version, "undefined" != typeof wx && (o.data._platform = "wx"), 
    "undefined" != typeof my && (o.data._platform = "my"), wx.request({
        url: o.url,
        header: o.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: o.data || {},
        method: o.method || "GET",
        dataType: o.dataType || "json",
        success: function(a) {
            if (-1 == a.data.code) {
                var e = getCurrentPages(), t = e[e.length - 1];
                t ? "pages/login/login" != t.route ? getApp().login() : console.log("Login Page Do Not Login") : getApp().login();
            } else -2 == a.data.code ? wx.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : o.success && o.success(a.data);
        },
        fail: function(a) {
            console.warn("--- request fail >>>"), console.warn("--- " + o.url + " ---"), console.warn(a), 
            console.warn("<<< request fail ---");
            var e = getApp();
            e.is_on_launch ? (e.is_on_launch = !1, wx.showModal({
                title: "网络请求出错",
                content: a.errMsg || "",
                showCancel: !1,
                success: function(a) {
                    a.confirm && o.fail && o.fail(a);
                }
            })) : (wx.showToast({
                title: a.errMsg,
                image: "/images/icon-warning.png"
            }), o.fail && o.fail(a));
        },
        complete: function(e) {
            if (200 != e.statusCode && e.data.code && 500 == e.data.code) {
                var a = e.data.data.message;
                wx.showModal({
                    title: "系统错误",
                    content: a + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(a) {
                        a.confirm && wx.setClipboardData({
                            data: JSON.stringify({
                                data: e.data.data,
                                object: o
                            })
                        });
                    }
                });
            }
            o.complete && o.complete(e);
        }
    });
};