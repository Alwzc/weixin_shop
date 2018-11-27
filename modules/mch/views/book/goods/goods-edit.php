<?php
defined('YII_ENV') or exit('Access Denied');
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/29
 * Time: 10:49
 */

$urlManager = Yii::$app->urlManager;
$this->title = '预约商品编辑';
$staticBaseUrl = Yii::$app->request->baseUrl . '/statics';
$this->params['active_nav_group'] = 10;
$this->params['is_book'] = 1;
$returnUrl = Yii::$app->request->referrer;
if (!$returnUrl) {
    $returnUrl = $urlManager->createUrl(['mch/group/goods/index']);
}
?>
<script src="<?= $staticBaseUrl ?>/mch/js/uploadVideo.js"></script>
<style>
    .cat-box {
        border: 1px solid rgba(0, 0, 0, .15);
    }

    .cat-box .row {
        margin: 0;
        padding: 0;
    }

    .cat-box .col-6 {
        padding: 0;
    }

    .cat-box .cat-list {
        border-right: 1px solid rgba(0, 0, 0, .15);
        overflow-x: hidden;
        overflow-y: auto;
        height: 10rem;
    }

    .cat-box .cat-item {
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        padding: .5rem 1rem;
        display: block;
        margin: 0;
    }

    .cat-box .cat-item:last-child {
        border-bottom: none;
    }

    .cat-box .cat-item:hover {
        background: rgba(0, 0, 0, .05);
    }

    .cat-box .cat-item.active {
        background: rgb(2, 117, 216);
        color: #fff;
    }

    .cat-box .cat-item input {
        display: none;
    }

    form {
    }

    form .head {
        position: fixed;
        top: 50px;
        right: 1rem;
        left: calc(240px + 1rem);
        z-index: 9;
        padding-top: 1rem;
        background: #f5f7f9;
        padding-bottom: 1rem;
    }

    form .head .head-content {
        background: #fff;
        border: 1px solid #eee;
        height: 40px;
    }

    .head-step {
        height: 100%;
        padding: 0 20px;
    }

    .step-block {
        position: relative;
    }

    form .body {
        padding-top: 45px;
    }

    .step-block > div {
        padding: 20px;
        background: #fff;
        border: 1px solid #eee;
        margin-bottom: 5px;
    }

    .step-block > div:first-child {
        padding: 20px;
        width: 120px;
        margin-right: 5px;
        font-weight: bold;
        text-align: center;
    }

    .step-block .step-location {
        position: absolute;
        top: -122px;
        left: 0;
    }

    .step-block:first-child .step-location {
        top: -140px;
    }

    form .foot {
        text-align: center;
        background: #fff;
        border: 1px solid #eee;
        padding: 1rem;
    }

    .edui-editor,
    #edui1_toolbarbox {
        z-index: 2 !important;
    }

    form .short-row {
        width: 380px;
    }

    .form {
        background: none;
        width: 100%;
        max-width: 100%;
    }

    .attr-group {
        border: 1px solid #eee;
        padding: .5rem .75rem;
        margin-bottom: .5rem;
        border-radius: .15rem;
    }

    .attr-group-delete {
        display: inline-block;
        background: #eee;
        color: #fff;
        width: 1rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        border-radius: 999px;
    }

    .attr-group-delete:hover {
        background: #ff4544;
        color: #fff;
        text-decoration: none;
    }

    .attr-list > div {
        vertical-align: top;
    }

    .attr-item {
        display: inline-block;
        background: #eee;
        margin-right: 1rem;
        margin-top: .5rem;
        overflow: hidden;
    }

    .attr-item .attr-name {
        padding: .15rem .75rem;
        display: inline-block;
    }

    .attr-item .attr-delete {
        padding: .35rem .75rem;
        background: #d4cece;
        color: #fff;
        font-size: 1rem;
        font-weight: bold;
    }

    .attr-item .attr-delete:hover {
        text-decoration: none;
        color: #fff;
        background: #ff4544;
    }

    .panel {
        margin-top: calc(40px + 1rem);
    }

    form .form-group .col-3 {
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 160px;
        -ms-flex: 0 0 160px;
        flex: 0 0 160px;
        max-width: 160px;
        width: 160px;
    }
