var api = require("../../api.js"), app = getApp(), is_loading_more = !1, is_no_more = !1;

Page({
    data: {
        page: 1,
        video_list: [],
        url: "",
        hide: "hide",
        show: !1,
        animationData: {}
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a);
        this.loadMoreGoodsList(), is_no_more = is_loading_more = !1;
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    loadMoreGoodsList: function() {
        var t = this;
        if (!is_loading_more) {
            t.setData({
                show_loading_bar: !0
            }), is_loading_more = !0;
            var i = t.data.page;
            app.request({
                url: api.default.video_list,
                data: {
                    page: i
                },
                success: function(a) {
                    0 == a.data.list.length && (is_no_more = !0);
                    var o = t.data.video_list.concat(a.data.list);
                    t.setData({
                        video_list: o,
                        page: i + 1
                    });
                },
                complete: function() {
                    is_loading_more = !1, t.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    play: function(a) {
        var o = a.currentTarget.dataset.index;
        wx.createVideoContext("video_" + this.data.show_video).pause(), this.setData({
            show_video: o,
            show: !0
        });
    },
    onReachBottom: function() {
        is_no_more || this.loadMoreGoodsList();
    },
    more: function(a) {
        var o = this, t = a.target.dataset.index, i = o.data.video_list, e = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = e, -1 != i[t].show ? (e.rotate(0).step(), i[t].show = -1) : (e.rotate(0).step(), 
        i[t].show = 0), o.setData({
            video_list: i,
            animationData: this.animation.export()
        });
    }
});