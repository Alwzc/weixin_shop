<?php

namespace app\models; 

use app\models\common\admin\log\CommonActionLog;
use Yii;

/** 
 * This is the model class for table "{{%prince_replace_rule}}". 
 * 
 * @property integer $id
 * @property integer $store_id
 * @property integer $is_delete
 * @property string $before_word
 * @property string $after_word
 */ 
class PrinceReplaceRule extends \yii\db\ActiveRecord
{ 
    /** 
     * @inheritdoc 
     */ 
    public static function tableName() 
    { 
        return '{{%prince_replace_rule}}'; 
    } 

    /** 
     * @inheritdoc 
     */ 
    public function rules() 
    { 
        return [
            [['store_id', 'before_word'], 'required'],
            [['store_id'], 'integer'],
            [['before_word','after_word'], 'string', 'max' => 1000],
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
            'before_word' => 'Before Word',
            'after_word' => 'After Word',
        ]; 
    }

    public function afterSave($insert, $changedAttributes)
    {
        $data = $insert ? json_encode($this->attributes) : json_encode($changedAttributes);
        CommonActionLog::storeActionLog('', $insert, $this->is_delete, $data, $this->id);
    }
} 