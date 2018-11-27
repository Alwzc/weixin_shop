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
$this->params['active_nav_group'] = 0;
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
        height: 15rem;
    }

    .panel-4 {
        height: 17rem;
    }

    .panel-5 {
        height: 20rem;
    }

    .panel-6 {
        height: 22rem;
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

    .panel-foot{
        margin-top: -4rem;
        margin-left: 11%;
    }

    .panel-foot ul{
        padding-left: 0;
    }

    .panel-foot li{
        width: 5%;
        height: 3rem;
        list-style: none;
        white-space:nowrap;
        float: left;
        margin-right: 4.8%;
    }

    .panel-foot img{
        width: 100%;
    }

    .userNum,.goodsNum,.orderNum{
        height: 4.5rem;
        width: 4.5rem; 
        margin: 0 auto;
        cursor:pointer;       
    }

    .card{
        height: 4.5rem;
        width: 4.5rem;
        background-color: black;
        color: white;
        text-align: center;
        margin: 0 auto;
    }

    .panel-6 .user-nickname,
    .panel-6 .user-money {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.25;
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

    <div class="home-col col-md-5">
        <div class="panel panel-1" v-if="panel_1">
            <div class="panel-header">商城信息</div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-4 text-center">
                        <div class="userNum text-center" onclick="window.location.href=`<?= $urlManager->createUrl('/mch/user/index') ?>`;return false">
                            <div style="font-size: 1.75rem;width: 100%">{{panel_1.user_count}}</div>
                            <div>用户数</div>
                        </div>

                    </div>
                    <div class="col-4 text-center">
                        <div class="goodsNum text-center" onclick="window.location.href=`<?= $urlManager->createUrl('/mch/goods/goods') ?>`;return false">
                            <div style="font-size: 1.75rem;width: 100%">{{panel_1.goods_count}}</div>
                            <div>商品数</div>
                        </div>
                    </div>
                    <div class="col-4 text-center">
                        <div class="orderNum text-center" onclick="window.location.href=`<?= $urlManager->createUrl('/mch/order/index') ?>`;return false">
                            <div style="font-size: 1.75rem;width: 100%">
                                {{panel_1.order_count}}
                            </div>
                            <div>订单数</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="home-col col-md-7">
        <div class="panel panel-2" v-if="panel_2">
            <div class="panel-body">
                <div class="row">
                    <div class="col-4 panel-2-item" flex="cross:center main:center">
                        <div flex="dir:left box:last" class="w-100">
                            <div flex="cross:center">
                                <img class="mr-3 item-icon"
                                     src="<?= Yii::$app->request->baseUrl ?>/statics/images/mch-home/1.png">
                            </div>
                            <div style="width: 100px;text-align: center">
                                <div style="font-size: 1.75rem">{{panel_2.goods_zero_count}}</div>
                                <div>已售罄商品</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-4 panel-2-item" flex="cross:center main:center">
                        <div flex="dir:left box:last" class="w-100">
                            <div flex="cross:center">
                                <img class="mr-3 item-icon"
                                     src="<?= Yii::$app->request->baseUrl ?>/statics/images/mch-home/2.png">
                            </div>
                            <div style="width: 100px;text-align: center">
                                <div style="font-size: 1.75rem">{{panel_2.order_no_send_count}}</div>
                                <div>待发货订单</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-4 panel-2-item" flex="cross:center main:center">
                        <div flex="dir:left box:last" class="w-100">
                            <div flex="cross:center">
                                <img class="mr-3 item-icon"
                                     src="<?= Yii::$app->request->baseUrl ?>/statics/images/mch-home/3.png">
                            </div>
                            <div style="width: 100px;text-align: center">
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
        <div class="panel panel-5 mb-3" v-if="panel_5">
            <div class="panel-header">
                <span>商品销量排行</span>
                <ul class="nav nav-right goods_statistics">
                    <li class="nav-item">
                        <input hidden value="1">
                        <a class="nav-link active" href="javascript:" data-tab=".tab-1">今日</a>
                    </li>
                    <li class="nav-item">
                        <input hidden value="2">
                        <a class="nav-link" href="javascript:" data-tab=".tab-1">昨日</a>
                    </li>
                    <li class="nav-item">
                        <input hidden value="3">
                        <a class="nav-link" href="javascript:" data-tab=".tab-1">最近7天</a>
                    </li>
                    <li class="nav-item">
                        <input hidden value="4">
                        <a class="nav-link" href="javascript:" data-tab=".tab-1">最近30天</a>
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
                        <tr v-if="panel_5.data_1.length==0">
                            <td colspan="3" class="text-center">暂无销售记录</td>
                        </tr>
                        <tr v-else v-for="(item,index) in panel_5.data_1">
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
        <div class="panel panel-4" v-if="panel_4">
            <div class="panel-body">
                <div id="echarts_1" style="height:15rem;"></div>
            </div>
        </div>
    </div>
    <div class="home-col col-md-6">

        <div class="panel panel-3 mb-3" v-if="panel_3">

            <div class="panel-header">
                <span>订单概述</span>
                <ul class="nav nav-right order_statistics">
                    <li class="nav-item">
                        <input hidden value="1">
                        <a class="nav-link active" href="javascript:" data-tab=".tab-1">今日</a>
                    </li>
                    <li class="nav-item">
                        <input hidden value="2">
                        <a class="nav-link" href="javascript:" data-tab=".tab-1">昨日</a>
                    </li>
                    <li class="nav-item">
                        <input hidden value="3">
                        <a class="nav-link" href="javascript:" data-tab=".tab-1">最近7天</a>
                    </li>
                    <li class="nav-item">
                        <input hidden value="4">
                        <a class="nav-link" href="javascript:" data-tab=".tab-1">最近30天</a>
                    </li>
                </ul>
            </div>
            <div class="panel-body">
                <div class="tab-body tab-1 active">
                    <div class="row">
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{panel_3.data_1.order_goods_count}}
                                </div>
                                <div class="">成交量（件）</div>
                            </div>

                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{panel_3.data_1.order_price_count}}
                                </div>
                                <div class="">成交额（元）</div>
                            </div>
                        </div>
                        <div class="col-sm-4 panel-3-item" flex="cross:center main:center">
                            <div class="text-center">
                                <div style="font-size: 1.75rem;color: #facf5b;">{{panel_3.data_1.order_price_average}}
                                </div>
                                <div class="">订单平均消费（元）</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-6" v-if="panel_6">
            <div class="panel-body">
                <div id="echarts_2" style="height:21rem;"></div>
                <div class="panel-foot" id="footer">
                    <ul>
                        <li v-for='avatar in panel_6'>
                            <img :src="avatar.avatar">
                        </li>                        
                    </ul>
                </div>
            </div>
        </div>

    </div>
