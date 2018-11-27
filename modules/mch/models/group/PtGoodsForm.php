<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/11/22
 * Time: 17:35
 */

namespace app\modules\mch\models\group;

use app\models\Attr;
use app\models\AttrGroup;
use app\models\PtGoods;
use app\models\PtGoodsPic;
use app\modules\mch\models\MchModel;
use yii\data\Pagination;

/**
 * @property \app\models\GoodsShare $goods_share
 * @property \app\models\PtGoods $goods
 */
class PtGoodsForm extends MchModel
{
    public $goods;
    public $goods_share;

    public $goods_pic_list;

    public $name;
    public $store_id;
    public $original_price;
    public $price;
    public $detail;
    public $cat_id;

    public $grouptime;
    public $attr;
    public $service;
    public $sort;
    public $virtual_sales;
    public $cover_pic;
    public $weight;
    public $freight;
    public $unit;
    public $group_num;
    public $limit_time;
    public $is_only;
    public $is_more;
    public $colonel;
    public $buy_limit;
    public $type;

    public $use_attr;
    public $goods_num;
    public $one_buy_limit;

    public $mall_id;

    public $individual_share;
    public $share_commission_first;
    public $share_commission_second;
    public $share_commission_third;
    public $share_type;
    public $payment;
    public $rebate;
    public $goods_no;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['store_id', 'name', 'original_price', 'price', 'cover_pic', 'detail', 'group_num', 'grouptime', 'cat_id', 'one_buy_limit'], 'required'],
            [['store_id', 'cat_id', 'freight', 'limit_time', 'is_only', 'is_more', 'type', 'use_attr', 'share_type'], 'integer'],
            [['original_price', 'price'], 'number', 'min' => 0.01, 'max' => 999999],
            [['detail', 'cover_pic', 'goods_no'], 'string'],
            [['attr', 'goods_pic_list', 'payment'], 'safe',],
            [['name', 'unit'], 'string', 'max' => 255],
            [['service'], 'string', 'max' => 2000],
            [['goods_num', 'sort', 'virtual_sales', 'weight', 'grouptime', 'buy_limit', 'one_buy_limit'], 'integer', 'min' => 0, 'max' => 999999],
            [['group_num',], 'integer', 'min' => 2,],
            [['share_commission_first', 'share_commission_second', 'share_commission_third', 'individual_share', 'rebate', 'colonel', 'goods_no',], 'default', 'value' => 0],
            [['share_commission_first', 'share_commission_second', 'share_commission_third', 'rebate', 'colonel'], 'number', 'min' => 0, 'max' => 999999],
            [['attr'], 'app\modules\mch\models\AttrValidator']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'store_id' => 'Store ID',
            'name' => '商品名称',
            'original_price' => '商品原价',
            'price' => '团购价',
            'detail' => '商品详情，图文',
            'cat_id' => '商品分类',
            'status' => '上架状态【1=> 上架，2=> 下架】',
            'grouptime' => '拼团时间/小时',
            'attr' => '规格的库存及价格',
            'service' => '服务选项',
            'sort' => '商品排序 升序',
            'virtual_sales' => '虚拟销量',
            'cover_pic' => '商品缩略图',
            'weight' => '重量',
            'freight' => '运费模板ID',
            'unit' => '单位',
            'addtime' => '添加时间',
            'is_delete' => '是否删除',
            'group_num' => '商品成团数',
            'goods_pic_list' => '商品图集',
            'is_only' => '是否允许单独购买',
            'limit_time' => '拼团限时',
            'is_more' => '是否允许多件购买',
            'colonel' => '团长优惠',
            'buy_limit' => '限购数量',
            'type' => '商品支持送货类型',
            'use_attr' => '是否使用规则',
            'goods_num' => '商品库存',
            'one_buy_limit' => '商品单次购买数量',
            'share_commission_first' => '一级佣金比例',
            'share_commission_second' => '二级佣金比例',
            'share_commission_third' => '三级佣金比例',
            'rebate' => '自购返利',
            'goods_no' => '货号'
        ];
    }

    /**
     * @param $store_id
     * @return array
     * 商品列表
     */
    public function getList($store_id)
    {
        $query = PtGoods::find()
            ->alias('g')
            ->andWhere(['g.is_delete' => 0, 'g.store_id' => $store_id])
            ->leftJoin('{{%pt_cat}} c', 'g.cat_id=c.id')
            ->select([
                'g.id', 'g.store_id', 'g.name', 'g.original_price', 'g.price',
                'g.cat_id', 'g.status', 'g.grouptime', 'g.unit', 'g.is_hot',
                'g.group_num', 'g.addtime', 'g.type', 'g.sort',
                'g.virtual_sales', 'g.cover_pic', 'c.name AS cname'
            ])->with('detail');

        $cat = \Yii::$app->request->get('cat');
        if ($cat) {
            $query->andWhere(['cat_id' => $cat]);
        }
        $keyword = \Yii::$app->request->get('keyword');
        if (trim($keyword)) {
            $query->andWhere([
                'OR',
                ['LIKE', 'g.name', $keyword],
                ['LIKE', 'c.name', $keyword],
            ]);
        }
        $count = $query->count();
        $p = new Pagination(['totalCount' => $count, 'pageSize' => 20]);

        $list = $query->orderBy('g.sort ASC')
            ->offset($p->offset)
            ->asArray()
            ->limit($p->limit)
            ->all();

        foreach ($list as $key => $goods) {
            $list[$key]['num'] = PtGoods::getNum(json_decode($goods['attr'], true));
        }

        return [$list, $p];
    }

    /**
     * @return array
     * 商品编辑
     */
    public function save()
    {
        if ($this->validate()) {
            if (!is_array($this->goods_pic_list) || empty($this->goods_pic_list) || count($this->goods_pic_list) == 0) {
                return [
                    'code' => 1,
                    'msg' => '商品图片不能为空',
                ];
            }

            if (!$this->use_attr && ($this->goods_num === null || $this->goods_num === '')) {
                return [
                    'code' => 1,
                    'msg' => '请填写商品库存',
                ];
            }

            if (!$this->original_price) {
                $this->original_price = $this->price;
            }

            if ($this->original_price > 99999999.99) {
                return [
                    'code' => 1,
                    'msg' => '商品原价超过限制',
                ];
            }
            if ($this->price > 99999999.99) {
                return [
                    'code' => 1,
                    'msg' => '商品售价超过限制',
                ];
            }


            if (!$this->virtual_sales) {
                $this->virtual_sales = 0;
            }

            $goods = $this->goods;
            if ($goods->isNewRecord) {
                $goods->is_delete = 0;
                $goods->is_hot = 0;
                $goods->addtime = time();
                $goods->status = 2;
                $goods->attr = \Yii::$app->serializer->encode([]);
            }

//            $this->full_cut = json_encode($this->full_cut,JSON_UNESCAPED_UNICODE);
//            if (!isset($this->integral['more'])){
//                $this->integral['more'] = '';
//            }

//            $this->integral = json_encode($this->integral,JSON_UNESCAPED_UNICODE);

            $_this_attributes = $this->attributes;
            $_this_attributes['payment'] = \Yii::$app->serializer->encode($this->payment);
            unset($_this_attributes['attr']);
            $goods->attributes = $_this_attributes;
            $goods->use_attr = $this->use_attr ? 1 : 0;
            if ($goods->save()) {
                PtGoodsPic::updateAll(['is_delete' => 1], ['goods_id' => $goods->id]);
                foreach ($this->goods_pic_list as $pic_url) {
                    $goods_pic = new PtGoodsPic();
                    $goods_pic->goods_id = $goods->id;
                    $goods_pic->pic_url = $pic_url;
                    $goods_pic->is_delete = 0;
                    $goods_pic->save();
                }
                $this->setAttr($goods);
                $this->goods_share->store_id = $this->store_id;
                $this->goods_share->type = 0;
                $this->goods_share->goods_id = $goods->id;
                $this->goods_share->individual_share = $this->individual_share;
                $this->goods_share->share_commission_first = $this->share_commission_first;
                $this->goods_share->share_commission_second = $this->share_commission_second;
                $this->goods_share->share_commission_third = $this->share_commission_third;
                $this->goods_share->share_type = $this->share_type;
                $this->goods_share->rebate = $this->rebate;
                $this->goods_share->save();
                return [
                    'code' => 0,
                    'msg' => '保存成功',
                ];
            } else {
                return $this->getErrorResponse($goods);
            }
        } else {
            return $this->errorResponse;
        }
    }