</style>
<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <div class="panel-body">
        <form class="form auto-form" method="post" autocomplete="off" data-return="<?= $returnUrl ?>">
            <div class="head">
                <div class="head-content" flex="dir:left">
                    <a flex="cross:center" class="head-step" href="#step1">选择分类</a>
                    <a flex="cross:center" class="head-step" href="#step2">基本信息</a>
                    <a flex="cross:center" class="head-step" href="#step6">规格库存</a>
                    <a flex="cross:center" class="head-step" href="#step5">分销设置</a>
                    <a flex="cross:center" class="head-step" href="#step3">自定义表单</a>
                    <a flex="cross:center" class="head-step" href="#step4">商品详情</a>
                </div>
            </div>
            <div id="app">
                <div class="step-block" flex="dir:left box:first">
                    <div>
                        <span>选择分类</span>
                        <span class="step-location" id="step1"></span>
                    </div>
                    <div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">商品分类</label>
                            </div>
                            <div class="col-9">
                                <div class="input-group short-row">
                                    <select class="form-control parent" name="model[cat_id]">
                                        <option value="">请选择分类</option>
                                        <?php foreach ($cat as $value) : ?>
                                            <option
                                                value="<?= $value['id'] ?>" <?= $value['id'] == $goods['cat_id'] ? 'selected' : '' ?>><?= $value['name'] ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-block" flex="dir:left box:first">
                    <div>
                        <span>基本信息</span>
                        <span class="step-location" id="step2"></span>
                    </div>
                    <div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">商品名称</label>
                            </div>
                            <div class="col-9">
                                <input class="form-control short-row" type="text" name="model[name]"
                                       value="<?= $goods['name'] ?>">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label">商品排序</label>
                            </div>
                            <div class="col-9">
                                <input class="form-control short-row" type="text" name="model[sort]"
                                       value="<?= $goods['sort'] ?: 100 ?>">
                                <div class="text-muted fs-sm">排序按升序排列</div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label">虚拟销量</label>
                            </div>
                            <div class="col-9">
                                <input class="form-control short-row" type="number" name="model[virtual_sales]"
                                       value="<?= $goods['virtual_sales'] ?>" min="0">
                                <div class="text-muted fs-sm">前端展示的销量=实际销量+虚拟销量</div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class="col-form-label required">商品缩略图</label>
                            </div>
                            <div class="col-9">
                                <div class="upload-group short-row">
                                    <div class="input-group">
                                        <input class="form-control file-input" name="model[cover_pic]"
                                               value="<?= $goods['cover_pic'] ?>">
                                    <span class="input-group-btn">
                                        <a class="btn btn-secondary upload-file" href="javascript:"
                                           data-toggle="tooltip"
                                           data-placement="bottom" title="上传文件">
                                            <span class="iconfont icon-cloudupload"></span>
                                        </a>
                                    </span>
                                    <span class="input-group-btn">
                                        <a class="btn btn-secondary select-file" href="javascript:"
                                           data-toggle="tooltip"
                                           data-placement="bottom" title="从文件库选择">
                                            <span class="iconfont icon-viewmodule"></span>
                                        </a>
                                    </span>
                                    <span class="input-group-btn">
                                        <a class="btn btn-secondary delete-file" href="javascript:"
                                           data-toggle="tooltip"
                                           data-placement="bottom" title="删除文件">
                                            <span class="iconfont icon-close"></span>
                                        </a>
                                    </span>
                                    </div>
                                    <div class="upload-preview text-center upload-preview">
                                        <span class="upload-preview-tip">325&times;325</span>
                                        <img class="upload-preview-img" src="<?= $goods['cover_pic'] ?>">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class="col-form-label required">商品图片</label>
                            </div>
                            <div class="col-9">
                                <?php if ($goods->goodsPicList()) :
                                    foreach ($goods->goodsPicList() as $goods_pic) : ?>
                                                                            <?php $goods_pic_list[] = $goods_pic->pic_url ?>
                                    <?php endforeach;
                                else :
                                    $goods_pic_list = [];
                                endif; ?>

                                <div class="upload-group multiple short-row">
                                    <div class="input-group">
                                        <input class="form-control file-input" readonly>
                                    <span class="input-group-btn">
                                        <a class="btn btn-secondary upload-file" href="javascript:"
                                           data-toggle="tooltip"
                                           data-placement="bottom" title="上传文件">
                                            <span class="iconfont icon-cloudupload"></span>
                                        </a>
                                    </span>
                                    <span class="input-group-btn">
                                        <a class="btn btn-secondary select-file" href="javascript:"
                                           data-toggle="tooltip"
                                           data-placement="bottom" title="从文件库选择">
                                            <span class="iconfont icon-viewmodule"></span>
                                        </a>
                                    </span>
                                    </div>
                                    <div class="upload-preview-list">
                                        <?php if (count($goods_pic_list) > 0) : ?>
                                            <?php foreach ($goods_pic_list as $item) : ?>
                                                <div class="upload-preview text-center">
                                                    <input type="hidden" class="file-item-input"
                                                           name="model[goods_pic_list][]"
                                                           value="<?= $item ?>">
                                                    <span class="file-item-delete">&times;</span>
                                                    <span class="upload-preview-tip">750&times;750</span>
                                                    <img class="upload-preview-img" src="<?= $item ?>">
                                                </div>
                                            <?php endforeach; ?>
                                        <?php else : ?>
                                            <div class="upload-preview text-center">
                                                <input type="hidden" class="file-item-input" name="model[goods_pic_list][]">
                                                <span class="file-item-delete">&times;</span>
                                                <span class="upload-preview-tip">750&times;750</span>
                                                <img class="upload-preview-img" src="">
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">预约金额</label>
                            </div>
                            <div class="col-9">
                                <div class="input-group short-row">
                                    <input type="number" step="0.01" class="form-control"
                                           name="model[price]" min="0.01"
                                           value="<?= $goods['price'] ? $goods['price'] : 1 ?>">
                                    <span class="input-group-addon">元</span>
                                </div>
                                <div class="fs-sm text-muted">设置0则小程序端将显示为 免费</div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">原价</label>
                            </div>
                            <div class="col-9">
                                <input type="number" step="0.01" class="form-control short-row"
                                       name="model[original_price]" min="0"
                                       value="<?= $goods['original_price'] ? $goods['original_price'] : 1 ?>">
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">服务内容</label>
                            </div>
                            <div class="col-9">
                                <input class="form-control short-row" name="model[service]"
                                       value="<?= $goods['service'] ?>">
                                <div class="fs-sm text-muted">例子：正品保障,极速发货,7天退换货。多个请使用英文逗号<kbd>,</kbd>分隔</div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label">支持门店</label>
                            </div>
                            <div class="col-9">
                                <input class="form-control short-row" name="model[shop_id]"
                                       value="<?= $goods['shop_id'] ?>">
                                <div class="fs-sm text-muted">请填写门店id 多个请使用英文逗号<kbd>,</kbd>分隔，不使用门店请填 -1</div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">库存</label>
                            </div>
                            <div class="col-9">
                                <div class="input-group short-row">
                                    <input class="form-control short-row" type="text" name="model[stock]" value="<?= $goods['stock']?:0 ?>">
                                    <span class="input-group-addon">件</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">限单</label>
                            </div>
                            <div class="col-9"> 
                                <input class="form-control short-row" type="text" name="model[buy_limit]"
                                       value="<?= $goods['buy_limit'] ?: 0 ?>">
                                <div class="text-muted fs-sm">限制购买次数, 默认 0 不限</div>
                            </div>
                        </div>
