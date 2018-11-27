<?php

namespace app\modules\mch\models;

use app\models\PrinceReplaceRule;
use Curl\Curl;


/**
 * @property Topic $model
 */
class PrinceReplaceRuleForm extends MchModel
{
    public $model;

    public $store_id;
    public $before_word;
    public $after_word;


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
            'before_word' => '替换前关键词',
            'after_word' => '替换后关键词',
        ];
    }

    public function save()
    {
       
       if (!$this->validate())
            return $this->errorResponse;
        $this->model->attributes = $this->attributes;
        $this->model->store_id = $this->store_id;
        $this->model->is_delete = 0;

        if ($this->model->save())
            return [
                'code' => 0,
                'msg' => '保存成功',
            ];
        else
            return $this->getErrorResponse($this->model);
    }

}