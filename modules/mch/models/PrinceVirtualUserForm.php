<?php

namespace app\modules\mch\models;

use app\models\PrinceVirtualUser;
use Curl\Curl;


/**
 * @property Topic $model
 */
class PrinceVirtualUserForm extends MchModel
{
    public $model;

    public $store_id;
    public $virtual_user;
    public $virtual_avatar;


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
            'virtual_user' => '虚拟用户名',
            'virtual_avatar' => '虚拟头像',
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