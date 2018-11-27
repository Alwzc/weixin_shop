var api = require("../../api.js"), app = getApp();

Page({
    data: {
        backgrop: [ "navbar-item-active" ],
        navbarArray: [],
        navbarShowIndexArray: 0,
        navigation: !1,
        windowWidth: 375,
        scrollNavbarLeft: 0,
        currentChannelIndex: 0,
        articlesHide: !1
    },
    onLoad: function(a) {
        var t = a.type;
        void 0 !== t && t && this.setData({
            typeid: t
        }), this.systemInfo = wx.getSystemInfoSync(), app.pageOnLoad(this, a);
        this.loadTopicList({
            page: 1,
            reload: !0
        });
        var e = this;
        wx.getSystemInfo({
            success: function(a) {
                e.setData({
                    windowWidth: a.windowWidth
                });
            }
        });
        this.data.navbarArray, this.data.navbarShowIndexArray;
    },
    loadTopicList: function(i) {
        var r = this;
        r.data.is_loading || i.loadmore && !r.data.is_more || (r.setData({
            is_loading: !0
        }), app.request({
            url: api.default.topic_type,
            data: {},
            success: function(a) {
                0 == a.code && r.setData({
                    navbarArray: a.data.list,
                    navbarShowIndexArray: Array.from(Array(a.data.list.length).keys()),
                    navigation: "" != a.data.list
                }), app.request({
                    url: api.default.topic_list,
                    data: {
                        page: i.page
                    },
                    success: function(a) {
                        if (0 == a.code) if (void 0 !== r.data.typeid) {
                            for (var t = 0, e = 0; e < r.data.navbarArray.length && (t += 66, r.data.navbarArray[e].id != r.data.typeid); e++) ;
                            r.setData({
                                scrollNavbarLeft: t
                            }), r.switchChannel(parseInt(r.data.typeid)), r.sortTopic({
                                page: 1,
                                type: r.data.typeid,
                                reload: !0
                            });
                        } else i.reload && r.setData({
                            list: a.data.list,
                            page: i.page,
                            is_more: 0 < a.data.list.length
                        }), i.loadmore && r.setData({
                            list: r.data.list.concat(a.data.list),
                            page: i.page,
                            is_more: 0 < a.data.list.length
                        });
                    },
                    complete: function() {
                        r.setData({
                            is_loading: !1
                        });
                    }
                });
            }
        }));
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onPullDownRefresh: function() {
        var a = this.data.currentChannelIndex;
        this.switchChannel(parseInt(a)), this.sortTopic({
            page: 1,
            type: parseInt(a),
            reload: !0
        }), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var a = this.data.currentChannelIndex;
        this.switchChannel(parseInt(a)), this.sortTopic({
            page: this.data.page + 1,
            type: parseInt(a),
            loadmore: !0
        });
    },
    onTapNavbar: function(i) {
        if ("undefined" == typeof my) {
            var a = i.currentTarget.offsetLeft;
            this.setData({
                scrollNavbarLeft: a - 85
            });
        } else {
            var r = this.data.navbarArray, n = this, s = !0;
            r.forEach(function(a, t, e) {
                i.currentTarget.id == a.id && (s = !1, 1 <= t ? n.setData({
                    toView: r[t - 1].id
                }) : n.setData({
                    toView: -1
                }));
            }), s && n.setData({
                toView: "0"
            });
        }
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), this.switchChannel(parseInt(i.currentTarget.id)), this.sortTopic({
            page: 1,
            type: i.currentTarget.id,
            reload: !0
        });
    },
    sortTopic: function(t) {
        var e = this;
        app.request({
            url: api.default.topic_list,
            data: t,
            success: function(a) {
                0 == a.code && (t.reload && e.setData({
                    list: a.data.list,
                    page: t.page,
                    is_more: 0 < a.data.list.length
                }), t.loadmore && e.setData({
                    list: e.data.list.concat(a.data.list),
                    page: t.page,
                    is_more: 0 < a.data.list.length
                }), wx.hideLoading());
            }
        });
    },
    switchChannel: function(i) {
        var a = this.data.navbarArray, t = new Array();
        -1 == i ? t[1] = "navbar-item-active" : 0 == i && (t[0] = "navbar-item-active"), 
        a.forEach(function(a, t, e) {
            a.type = "", a.id == i && (a.type = "navbar-item-active");
        }), this.setData({
            navbarArray: a,
            currentChannelIndex: i,
            backgrop: t
        });
    }
});