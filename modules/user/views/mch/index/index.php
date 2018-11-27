<?php
defined('YII_ENV') or exit('Access Denied');
/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/6/19
 * Time: 16:52
 * @var \yii\web\View $this
 */
$urlManager = Yii::$app->urlManager;
$this->title = '我的商城';
?>
<style>
    .home-row {
        margin-right: -.5rem;
        margin-left: -.5rem;
    }

    .home-row .home-col {
        padding-left: .5rem;
        padding-right: .5rem;
        margin-bottom: 1rem;
    }

    .panel-1 {
        height: 10rem;
    }

    .panel-2 {
        height: 10rem;
    }

    .panel-3 {
        height: 30rem;
    }

    .panel-4 {
        height: 17rem;
    }

    .panel-5 {
        height: 30rem;
    }

    .panel-6 {
        height: 12rem;
    }

    .panel-2 hr {
        border-top-color: #eee;
    }

    .panel-2-item {
        height: 8rem;
        border-right: 1px solid #eee;
    }

    .panel-2-item .item-icon {
        width: 42px;
        height: 42px;
    }

    .panel-2-item > div {
        padding: 0 0;
    }

    @media (min-width: 1100px) {
        .panel-2-item > div {
            padding: 0 1rem;
        }
    }

    @media (min-width: 1300px) {
        .panel-2-item > div {
            padding: 0 2rem;
        }
    }

    @media (min-width: 1500px) {
        .panel-2-item > div {
            padding: 0 3.5rem;
        }
    }

    @media (min-width: 1700px) {
        .panel-2-item > div {
            padding: 0 5rem;
        }
    }

    .panel-3-item {
        height: calc(13rem - 50px);
    }

    .panel .panel-body .tab-body {
        display: none;
    }

    .panel .panel-body .tab-body.active {
        display: block;
    }

    .panel .panel-header .tab-body {
        display: none;
    }

    .panel .panel-header .tab-body.active {
        display: block;
    }

    .panel-5 table {
        table-layout: fixed;
        margin-top: -1rem;
    }

    .panel-5 td:nth-of-type(2) div {
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .panel-5 table th {
        border-top: none;
    }

    .panel-5 .table td, .panel-5 .table th {
        padding: .5rem;
    }

    .panel-6 .user-top-list {
        margin-left: -1rem;
        white-space: nowrap;
    }

    .panel-6 .user-top-item {
        display: inline-block;
        width: 75px;
        margin-left: 1rem;
    }

    .panel-6 .user-avatar {
        background-size: cover;
        width: 100%;
        height: 75px;
        background-position: center;
        margin-bottom: .2rem;
    }

    .panel-6 .user-nickname,
    .panel-6 .user-money {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.25;
    }

    .goodsNum,.orderNum{
        height: 4.5rem;
        width: 4.5rem; 
        margin: 0 auto;      
    }

    .card{
        height: 4.5rem;
        width: 4.5rem;
        background-color: black;
        color: white;
        text-align: center;
        margin: 0 auto;
    }

    .url-to {
        cursor: pointer;
    }
</style>
<div class="row home-row" id="app" style="display: none">
    <div v-if="loading" class="col-sm-12 text-center" style="margin-top: 20rem;">
        <svg width='50px' height='50px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
             preserveAspectRatio="xMidYMid" class="uil-default">
            <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(0 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.8s' repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(45 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.7000000000000001s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(90 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.6000000000000001s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(135 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.5s' repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(180 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.4s' repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(225 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.30000000000000004s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(270 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.2s' repeatCount='indefinite'/>
            </rect>
            <rect x='45' y='38' width='10' height='24' rx='4' ry='4' fill='#000000'
                  transform='rotate(315 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='0.8s' begin='-0.1s' repeatCount='indefinite'/>
            </rect>
        </svg>
        <div class="text-muted">数据加载中</div>
    </div>
    <div class="home-col col-md-4">
        <div class="panel panel-1" v-if="panel_1">
            <div class="panel-header">商城信息</div>
            <div class="panel-body">
                <div class="row">
                    <div class="text-center url-to goodsNum"
                         data-url="<?= $urlManager->createUrl(['user/mch/goods/index']) ?>">
                        <div style="font-size: 1.75rem">{{panel_1.goods_count}}</div>
                        <div>商品数</div>
                    </div>
                    <div class="text-center url-to orderNum"
                         data-url="<?= $urlManager->createUrl(['user/mch/order/index']) ?>">
                        <div style="font-size: 1.75rem">{{panel_1.order_count}}</div>
                        <div>订单数</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="home-col col-12 col-md-8">
        <div class="panel panel-2" v-if="panel_2">
            <div class="panel-body">
                <div class="row">
                    <div class="col-4 panel-2-item" flex="cross:center main:center">
                        <div flex="dir:left box:mean" class="w-100">
                            <div flex="cross:center">
                                <img class="mr-3 item-icon"
                                     src="<?= Yii::$app->request->baseUrl ?>/statics/images/mch-home/1.png">
                            </div>
                            <div style="text-align: center" class="url-to"
                                 data-url="<?= $urlManager->createUrl(['user/mch/goods/index']) ?>">
                                <div style="font-size: 1.75rem">{{panel_2.goods_zero_count}}</div>
                                <div>已售罄商品</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-4 panel-2-item" flex="cross:center main:center">
                        <div flex="dir:left box:mean" class="w-100">
                            <div flex="cross:center">
                                <img class="mr-3 item-icon"
                                     src="<?= Yii::$app->request->baseUrl ?>/statics/images/mch-home/2.png">
                            </div>
                            <div style="text-align: center" class="url-to"
                                 data-url="<?= $urlManager->createUrl(['user/mch/order/index', 'status' => 1]) ?>">
                                <div style="font-size: 1.75rem">{{panel_2.order_no_send_count}}</div>
                                <div>待发货订单</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-4 panel-2-item" flex="cross:center main:center">
                        <div flex="dir:left box:mean" class="w-100">
                            <div flex="cross:center">
                                <img class="mr-3 item-icon"
                                     src="<?= Yii::$app->request->baseUrl ?>/statics/images/mch-home/3.png">
                            </div>
                            <div style="text-align: center" class="url-to"
                                 data-url="<?= $urlManager->createUrl(['user/mch/goods/refund', 'status' => 0]) ?>">
                                <div style="font-size: 1.75rem">{{panel_2.order_refunding_count}}</div>
                                <div>维权中订单</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="home-col col-md-6">
        <div class="panel panel-3 mb-3" v-if="panel_3">
            <div class="panel-header">
                <span>订单概述</span>
                <ul class="nav nav-right">
                    <li class="nav-item">
                        <a class="nav-link active big" href="javascript:" data-tab=".tab-1" data-index="date">按日统计</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link big" href="javascript:" data-tab=".tab-2" data-index="month">按月统计</a>
                    </li>
                    <li class="nav-item" hidden>
                        <a class="nav-link big" href="javascript:" data-tab=".tab-3" data-index="year">按年统计</a>
                    </li>
                </ul>
            </div>
            <div class="panel-header">
                <div class="tab-body tab-1 active">
                    <ul class="nav nav-right">
                        <li class="nav-item">
                            <a class="nav-link active small" href="javascript:" data-tab="0">今日</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="1">昨日</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="2">最近7天</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="3">最近30天</a>
                        </li>
                    </ul>
                </div>
                <div class="tab-body tab-2">
                    <ul class="nav nav-right">
                        <?php for ($i = 0; $i < 12;
                        $i++) :
    if ($i >= date('m')) {
        break;
    } ?>
                            <li class="nav-item">
                                <a class="nav-link active small" href="javascript:" data-tab="<?= $i ?>"><?= $i + 1 ?>月</a>
                            </li>
                        <?php endfor; ?>
                        <!--
                        <li class="nav-item">
                            <a class="nav-link active small" href="javascript:" data-tab="0">1月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="1">2月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="2">3月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="3">4月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="4">5月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="5">6月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="6">7月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="7">8月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="8">9月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="9">10月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="10">11月</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab="11">12月</a>
                        </li>
                        -->
                    </ul>
                </div>
                <div class="tab-body tab-3" hidden>
                    <ul class="nav nav-right">
                        <li class="nav-item">
                            <a class="nav-link active small" href="javascript:" data-tab=".tab-1">今年</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link small" href="javascript:" data-tab=".tab-2">去年</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="panel-body" v-if="show_panel_3">
                <div class="tab-body tab-1 active">
                    <div class="row">
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_count}}
                                </div>
                                <div class="">订单数量</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_price_count}}
                                </div>
                                <div class="">成交额（元）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_price_average}}
                                </div>
                                <div class="">平均消费（元）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_goods_count}}
                                </div>
                                <div class="">成交量（件）</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-body tab-2">
                    <div class="row">
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_count}}
                                </div>
                                <div class="">月成交订单数（件）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_price_count}}
                                </div>
                                <div class="">月成交额（元）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_price_average}}
                                </div>
                                <div class="">平均消费（元）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_goods_count}}
                                </div>
                                <div class="">月成交量（件）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.day_order_price_count}}
                                </div>
                                <div class="">日均成交额（元）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{show_panel_3.order_price_compare}}
                                </div>
                                <div class="">对比上月（元）</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="home-col col-md-6">
        <div class="panel panel-5 mb-3" v-if="panel_5">
            <div class="panel-header">
                <span>商品销量排行</span>
                <ul class="nav nav-right">
                    <li class="nav-item">
                        <a class="nav-link active small" href="javascript:" data-tab="0">今日</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link small" href="javascript:" data-tab="1">昨日</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link small" href="javascript:" data-tab="2">最近7天</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link small" href="javascript:" data-tab="3">最近30天</a>
                    </li>
                </ul>
            </div>
            <div class="panel-body">
                <div class="tab-body tab-1 active">
                    <table class="table">
                        <col style="width: 10%">
                        <col style="width: 75%">
                        <col style="width: 15%">
                        <thead>
                        <tr>
                            <th>排名</th>
                            <th>商品名称</th>
                            <th class="text-center">成交数量</th>
                        </tr>
                        </thead>
                        <tr v-if="show_panel_5.length==0">
                            <td colspan="3" class="text-center">暂无销售记录</td>
                        </tr>
                        <tr v-else v-for="(item,index) in show_panel_5">
                            <td>{{index+1}}</td>
                            <td>
                                <div>{{item.name}}</div>
                            </td>
                            <td class="text-center">{{item.num}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            loading: true,
            panel_1: null,
            panel_2: null,
            panel_3: null,
            panel_5: null,
            show_panel_1: null,
            show_panel_2: null,
            show_panel_3: null,
            show_panel_5: null,
            panel_3_index: null
        }
    });
    $('#app').show();
    $.ajax({
        dataType: 'json',
        success: function (res) {
            app.loading = false;
            $.loadingHide();
            if (res.code != 0) {
                $.alert({
                    content: res.msg,
                });
                return;
            }
            app.panel_1 = res.data.panel_1;
            app.panel_2 = res.data.panel_2;
            app.panel_3 = res.data.panel_3;
            app.panel_5 = res.data.panel_5;
            app.panel_3_index = 'date';
            app.show_panel_3 = app.panel_3['date'][0];
            app.show_panel_5 = app.panel_5[0];

        }
    });

    $(document).on('mouseenter', '.goodsNum', function (){
        $(".goodsNum").addClass("card");
    });
    $(document).on('mouseleave', '.goodsNum', function (){
        $(".goodsNum").removeClass("card");
    });
    $(document).on('mouseenter', '.orderNum', function (){
        $(".orderNum").addClass("card");
    });
    $(document).on('mouseleave', '.orderNum', function (){
        $(".orderNum").removeClass("card");
    });

    $(document).on('click', '.url-to', function () {
        window.location.href = $(this).data('url');
    });

    $(document).on('click', '.panel-3 .panel-header .nav-link.small', function () {
        $(this).parents('.panel').find('.nav-link.small').removeClass('active');
        var target = $(this).attr('data-tab');
        $(this).addClass('active');
        app.show_panel_3 = app.panel_3[app.panel_3_index][target]
    });

    $(document).on('click', '.panel-5 .panel-header .nav-link.small', function () {
        $(this).parents('.panel').find('.nav-link.small').removeClass('active');
        var target = $(this).attr('data-tab');
        $(this).addClass('active');
        app.show_panel_5 = app.panel_5[target]
    });

    $(document).on('click', '.panel .panel-header .nav-link.big', function () {
        $(this).parents('.panel').find('.nav-link.big').removeClass('active');
        $(this).parents('.panel').find('.tab-body').removeClass('active');
        $(this).parents('.panel').find('.nav-link.small').removeClass('active');
        var target = $(this).attr('data-tab');
        $(this).addClass('active');
        var index = $(this).data('index');
        $(this).parents('.panel').find(target).addClass('active');
        app.panel_3_index = index;
        if (index == 'month') {
            var date = new Date;
            var month = date.getMonth();
            app.show_panel_3 = app.panel_3[index][month];
            $(this).parents('.panel').find(target).find('.nav-item:nth-child(' + (month + 1) + ')').find('.nav-link.small').addClass('active');
        } else {
            $(this).parents('.panel').find(target).find('.nav-link.small:first').addClass('active');
            app.show_panel_3 = app.panel_3[index][0];
        }
    });
</script>