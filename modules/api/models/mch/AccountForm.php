<?php
/**
 * @author Lu Wei
 *
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2018/4/28
 * Time: 12:03
 */


namespace app\modules\api\models\mch;

use app\models\Mch;
use app\modules\api\models\ApiModel;

class AccountForm extends ApiModel
{
    public $mch_id;

    public function search()
    {
        $mch = Mch::findOne($this->mch_id);
        if (!$mch) {
            return [
                'code' => 1,
                'msg' => '商户不存在。',
            ];
        }
        return [
            'code' => 0,
            'data' => [
                'header_bg' => \Yii::$app->request->hostInfo . \Yii::$app->request->baseUrl . '/statics/shop/img/mch-account-header-bg.png',
                'account_money' => number_format($mch->account_money, 2, '.', ''),
                'rest_money' => '0',
                'desc' => '商户的手续费为' . $mch->transfer_rate . '/1000，即每笔成交订单可收入的金额=订单支付金额×(1-' . $mch->transfer_rate . '÷1000)。',
            ],
        ];
    }
}
