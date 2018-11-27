var api = require("../../../api.js"), app = getApp(), is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this, t), is_loading = is_no_more = !1, p = 2;
        var a = this;
        a.setData({
            gid: t.id
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.comment,
            data: {
                gid: t.id
            },
            success: function(t) {
                wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code && (0 == t.data.comment.length && wx.showModal({
                    title: "提示",
                    content: "暂无评价",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), a.setData({
                    comment: t.data.comment
                })), a.setData({
                    show_no_data_tip: 0 == a.data.comment.length
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var n = this;
        is_loading || is_no_more || (is_loading = !0, app.request({
            url: api.group.comment,
            data: {
                gid: n.data.gid,
                page: p
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = n.data.comment.concat(t.data.comment);
                    n.setData({
                        comment: a
                    }), 0 == t.data.comment.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    onShareAppMessage: function() {},
    bigToImage: function(t) {
        var a = this.data.comment[t.target.dataset.index].pic_list;
        wx.previewImage({
            current: t.target.dataset.url,
            urls: a
        });
    }
});