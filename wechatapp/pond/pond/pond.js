var p_animation, bout, animation, api = require("../../api.js"), app = getApp();

Page({
    data: {
        circleList: [],
        awardList: [],
        colorCircleFirst: "#F12416",
        colorCircleSecond: "#FFFFFF",
        colorAwardDefault: "#F5F0FC",
        colorAwardSelect: "#ffe400",
        indexSelect: 0,
        isRunning: !1,
        prize: !1,
        close: !1,
        lottert: 0,
        animationData: "",
        time: !1,
        title: ""
    },
    onLoad: function(t) {
        var e = this;
        app.pageOnLoad(this, t), app.request({
            url: api.pond.setting,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.title;
                    a && (wx.setNavigationBarTitle({
                        title: a
                    }), e.setData({
                        title: a
                    }));
                }
            }
        });
    },
    onShow: function() {
        var o = this;
        wx.showLoading({
            title: "加载中"
        }), app.request({
            url: api.pond.index,
            success: function(t) {
                var i = t.data.list;
                i.forEach(function(t, a, e) {
                    switch (t.type) {
                      case 1:
                        i[a].name = t.price + "元红包";
                        break;

                      case 2:
                        i[a].name = t.coupon;
                        break;

                      case 3:
                        i[a].name = t.num + "积分", i[a].image_url || (i[a].image_url = "/pond/images/pond-jf.png");
                        break;

                      case 4:
                        i[a].name = t.gift;
                        break;

                      case 5:
                        i[a].name = "谢谢参与", i[a].image_url || (i[a].image_url = "/pond/images/pond-xx.png");
                    }
                }), o.setData({
                    list: i,
                    oppty: t.data.oppty,
                    time: t.data.time,
                    register: t.data.register,
                    integral: t.data.integral
                });
                for (var a = 18, e = 18, n = 0; n < 8; n++) 0 == n ? e = a = 18 : n < 3 ? (a = a, 
                e = e + 196 + 8) : n < 5 ? (e = e, a = a + 158 + 8) : n < 7 ? (e = e - 196 - 8, 
                a = a) : n < 8 && (e = e, a = a - 158 - 8), i[n].topAward = a, i[n].leftAward = e;
                o.setData({
                    awardList: i
                });
            },
            complete: function(t) {
                wx.hideLoading();
                for (var a = 4, e = 4, i = [], n = 0; n < 24; n++) {
                    if (0 == n) a = e = 8; else if (n < 6) e = 4, a += 110; else if (6 == n) e = 8, 
                    a = 660; else if (n < 12) e += 92, a = 663; else if (12 == n) e = 545, a = 660; else if (n < 18) e = 550, 
                    a -= 110; else if (18 == n) e = 545, a = 10; else {
                        if (!(n < 24)) return;
                        e -= 92, a = 5;
                    }
                    i.push({
                        topCircle: e,
                        leftCircle: a
                    });
                }
                o.setData({
                    circleList: i
                }), bout = setInterval(function() {
                    "#FFFFFF" == o.data.colorCircleFirst ? o.setData({
                        colorCircleFirst: "#F12416",
                        colorCircleSecond: "#FFFFFF"
                    }) : o.setData({
                        colorCircleFirst: "#FFFFFF",
                        colorCircleSecond: "#F12416"
                    });
                }, 900), o.pond_animation();
            }
        });
    },
    startGame: function() {
        var o = this;
        if (!o.data.isRunning) if (0 != o.data.oppty) if (o.data.integral) if (o.data.time) {
            clearInterval(p_animation), animation.translate(0, 0).step(), o.setData({
                animationData: animation.export()
            }), o.setData({
                isRunning: !0,
                lottert: 0
            });
            var a = o.data.indexSelect, e = 0, s = o.data.awardList, r = setInterval(function() {
                if (a++, a %= 8, e += 30, o.setData({
                    indexSelect: a
                }), 0 < o.data.lottert && a + 1 == o.data.lottert) {
                    if (clearInterval(r), o.pond_animation(), 5 == s[a].type) var t = 1; else t = 2;
                    o.setData({
                        isRunning: !1,
                        name: s[a].name,
                        num: s[a].id,
                        prize: t
                    });
                }
            }, 200 + e);
            app.request({
                url: api.pond.lottery,
                success: function(i) {
                    if (1 == i.code) return clearInterval(r), wx.showModal({
                        title: "很抱歉",
                        content: i.msg ? i.msg : "网络错误",
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && o.setData({
                                isRunning: !1
                            });
                        }
                    }), void o.pond_animation();
                    "积分不足" == i.msg && o.setData({
                        integral: !1
                    });
                    var n = i.data.id;
                    s.forEach(function(t, a, e) {
                        t.id == n && setTimeout(function() {
                            o.setData({
                                lottert: a + 1,
                                oppty: i.data.oppty
                            });
                        }, 2e3);
                    });
                }
            });
        } else wx.showModal({
            title: "很抱歉",
            content: "活动未开始或已经结束",
            showCancel: !1,
            success: function(t) {
                t.confirm && o.setData({
                    isRunning: !1
                });
            }
        }); else wx.showModal({
            title: "很抱歉",
            content: "积分不足",
            showCancel: !1,
            success: function(t) {
                t.confirm && o.setData({
                    isRunning: !1
                });
            }
        }); else wx.showModal({
            title: "很抱歉",
            content: "抽奖机会不足",
            showCancel: !1,
            success: function(t) {
                t.confirm && o.setData({
                    isRunning: !1
                });
            }
        });
    },
    pondClose: function() {
        this.setData({
            prize: !1
        });
    },
    pond_animation: function() {
        var t = this;
        animation = wx.createAnimation({
            duration: 500,
            timingFunction: "step-start",
            delay: 0,
            transformOrigin: "50% 50%"
        });
        var a = !0;
        p_animation = setInterval(function() {
            a ? (animation.translate(0, 0).step(), a = !1) : (animation.translate(0, -3).step(), 
            a = !0), t.setData({
                animationData: animation.export()
            });
        }, 900);
    },
    onHide: function() {
        clearInterval(bout), clearInterval(p_animation);
    },
    onShareAppMessage: function() {
        return {
            path: "/pond/pond/pond?user_id=" + wx.getStorageSync("user_info").id,
            title: this.data.title ? this.data.title : "九宫格抽奖"
        };
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
            url: api.pond.qrcode,
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