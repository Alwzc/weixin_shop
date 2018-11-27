<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/9
 * Time: 16:43
 */
defined('YII_ENV') or exit('Access Denied');
use yii\widgets\LinkPager;

$urlManager = Yii::$app->urlManager;
$imgurl = Yii::$app->request->baseUrl;
$this->title = '商品列表';
?>
<style>
    .modal-dialog{
        position:fixed;
        top:20%;
        left:45%;
        width:240px;
    }
    .modal-content{
        width:240px;
    }
    .modal-body{
        /*height:200px;*/
    }
    table {
        table-layout: fixed;
    }

    th {
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    td {
        text-align: center;
        line-height: 30px;
    }

    .ellipsis {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    td.nowrap {
        white-space: nowrap;
        overflow: hidden;
    }

    .goods-pic {
        margin: 0 auto;
        width: 3rem;
        height: 3rem;
        background-color: #ddd;
        background-size: cover;
        background-position: center;
    }
</style>

<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <div class="panel-body">
        <?php
        $status = ['已下架', '已上架'];
        ?>
        <div class="mb-3 clearfix">
            <div class="float-left">
                <div class="dropdown float-right ml-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        批量设置
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"
                         style="max-height: 200px;overflow-y: auto">
                        <a href="javascript:void(0)" class="btn btn-secondary batch dropdown-item"
                           data-url="<?= $urlManager->createUrl(['mch/goods/batch']) ?>" data-content="是否批量上架"
                           data-type="0">批量上架</a>
                        <a href="javascript:void(0)" class="btn btn-warning batch dropdown-item"
                           data-url="<?= $urlManager->createUrl(['mch/goods/batch']) ?>" data-content="是否批量下架"
                           data-type="1">批量下架</a>
                        <a href="javascript:void(0)" class="btn btn-danger batch dropdown-item"
                           data-url="<?= $urlManager->createUrl(['mch/goods/batch']) ?>" data-content="是否批量删除"
                           data-type="2">批量删除</a>
                    </div>
                </div>
                <div class="dropdown float-right ml-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <?= isset($_GET['cat']) ? $_GET['cat'] : '全部类型' ?>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"
                         style="max-height: 200px;overflow-y: auto">
                        <a class="dropdown-item" href="<?= $urlManager->createUrl(['mch/mch/goods/goods']) ?>">全部类型</a>
                        <?php foreach ($cat_list as $index => $value) : ?>
                            <a class="dropdown-item"
                               href="<?= $urlManager->createUrl(array_merge(['mch/mch/goods/goods'], $_GET, ['cat' => $value])) ?>"><?= $value ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="dropdown float-right ml-2">
                    <button class="btn btn-secondary dropdown-toggle" type="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <?php if ($_GET['status']==='1') :
                            ?>上架
                        <?php elseif ($_GET['status']==='2') :
                            ?>下架
                        <?php elseif ($_GET['status']=='') :
                            ?>全部商品
                        <?php else : ?>
                        <?php endif; ?>
                    </button>
                    <div class="dropdown-menu" style="min-width:8rem"
                    >
                        <a class="dropdown-item" href="<?= $urlManager->createUrl(['mch/mch/goods/goods']) ?>">全部商品</a>
                        <a class="dropdown-item" href="<?= $urlManager->createUrl(['mch/mch/goods/goods','status' => 1]) ?>">上架</a>
                        <a class="dropdown-item" href="<?= $urlManager->createUrl(['mch/mch/goods/goods','status' => 2]) ?>">下架</a>

                    </div>
                </div>
            </div>
            <div class="float-right">
                <form method="get">

                    <?php $_s = ['keyword','page','per-page'] ?>
                    <?php foreach ($_GET as $_gi => $_gv) :
                        if (in_array($_gi, $_s)) {
                            continue;
                        } ?>
                        <input type="hidden" name="<?= $_gi ?>" value="<?= $_gv ?>">
                    <?php endforeach; ?>

                    <div class="input-group">
                        <input class="form-control" placeholder="商品名" name="keyword"
                               value="<?= isset($_GET['keyword']) ? trim($_GET['keyword']) : null ?>">
                        <span class="input-group-btn">
                    <button class="btn btn-primary">搜索</button>
                </span>
                    </div>
                </form>
            </div>
        </div>
        <table class="table table-bordered bg-white table-hover">
            <thead>
            <tr>
                <th style="text-align: center;">
                    <label class="checkbox-label" style="margin-right: 0px;">
                        <input type="checkbox" class="goods-all">
                        <span class="label-icon"></span>
                    </label>
                </th>
                <th><span class="label-text">商品ID</span></th>
                <th>商户店铺名称</th>
                <th>商品类型</th>
                <th>商品名称</th>
                <th>售价</th>
                <th>库存</th>
                <th>状态</th>
                <th>排序</th>
                <th>操作</th>
            </tr>
            </thead>
            <col style="width: 3%">
            <col style="width: 5%">
            <col style="width: 10%">
            <col style="width: 7%">
            <col style="width: 15%">
            <col style="width: 7%">
            <col style="width: 5%">
            <col style="width: 14%">
            <col style="width: 8%">
            <col style="width: 12%">
            <tbody>
            <?php foreach ($list as $index => $goods) : ?>
                <tr>
                    <td class="nowrap" style="text-align: center;">
                        <label class="checkbox-label" style="margin-right: 0px;">
                            <input data-num="<?= $goods->num ?>" type="checkbox"
                                   class="goods-one"
                                   value="<?= $goods->id ?>">
                            <span class="label-icon"></span>
                        </label>
                    </td>
                    <td data-toggle="tooltip"
                        data-placement="top" title="<?=$goods->id?>"><span class="label-text"><?= $goods->id ?></span></td>
                    <td><?=$goods->mch->name?></td>
                    <td class="ellipsis" data-toggle="tooltip"
                        data-placement="top" title="<?=$goods->mchCatList?>">
                        <span class="badge badge-info" style="width: 100%"><?= $goods->mchCatList ?></span>
                    </td>
                    <td class="text-left ellipsis" data-toggle="tooltip"
                        data-placement="top" title="<?=$goods->name?>"><?= $goods->name ?></td>
                    <td class="p-0" style="vertical-align: middle" hidden>
                        <div class="goods-pic" style="background-image: url(<?= $goods->getGoodsPic(0)->pic_url ?>)"></div>
                    </td>
                    <td class="nowrap text-danger"><?= $goods->price ?>元</td>
                    <td class="nowrap"><?= $goods->num ?></td>
                    <td class="nowrap">
                        <?php if ($goods->status == 1) : ?>
                            <span class="badge badge-success">已上架</span>
                            |
                            <a href="javascript:" onclick="upDown(<?= $goods->id ?>,'down');">下架</a>
                        <?php else : ?>
                            <span class="badge badge-default"><?= $status[$goods->status] ?></span>
                            |
                            <a href="javascript:" onclick="upDown(<?= $goods->id ?>,'up');">审核并上架</a>
                        <?php endif ?>
                    </td>
                    <td class="nowrap">
                        <input class="form-control form-control-sm set-goods-sort" value="<?= $goods->sort ?>"
                               data-id="<?= $goods->id ?>" type="number" step="1" min="0" max="10000000">
                    </td>
                    <td class="nowrap">
                        <img src="<?= $imgurl ?>\statics\images\chengxuma.png" width="20px"  onclick="getGoodsQrcode(<?= $goods->id ?>);" data-toggle="modal" data-target="#myModal" title="小程序码">&nbsp;
                        <a class="btn btn-sm btn-primary" href="<?=$urlManager->createUrl(['mch/mch/goods/detail','goods_id'=>$goods->id])?>">详情</a>
                        <a class="btn btn-sm btn-danger del"
                           href="<?= $urlManager->createUrl(['mch/goods/goods-del', 'id' => $goods->id]) ?>">删除</a>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>

        </table>
        <div class="text-center">
            <nav aria-label="Page navigation example">
                <?php echo LinkPager::widget([
                    'pagination' => $pagination,
                    'prevPageLabel' => '上一页',
                    'nextPageLabel' => '下一页',
                    'firstPageLabel' => '首页',
                    'lastPageLabel' => '尾页',
                    'maxButtonCount' => 5,
                    'options' => [
                        'class' => 'pagination',
                    ],
                    'prevPageCssClass' => 'page-item',
                    'pageCssClass' => "page-item",
                    'nextPageCssClass' => 'page-item',
                    'firstPageCssClass' => 'page-item',
                    'lastPageCssClass' => 'page-item',
                    'linkOptions' => [
                        'class' => 'page-link',
                    ],
                    'disabledListItemSubTagOptions' => ['tag' => 'a', 'class' => 'page-link'],
                ])
                ?>
            </nav>
        </div>
    </div>
</div>
<!--小程序码开始-->

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-show="false">

    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <img id="goods_qrcode_wx" src="" width="200px">
                <img id="goods_qrcode_my" src="" width="200px">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default"
                        data-dismiss="modal" id="closeModel">关闭
                </button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!--小程序码结束-->


<script>
    $("#myModal").modal({backdrop: "static", keyboard: false});

    $("#closeModel").click(function(){
        $("#goods_qrcode_wx").attr("src", '');
        $("#goods_qrcode_my").attr("src", '');
    });

    var GoodsQrcodeUrl = "<?= $urlManager->createUrl(['mch/goods/goods-qrcode']) ?>";

    function getGoodsQrcode(id){
        $("#goods_qrcode_wx").attr("src", '');
        $("#goods_qrcode_my").attr("src", '');
        $.ajax({
            url: GoodsQrcodeUrl,
            type: 'get',
            dataType: 'json',
            data: {
                goods_id:id
            },
            success: function (res) {
                if (res.code == 0) {
                    $("#goods_qrcode_wx").attr("src", res.data.wx);
                    $("#goods_qrcode_my").attr("src", res.data.my);
                }else{
                    alert('获取小程序码失败');
                }
            }
        });
    }

    $(document).on('click', '.del', function () {
        if (confirm("是否删除？")) {
            $.ajax({
                url: $(this).attr('href'),
                type: 'get',
                dataType: 'json',
                success: function (res) {
                    alert(res.msg);
                    if (res.code == 0) {
                        window.location.reload();
                    }
                }
            });
        }
        return false;
    });

    function upDown(id, type) {
        var text = '';
        if (type == 'up') {
            text = "上架";
        } else {
            text = '下架';
        }

        var url = "<?= $urlManager->createUrl(['mch/goods/goods-up-down']) ?>";
        layer.confirm("是否" + text + "？", {
            btn: [text, '取消'] //按钮
        }, function () {
            layer.msg('加载中', {
                icon: 16
                , shade: 0.01
            });
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: {id: id, type: type},
                success: function (res) {
                    if (res.code == 0) {
                        window.location.reload();
                    }
                    if (res.code == 1) {
                        layer.alert(res.msg, {
                            skin: 'layui-layer-molv'
                            , closeBtn: 0
                            , anim: 4 //动画类型
                        });
                        if (res.return_url) {
                            location.href = res.return_url;
                        }
                    }
                }
            });
        });
        return false;
    }

    $(document).on('click', '.goods-all', function () {
        var checked = $(this).prop('checked');
        $('.goods-one').prop('checked', checked);
        if (checked) {
            $('.batch').addClass('is_use');
        } else {
            $('.batch').removeClass('is_use');
        }
    });
    $(document).on('click', '.goods-one', function () {
        var checked = $(this).prop('checked');
        var all = $('.goods-one');
        var is_all = true;//只要有一个没选中，全选按钮就不选中
        var is_use = false;//只要有一个选中，批量按妞就可以使用
        all.each(function (i) {
            if ($(all[i]).prop('checked')) {
                is_use = true;
            } else {
                is_all = false;
            }
        });
        if (is_all) {
            $('.goods-all').prop('checked', true);
        } else {
            $('.goods-all').prop('checked', false);
        }
        if (is_use) {
            $('.batch').addClass('is_use');
        } else {
            $('.batch').removeClass('is_use');
        }
    });
    $(document).on('click', '.batch', function () {
        var all = $('.goods-one');
        var is_all = true;//只要有一个没选中，全选按钮就不选中
        all.each(function (i) {
            if ($(all[i]).prop('checked')) {
                is_all = false;
            }
        });
        if (is_all) {
            $.myAlert({
                content: "请先勾选商品"
            });
        }
    });
    // 批量设置积分
    $(document).on('click', '.save-attr-btn', function () {
        var give = $('input[name^="integral[give]"]').val();
        var forehead = $('input[name^="integral[forehead]"]').val();
//        var more = $('input[name^="integral[more]"]').val();
        if ($('input[name^="integral[more]"]').is(':checked')) {
            var more = 1;
        } else {
            var more = '';
        }
        console.log(more);
        var all = $('.goods-one');
        var is_all = true;//只要有一个没选中，全选按钮就不选中
        all.each(function (i) {
            if ($(all[i]).prop('checked')) {
                is_all = false;
            }
        });
        if (is_all) {
            $.myAlert({
                content: "请先勾选商品"
            });
            return;
        }
        var a = $(this);
        var goods_group = [];
        all.each(function (i) {
            if ($(all[i]).prop('checked')) {
                var goods = {};
                goods_group.push($(all[i]).val());
            }
        });
    });
    $(document).on('click', '.is_use', function () {
        var a = $(this);
        var goods_group = [];
        var all = $('.goods-one');
        all.each(function (i) {
            if ($(all[i]).prop('checked')) {
                var goods = {};
                goods.id = $(all[i]).val();
                goods.num = $(all[i]).data('num');
                goods_group.push(goods);
            }
        });
        $.myConfirm({
            content: a.data('content'),
            confirm: function () {
                $.myLoading();
                $.ajax({
                    url: a.data('url'),
                    type: 'get',
                    dataType: 'json',
                    data: {
                        goods_group: goods_group,
                        type: a.data('type'),
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            $.myAlert({
                                content:res.msg,
                                confirm:function(){
                                    window.location.reload();
                                }
                            });
                        } else {
                            $.myAlert({
                                content:res.msg
                            });
                        }
                    },
                    complete: function () {
                        $.myLoadingHide();
                    }
                });
            }
        })
    });

    $(document).on('change', '.set-goods-sort', function () {
        var input = $(this);
        var id = input.attr('data-id');
        var sort = parseInt(input.val());
        if (isNaN(sort) || sort < 0 || sort > 10000000)
            return false;
        $.loading();
        $.ajax({
            url: '<?=Yii::$app->urlManager->createUrl(['mch/goods/set-sort'])?>',
            data: {
                goods_id: id,
                sort: sort,
            },
            dataType: 'json',
            success: function (res) {
                $.toast({
                    content: res.msg,
                });
            },
            complete: function () {
                $.loadingHide();
            }
        });

    });

</script>
<script>
    $(document).ready(function () {
        var clipboard = new Clipboard('.copy');
        clipboard.on('success', function (e) {
            $.myAlert({
                title: '提示',
                content: '复制成功'
            });
        });
        clipboard.on('error', function (e) {
            $.myAlert({
                title: '提示',
                content: '复制失败，请手动复制。链接为：' + e.text
            });
        });
    })
</script>

