<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "{{%pt_goods_detail}}".
 *
 * @property integer $id
 * @property integer $store_id
 * @property integer $goods_id
 * @property string $colonel
 * @property string $group_num
 * @property integer $group_time
 * @property string $attr
 */
class PtGoodsDetail extends \yii\db\ActiveRecord
{
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
            [['store_id'], 'required'],
            [['store_id', 'goods_id', 'group_num', 'group_time'], 'integer'],
            [['colonel'], 'number'],
            [['attr'], 'string'],
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
}
