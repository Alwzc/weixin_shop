<?php
/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/8/10
 * Time: 22:53
 */

namespace app\modules\api\models\group;

use app\models\Goods;
use app\models\OrderDetail;
use app\models\OrderRefund;
use app\models\PtGoods;
use app\models\PtOrderDetail;
use app\models\PtOrderRefund;
use app\modules\api\models\ApiModel;

class OrderRefundDetailForm extends ApiModel
{
    public $store_id;
    public $user_id;
    public $order_refund_id;

    public function rules()
    {
        return [
            [['order_refund_id'], 'required'],
        ];
    }

    public function search()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }
        $order_refund = PtOrderRefund::find()->alias('or')
            ->leftJoin(['od' => PtOrderDetail::tableName()], 'or.order_detail_id=od.id')
            ->leftJoin(['g' => PtGoods::tableName()], 'od.goods_id=g.id')
            ->where([
                'or.id' => $this->order_refund_id,
                'or.is_delete' => 0,
            ])
            ->select('or.id order_refund_id,g.id goods_id,g.name,od.num,od.total_price,od.attr,or.desc refund_desc,or.type refund_type,or.status refund_status,or.pic_list refund_pic_list,or.refund_price,g.cover_pic AS goods_pic')
            ->asArray()->one();
        if (!$order_refund) {
            return [
                'code' => 1,
                'msg' => '售后单不存在'
            ];
        }
        $order_refund['attr'] = json_decode($order_refund['attr']);
        $order_refund['refund_pic_list'] = json_decode($order_refund['refund_pic_list']);
        return [
            'code' => 0,
            'msg' => 'success',
            'data' => $order_refund,
        ];
    }
}
