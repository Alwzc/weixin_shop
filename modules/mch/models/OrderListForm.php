<?php
/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/7/20
 * Time: 14:34
 */

namespace app\modules\mch\models;

use app\models\Goods;
use app\models\Order;
use app\models\OrderDetail;
use app\models\OrderRefund;
use app\models\Recharge;
use app\models\ReOrder;
use app\models\Share;
use app\models\Shop;
use app\models\User;
use app\modules\mch\extensions\Export;
use yii\data\Pagination;
use yii\helpers\ArrayHelper;
use app\models\GoodsPic;

class OrderListForm extends MchModel
{
    public $store_id;
    public $user_id;
    public $keyword;
    public $status;
    public $is_recycle;
    public $page;
    public $limit;

    public $flag;//是否导出
    public $is_offline;
    public $clerk_id;
    public $parent_id;
    public $shop_id;

    public $date_start;
    public $date_end;
    public $express_type;
    public $keyword_1;
    public $seller_comments;

    public $fields;
    public $type;

    public $platform;//所属平台

    public function rules()
    {
        return [
            [['keyword',], 'trim'],
            [['status', 'is_recycle', 'page', 'limit', 'user_id', 'is_offline', 'clerk_id', 'shop_id', 'keyword_1'], 'integer'],
            [['status',], 'default', 'value' => -1],
            [['page',], 'default', 'value' => 1],
            //[['limit',], 'default', 'value' => 20],
            [['flag', 'date_start', 'date_end', 'express_type'], 'trim'],
            [['flag'], 'default', 'value' => 'no'],
            [['seller_comments'], 'string'],
            [['fields'],'safe']
        ];
    }

