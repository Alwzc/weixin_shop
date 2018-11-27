<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/9
 * Time: 17:41
 */
$urlManager = Yii::$app->urlManager;
$urlStr = get_plugin_url();
?>
<style>
    .form-control {
        /*height: 34px;*/
    }

    .form-group > div:first-child {
        padding-right: 4px;
        text-align: right;
    }

    .form-group > div:last-child {
        padding-left: 4px;
    }

    .middle-center {
        /*line-height: 34px;*/
    }

    .w-20 {
        width: 20rem;
    }

    .w-12 {
        width: 12rem;
    }

    .status .nav-item, .bg-shaixuan {
        background-color: #f8f8f8;
    }

    .status .nav-item .nav-link {
        color: #464a4c;
        border: 1px solid #ddd;
        border-radius: 0;
    }

    .status .nav-item .nav-link.active {
        border-color: #ddd #ddd #fff;
        background-color: #fff;
    }
</style>

<!-- 地区选择模态框 -->
<div class="modal fade" id="order-export">
    <div class="modal-dialog">
        <div class="panel">
            <div class="panel-header">
                <span>选择需要导出的信息</span>
                <a href="javascript:" class="panel-close" data-dismiss="modal">&times;</a>
            </div>
            <form method="post"
                  action="<?= $url ? $url : Yii::$app->request->url ?>"
                  target="_blank">
                <div class="panel-body">
                    <label class="checkbox-label select-all">
                        <input type="checkbox">
                        <span class="label-icon"></span>
                        <span class="label-text">全选</span>
                    </label>
                        <div>
                            <input name="flag" hidden value="EXPORT">
                            <label v-for="(item,index) in list" class="checkbox-label" :hidden="item.hidden">
                                <input class="isChecked" type="checkbox" :name="'fields['+index+'][selected]'"
                                       value="1">
                                <input type="hidden" :name="'fields['+index+'][key]'" v-model="item.key">
                                <input type="hidden" :name="'fields['+index+'][value]'" v-model="item.value">
                                <span class="label-icon"></span>
                                <span class="label-text">{{item.value}}</span>
                            </label>
                        </div>
                </div>
                <div class="panel-footer">
                    <button type="submit" class="btn btn-primary" href="javascript:">确定</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- 订单核销 -->
<div class="modal fade clerk-modal" data-backdrop="static" id="clerk">
    <div class="modal-dialog modal-sm" role="document" style="max-width: 400px">
        <div class="modal-content">
            <div class="modal-header">
                <b class="modal-title">选择核销人</b>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form class="send-form" method="post">
            <div class="modal-body">
                <form class="clerk-form" method="post">
                    <div class="form-group row">
                        <div class="col-12">
                        <div class="input-group">
                            <input class="form-control clerk-keyword" placeholder="请输入核销员昵称">
                            <a class="input-group-addon btn clerk-search" href="javascript:" v-on:click="showKeyword()">查找</a>
                        </div>

                        </div>
                    </div>
                    <input type="hidden" class="order_id">
                    <div style="max-height:400px;overflow: auto">
                        <table class="table table-bordered">
                            <tr>
                                <td>id</td>
                                <td>昵称</td>
                                <td>所属门店</td>
                                <td>操作</td>
                            </tr>
                            <tr v-for="(item,index) in clerk_list">
                                <td>{{item.id}}</td>
                                <td>{{item.nickname}}</td>
                                <td>{{item.shop}}</td>
                                <td>
                                    <a class="btn btn-primary btn-sm select-clerk" href="javascript:"
                                       data-url="<?= $urlManager->createUrl([$urlStr . '/clerk']) ?>"
                                       :data-index="item.id">选择</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    jQuery.datetimepicker.setLocale('zh');
    jQuery('#date_start').datetimepicker({
        datepicker: true,
        timepicker: false,
        format: 'Y-m-d',
        dayOfWeekStart: 1,
        scrollMonth: false,
        scrollTime: false,
        scrollInput: false,
        onShow: function (ct) {
            this.setOptions({
                maxDate: jQuery('#date_end').val() ? jQuery('#date_end').val() : false
            })
        }
    });
    $(document).on('click', '#show_date_start', function () {
        $('#date_start').datetimepicker('show');
    });
    jQuery('#date_end').datetimepicker({
        datepicker: true,
        timepicker: false,
        format: 'Y-m-d',
        dayOfWeekStart: 1,
        scrollMonth: false,
        scrollTime: false,
        scrollInput: false,
        onShow: function (ct) {
            this.setOptions({
                minDate: jQuery('#date_start').val() ? jQuery('#date_start').val() : false
            })
        }
    });
    $(document).on('click', '#show_date_end', function () {
        $('#date_end').datetimepicker('show');
    });
    $(document).on('click', '.new-day', function () {
        var index = $(this).data('index');
        var myDate = new Date();
        var mydate = new Date(myDate.getTime() - index * 24 * 60 * 60 * 1000);
        jQuery('#date_start').datetimepicker('setOptions', {value: mydate});
        jQuery('#date_end').datetimepicker('setOptions', {value: myDate});
    });
</script>
<script>
    $(document).on('click', '.export-btn', function () {
        $("#order-export").modal('show');
    });
    var OrderExport = new Vue({
        el: '#order-export',
        data: {
            list: <?=$exportList ? $exportList : '[]'?>
        }
    });

    $(document).on('click', '.select-all', function () {
        var checked = $(this).children("input[type = 'checkbox']").prop('checked');

        $('.isChecked').prop('checked', checked)
    })
</script>
<script>
    var clerk = new Vue({
        el:"#clerk",
        data:{
            clerk_list:[]
        },
        methods: {
            //关键字查询
            showKeyword: function () {
                var _self = this;
                var keyword = $.trim($('.clerk-keyword').val());console.log(keyword);
                if (keyword == "") {
                    _self.show_user_list = _self.user_list;
                    return;
                }
                _self.show_user_list = [];
                $.ajax({
                    url: '<?=$urlManager->createUrl(['mch/user/get-clerk'])?>',
                    dataType: 'json',
                    type: 'get',
                    data: {
                        keyword: keyword
                    },
                    success: function (res) {
                        _self.clerk_list = res;
                    }
                });
            }
        }
    });

    $(document).on('click', '.select-clerk', function(){
        var order_id = $('.order_id').val();
        var index = $(this).data('index');
        var url = $(this).data('url');
        $.ajax({
            url:url,
            dataTtpe:'json',
            type:'get',
            data:{
                order_id:order_id,
                clerk_id:index
            },
            success:function(res){
                $('.clerk-modal').modal('hide');
                $.myAlert({
                    content:res.msg,
                    confirm:function(){
                        if(res.code == 0){
                            window.location.reload();
                        }
                    }
                });
            }
        });
    })
</script>
