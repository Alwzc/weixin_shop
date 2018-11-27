<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/22
 * Time: 15:53
 */

namespace app\modules\api\models;

use app\models\Goods;
use app\models\GoodsShare;
use app\models\MchPlugin;
use app\models\MchSetting;
use app\models\MsGoods;
use app\models\MsOrder;
use app\models\MsSetting;
use app\models\Order;
use app\models\OrderDetail;
use app\models\OrderShare;
use app\models\PtOrder;
use app\models\PtOrderDetail;
use app\models\PtSetting;
use app\models\Setting;
use app\models\User;
use app\models\YyOrder;
use app\models\YySetting;

class ShareMoneyForm extends ApiModel
{
    public $order;
    public $order_type;

    public function setData()
    {
        $setting = Setting::findOne(['store_id' => $this->order->store_id]);
        if (!$setting || $setting->level == 0) {
            return false;
        }
        if(isset($this->order->mch_id) && $this->order->mch_id > 0){
            $mchPlugin = MchPlugin::findOne(['mch_id'=>$this->order->mch_id,'store_id'=>$this->order->store_id]);
            if(!$mchPlugin || $mchPlugin->is_share == 0){
                return false;
            }
            $mchSetting = MchSetting::findOne(['mch_id' => $this->order->mch_id]);
            if(!$mchSetting){
                return false;
            }
            if($mchSetting->is_share == 0){
                return false;
            }
        }

        $orderDetail = $this->getDetail();
        if (!$orderDetail) {
            return false;
        }
        $user = User::findOne($this->order->user_id);
        if (!$user) {
            return false;
        }
        $order = $this->order;

        if ($this->order_type == 1 || $this->order_type == 0) {
            /* @var $orderShare Order */
            $orderShare = $this->order;
            $orderShare->parent_id = $user->parent_id;
            if ($user->parent_id) {
                $parent = User::findOne($user->parent_id);//上级
                $orderShare->parent_id_1 = $parent->parent_id;
                if ($parent->parent_id) {
                    $parent_1 = User::findOne($parent->parent_id);//上上级
                    $orderShare->parent_id_2 = $parent_1->parent_id;
                } else {
                    $orderShare->parent_id_2 = -1;
                }
            } else {
                $orderShare->parent_id_1 = -1;
                $orderShare->parent_id_2 = -1;
            }
        } else {
            if ($this->order_type == 2) {
                $type = 0;
            } else {
                $type = 1;
            }
            $orderShare = OrderShare::findOne(['order_id' => $order->id, 'type' => $type, 'is_delete' => 0, 'store_id' => $order->store_id]);
            if (!$orderShare) {
                $orderShare = new OrderShare();
                $orderShare->order_id = $order->id;
                $orderShare->store_id = $order->store_id;
                $orderShare->is_delete = 0;
                $orderShare->user_id = $order->user_id;
            }
            $orderShare->version = xcx_core_version();
            $orderShare->type = $type;

            $orderShare->parent_id_1 = $user->parent_id;
            if ($user->parent_id) {
                $parent = User::findOne($user->parent_id);//上级
                $orderShare->parent_id_2 = $parent->parent_id;
                if ($parent->parent_id) {
                    $parent_1 = User::findOne($parent->parent_id);//上上级
                    $orderShare->parent_id_3 = $parent_1->parent_id;
                } else {
                    $orderShare->parent_id_3 = -1;
                }
            } else {
                $orderShare->parent_id_2 = -1;
                $orderShare->parent_id_3 = -1;
            }
        }

        $share_commission_money_first = 0;//一级分销总佣金
        $share_commission_money_second = 0;//二级分销总佣金
        $share_commission_money_third = 0;//三级分销总佣金
        foreach ($orderDetail as $item) {
            $item_price = doubleval($item['price']);
            if ($item['individual_share'] == 1) {
                $rate_first = doubleval($item['share_commission_first']);
                $rate_second = doubleval($item['share_commission_second']);
                $rate_third = doubleval($item['share_commission_third']);
                $shareType = $item['share_type'];
            } else {
                if(isset($item['mch_id']) && $item['mch_id'] > 0){
                    continue;
                }
                $rate_first = doubleval($setting->first);
                $rate_second = doubleval($setting->second);
                $rate_third = doubleval($setting->third);
                $shareType = $setting->price_type;
            }
            if ($shareType == 1) {
                $share_commission_money_first += $rate_first * $item['num'];
                $share_commission_money_second += $rate_second * $item['num'];
                $share_commission_money_third += $rate_third * $item['num'];
            } else {
                $share_commission_money_first += $item_price * $rate_first / 100;
                $share_commission_money_second += $item_price * $rate_second / 100;
                $share_commission_money_third += $item_price * $rate_third / 100;
            }
        }

        if ($setting->is_rebate == 1 && $user->is_distributor == 1) {
            $orderShare->rebate = $share_commission_money_first < 0.01 ? 0 : $share_commission_money_first;
            $orderShare->first_price = $share_commission_money_second < 0.01 ? 0 : $share_commission_money_second;
            $orderShare->second_price = $share_commission_money_third < 0.01 ? 0 : $share_commission_money_third;
            $orderShare->third_price = 0;
        } else {
            $orderShare->rebate = 0;
            $orderShare->first_price = $share_commission_money_first < 0.01 ? 0 : $share_commission_money_first;
            $orderShare->second_price = $share_commission_money_second < 0.01 ? 0 : $share_commission_money_second;
            $orderShare->third_price = $share_commission_money_third < 0.01 ? 0 : $share_commission_money_third;
        }
        return $orderShare->save();
    }


