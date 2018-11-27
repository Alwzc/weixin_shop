<?php

namespace app\modules\mch\models\group;

use app\models\PtGoods;
use app\modules\mch\models\MchModel;
use yii\data\Pagination;

class PtGoodsDetailForm extends MchModel
{
    public $store_id;
    public $colonel;
    public $group_num;
    public $group_time;
    public $attr;
    public $model;
    public $goods_id;

    public $keyword;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%pt_goods_detail}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['store_id', 'group_num', 'group_time', 'colonel'], 'required'],
            [['store_id', 'group_num', 'goods_id', 'group_time'], 'integer'],
            [['colonel'], 'number', 'min' => 0],
            [['group_num',], 'integer', 'min' => 2, 'max' => 10000],
            [['group_time',], 'integer', 'min' => 0, 'max' => 10000],
            [['attr'], 'safe'],
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
            'goods_id' => 'Goods ID',
            'colonel' => '团长优惠',
            'group_num' => '商品成团数',
            'group_time' => '拼团时间/小时',
            'attr' => '规格的库存及价格',
        ];
    }

    public function search()
    {
        //if (!$this->validate())
        //    return $this->errorResponse;

        $query = PtGoods::find()->where(['store_id' => $this->store_id, 'is_delete' => 0]);

        if ($this->keyword) {
            $query->andWhere(['like', 'name', $this->keyword]);
        }

        $count = $query->count();
        $p = new Pagination(['totalCount' => $count, 'pageSize' => 20]);

        $list = $query->limit($p->limit)->offset($p->offset)->asArray()->all();

        return [
            'code' => 0,
            'data' => array(
                'page_count' => $count,
                'list' => $list,
            ),
        ];
    }

    public function save()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }

        $this->model->store_id = $this->store_id;
        $this->model->colonel = $this->colonel;
        $this->model->group_num = $this->group_num;
        $this->model->group_time = $this->group_time;

        if ($this->goods_id) {
            $this->model->goods_id = $this->goods_id;
            $id = $this->goods_id;
        } else {
            $id = $this->model->goods_id;
        }

        $goods = PtGoods::find()->select('attr')->where(['is_delete' => 0, 'id' => $id, 'store_id' => $this->store_id])->asArray()->one();
        $old = json_decode($goods['attr'], true);
        $new = json_decode($this->attr, true);

        foreach ($new as $k1 => $v1) {
            foreach ($old as $k => $v) {
                if ($new['attr_list'] == $old['attr_list']) {
                    if ($new[$k]['price'] > 99999999.99 || $new[$k]['price'] < 0) {
                        return [
                            'code' => 1,
                            'msg' => '阶级团购价超过限制',
                        ];
                    }
                    $old[$k]['price'] = round($new[$k]['price'], 2);
                }
            }
        }

        $this->model->attr = \Yii::$app->serializer->encode($old);
        if ($this->model->save()) {
            return [
                'code' => 0,
                'msg' => '保存成功',
            ];
        } else {
            return $this->getErrorResponse($this->model);
        }
    }
}
