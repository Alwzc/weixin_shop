<?php
/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/7/27
 * Time: 18:41
 */

namespace app\modules\api\models\group;

use app\models\Goods;
use app\models\MiaoshaGoods;
use app\models\PtGoods;
use app\modules\api\models\ApiModel;

class PtGoodsAttrInfoForm extends ApiModel
{
    public $goods_id;
    public $attr_list;
    public $group_id;

    public function rules()
    {
        return [
            [['goods_id', 'attr_list','group_id'], 'required'],
        ];
    }

    public function search()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }
        $this->attr_list = json_decode($this->attr_list, true);
        $goods = PtGoods::findOne($this->goods_id);
        if (!$goods) {
            return [
                'code' => 1,
                'msg' => '商品不存在',
            ];
        }
        $res = $goods->getAttrInfo($this->attr_list, $this->group_id);
//        $miaosha_data = $this->getMiaoshaData($goods, $this->attr_list);
//        if ($miaosha_data) {
//            $miaosha_data['miaosha_price'] = number_format($miaosha_data['miaosha_price'], 2, '.', '');
//            $miaosha_data['rest_num'] = min((int)$res['num'], (int)$miaosha_data['miaosha_num']) - $miaosha_data['sell_num'];
//        }
//        $res['miaosha'] = $miaosha_data;
        return [
            'code' => 0,
            'msg' => 'success',
            'data' => $res,
        ];
    }

//    /**
//     * @param Goods $goods
//     * @param array $attr_id_list eg.[12,34,22]
//     * @return array ['attr_list'=>[],'miaosha_price'=>'秒杀价格','miaosha_num'=>'秒杀数量','sell_num'=>'已秒杀商品数量']
//     */
//    private function getMiaoshaData($goods, $attr_id_list = [])
//    {
//        $miaosha_goods = MiaoshaGoods::findOne([
//            'goods_id' => $goods->id,
//            'is_delete' => 0,
//            'open_date' => date('Y-m-d'),
//            'start_time' => intval(date('H')),
//        ]);
//        if (!$miaosha_goods)
//            return null;
//        $attr_data = json_decode($miaosha_goods->attr, true);
//        sort($attr_id_list);
//        $miaosha_data = null;
//        foreach ($attr_data as $i => $attr_data_item) {
//            $_tmp_attr_id_list = [];
//            foreach ($attr_data_item['attr_list'] as $item) {
//                $_tmp_attr_id_list[] = $item['attr_id'];
//            }
//            sort($_tmp_attr_id_list);
//            if ($attr_id_list == $_tmp_attr_id_list) {
//                $miaosha_data = $attr_data_item;
//                break;
//            }
//        }
//        return $miaosha_data;
//    }
}