</div>

<script src="<?= Yii::$app->request->baseUrl ?>/statics/echarts/echarts.min.js"></script>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            loading: true,
            panel_1: null,
            panel_2: null,
            panel_3: null,
            panel_4: null,
            panel_5: null,
            panel_6: null,
        },
    });
    $('#app').show();
    $(document).on('click', '.panel .panel-header .nav-link', function () {
        $(this).parents('.panel').find('.nav-link').removeClass('active');
        $(this).parents('.panel').find('.tab-body').removeClass('active');
        var target = $(this).attr('data-tab');
        $(this).addClass('active');
        $(this).parents('.panel').find(target).addClass('active');
    });

    $(document).on('click', '.goods_statistics .nav-link', function () {
        $.loading();
        var val = $('.goods_statistics .active').prev().val();
        $.ajax({
            url: '<?= $urlManager->createUrl('mch/store/index')?>',
            method: 'GET',
            dataType: 'json',
            data: {
                sign: val,
                type: 'goods'
            },
            success: function (res) {
                $.loadingHide();
                if (res.code != 0) {
                    $.alert({
                        content: res.msg,
                    });
                    return;
                }
                app.panel_5 = res.data.panel_5;
            }
        })
    });

    $(document).on('mouseenter', '.userNum', function (){
        $(".userNum").addClass("card");
    });
    $(document).on('mouseleave', '.userNum', function (){
        $(".userNum").removeClass("card");
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

    $(document).on('click', '.order_statistics .nav-link', function () {
        $.loading();
        var val = $('.order_statistics .active').prev().val();
        $.ajax({
            url: '<?= $urlManager->createUrl('mch/store/index')?>',
            method: 'GET',
            dataType: 'json',
            data: {
                sign: val,
                type: 'order'
            },
            success: function (res) {
                $.loadingHide();
                if (res.code != 0) {
                    $.alert({
                        content: res.msg,
                    });
                    return;
                }
                app.panel_3 = res.data.panel_3;
            }
        })
    });

    $.ajax({
        dataType: 'json',
        data: {
            sign: 1
        },
        success: function (res) {
            app.loading = false;
            $.loadingHide();
            if (res.code != 0) {
                $.alert({
                    content: res.msg,
                });
                console.log(res);
                return;
            }
            app.panel_1 = res.data.panel_1;
            app.panel_2 = res.data.panel_2;
            app.panel_3 = res.data.panel_3;
            app.panel_4 = res.data.panel_4;
            app.panel_5 = res.data.panel_5;
            app.panel_6 = res.data.panel_6;

            setTimeout(function () {
                var echarts_1 = echarts.init(document.getElementById('echarts_1'));
                var echarts_2 = echarts.init(document.getElementById('echarts_2'));
                let person = [];
                let money = [];
                let arr = ['','','','','','','','','','']
                res.data.panel_6.forEach(function(e){
                    person.push(e.nickname);
                    money.push(e.money);
                });
                if(person.length != 10){
                    let tempPerson = person.concat(arr);
                    person = tempPerson.slice(0,10);
                }
                if(money.length != 10){
                    let tempMoney = money.concat(arr);
                    money = tempMoney.slice(0,10);
                }
                var echarts_1_option = {
                    title: {
                        text: '近七日交易走势'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['成交量', '成交额']
                    },
                    grid: {
                        left: '0%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        data: res.data.panel_4.date,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '成交量',
                            type: 'line',
                            data: res.data.panel_4.order_goods_data.data,
                        },
                        {
                            name: '成交额',
                            type: 'line',
                            data: res.data.panel_4.order_goods_price_data.data,
                        },
                    ]
                };

                var echarts_2_option = {
                        title: {
                        text: '用户购买力排行',
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    grid: {
                        top: '20%',
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        containLabel: true
                    },
                    xAxis : {
                        data: person,
                        axisLabel: {
                          formatter: function(value) {
                             var res = value;
                             if(res.length > 5) {
                                 res = res.substring(0, 4) + ".."
                             }
                             return res
                         }
                     }
                    },
                    yAxis : {
                        type : 'value'
                    },
                    series : [
                        {
                            name:'购物力',
                            type:'bar',
                            barWidth: '60%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: money
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                echarts_1.setOption(echarts_1_option);
                echarts_2.setOption(echarts_2_option);
                
                window.onresize = function(){
                    echarts_1.resize();
                    echarts_2.resize();
                    var label = document.getElementById("footer");
                }
            }, 500);
        }
    });
</script>