<!--                        <div class="form-group row">-->
<!--                            <div class="col-3 text-right">-->
<!--                                <label class=" col-form-label">限购</label>-->
<!--                            </div>-->
<!--                            <div class="col-9">-->
<!--                                <input class="form-control short-row" type="text" name="model[one_buy_limit]"-->
<!--                                       value="--><?//= $goods['one_buy_limit']?:0 ?><!--">-->
<!--                                <div class="text-muted fs-sm">限制一次购买数量，默认 0 不限</div>-->
<!--                            </div>-->
<!--                        </div>-->
                    </div>
                </div>


                <div class="step-block" flex="dir:left box:first">
                <div>
                    <span>规格库存</span>
                    <span class="step-location" id="step6"></span>
                </div>
                <div>
                    <!-- 规格开关 -->
                    <div class="form-group row">
                        <div class="col-3 text-right">
                            <label class="col-form-label">是否使用规格</label>
                        </div>
                        <div class="col-9 col-form-label">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox"
                                       name="model[use_attr]" 
                                       value="1"
                                    <?= $goods['use_attr'] ? 'checked' : null ?>
                                       class="custom-control-input use-attr">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">使用规格</span>
                            </label>
                        </div>
                    </div>

                    <!-- 有规格 -->
                    <div class="attr-edit-block">
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">规格组和规格值</label>
                            </div>
                            <div class="col-9">
                                <div class="input-group short-row mb-2" v-if="attr_group_list.length<3">
                                    <span class="input-group-addon">规格组</span>
                                    <input class="form-control add-attr-group-input" placeholder="如颜色、尺码、套餐">
                                    <span class="input-group-btn">
                                        <a class="btn btn-secondary add-attr-group-btn" href="javascript:">添加</a>
                                    </span>
                                </div>
                                <div v-else class="mb-2">最多只可添加3个规格组</div>
                                <div v-for="(attr_group,i) in attr_group_list" class="attr-group">
                                    <div>
                                        <b>{{attr_group.attr_group_name}}</b>
                                        <a v-bind:index="i" href="javascript:" class="attr-group-delete">×</a>
                                    </div>
                                    <div class="attr-list">
                                        <div v-for="(attr,j) in attr_group.attr_list" class="attr-item">
                                            <span class="attr-name">{{attr.attr_name}}</span>
                                            <a v-bind:group-index="i" v-bind:index="j" class="attr-delete"
                                               href="javascript:">×</a>
                                        </div>
                                        <div style="display: inline-block;width: 200px;margin-top: .5rem">
                                            <div class="input-group attr-input-group" style="border-radius: 0">
                                                <span class="input-group-addon"
                                                      style="padding: .35rem .35rem;font-size: .8rem">规格值</span>
                                                <input class="form-control form-control-sm add-attr-input"
                                                       placeholder="如红色、白色">
                                                <span class="input-group-btn">
                                                    <a v-bind:index="i" class="btn btn-secondary btn-sm add-attr-btn"
                                                       href="javascript:">添加</a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">价格和库存</label>
                            </div>
                            <div class="col-9">
                                <div v-if="attr_group_list && attr_group_list.length>0">
                                    <table class="table table-bordered attr-table">
                                        <thead>
                                            <tr>
                                                <th v-for="(attr_group,i) in attr_group_list"
                                                    v-if="attr_group.attr_list && attr_group.attr_list.length>0">
                                                    {{attr_group.attr_group_name}}
                                                </th>
                                                <th>
                                                    <div class="input-group">
                                                        <span>库存</span>
                                                        <input class="form-control form-control-sm" type="number" style="width: 60px">
                                                        <span class="input-group-addon"><a href="javascript:" class="bat" data-index="0">设置</a></span>
                                                    </div>

                                                </th>

                                                <th>                                                
                                                    <div class="input-group">
                                                        <span>价格</span>
                                                        <input class="form-control form-control-sm" type="number" style="width: 60px">
                                                        <span class="input-group-addon"><a href="javascript:" class="bat" data-index="1">设置</a></span>
                                                    </div>
                                                </th>
                                                <th>规格图片</th>
                                            </tr>
                                        </thead>
                                        <tr v-for="(item,index) in checked_attr_list">
                                                <td v-for="(attr,attr_index) in item.attr_list">
                                                    <input type="hidden"
                                                       v-bind:name="'attr['+index+'][attr_list]['+attr_index+'][attr_id]'"
                                                       v-bind:value="attr.attr_id">

                                                    <input type="hidden" style="width: 40px"
                                                       v-bind:name="'attr['+index+'][attr_list]['+attr_index+'][attr_name]'"
                                                       v-bind:value="attr.attr_name">

                                                    <input type="hidden" style="width: 40px"
                                                       v-bind:name="'attr['+index+'][attr_list]['+attr_index+'][attr_group_name]'"
                                                       v-bind:value="attr.attr_group_name">
                                                    <span>{{attr.attr_name}}</span>
                                                </td>

                                                <td>
                                                    <input class="form-control form-control-sm" type="number" min="0"
                                                        step="1" style="width: 60px" v-bind:name="'attr['+index+'][num]'"
                                                        v-model="item.num" v-on:change="change(item,index)">
                                                </td>
                                                <td>
                                                    <input class="form-control form-control-sm" type="number" min="0"
                                                        step="0.01" style="width: 70px"
                                                        v-bind:name="'attr['+index+'][price]'"
                                                        v-model="item.price" v-on:change="change(item,index)">
                                                </td>
                                                <td>
                                                    <div class="input-group input-group-sm" v-bind:data-index="index">
                                                        <input class="form-control form-control-sm" style="width: 40px"
                                                            v-bind:name="'attr['+index+'][pic]'"
                                                            v-model="item.pic">
                                                        <span class="input-group-btn">
                                                            <a class="btn btn-secondary upload-attr-pic" href="javascript:"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom" title="上传文件">
                                                                <span class="iconfont icon-cloudupload"></span>
                                                            </a>
                                                        </span> 
                                                        <span class="input-group-btn">
                                                            <a class="btn btn-secondary select-attr-pic" href="javascript:"
                                                               data-toggle="tooltip"
                                                               data-placement="bottom" title="从文件库选择">
                                                                <span class="iconfont icon-viewmodule"></span>
                                                            </a>
                                                        </span>
                                                        <span class="input-group-btn">
                                                            <a class="btn btn-secondary delete-attr-pic" href="javascript:"
                                                               data-toggle="tooltip"
                                                               data-placement="bottom" title="删除文件">
                                                                <span class="iconfont icon-close"></span>
                                                            </a>
                                                        </span>
                                                    </div>
                                                    <img v-if="item.pic" v-bind:src="item.pic"
                                                        style="width: 50px;height: 50px;margin: 2px 0;border-radius: 2px">
                                                </td>
                                            </tr>
                                        </table>
                                        <div class="text-muted fs-sm">规格价格0表示保持原售价</div>
                                    </div>
                                    <div v-else class="pt-2 text-muted">请先填写规格组和规格值</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-block" flex="dir:left box:first">
                    <div>
                        <span>分销设置</span>
                        <span class="step-location" id="step5"></span>
                    </div>
                    <div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">开启单独分销设置</label>
                            </div>
                            <div class="col-9 col-form-label">
                                <label class="radio-label">
                                    <input <?= $goods_share['individual_share'] == 0 ? 'checked' : null ?>
                                        value="0" name="model[individual_share]" type="radio" class="custom-control-input">
                                    <span class="label-icon"></span>
                                    <span class="label-text">不开启</span>
                                </label>
                                <label class="radio-label">
                                    <input <?= $goods_share['individual_share'] == 1 ? 'checked' : null ?>
                                        value="1" name="model[individual_share]" type="radio" class="custom-control-input">
                                    <span class="label-icon"></span>
                                    <span class="label-text">开启</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row share-commission">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">分销佣金类型</label>
                            </div>
                            <div class="col-9 col-form-label">
                                <label class="radio-label share-type">
                                    <input <?= $goods_share['share_type'] == 0 ? 'checked' : null ?>
                                        name="model[share_type]"
                                        value="0"
                                        type="radio"
                                        class="custom-control-input">
                                    <span class="label-icon"></span>
                                    <span class="label-text">百分比</span>
                                </label>
                                <label class="radio-label share-type">
                                    <input <?= $goods_share['share_type'] == 1 ? 'checked' : null ?>
                                        name="model[share_type]"
                                        value="1"
                                        type="radio"
                                        class="custom-control-input">
                                    <span class="label-icon"></span>
                                    <span class="label-text">固定金额</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row share-commission">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">单独分销设置</label>
                            </div>
                            <div class="col-9">
                                <div class="short-row">
                                    <!--2018-05-22 注释--风哀伤
                                    <div class="input-group mb-3">
                                        <span class="input-group-addon">自购返利</span>
                                        <input name="model[rebate]"
                                               value="<?= $goods_share['rebate'] ?>"
                                               class="form-control"
                                               type="number"
                                               step="0.01"
                                               min="0" max="100">
                                    <span
                                        class="input-group-addon percent"><?= $goods_share['share_type'] == 1 ? "元" : "%" ?></span>
                                    </div>
                                    <div class="fs-sm text-danger">注：开启分销内购，分销商自己购买商品，享受分销自购返现，上级享受一级佣金，上上级享受二级佣金，上上上级享受三级佣金</div>-->
                                    <div class="input-group mb-3">
                                        <span class="input-group-addon">一级佣金</span>
                                        <input name="model[share_commission_first]"
                                               value="<?= $goods_share['share_commission_first'] ?>"
                                               class="form-control"
                                               type="number"
                                               step="0.01"
                                               min="0" max="100">
                                    <span
                                        class="input-group-addon percent"><?= $goods_share['share_type'] == 1 ? "元" : "%" ?></span>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-addon">二级佣金</span>
                                        <input name="model[share_commission_second]"
                                               value="<?= $goods_share['share_commission_second'] ?>"
                                               class="form-control"
                                               type="number"
                                               step="0.01"
                                               min="0" max="100">
                                    <span
                                        class="input-group-addon percent"><?= $goods_share['share_type'] == 1 ? "元" : "%" ?></span>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-addon">三级佣金</span>
                                        <input name="model[share_commission_third]"
                                               value="<?= $goods_share['share_commission_third'] ?>"
                                               class="form-control"
                                               type="number"
                                               step="0.01"
                                               min="0" max="100">
                                    <span
                                        class="input-group-addon percent"><?= $goods_share['share_type'] == 1 ? "元" : "%" ?></span>
                                    </div>
                                    <div class="fs-sm">
                                        <a href="<?= $urlManager->createUrl(['mch/share/basic']) ?>"
                                           target="_blank">分销层级</a>的优先级高于商品单独的分销比例，例：层级只开二级分销，那商品的单独分销比例只有二级有效
                                    </div>
                                    <div class="fs-sm text-danger">预约核销成功，才计算佣金</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-block" flex="dir:left box:first">
                    <div>
                        <span>自定义表单</span>
                        <span class="step-location" id="step3"></span>
                    </div>
                    <div>
                        <div class="form-group row">
                            <div class="col-3 text-right required">
                                <label class="col-form-label">自定义表单</label>
                            </div>
                            <div class="col-9">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <td>类型</td>
                                        <td>名称</td>
                                        <td>必填</td>
                                        <td>设置</td>
                                        <td></td>
                                    </tr>
                                    </thead>
                                    <col style="width: 15%;">
                                    <col style="width: 15%;">
                                    <col style="width: 10%;">
                                    <col style="width: 30%;">
                                    <col style="width: 30%;">
                                    <tbody>
                                    <template v-for="(item,index) in form_list">
                                        <tr v-if="item.type == 'text'">
                                            <td>
                                                单行文本
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">设置默认值</span><input type="text"
                                                                                          v-model="item.default"
                                                                                          class="form-control"
                                                                                          :name="'model[form_list]['+index+'][default]'">
                                                </div>
                                                <div class="mb-2">
                                                    <span class="mr-2">提示语</span><input type="text" v-model="item.tip"
                                                                                        class="form-control"
                                                                                        :name="'model[form_list]['+index+'][tip]'">
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>
                                        <tr v-if="item.type == 'textarea'">
                                            <td>
                                                多行文本
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">设置默认值</span><input type="text"
                                                                                          v-model="item.default"
                                                                                          class="form-control"
                                                                                          :name="'model[form_list]['+index+'][default]'">
                                                </div>
                                                <div class="mb-2">
                                                    <span class="mr-2">提示语</span><input type="text" v-model="item.tip"
                                                                                        class="form-control"
                                                                                        :name="'model[form_list]['+index+'][tip]'">
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>
                                        <tr v-if="item.type == 'time'">
                                            <td>
                                                时间选择器
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">设置默认值</span><input type="time"
                                                                                          v-model="item.default"
                                                                                          class="form-control "
                                                                                          :name="'model[form_list]['+index+'][default]'">
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>
                                        <tr v-if="item.type == 'date'">
                                            <td>
                                                日期选择器
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">设置默认值</span><input type="date"
                                                                                          v-model="item.default"
                                                                                          class="form-control "
                                                                                          :name="'model[form_list]['+index+'][default]'">
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>
                                        <tr v-if="item.type == 'radio'">
                                            <td>
                                                单选框
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">选项值</span><input type="text"
                                                                                        v-model="item.default"
                                                                                        class="form-control"
                                                                                        :name="'model[form_list]['+index+'][default]'">

                                                    <div class="text-muted fs-sm">选项值请用英文逗号<kbd>,</kbd>分隔</div>
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>
                                        <tr v-if="item.type == 'checkbox'">
                                            <td>
                                                复选框
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">选项值</span><input type="text"
                                                                                        v-model="item.default"
                                                                                        class="form-control"
                                                                                        :name="'model[form_list]['+index+'][default]'">

                                                    <div class="text-muted fs-sm">选项值请用英文逗号<kbd>,</kbd>分隔</div>
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>
                                        <tr v-if="item.type == 'uploadImg'">
                                            <td>
                                                图片上传
                                                <input type="hidden" v-model="item.id" class="form-control"
                                                       :name="'model[form_list]['+index+'][id]'">
                                                <input type="hidden" v-model="item.type"
                                                       :name="'model[form_list]['+index+'][type]'">
                                            </td>
                                            <td><input type="text" v-model="item.name" class="form-control"
                                                       :name="'model[form_list]['+index+'][name]'"></td>
                                            <td><input type="checkbox" value="1" :checked="item.required==1"
                                                       :name="'model[form_list]['+index+'][required]'"></td>
                                            <td>
                                                <div class="mb-2">
                                                    <span class="mr-2">提示语</span><input type="text"
                                                                                        v-model="item.default"
                                                                                        class="form-control"
                                                                                        :name="'model[form_list]['+index+'][tip]'">
                                                </div>
                                            </td>
                                            <td>
                                                <a class="btn btn-sm btn-primary form-prev" :data-index="index"
                                                   v-if="index>0"
                                                   href="javascript:">上移</a>
                                                <a class="btn btn-sm btn-primary form-next" :data-index="index"
                                                   v-if="index<form_list.length-1"
                                                   href="javascript:">下移</a>
                                                <a class="btn btn-sm btn-danger form-del" :data-index="index"
                                                   href="javascript:">删除</a>
                                            </td>
                                        </tr>

                                    </template>
                                    <template>
                                        <tr>
                                            <td colspan="2">
                                                <select class="form-control form-add-type">
                                                    <option value="text">单行文本</option>
                                                    <option value="textarea">多行文本</option>
                                                    <option value="time">时间选择器</option>
                                                    <option value="date">日期选择器</option>
                                                    <option value="radio">单选</option>
                                                    <option value="checkbox">复选</option>
                                                    <option value="uploadImg">上传图片</option>
                                                </select>
                                            </td>
                                            <td colspan="2" style="text-align: right">
                                                <a class="btn btn-sm btn-primary form-add" href="javascript:">添加一个字段</a>
                                            </td>
                                        </tr>
                                    </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-block" flex="dir:left box:first">
                    <div>
                        <span>图文详情</span>
                        <span class="step-location" id="step4"></span>
                    </div>
                    <div>
                        <div class="form-group row">
                            <div class="col-3 text-right">
                                <label class=" col-form-label required">图文详情</label>
                            </div>
                            <div class="col-9">
                            <textarea class="short-row" id="editor"
                                      name="model[detail]"><?= $goods['detail'] ?></textarea>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div flex="dir:left box:first">
                <div class="form-group mt-3">
                        <a class="btn btn-primary auto-form-btn" href="javascript:">保存</a>
                        <input type="button" class="btn btn-default ml-4" 
                               name="Submit" onclick="javascript:history.back(-1);" value="返回">
                </div>
            </div>
        </form>


        <!-- 选择分类 -->
        <div class="modal fade" id="catModal" tabindex="-1" role="dialog" aria-labelledby="catModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <b>选择分类</b>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="cat-box">
                            <div class="row">
                                <div class="col-6">
                                    <div class="cat-list parent-cat-list">
                                        <?php if (is_array($cat_list)) :
                                            foreach ($cat_list as $index => $cat) : ?>
                                            <label class="cat-item <?= $index == 0 ? 'active' : '' ?>">
                                                <?= $cat->name ?>
                                                <input value="<?= $cat->id ?>"
                                                    <?= $index == 0 ? 'checked' : '' ?>
                                                       type="radio"
                                                       name="model[cat_id]">
                                            </label>
                                            <?php endforeach;
                                        endif; ?>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="cat-list">
                                        <label class="cat-item" v-for="sub_cat in sub_cat_list">
                                            {{sub_cat.name}}
                                            <input v-bind:value="sub_cat.id" type="radio" name="model[cat_id]">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-primary cat-confirm">确认</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script src="<?= Yii::$app->request->baseUrl ?>/statics/ueditor/ueditor.config.js"></script>
