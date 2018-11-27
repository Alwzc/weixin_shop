<?php
defined('YII_ENV') or exit('Access Denied');

$urlManager = Yii::$app->urlManager;
$this->title = '虚拟用户编辑/添加'; 
$this->params['active_nav_group'] = 8; 

use yii\widgets\ActiveForm;
use \app\models\Option;
?> 
<!-- 
<link href="<?= Yii::$app->request->baseUrl ?>/statics/mch/css/bootstrap-combined.min.css" rel="stylesheet">
<link href="<?= Yii::$app->request->baseUrl ?>/statics/mch/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
<script src="<?= Yii::$app->request->baseUrl ?>/statics/mch/js/bootstrap-datetimepicker.js"></script>     -->

<div class="panel mb-3">
    <div class="panel-header"><?= $this->title ?></div>
    <div class="panel-body">
        <form class="form auto-form" method="post" return="<?= $urlManager->createUrl(['mch/prince-comment/user-list']) ?>">
            <div class="form-group row" style="<?php if(!$model['id']){echo 'display:none';}else{echo 'display:display'; } ?>"" >
                <div class="form-group-label col-sm-2 text-right">
                    <label class="col-form-label">ID</label>
                </div>
                <div class="col-sm-6">
                 <div class="col-form-label required"><?= $model['id'] ?></div>
             </div>
        </div> 

        <div class="form-group row">
            <div class="form-group-label col-sm-2 text-right">
                <label class="col-form-label required">用户名</label>
            </div>
            <div class="col-sm-6">
               <input class="form-control" name="virtual_user" value="<?= $model['virtual_user'] ?>">
            </div>
        </div>


        <div class="form-group row">
            <div class="form-group-label col-sm-2 text-right">
                <label class="col-form-label">用户头像</label>
            </div>
            <div class="col-sm-6">
                <div class="upload-group">
                    <div class="input-group">
                        <input class="form-control file-input" name="virtual_avatar"
                        value="<?= $model['virtual_avatar'] ?>">
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
                        <img class="upload-preview-img" src="<?= $model['virtual_avatar'] ?>">
                    </div>
                </div>
            </div>
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
