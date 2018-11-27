var api = require("../../api.js"), app = getApp();

Page({
    data: {
        swiper_current: 0,
        goods: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        },
        topic: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        }
    },
    onLoad: function(a) {
        app.pageOnLoad(this, a), this.loadGoodsList({
            reload: !0,
            page: 1
        }), this.loadTopicList({
            reload: !0,
            page: 1
        });
    },
    tabSwitch: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            swiper_current: t
        });
    },
    swiperChange: function(a) {
        this.setData({
            swiper_current: a.detail.current
        });
    },
    loadGoodsList: function(t) {
        var o = this;
        o.data.goods.is_loading || t.loadmore && !o.data.goods.is_more || (o.data.goods.is_loading = !0, 
        o.setData({
            goods: o.data.goods
        }), app.request({
            url: api.user.favorite_list,
            data: {
                page: t.page
            },
            success: function(a) {
                0 == a.code && (t.reload && (o.data.goods.list = a.data.list), t.loadmore && (o.data.goods.list = o.data.goods.list.concat(a.data.list)), 
                o.data.goods.page = t.page, o.data.goods.is_more = 0 < a.data.list.length, o.setData({
                    goods: o.data.goods
                }));
            },
            complete: function() {
                o.data.goods.is_loading = !1, o.setData({
                    goods: o.data.goods
                });
            }
        }));
    },
    goodsScrollBottom: function() {
        this.loadGoodsList({
            loadmore: !0,
            page: this.data.goods.page + 1
        });
    },
    loadTopicList: function(t) {
        var o = this;
        o.data.topic.is_loading || t.loadmore && !o.data.topic.is_more || (o.data.topic.is_loading = !0, 
        o.setData({
            topic: o.data.topic
        }), app.request({
            url: api.user.topic_favorite_list,
            data: {
                page: t.page
            },
            success: function(a) {
                0 == a.code && (t.reload && (o.data.topic.list = a.data.list), t.loadmore && (o.data.topic.list = o.data.topic.list.concat(a.data.list)), 
                o.data.topic.page = t.page, o.data.topic.is_more = 0 < a.data.list.length, o.setData({
                    topic: o.data.topic
                }));
            },
            complete: function() {
                o.data.topic.is_loading = !1, o.setData({
                    topic: o.data.topic
                });
            }
        }));
    },
    topicScrollBottom: function() {
        this.loadTopicList({
            loadmore: !0,
            page: this.data.topic.page + 1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        this.loadMoreGoodsList();
    }
});