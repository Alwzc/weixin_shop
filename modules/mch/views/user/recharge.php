<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/3/17
 * Time: 9:23
 */
defined('YII_ENV') or exit('Access Denied');

use \app\models\User;
use yii\widgets\LinkPager;


$urlManager = Yii::$app->urlManager;
$this->title = '余额充值记录';
$this->params['active_nav_group'] = 4;
?>

<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <div class="panel-body">
        <a class="btn btn-secondary export-btn" href="javascript:">批量导出</a>
        <div class="float-right mb-4">
            <form method="get">

                <?php $_s = ['keyword'] ?>
                <?php foreach ($_GET as $_gi => $_gv) :
                    if (in_array($_gi, $_s)) {
                        continue;
                    } ?>
                    <input type="hidden" name="<?= $_gi ?>" value="<?= $_gv ?>">
                <?php endforeach; ?>

                <div class="input-group">
                    <input class="form-control"
                           placeholder="昵称"
                           name="keyword"
                           autocomplete="off"
                           value="<?= isset($_GET['keyword']) ? trim($_GET['keyword']) : null ?>">
                    <span class="input-group-btn">
                    <button class="btn btn-primary">搜索</button>
                </span>
                </div>
            </form>
        </div>
        <div class="text-danger"></div>
        <table class="table table-bordered bg-white">
            <thead>
            <tr>
                <th>ID</th>
                <th>说明/订单号</th>
                <th>昵称</th>
                <th>支付金额</th>
                <th>赠送金额</th>
                <th>支付日期</th>
                <th>备注</th>
            </tr>
            </thead>
            <?php foreach ($list as $v) : ?>
                <tr style="<?= $v['flag'] == 1 ? 'color:#ff4544' : '' ?>">
                    <td><?= $v['id'] ?></td>
                    <td>
                        <div><?= $v['order_no'] ?></div>
                        <?php if ($v['flag'] == 1) : ?>
                            <div>
                                <span style="background-color: #ff4544;color:#fff;">此订单数据异常，即订单的支付金额、赠送金额与充值设置不一致</span>
                            </div>
                        <?php endif ?>
                    </td>
                    <td>
                        <?= $v['nickname'] ?>
                        <?php if (isset($v['platform']) && intval($v['platform']) === 0): ?>
                            <span class="badge badge-success">微信</span>
                        <?php elseif (isset($v['platform']) && intval($v['platform']) === 1): ?>
                            <span class="badge badge-primary">支付宝</span>
                        <?php else: ?>
                            <span class="badge badge-default">未知</span>
                        <?php endif; ?>
                    </td>
                    <td><?= $v['pay_price'] ?></td>
                    <td><?= $v['send_price'] ?></td>
                    <td><?= date('Y-m-d H:i:s', $v['pay_time']); ?></td>
                    <td>
                        <div>图片：</div>
                        <div>
                            <a href="<?= $v['pic_url'] ?>" target="_blank">
                                <img src="<?= $v['pic_url'] ?>" style="max-width:100px;max-height:100px;">
                            </a>
                        </div>
                        <div>
                            <label>说明：<?= $v['explain'] ?></label>
                        </div>
                    </td>
                </tr>
            <?php endforeach; ?>
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
            <div class="text-muted">共<?= $row_count ?>条数据</div>
        </div>
    </div>
</div>

<?= $this->render('/layouts/ss', [
    'exportList'=>$exportList
]) ?>
