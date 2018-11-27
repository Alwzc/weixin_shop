<?php

namespace app\models;

use app\models\common\admin\log\CommonActionLog;
use Yii;

/**
 * This is the model class for table "{{%level}}".
 *
 * @property integer $id
 * @property integer $store_id
 * @property integer $level
 * @property string $name
 * @property string $money
 * @property string $discount
 * @property integer $status
 * @property integer $is_delete
 * @property integer $addtime
 * @property string $image
 * @property string $price
 * @property string $detail
 * @property string $buy_prompt
 */
class Level extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%level}}';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['store_id', 'level', 'status', 'is_delete', 'addtime'], 'integer'],
            [['money', 'discount', 'price'], 'number'],
            [['image'], 'string'],
            [['name', 'detail', 'buy_prompt'], 'string', 'max' => 255],
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
            'level' => 'Level',
            'name' => '等级名称',
            'money' => '会员完成订单金额满足则升级',
            'discount' => '折扣',
            'status' => '状态 0--禁用 1--启用',
            'is_delete' => 'Is Delete',
            'addtime' => 'Addtime',
            'image' => '升级 图片',
            'price' => '升级 所需价格',
            'detail' => '会员介绍',
            'buy_prompt' => '会员购买提示',
        ];
    }

    public function afterSave($insert, $changedAttributes)
    {
        $data = $insert ? json_encode($this->attributes) : json_encode($changedAttributes);
        CommonActionLog::storeActionLog('', $insert, $this->is_delete, $data, $this->id);
    }
}