<script src="<?= Yii::$app->request->baseUrl ?>/statics/ueditor/ueditor.all.min.js"></script>
<script>
    var Map = function () {
        this._data = [];
        this.set = function (key, val) {
            for (var i in this._data) {
                if (this._data[i].key == key) {
                    this._data[i].val = val;
                    return true;
                }
            }
            this._data.push({
                key: key,
                val: val,
            });
            return true;
        };
        this.get = function (key) {
            for (var i in this._data) {
                if (this._data[i].key == key)
                    return this._data[i].val;
            }
            return null;
        };
        this.delete = function (key) {
            for (var i in this._data) {
                if (this._data[i].key == key) {
                    this._data.splice(i, 1);
                }
            }
            return true;
        };
    };
    var map = new Map();
    var app = new Vue({
        el: "#app",
        data: {
            form_list: <?=$form_list?>,           
            attr_group_list: JSON.parse('<?=json_encode($goods->getAttrData(), JSON_UNESCAPED_UNICODE)?>'),
            checked_attr_list: JSON.parse('<?=json_encode($goods->getCheckedAttrData(), JSON_UNESCAPED_UNICODE)?>'),//已选规格数据
        },
        methods:{
            change: function (item, index) {
                this.checked_attr_list[index] = item;
            }
        }
    });
