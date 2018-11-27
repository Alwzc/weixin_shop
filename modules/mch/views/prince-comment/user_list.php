<?php
defined('YII_ENV') or exit('Access Denied');
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/29
 * Time: 9:50
 */
use yii\widgets\LinkPager;

$urlManager = Yii::$app->urlManager;
$this->title = '虚拟用户列表';
$this->params['active_nav_group'] = 3;
?>
<style>
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
        width: 3rem;
        height: 3rem; 
        display: inline-block;
        background-color: #ddd;
        background-size: cover;
        background-position: center;
    }

    .img-view-list {
        margin-left: -.5rem;
        margin-top: -.5rem;
    }

    .img-view {
        width: 4rem;
        height: 4rem;
        display: inline-block;
        background-size: cover;
        background-position: center;
        cursor: pointer;
        opacity: .85;
        margin-top: .5rem;
        margin-left: .5rem;
    }

    .img-view:hover {
        opacity: 1;
    }

    .img-view-box { 
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        z-index: 1030;
        visibility: hidden;
        opacity: 0;
    }

    .img-view-box.active {
        visibility: visible;
        opacity: 1;
    }

    .img-view-close {
        position: absolute;
        right: 2rem;
        top: 2rem;
        display: inline-block;
        font-size: 3rem;
        color: #ddd !important;
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
    }

    .img-view-close:hover {
        color: #fff !important;
        text-decoration: none;
    }
</style>
<div class="panel mb-3">

    <div class="panel-header">
        <span><?= $this->title ?></span>
        <ul class="nav nav-right">
            <li class="nav-item">
                <a class="nav-link" href="<?= $urlManager->createUrl(['mch/prince-comment/user-edit']) ?>">添加虚拟用户</a>
            </li>
        </ul>
    </div>
    <div class="panel-body">
        <table class="table table-bordered bg-white">
            <thead>
            <tr>
                <th>ID</th>
                <th>用户</th>
                <th>头像</th> 
                <th>操作</th>
            </tr>
            </thead>
            <col style="width: 10%">
            <col style="width: 40%">
            <col style="width: 40%">
            <col style="width: 10%">
            <tbody>
            <?php foreach ($list as $index => $item): ?>
                <tr>
                    <td class="nowrap"><?= $item['id'] ?></td>
                    <td class="nowrap"><?= $item['virtual_user'] ?></td>
                    <td class="text-center"><div class="img-view"
                                     data-src="<?= $item['virtual_avatar']?$item['virtual_avatar']:'https://res.wx.qq.com/zh_CN/htmledition/v2/images/web_wechat_no_contect.png'  ?>"
                                     style="background-image: url('<?= $item['virtual_avatar']?$item['virtual_avatar']:'https://res.wx.qq.com/zh_CN/htmledition/v2/images/web_wechat_no_contect.png' ?>')"></div>
                                   </td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-warning"
                           href="<?= $urlManager->createUrl(['mch/prince-comment/user-edit', 'id' => $item['id'], 'status' => 1]) ?>">修改</a>
                        <a class="btn btn-sm btn-danger delete-status-btn"
                           href="<?= $urlManager->createUrl(['mch/prince-comment/user-delete', 'id' => $item['id'], 'status' => 1]) ?>">删除</a>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>

        </table>
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

<div class="img-view-box" flex="cross:center main:center">
    <a class="img-view-close" href="javascript:">×</a>
    <img src="">
</div>
<script>
    $(document).on("click", ".img-view", function () {
        var src = $(this).attr("data-src");
        $(".img-view-box").addClass("active").find("img").attr("src", src);
    });

    $(document).on("click", ".img-view-close", function () {
        $(".img-view-box").removeClass("active");
    });
    $(document).on("click", ".hide-status-btn", function () {
        $.myLoading();
        $.ajax({
            url: $(this).attr("href"),
            dataType: "json",
            success: function () {
                location.reload();
            }
        });
        return false;
    });
    $(document).on("click", ".delete-status-btn", function () {
        var url = $(this).attr("href");
        $.myConfirm({
            content: "确认删除该用户？",
            confirm: function () {
                $.myLoading();
                $.ajax({
                    url: url,
                    dataType: "json",
                    success: function () {
                        location.reload();
                    }
                });
            }
        });
        return false;
    });
</script>