<?php
defined('YII_ENV') or exit('Access Denied');

/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/6/19
 * Time: 16:52
 */

use \app\models\Option;

$urlManager = Yii::$app->urlManager;
$this->title = '商城设置';
$this->params['active_nav_group'] = 1;
?>
<style>
    #tab{
        margin-left: 6rem;
        border-bottom: 1px #E5E5E5 solid;
        margin-bottom: 3rem;
    }

    #tab .nav-item{
        border: 1px #E5E5E5 solid;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        margin-bottom: -1px;
        height: 3rem;
        line-height: 3rem;
        padding-left: 1rem;
        padding-right: 1rem;
        cursor: pointer;
    }
    .pointer{
        background-color: #33AAFF;
        color: white;
    }

    .toggle{
        display: none;
    }
</style>
<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <ul class="nav mt-3" id="tab">
        <li class="nav-item tabs pointer" id="tab1" value="1">
            基本信息
        </li>
        <li class="nav-item tabs" id="tab2" value="2">
            客服设置
        </li>
        <li class="nav-item tabs" id="tab3" value="3">
            显示设置
        </li>
    </ul>
    <div class="panel-body">
        <form method="post" class="auto-form">
            <div id="content1">
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label required">商城名称</label>
                    </div>
                    <div class="col-sm-6">
                        <input class="form-control" type="text" name="name" value="<?= $store->name ?>">
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">联系电话</label>
                    </div>
                    <div class="col-sm-6">
                        <input class="form-control" type="text" name="contact_tel"
                               value="<?= $store->contact_tel ?>">
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">未支付订单超时时间</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input class="form-control" type="number" name="over_day"
                                   value="<?= $store->over_day ?>">
                            <span class="input-group-addon">小时</span>
                        </div>
                        <div class="text-muted fs-sm">注意：时间设置为0则表示不开启自动删除未支付订单功能</div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">收货时间</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input class="form-control" type="number" name="delivery_time"
                                   value="<?= $store->delivery_time ?>">
                            <span class="input-group-addon">天</span>
                        </div>
                        <div class="text-muted fs-sm">从发货到自动确认收货的时间</div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">售后时间</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input class="form-control" type="number" name="after_sale_time"
                                   value="<?= $store->after_sale_time ?>">
                            <span class="input-group-addon">天</span>
                        </div>
                        <div class="text-muted fs-sm">可以申请售后的时间，<span class="text-danger">注意：分销订单中的已完成订单，只有订单已确认收货，并且时间超过设置的售后天数之后才计入其中！</span>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">快递鸟商户ID</label>
                    </div>
                    <div class="col-sm-6">
                        <input class="form-control" type="text" name="kdniao_mch_id"
                               value="<?= $store->kdniao_mch_id ?>">
                        <div class="text-muted fs-sm">用于获取物流信息，<a target="_blank" href="http://www.kdniao.com/">快递鸟接口申请</a>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">快递鸟API KEY</label>
                    </div>
                    <div class="col-sm-6">
                        <input class="form-control" type="text" name="kdniao_api_key"
                               value="<?= $store->kdniao_api_key ?>">
                    </div>
                </div>
                
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">开启领券中心</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->is_coupon == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="is_coupon" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->is_coupon == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="is_coupon" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">发货方式</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->send_type == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="send_type" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">快递或自提</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio1" <?= $store->send_type == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="send_type" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">仅快递</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio1" <?= $store->send_type == 2 ? 'checked' : null ?>
                                   value="2"
                                   name="send_type" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">仅自提</span>
                        </label>
                        <div class="text-muted fs-sm">自提需要设置门店，如果您还未设置门店请保存本页后设置门店，<a target="_blank"
                                                                                      href="<?= $urlManager->createUrl(['mch/store/shop']) ?>">点击前往设置</a>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">支付方式</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="checkbox-label">
                            <input <?= $option['payment']['wechat'] == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="payment[wechat]" type="checkbox" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">线上支付</span>
                        </label>
                        <label class="checkbox-label">
                            <input <?= $option['payment']['huodao'] == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="payment[huodao]" type="checkbox" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">货到付款</span>
                        </label>
                        <label class="checkbox-label">
                            <input <?= $option['payment']['balance'] == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="payment[balance]" type="checkbox" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">余额支付</span>
                        </label>
                        <div class="fs-sm text-danger">默认支持线上支付；若三个都不勾选，则视为勾选线上支付</div>
                        <div class="fs-sm">可在“<a target="_blank" href="<?=$urlManager->createUrl(['mch/recharge/setting'])?>">营销管理=>充值=>设置</a>”中开启余额功能</div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">会员积分</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input type="number" step="1" class="form-control short-row" name="integral"
                                   value="<?= $store->integral ?: 10 ?>">
                            <span class="input-group-addon">积分抵扣1元</span>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label required">会员积分使用规则</label>
                    </div>
                    <div class="col-sm-6">
                        <textarea class="form-control" type="text"
                                  rows="3"
                                  placeholder="请填写积分使用规则"
                                  name="integration"><?= $store->integration ?></textarea>
                        <div class="text-muted fs-sm">积分使用规则用于用户结算页说明显示，为了更好体验字数最好不要超过80字</div>
                    </div>
                </div>

                <div class="form-group row" hidden>
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">商城首页公告</label>
                    </div>
                    <div class="col-sm-6">
                        <textarea class="form-control" type="text"
                                  rows="3"
                                  placeholder="请填写商城公告"
                                  name="notice"><?= $option['notice'] ?></textarea>
                    </div>
                </div>
            </div>

            <div id="content2" class="toggle">
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">开启在线客服</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->show_customer_service == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="show_customer_service" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->show_customer_service == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="show_customer_service" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">客服图标</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="upload-group">
                            <div class="input-group">
                                <input class="form-control file-input" name="service"
                                       value="<?= Option::get('service', $store->id, 'admin') ?>">
                                <span class="input-group-btn">
                                <a class="btn btn-secondary upload-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="上传文件">
                                    <span class="iconfont icon-cloudupload"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary select-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="从文件库选择">
                                    <span class="iconfont icon-viewmodule"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary delete-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="删除文件">
                                    <span class="iconfont icon-close"></span>
                                </a>
                            </span>
                            </div>
                            <div class="upload-preview text-center upload-preview">
                                <span class="upload-preview-tip">100&times;100</span>
                                <img class="upload-preview-img" src="<?= Option::get('service', $store->id, 'admin') ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">一键拨号</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->dial == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="dial" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->dial == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="dial" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">拨号图标</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="upload-group">
                            <div class="input-group">
                                <input class="form-control file-input" name="dial_pic"
                                       value="<?= $store->dial_pic ?>">

                                <span class="input-group-btn">
                                <a class="btn btn-secondary upload-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="上传文件">
                                    <span class="iconfont icon-cloudupload"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary select-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="从文件库选择">
                                    <span class="iconfont icon-viewmodule"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary delete-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="删除文件">
                                    <span class="iconfont icon-close"></span>
                                </a>
                            </span>
                            </div>
                            <div class="upload-preview text-center upload-preview">
                                <span class="upload-preview-tip">100&times;100</span>
                                <img class="upload-preview-img" src="<?= $store->dial_pic ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">客服图标（跳转外链）</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="upload-group">
                            <div class="input-group">
                                <input class="form-control file-input" name="web_service"
                                       value="<?= $option['web_service'] ?>">
                                <span class="input-group-btn">
                                <a class="btn btn-secondary upload-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="上传文件">
                                    <span class="iconfont icon-cloudupload"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary select-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="从文件库选择">
                                    <span class="iconfont icon-viewmodule"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary delete-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="删除文件">
                                    <span class="iconfont icon-close"></span>
                                </a>
                            </span>
                            </div>
                            <div class="upload-preview text-center upload-preview">
                                <span class="upload-preview-tip">100&times;100</span>
                                <img class="upload-preview-img"
                                     src="<?= $option['web_service'] ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-3 text-right">
                        <label class=" col-form-label">客服外链</label>
                    </div>
                    <div class="col-sm-6">
                        <input class="form-control" type="text" step="1" name="web_service_url"
                               value="<?= urldecode($option['web_service_url']) ?>">
                    </div>
                </div>

                <?php $wxapp = json_decode($option['wxapp'], true);?>
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">悬浮按钮<br>（跳转小程序）</label>
                    </div>
                    <div class="col-sm-6">

                        <div class="form-group row">
                            <div class="form-group-label col-sm-2 text-right">
                                <label class="col-form-label">图标</label>
                            </div>
                            <div class="col-sm-6">
                                <div class="upload-group">
                                    <div class="input-group">
                                        <input class="form-control file-input" name="wxapp[pic_url]"
                                               value="<?= $wxapp['pic_url'] ?>">
                                <span class="input-group-btn">
                                <a class="btn btn-secondary upload-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="上传文件">
                                    <span class="iconfont icon-cloudupload"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary select-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="从文件库选择">
                                    <span class="iconfont icon-viewmodule"></span>
                                </a>
                            </span>
                                <span class="input-group-btn">
                                <a class="btn btn-secondary delete-file" href="javascript:" data-toggle="tooltip"
                                   data-placement="bottom" title="删除文件">
                                    <span class="iconfont icon-close"></span>
                                </a>
                            </span>
                                    </div>
                                    <div class="upload-preview text-center upload-preview">
                                        <span class="upload-preview-tip">100&times;100</span>
                                        <img class="upload-preview-img"
                                             src="<?= $wxapp['pic_url'] ?>">
                                    </div>
                                </div>
                                <div class="fs-sm text-danger">若图片为空，则表示不开启</div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="form-group-label col-sm-2 text-right">
                                <label class=" col-form-label">跳转小程序appid</label>
                            </div>
                            <div class="col-sm-6">
                                <input class="form-control" type="text" step="1" name="wxapp[appid]"
                                       value="<?= $wxapp['appid']  ?>">
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="form-group-label col-sm-2 text-right">
                                <label class=" col-form-label">跳转小程序路径</label>
                            </div>
                            <div class="col-sm-6">
                                <input class="form-control" type="text" step="1" name="wxapp[path]"
                                       value="<?= $wxapp['path']  ?>">
                                <div class="fs-sm">打开的页面路径，如pages/index/index，开头请勿加“/”</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="content3" class="toggle">
                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">分类页面样式</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->cat_style == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="cat_style" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">大图模式（不显示侧栏）</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio1" <?= $store->cat_style == 2 ? 'checked' : null ?>
                                   value="2"
                                   name="cat_style" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">大图模式（显示侧栏）</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio1" <?= $store->cat_style == 3 ? 'checked' : null ?>
                                   value="3"
                                   name="cat_style" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">小图标模式（不显示侧栏）</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio1" <?= $store->cat_style == 4 ? 'checked' : null ?>
                                   value="4"
                                   name="cat_style" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">小图标模式（显示侧栏）</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio1" <?= $store->cat_style == 5 ? 'checked' : null ?>
                                   value="5"
                                   name="cat_style" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">商品列表模式</span>
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">自定义板块分隔符</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio2" <?= $store->cut_thread == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="cut_thread" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->cut_thread == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="cut_thread" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">首页购买记录框</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio2" <?= $store->purchase_frame == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="purchase_frame" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->purchase_frame == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="purchase_frame" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">商城评价开关</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio2" <?= $store->is_comment == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="is_comment" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->is_comment == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="is_comment" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">推荐商品状态</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio2" <?= $store->is_recommend == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="is_recommend" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->is_recommend == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="is_recommend" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span> 
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label required">推荐商品显示数量</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input class="form-control" type="number" name="recommend_count"
                                   value="<?= $store->recommend_count ?>" max="100" min="0">
                            <span class="input-group-addon">个</span>
                        </div>
                        <div class="text-muted fs-sm">商品详情页 推荐商品显示的最大数量</div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">首页分类商品每行个数</label>
                    </div>
                    <div class="col-sm-6">
                        <select class="form-control" name="cat_goods_cols">
                            <option value="1" <?= $store->cat_goods_cols == 1 ? 'selected' : null ?> >1</option>
                            <option value="2" <?= $store->cat_goods_cols == 2 ? 'selected' : null ?> >2</option>
                            <option value="3" <?= $store->cat_goods_cols == 3 ? 'selected' : null ?> >3</option>
                        </select>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label required">首页分类商品显示个数</label>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input class="form-control" type="number" name="cat_goods_count"
                                   value="<?= $store->cat_goods_count ?>" max="100" min="0">
                            <span class="input-group-addon">个</span>
                        </div>
                        <div class="text-muted fs-sm">每个分类板块显示的商品最大数量（0~100）</div>
                    </div>
                </div>

                <div class="form-group row" hidden>
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">开启线下自提</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->is_offline == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="is_offline" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->is_offline == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="is_offline" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">关闭</span>
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="form-group-label col-sm-2 text-right">
                        <label class="col-form-label">首页导航栏一行个数</label>
                    </div>
                    <div class="col-sm-6">
                        <label class="radio-label">
                            <input id="radio1" <?= $store->nav_count == 0 ? 'checked' : null ?>
                                   value="0"
                                   name="nav_count" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启4个</span>
                        </label>
                        <label class="radio-label">
                            <input id="radio2" <?= $store->nav_count == 1 ? 'checked' : null ?>
                                   value="1"
                                   name="nav_count" type="radio" class="custom-control-input">
                            <span class="label-icon"></span>
                            <span class="label-text">开启5个</span>
                        </label>
                    </div>
                </div>

    <!--             <div class="form-group row">
                    <div class="form-group-label col-sm-3 text-right">
                        <label class=" col-form-label">全局包邮金额</label>
                    </div>
                    <div class="col-sm-6">
                        <input class="form-control" type="number" step="1" name="postage"
                               value="<?= Option::get('postage', $store->id, 'admin', '-1') ?>">
                        <div class="text-danger text-muted">注：全局满额包邮优先级最高</div>
                        <div class="text-danger text-muted">填-1表示不开启包邮</div>

                    </div>
                </div>
     -->
            </div>
            <div class="form-group row">
                <div class="form-group-label col-sm-2 text-right">
                </div>
                <div class="col-sm-6">
                    <a class="btn btn-primary auto-form-btn" href="javascript:">保存</a>
                </div>
            </div>

        </form>
    </div>
</div>
 

<script>
    $(document).on("click", "#tab1", function () {
        $('#tab1').addClass('pointer');
        $('#tab2').removeClass('pointer');
        $('#tab3').removeClass('pointer');
    });
    $(document).on("click", "#tab2", function () {
        $('#tab2').addClass('pointer');
        $('#tab1').removeClass('pointer');
        $('#tab3').removeClass('pointer');
    });
    $(document).on("click", "#tab3", function () {
        $('#tab3').addClass('pointer');
        $('#tab1').removeClass('pointer');
        $('#tab2').removeClass('pointer');
    });    

    $("ul#tab > li ").click(function(){
        var num = $(this).val();
        $("#content"+num).removeClass('toggle');
        if(num % 2 == 0){
            $("#content1").addClass('toggle')
            $("#content3").addClass('toggle')
        }else if(num % 3 == 0){
            $("#content2").addClass('toggle')
            $("#content1").addClass('toggle')
        }else{
            $("#content2").addClass('toggle')
            $("#content3").addClass('toggle')           
        }
    })
</script>