</script>
<!-- 规格 -->
<script>
    $(document).on("click", ".add-attr-group-btn", function () {
        var name = $(".add-attr-group-input").val();
        name = $.trim(name);
        if (name == "")
            return;
        app.attr_group_list.push({
            attr_group_name: name,
            attr_list: [],
        });
        $(".add-attr-group-input").val("");
        app.checked_attr_list = getAttrList();
    });
    function checkUseAttr() {
        if ($('.use-attr').length == 0)
            return;
        if ($('.use-attr').prop('checked')) {
            $('input[name="model[stock]"]').val(0).prop('readonly', true);
            $('.attr-edit-block').show();
        } else {
            $('input[name="model[stock]"]').prop('readonly', false);
            $('.attr-edit-block').hide();
        }
    }

    $(document).on('change', '.use-attr', function () {
        checkUseAttr();
    });

    checkUseAttr();

    $(document).on("click", ".add-attr-group-btn", function () {
        var name = $(".add-attr-group-input").val();
        name = $.trim(name);
        if (name == "")
            return;
        app.attr_group_list.push({
            attr_group_name: name,
            attr_list: [],
        });
        $(".add-attr-group-input").val("");
        app.checked_attr_list = getAttrList();
    });

    $(document).on("click", ".add-attr-btn", function () {
        var name = $(this).parents(".attr-input-group").find(".add-attr-input").val();
        var index = $(this).attr("index");
        name = $.trim(name);
        if (name == "")
            return;
        app.attr_group_list[index].attr_list.push({
            attr_name: name,
        });
        $(this).parents(".attr-input-group").find(".add-attr-input").val("");
        app.checked_attr_list = getAttrList();
    });


    $(document).on("click", ".attr-group-delete", function () {
        var index = $(this).attr("index");
        app.attr_group_list.splice(index, 1);
        app.checked_attr_list = getAttrList();
    });

    $(document).on("click", ".attr-delete", function () {
        var index = $(this).attr("index");
        var group_index = $(this).attr("group-index");
        app.attr_group_list[group_index].attr_list.splice(index, 1);
        app.checked_attr_list = getAttrList();
    });

    function getAttrList() {
        var array = [];
        for (var i in app.attr_group_list) {
            for (var j in app.attr_group_list[i].attr_list) {
                var object = {
                    attr_group_name: app.attr_group_list[i].attr_group_name,
                    attr_id: null,
                    attr_name: app.attr_group_list[i].attr_list[j].attr_name,
                };
                if (!array[i])
                    array[i] = [];
                array[i].push(object);
            }
        }
        var len = array.length;
        var results = [];
        var indexs = {};

        function specialSort(start) {
            start++;
            if (start > len - 1) {
                return;
            }
            if (!indexs[start]) {
                indexs[start] = 0;
            }
            if (!(array[start] instanceof Array)) {
                array[start] = [array[start]];
            }
            for (indexs[start] = 0; indexs[start] < array[start].length; indexs[start]++) {
                specialSort(start);
                if (start == len - 1) {
                    var temp = [];
                    for (var i = len - 1; i >= 0; i--) {
                        if (!(array[start - i] instanceof Array)) {
                            array[start - i] = [array[start - i]];
                        }
                        if (array[start - i][indexs[start - i]]) {
                            temp.push(array[start - i][indexs[start - i]]);
                        }
                    }
                    var key = [];
                    for (var i in temp) {
                        key.push(temp[i].attr_id);
                    }
                    var oldVal = map.get(key.sort().toString());
                    if (oldVal) {
                        results.push({
                            num: oldVal.num,
                            price: oldVal.price,
                            single: oldVal.single,
                            no: oldVal.no,
                            pic: oldVal.pic,
                            attr_list: temp
                        });
                    } else {
                        results.push({
                            num: 0,
                            price: 0,
                            single: 0,
                            no: '',
                            pic: '',
                            attr_list: temp
                        });
                    }
                }
            }
        }
        specialSort(-1);
        return results;
    }
