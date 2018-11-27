var interval, api = require("../../api.js"), app = getApp();

Page({
    ctx: null,
    data: {
        isStart: !0,
        name: "",
        monitor: "",
        detect: !0,
        type: 5,
        error: "",
        oppty: 0,
        log: [],
        register: !0,
        award_name: !1
    },
    onShow: function() {
        wx.showLoading({
            title: "加载中"
        });
        var i = this;
        app.request({
            url: api.scratch.setting,
            success: function(t) {
                var a = t.data.setting;
                a.title && wx.setNavigationBarTitle({
                    title: a.title
                }), i.setData({
                    title: a.title,
                    deplete_register: a.deplete_register,
                    register: null == a.deplete_register || 0 == a.deplete_register
                }), app.request({
                    url: api.scratch.index,
                    success: function(t) {
                        if (0 == t.code) {
                            var a = t.data.list, e = i.setName(a);
                            console.log("name=>" + e), i.setData({
                                name: e,
                                oppty: t.data.oppty,
                                id: a.id,
                                type: a.type
                            });
                        } else i.setData({
                            error: t.msg,
                            isStart: !0,
                            oppty: t.data.oppty
                        });
                    },
                    complete: function(t) {
                        wx.hideLoading();
                    }
                });
            }
        }), app.request({
            url: api.scratch.log,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data;
                    for (var e in a) a[e].name = i.setName(a[e]);
                    i.setData({
                        log: a
                    });
                }
            }
        }), this.init(), interval = setInterval(function() {
            app.request({
                url: api.scratch.log,
                success: function(t) {
                    if (0 == t.code) {
                        var a = t.data;
                        for (var e in a) a[e].name = i.setName(a[e]);
                        i.setData({
                            log: a
                        });
                    }
                }
            });
        }, 1e4);
    },
    onLoad: function(t) {
        app.pageOnLoad(this, t);
    },
    register: function() {
        this.data.error ? wx.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }) : (this.setData({
            register: !0
        }), this.init());
    },
    init: function() {
        var t = wx.createSelectorQuery(), s = this;
        s.setData({
            award_name: !1
        }), t.select("#frame").boundingClientRect(), t.exec(function(t) {
            var a = t[0].width, e = t[0].height;
            s.setData({
                r: 16,
                lastX: "",
                lastY: "",
                minX: "",
                minY: "",
                maxX: "",
                maxY: "",
                canvasWidth: a,
                canvasHeight: e
            });
            var i = wx.createCanvasContext("scratch");
            i.drawImage("/scratch/images/scratch_hide_2.png", 0, 0, a, e), s.ctx = i, "undefined" == typeof my ? i.draw(!1, function(t) {
                s.setData({
                    award_name: !0
                });
            }) : i.draw(!0), s.setData({
                isStart: !0,
                isScroll: !0
            });
        });
    },
    onReady: function() {
        "undefined" != typeof my && this.init();
    },
    onStart: function() {
        this.setData({
            register: null == this.data.deplete_register || 0 == this.data.deplete_register,
            name: this.data.monitor,
            isStart: !0,
            award: !1,
            award_name: !1
        }), this.init();
    },
    drawRect: function(t, a) {
        var e = this.data.r / 2, i = 0 < t - e ? t - e : 0, s = 0 < a - e ? a - e : 0;
        return "" !== this.data.minX ? this.setData({
            minX: this.data.minX > i ? i : this.data.minX,
            minY: this.data.minY > s ? s : this.data.minY,
            maxX: this.data.maxX > i ? this.data.maxX : i,
            maxY: this.data.maxY > s ? this.data.maxY : s
        }) : this.setData({
            minX: i,
            minY: s,
            maxX: i,
            maxY: s
        }), this.setData({
            lastX: i,
            lastY: s
        }), [ i, s, 2 * e ];
    },
    clearArc: function(t, a, e) {
        var i = this.data.r, s = this.ctx, o = i - e, r = Math.sqrt(i * i - o * o), n = t - o, c = a - r, d = 2 * o, h = 2 * r;
        e <= i && (s.clearRect(n, c, d, h), e += 1, this.clearArc(t, a, e));
    },
    touchStart: function(t) {
        if (this.setData({
            award_name: !0
        }), this.data.isStart) if (this.data.error) wx.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }); else ;
    },
    touchMove: function(t) {
        if (this.data.isStart && !this.data.error) {
            this.drawRect(t.touches[0].x, t.touches[0].y), this.clearArc(t.touches[0].x, t.touches[0].y, 1), 
            this.ctx.draw(!0);
        }
    },
    touchEnd: function(t) {
        if (this.data.isStart && !this.data.error) {
            var e = this, a = this.data.canvasWidth, i = this.data.canvasHeight, s = this.data.minX, o = this.data.minY, r = this.data.maxX, n = this.data.maxY;
            .4 * a < r - s && .4 * i < n - o && this.data.detect && (e.setData({
                detect: !1
            }), console.log("LOGID", e.data.id), app.request({
                url: api.scratch.receive,
                data: {
                    id: e.data.id
                },
                success: function(t) {
                    if (0 == t.code) {
                        e.setData({
                            award: 5 != e.data.type,
                            isStart: !1,
                            isScroll: !0
                        }), e.ctx.draw();
                        var a = t.data.list;
                        t.data.oppty <= 0 || "" == a ? e.setData({
                            monitor: "谢谢参与",
                            error: t.msg ? t.msg : "机会已用完",
                            detect: !0,
                            type: 5,
                            oppty: t.data.oppty
                        }) : e.setData({
                            monitor: e.setName(a),
                            id: a.id,
                            detect: !0,
                            type: a.type,
                            oppty: t.data.oppty
                        });
                    } else e.setData({
                        monitor: "谢谢参与",
                        detect: !0
                    }), wx.showModal({
                        title: "提示",
                        content: t.msg ? t.msg : "网络异常，请稍后重试",
                        showCancel: !1
                    }), e.onStart();
                }
            }));
        }
    },
    setName: function(t) {
        var a = "";
        switch (t.type) {
          case 1:
            a = t.price + "元红包";
            break;

          case 2:
            a = t.coupon;
            break;

          case 3:
            a = t.num + "积分";
            break;

          case 4:
            a = t.gift;
            break;

          default:
            a = "谢谢参与";
        }
        return a;
    },
    onShareAppMessage: function() {
        return {
            path: "/scratch/index/index?user_id=" + wx.getStorageSync("user_info").id,
            title: this.data.title ? this.data.title : "刮刮卡"
        };
    },
    onHide: function() {
        clearInterval(interval);
    },
    onUnload: function() {
        clearInterval(interval);
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active"
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: ""
        });
    },
    getGoodsQrcode: function() {
        var a = this;
        if (a.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), a.data.goods_qrcode) return !0;
        app.request({
            url: api.scratch.qrcode,
            success: function(t) {
                0 == t.code && a.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [ a ]
        });
    },
    qrcodeClose: function() {
        this.setData({
            qrcode_active: ""
        });
    },
    saveQrcode: function() {
        var a = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), wx.downloadFile({
            url: a.data.goods_qrcode,
            success: function(t) {
                wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        wx.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(t) {
                        wx.hideLoading();
                    }
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "图片下载失败",
                    content: t.errMsg + ";" + a.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});