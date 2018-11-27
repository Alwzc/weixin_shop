<?php
defined('YII_ENV') or exit('Access Denied');

$urlManager = Yii::$app->urlManager;
$this->title = '规则编辑/添加'; 
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
        <form class="form auto-form" method="post" return="<?= $urlManager->createUrl(['mch/prince-comment/rule-list']) ?>">
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
                <label class="col-form-label required">替换前关键词</label>
            </div>
            <div class="col-sm-6">
               <input class="form-control" name="before_word" value="<?= $model['before_word'] ?>">
            </div>
        </div>


        <div class="form-group row">
            <div class="form-group-label col-sm-2 text-right">
                <label class="col-form-label">替换后关键词</label>
            </div>
            <div class="col-sm-6">
               <input class="form-control" name="after_word" value="<?= $model['after_word'] ?>">
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