</script>


<script>
    $(document).on('change', '.video', function () {
        $('.video-check').attr('href', this.value);
    });
    //日期时间选择器
    laydate.render({
        elem: '#limit_time'
        , type: 'datetime'
    });
    var ue = UE.getEditor('editor', {
        serverUrl: "<?=$urlManager->createUrl(['upload/ue'])?>",
        enableAutoSave: false,
        saveInterval: 1000 * 3600,
        enableContextMenu: false,
        autoHeightEnabled: false,
    });

</script>

<script>
    $(document).on("click", ".submit-btn-1", "click", function () {
        var form = $(this).parents("form");
        var return_url = form.attr("data-return");
        var timeout = form.attr("data-timeout");
        var btn = $(this);
        var error = form.find(".form-error");
        var success = form.find(".form-success");
        error.hide();
        success.hide();
        $("input[name='_csrf']").val("<?=Yii::$app->request->csrfToken?>");
        btn.btnLoading("正在提交");
        var form_list = app.form_list;
        var is_submit = true;
        for (var i in form_list) {
            if (!form_list[i].name || form_list[i] == undefined) {
                is_submit = false;
                break;
            }
        }
        if (!is_submit) {
            btn.btnReset();
            $.myAlert({
                content: '请填写字段名称'
            });
            return;
        }
        $.ajax({
            url: form.attr("action"),
            type: form.attr("method"),
            data: form.serialize(),
            dataType: "json",
            success: function (res) {
                if (res.code == 0) {
                    success.html(res.msg).show();
                    if (return_url) {
                        if (timeout)
                            timeout = 1000 * parseInt(timeout);
                        else
                            timeout = 1500;
                        setTimeout(function () {
                            location.href = return_url;
                        }, timeout);
                    } else {
                        btn.btnReset();
                    }
                }
                if (res.code == 1) {
                    error.html(res.msg).show();
                    btn.btnReset();
                }
            }
        });
        return false;
    });
