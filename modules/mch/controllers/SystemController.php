<?php

/**
 * @author Lu Wei
 *
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2018/5/22
 * Time: 16:08
 */

namespace app\modules\mch\controllers;

use app\modules\mch\models\DbOptimizeForm;

class SystemController extends Controller
{
    /**
     * 数据库优化
     */
    public function actionDbOptimize()
    {
        $this->checkIsAdmin();
        if (\Yii::$app->request->isPost) {
            $form = new DbOptimizeForm();
            $form->attributes = \Yii::$app->request->post();
            return $form->run();
        } else {
            return $this->render('db-optimize');
        }
    }
}