    public function search()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }
        $query = Order::find()->alias('o')->where([
            'o.store_id' => $this->store_id,
            'o.mch_id'   => 0
        ])->leftJoin(['u' => User::tableName()], 'u.id = o.user_id');

        switch ($this->status) {
            case 0:
                $query->andWhere(['o.is_pay' => 0]);
                break;
            case 1:
                $query->andWhere([
                    'o.is_send' => 0,
                ])->andWhere(['or', ['o.is_pay' => 1], ['o.pay_type' => 2]]);
                break;
            case 2:
                $query->andWhere([
                    'o.is_send'    => 1,
                    'o.is_confirm' => 0,
                ])->andWhere(['or', ['o.is_pay' => 1], ['o.pay_type' => 2]]);
                break;
            case 3:
                $query->andWhere([
                    'o.is_send'    => 1,
                    'o.is_confirm' => 1,
                ])->andWhere(['or', ['o.is_pay' => 1], ['o.pay_type' => 2]]);
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                $query->andWhere(['o.apply_delete' => 1]);
                break;
            default:
                break;
        }
        if ($this->status == 5) {//已取消订单
            $query->andWhere(['or', ['o.is_cancel' => 1], ['o.is_delete' => 1]]);
        } else {
            if ($this->is_recycle != 1) {
                $query->andWhere(['o.is_cancel' => 0, 'o.is_delete' => 0]);
            }
        }

        if ($this->user_id) {//查找指定用户的
            $query->andWhere([
                'o.user_id' => $this->user_id,
            ]);
        }
        if ($this->clerk_id) {//查找指定核销员的订单
            $query->andWhere([
                'o.clerk_id' => $this->clerk_id,
            ]);
        }
        if ($this->shop_id) {//查找指定门店的订单
            $query->andWhere([
                'o.shop_id' => $this->shop_id,
            ]);
        }
        if ($this->parent_id) {
            $query->andWhere(['o.parent_id' => $this->parent_id]);
        }
        if ($this->date_start) {
            $query->andWhere(['>=', 'o.addtime', strtotime($this->date_start)]);
        }
        if ($this->date_end) {
            $query->andWhere(['<=', 'o.addtime', strtotime($this->date_end) + 86400]);
        }

        if (isset($this->platform)) {
            $query->andWhere(['u.platform' => $this->platform]);
        }

        if ($this->keyword) {//关键字查找
            switch ($this->keyword_1) {
                case 1:
                    $query->andWhere(['like', 'o.order_no', $this->keyword]);
                    break;
                case 2:
                    $query->andWhere(['like', 'u.nickname', $this->keyword]);
                    break;
                case 3:
                    $query->andWhere(['like', 'o.name', $this->keyword]);
                    break;
                default:
                    break;
            }
        }
        if ($this->is_offline) {
            $query->andWhere(['o.is_offline' => $this->is_offline]);
        }
        if ($this->type) {
            $query->andWhere(['o.type' => $this->type]);
        }else{
            if(get_plugin_type() != 0){
                $query->andWhere(['o.type'=>get_plugin_type()]);
            }else{
                $query->andWhere(['o.type'=>0]);
            }
        }
        if ($this->is_recycle == 1) {
            $query->andWhere(['o.is_recycle' => 1]);
        } else {
            $query->andWhere(['o.is_recycle' => 0]);
        }

        if ($this->flag == "EXPORT") {
            $query_ex = clone $query;
            $list_ex = $query_ex;
            $export = new ExportList();
            $export->is_offline = $this->is_offline;
            $export->order_type = 0;
            $export->fields = $this->fields;
            $export->dataTransform_new($list_ex);
        }
        $count = $query->count();
        $pagination = new Pagination(['totalCount' => $count, 'pageSize' => $this->limit, 'page' => $this->page - 1, 'route'=>\Yii::$app->requestedRoute]);

        $clerkQuery = User::find()
            ->select('nickname')
            ->where(['store_id' => $this->store_id])
            ->andWhere('id = o.clerk_id');

        $refundQuery = OrderRefund::find()
            ->select('status')
            ->where(['store_id' => $this->store_id, 'is_delete' => 0])
            ->andWhere('order_id = o.id')
            ->orderBy(['addtime' => SORT_DESC])
            ->limit(1);

        $list = $query->limit($pagination->limit)->offset($pagination->offset)->orderBy('o.addtime DESC')
            ->select(['o.*', 'u.nickname', 'u.platform', 'clerk_name' => $clerkQuery, 'refund' => $refundQuery])->asArray()->all();

        $listArray = ArrayHelper::toArray($list);
        foreach ($listArray as $i => &$item) {
            $item['goods_list'] = $this->getOrderGoodsList($item['id']);

            //此处考虑将 Order 和 Shop 模型使用 hasOne 关联，查询时使用 with 预查询 -- wi1dcard
            if ($item['shop_id'] && $item['shop_id'] != 0) {
                $shop = Shop::find()->where(['store_id' => $this->store_id, 'id' => $item['shop_id']])->asArray()->one();
                $item['shop'] = $shop;
            }
            $item['integral'] = json_decode($item['integral'], true);
            $item['flag'] = 0;
        }

        return [
            'row_count'  => $count,
            'page_count' => $pagination->pageCount,
            'pagination' => $pagination,
            'list'       => $listArray,
        ];
    }

    /**
     * @param $data array 需要处理的数据
     */
    public function dataTransform($data)
    {
        //TODO 测试数据 需要换成真实的字段
        $newFields = [];
        foreach ($this->fields as &$item) {
            if ($this->is_offline == 1) {
                if (in_array($item['key'], ['clerk_name','shop_name'])) {
                    $item['selected'] = 1;
                }
            } else {
                if (in_array($item['key'], ['express_price','express_no','express'])) {
                    $item['selected'] = 1;
                }
            }
            if (isset($item['selected']) && $item['selected'] == 1) {
                $newFields[$item['key']] = $item['value'];
            }
        }

        $newList = [];
        foreach ($data as $datum) {
            $newItem = [];
            $newItem['order_no'] = $datum->order_no;
            $newItem['nickname'] = $datum->user->nickname;
            $newItem['name'] = $datum->name;
            $newItem['mobile'] = $datum->mobile;
            $newItem['address'] = $datum->address;
            $newItem['total_price'] = $datum->total_price;
            $newItem['pay_price'] = $datum->pay_price;
            $newItem['pay_time'] = $datum->pay_time ? date('Y-m-d H:i', $datum->pay_time) : '';
            $newItem['send_time'] = $datum->send_time ? date('Y-m-d H:i', $datum->send_time) : '';
            $newItem['confirm_time'] = $datum->confirm_time ? date('Y-m-d H:i', $datum->confirm_time) : '';
            $newItem['words'] = $datum->words;
            $newItem['goods_list'] = $this->getOrderGoodsList($datum['id']);
            $newItem['is_pay'] = $datum['is_pay'] == 1 ? "已付款" : "未付款";
            $newItem['apply_delete'] = ($datum['apply_delete'] == 1) ? "取消中" : "无";
            $newItem['is_send'] = ($datum['is_send'] == 1) ? "已发货" : "未发货";
            $newItem['is_confirm'] = ($datum['is_confirm'] == 1) ? "已收货" : "未收货";
            $newItem['addtime'] = date('Y-m-d H:i', $datum['addtime']);
            $newItem['express_price'] = $datum['express_price'] . "元";

            //是否到店自提 0--否 1--是
            if ($datum['is_offline']) {
                $newItem['clerk_name'] = $datum->clerk ? $datum->clerk->nickname : '';
                $newItem['shop_name'] = $datum->shop ? $datum->shop->name : '';
            } else {
                $newItem['express_price'] = $datum->express_price;
                $newItem['express_no'] = $datum->express_no;
                $newItem['express'] = $datum->express;
            }

            if ($datum->orderForm) {
                $str = '';
                foreach ($datum->orderForm as $key => $item) {
                    $str .= $item['key'] . ':' . $item['value'] . ',';
                }
                $newItem['content'] = rtrim($str, ',');
            } else {
                $newItem['content'] = $datum->content;
            }

            $newList[] = $newItem;
        }
        Export::order_3($newList, $newFields);
    }

    public function getOrderGoodsList($order_id)
    {
        $picQuery = GoodsPic::find()
            ->alias('gp')
            ->select('pic_url')
            ->andWhere('gp.goods_id = od.goods_id')
            ->andWhere(['is_delete' => 0])
            ->limit(1);
        $orderDetailList = OrderDetail::find()->alias('od')
            ->leftJoin(['g' => Goods::tableName()], 'od.goods_id=g.id')
            ->where([
                'od.is_delete' => 0,
                'od.order_id'  => $order_id,
            ])->select(['od.*', 'g.name', 'g.unit', 'goods_pic' => $picQuery])->asArray()->all();
        foreach ($orderDetailList as $i => &$item) {
            //$goods = new Goods();
            //$goods->id = $item['goods_id'];
            //$item['goods_pic'] = $goods->getGoodsPic(0)->pic_url;
            $item['attr_list'] = json_decode($item['attr']);
        }
        return $orderDetailList;
    }

    public static function getCountData($store_id)
    {
        $form = new OrderListForm();
        $form->limit = 0;
        $form->store_id = $store_id;
        $data = [];

        $form->status = -1;
        $res = $form->search();
        $data['all'] = $res['row_count'];

        $form->status = 0;
        $res = $form->search();
        $data['status_0'] = $res['row_count'];

        $form->status = 1;
        $res = $form->search();
        $data['status_1'] = $res['row_count'];

        $form->status = 2;
        $res = $form->search();
        $data['status_2'] = $res['row_count'];

        $form->status = 3;
        $res = $form->search();
        $data['status_3'] = $res['row_count'];

        $form->status = 5;
        $res = $form->search();
        $data['status_5'] = $res['row_count'];

        return $data;
    }
}