</script>
<script>
    $(document).on('click', '.form-del', function () {
        var index = $(this).data('index');
        app.form_list.splice(index, 1);
    });
    $(document).on('click', '.form-prev', function () {
        var index = $(this).data('index');
        if (index == 0) {
            return;
        }
        var middle = app.form_list[index];
        var prev = app.form_list[index - 1];
        app.form_list.splice(index - 1, 2, middle, prev);
    });
    $(document).on('click', '.form-next', function () {
        var index = $(this).data('index');
        if (index == app.form_list.length - 1) {
            return;
        }
        var middle = app.form_list[index];
        var next = app.form_list[index + 1];
        app.form_list.splice(index, 2, next, middle);
    });
</script>
<script>
    $(document).on('click', '.form-add', function () {
        var aa = {};
        aa.type = $('.form-add-type').val();
        aa.name = $('.form-add-type').val();
        app.form_list.push(aa);
    });
</script>
<script>
    $(document).on("change", "input[name='model[individual_share]']", function () {
        setShareCommission();
    });
    setShareCommission();

    function setShareCommission() {
        if ($("input[name='model[individual_share]']:checked").val() == 1) {
            $(".share-commission").show();
        } else {
            $(".share-commission").hide();
        }
    }

    $(document).on('change',"input[name='model[share_type]']",function(){
        setShareType();
    });
    setShareType();

    function setShareType() {
        if($("input[name='model[share_type]']:checked").val() == 1){
            $('.percent').html('元');
        }else{
            $('.percent').html('%');
        }
    }
