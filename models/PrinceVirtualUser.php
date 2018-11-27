<?php

namespace app\models; 

use app\models\common\admin\log\CommonActionLog;
use Yii;

/** 
 * This is the model class for table "{{%prince_virtual_user}}". 
 * 
 * @property integer $id
 * @property integer $store_id
 * @property integer $is_delete
 * @property string $virtual_user
 * @property string $virtual_avatar
 */ 
class PrinceVirtualUser extends \yii\db\ActiveRecord
{ 
    /** 
     * @inheritdoc 
     */ 
    public static function tableName() 
    { 
        return '{{%prince_virtual_user}}'; 
    } 

    /** 
     * @inheritdoc 
     */ 
    public function rules() 
    { 
        return [
            [['store_id', 'virtual_user'], 'required'],
            [['store_id'], 'integer'],
            [['virtual_avatar'], 'string', 'max' => 1000],
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
            'is_delete' => 'Is Delete',
            'virtual_user' => 'Virtual User',
            'virtual_avatar' => 'Virtual Image',
        ]; 
    }

    public function afterSave($insert, $changedAttributes)
    {
        $data = $insert ? json_encode($this->attributes) : json_encode($changedAttributes);
        CommonActionLog::storeActionLog('', $insert, $this->is_delete, $data, $this->id);
    }
} 