    private function getDetail()
    {
        if ($this->order_type == 0) {
            return $this->getOrderDetail();
        } elseif ($this->order_type == 1) {
            return $this->getMsOrderDetail();
        } elseif ($this->order_type == 2) {
            return $this->getPtOrderDetail();
        } elseif ($this->order_type == 3) {
            return $this->getYyOrderDetail();
        } else {
            return false;
        }
    }

    private function getOrderDetail()
    {
        /* @var $order Order */
        $order = $this->order;
        /* @var $list OrderDetail */
        $list = OrderDetail::find()->where(['is_delete' => 0, 'order_id' => $order->id])->all();

        $newList = [];
        foreach ($list as $value) {
            $goods = $value->goods;
            $newItem = [
                'individual_share' => $goods['individual_share'],
                'share_commission_first' => $goods['share_commission_first'],
                'share_commission_second' => $goods['share_commission_second'],
                'share_commission_third' => $goods['share_commission_third'],
                'share_type' => $goods['share_type'],
                'num' => $value['num'],
                'price' => $value['total_price']
            ];
            array_push($newList, $newItem);
        }
        return $newList;
    }

    private function getMsOrderDetail()
    {
        /* @var $order MsOrder */
        $order = $this->order;

        $ms_setting = MsSetting::findOne(['store_id' => $order->store_id]);
        if (!$ms_setting || $ms_setting->is_share == 0) {
            return false;
        }

        $msGoods = MsGoods::findOne(['id' => $order->goods_id, 'store_id' => $order->store_id]);
        $newList = [];
        $newItem = [
            'individual_share' => $msGoods['individual_share'],
            'share_commission_first' => $msGoods['share_commission_first'],
            'share_commission_second' => $msGoods['share_commission_second'],
            'share_commission_third' => $msGoods['share_commission_third'],
            'share_type' => $msGoods['share_type'],
            'num' => $order->num,
            'price' => doubleval($order->pay_price - $order->express_price)
        ];
        array_push($newList, $newItem);
        return $newList;
    }

    private function getPtOrderDetail()
    {
        /* @var $order PtOrder */
        $order = $this->order;
        $pt_setting = PtSetting::findOne(['store_id' => $order->store_id]);
        if (!$pt_setting || $pt_setting->is_share == 0) {
            return false;
        }

        /* @var $list PtOrderDetail */
        $list = PtOrderDetail::find()->where(['is_delete' => 0, 'order_id' => $order->id])->all();
        $newList = [];
        foreach ($list as $value) {
            $share = $value->share;
            $newItem = [
                'individual_share' => $share['individual_share'],
                'share_commission_first' => $share['share_commission_first'],
                'share_commission_second' => $share['share_commission_second'],
                'share_commission_third' => $share['share_commission_third'],
                'share_type' => $share['share_type'],
                'num' => $value['num'],
                'price' => doubleval($order->pay_price - $order->express_price)
            ];
            array_push($newList, $newItem);
        }
        return $newList;
    }

    private function getYyOrderDetail()
    {
        /* @var $order YyOrder */
        $order = $this->order;
        $yy_setting = YySetting::findOne(['store_id' => $order->store_id]);
        if (!$yy_setting || $yy_setting->is_share == 0) {
            return false;
        }

        $share = GoodsShare::findOne(['goods_id' => $order->goods_id, 'store_id' => $order->store_id, 'type' => 1]);
        $newItem = [
            'individual_share' => $share['individual_share'],
            'share_commission_first' => $share['share_commission_first'],
            'share_commission_second' => $share['share_commission_second'],
            'share_commission_third' => $share['share_commission_third'],
            'share_type' => $share['share_type'],
            'num' => 1,
            'price' => $order->pay_price
        ];
        $newList = [];
        array_push($newList, $newItem);
        return $newList;
    }
}