</script>

<!-- 规格图片 -->
<script>
    $(document).on('click', '.upload-attr-pic', function () {
        var btn = $(this);
        var input = btn.parents('.input-group').find('.form-control');
        var index = btn.parents('.input-group').attr('data-index');
        $.upload_file({
            accept: 'image/*',
            start: function (res) {
                btn.btnLoading('');
            },
            success: function (res) {
                input.val(res.data.url).trigger('change');
                app.checked_attr_list[index].pic = res.data.url;
            },
            complete: function (res) {
                btn.btnReset();
            },
        });
    });
    $(document).on('click', '.select-attr-pic', function () {
        var btn = $(this);
        var input = btn.parents('.input-group').find('.form-control');
        var index = btn.parents('.input-group').attr('data-index');
        $.select_file({
            success: function (res) {
                input.val(res.url).trigger('change');
                app.checked_attr_list[index].pic = res.url;
            }
        });
    });
    $(document).on('click', '.delete-attr-pic', function () {
        var btn = $(this);
        var input = btn.parents('.input-group').find('.form-control');
        var index = btn.parents('.input-group').attr('data-index');
        input.val('').trigger('change');
        app.checked_attr_list[index].pic = '';
    });
</script>
<!--批量设置-->
<script>
    $(document).on('click', '.bat', function () {
        var type = $(this).data('index');
        var val = $($(this).parent().prev('input')).val();

        for(var i in app.checked_attr_list){
            if(type == 0){
                app.checked_attr_list[i].num = val
            }else if(type == 1){
                app.checked_attr_list[i].price = val
            }
        }
    });
</script>