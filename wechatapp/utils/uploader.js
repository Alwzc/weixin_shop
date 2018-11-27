module.exports = {
    upload: function(a) {
        var e = getApp();
        function o(t) {
            "function" == typeof a.start && a.start(t), wx.uploadFile({
                url: a.url || e.api.default.upload_image,
                filePath: t.path,
                name: a.name || "image",
                formData: a.data || {},
                success: function(t) {
                    200 == t.statusCode ? "function" == typeof a.success && (t.data = JSON.parse(t.data), 
                    a.success(t.data)) : "function" == typeof a.error && a.error("上传错误：" + t.statusCode + "；" + t.data), 
                    a.complete();
                },
                fail: function(t) {
                    "function" == typeof a.error && a.error(t.errMsg), a.complete();
                }
            });
        }
        (a = a || {}).complete = a.complete || function() {}, a.data = a.data || {}, a.data._uniacid = a.data._uniacid || e.siteInfo.uniacid, 
        a.data._acid = a.data._acid || e.siteInfo.acid, wx.chooseImage({
            count: 1,
            success: function(t) {
                if (t.tempFiles && 0 < t.tempFiles.length) {
                    var e = t.tempFiles[0];
                    o(e);
                } else "function" == typeof a.error && a.error("请选择文件"), a.complete();
            },
            fail: function(t) {
                "function" == typeof a.error && (a.error("请选择文件"), a.complete());
            }
        });
    }
};