//    /**
//     * @param Goods $goods
//     * 商品设置规格
//     */
//    private function setAttr($goods)
//    {
//        if (empty($this->attr) || !is_array($this->attr))
//            return;
//        $new_attr = [];
//        foreach ($this->attr as $i => $item) {
//            $new_attr_item = [
//                'attr_list' => [],
//                'num' => intval($item['num']),
//                'price' => doubleval($item['price']),
//                'no' => doubleval($item['no']),
//            ];
//            foreach ($item['attr_list'] as $a) {
//                $attr_group_model = AttrGroup::findOne(['store_id' => $this->store_id, 'attr_group_name' => $a['attr_group_name'], 'is_delete' => 0]);
//                if (!$attr_group_model) {
//                    $attr_group_model = new AttrGroup();
//                    $attr_group_model->attr_group_name = $a['attr_group_name'];
//                    $attr_group_model->store_id = $this->store_id;
//                    $attr_group_model->is_delete = 0;
//                    $attr_group_model->save();
//                }
//                $attr_model = Attr::findOne(['attr_group_id' => $attr_group_model->id, 'attr_name' => $a['attr_name'], 'is_delete' => 0]);
//                if (!$attr_model) {
//                    $attr_model = new Attr();
//                    $attr_model->attr_name = $a['attr_name'];
//                    $attr_model->attr_group_id = $attr_group_model->id;
//                    $attr_model->is_delete = 0;
//                    $attr_model->save();
//                }
//                $new_attr_item['attr_list'][] = [
//                    'attr_id' => $attr_model->id,
//                    'attr_name' => $attr_model->attr_name,
//                ];
//            }
//            $new_attr[] = $new_attr_item;
//        }
//        $goods->attr = json_encode($new_attr, JSON_UNESCAPED_UNICODE);
//        $goods->save();
//    }
    /**
     * @param Goods $goods
     */
    private function setAttr($goods)
    {
        if (!$this->use_attr) {
            list($default_attr, $default_attr_group) = $this->getDefaultAttr();
            $this->attr = [
                [
                    'attr_list' => [
                        [
                            'attr_group_name' => $default_attr_group->attr_group_name,
                            'attr_id' => $default_attr->id,
                            'attr_name' => $default_attr->attr_name,
                        ],
                    ],
                    'num' => intval($this->goods_num) ? intval($this->goods_num) : 0,
                    'price' => 0,
                    'single' => 0,
                    'no' => $this->goods_no,
                ],
            ];
        }
        if (empty($this->attr) || !is_array($this->attr)) {
            return;
        }
        $new_attr = [];
        foreach ($this->attr as $i => $item) {
            $new_attr_item = [
                'attr_list' => [],
                'num' => intval($item['num']),
                'price' => doubleval($item['price']),
                'single' => doubleval($item['single']),
                'no' => $item['no'] ? $item['no'] : '',
                'pic' => $item['pic'] ? $item['pic'] : '',
            ];
            foreach ($item['attr_list'] as $a) {
                $attr_group_model = AttrGroup::findOne(['store_id' => $this->store_id, 'attr_group_name' => $a['attr_group_name'], 'is_delete' => 0]);
                if (!$attr_group_model) {
                    $attr_group_model = new AttrGroup();
                    $attr_group_model->attr_group_name = $a['attr_group_name'];
                    $attr_group_model->store_id = $this->store_id;
                    $attr_group_model->is_delete = 0;
                    $attr_group_model->save();
                }
                $attr_model = Attr::findOne(['attr_group_id' => $attr_group_model->id, 'attr_name' => $a['attr_name'], 'is_delete' => 0]);
                if (!$attr_model) {
                    $attr_model = new Attr();
                    $attr_model->attr_name = $a['attr_name'];
                    $attr_model->attr_group_id = $attr_group_model->id;
                    $attr_model->is_delete = 0;
                    $attr_model->save();
                }
                $new_attr_item['attr_list'][] = [
                    'attr_id' => $attr_model->id,
                    'attr_name' => $attr_model->attr_name,
                ];
            }
            $new_attr[] = $new_attr_item;
        }
        $goods->attr = \Yii::$app->serializer->encode($new_attr);
        $goods->save();
    }


    /**
     * @return array
     */
    private function getDefaultAttr()
    {
        $default_attr_name = '默认';
        $default_attr_group_name = '规格';
        $attr = Attr::findOne([
            'attr_name' => $default_attr_name,
            'is_delete' => 0,
            'is_default' => 1,
        ]);
        $attr_group = null;
        if (!$attr) {
            $attr_group = AttrGroup::findOne([
                'attr_group_name' => $default_attr_group_name,
                'is_delete' => 0,
            ]);
            if (!$attr_group) {
                $attr_group = new AttrGroup();
                $attr_group->store_id = $this->store_id;
                $attr_group->attr_group_name = $default_attr_group_name;
                $attr_group->is_delete = 0;
                $attr_group->save(false);
            }
            $attr = new Attr();
            $attr->attr_group_id = $attr_group->id;
            $attr->attr_name = $default_attr_name;
            $attr->is_delete = 0;
            $attr->is_default = 1;
            $attr->save(false);
        } else {
            $attr_group = AttrGroup::findOne($attr->attr_group_id);
        }
        return [$attr, $attr_group];
    }
}
