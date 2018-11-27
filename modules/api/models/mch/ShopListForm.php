<?php
/**
 *
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2018/4/26
 * Time: 14:44
 */


namespace app\modules\api\models\mch;

use app\models\Mch;
use app\models\MchCommonCat;
use app\models\Model;
use app\modules\api\models\mch\ShopDataForm;
use app\modules\api\models\ApiModel;
use yii\data\Pagination;

class ShopListForm extends ApiModel
{
    public $store_id;
    public $keyword;
    public $cat_id;
    public $page;

    public function rules()
    {
        return [
            [['keyword',], 'trim'],
            [['cat_id', 'page'], 'integer'],
            [['page'], 'default', 'value' => 1,],
        ];
    }

    public function search()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }
        $query = Mch::find()->alias('m')
            ->leftJoin(['mc' => MchCommonCat::tableName()], 'm.mch_common_cat_id=mc.id')
            ->where([
                'm.store_id' => $this->store_id,
                'm.is_delete' => Model::IS_DELETE_FALSE,
                'm.is_open' => Mch::IS_OPEN_TRUE,
                'm.is_lock' => 0,
                'm.is_recommend' => Mch::IS_RECOMMEND_TRUE
            ])->orderBy('m.sort,m.addtime DESC');
        if ($this->cat_id) {
            $query->andWhere(['mc.id' => $this->cat_id]);
        }
        if ($this->keyword) {
            $query->andWhere([
                'OR',
                ['LIKE', 'm.name', $this->keyword,],
                ['LIKE', 'mc.name', $this->keyword,],
            ]);
        }
        $count = $query->count();
        $pagination = new Pagination(['totalCount' => $count, 'page' => $this->page - 1, 'pageSize' => 10,]);
        $list = $query->limit($pagination->limit)->offset($pagination->offset)
            ->select('m.id,m.name,m.logo')
            ->asArray()->all();
        foreach ($list as $i => &$item) {
            $shop_data_form = new ShopDataForm();
            $shop_data_form->mch_id = $item['id'];
            $shop_data_form->tab = 1;
            $shop_data_form->limit = 3;
            $shop_data = $shop_data_form->search();
            if ($shop_data['code'] != 0) {
                unset($list[$i]);
                continue;
            }
            $item['data'] = $shop_data['data'];
        }
        $cat_list = MchCommonCat::find()
            ->where(['store_id' => $this->store_id, 'is_delete' => 0,])->orderBy('sort ASC')
            ->select('id,name')->asArray()->all();
        return [
            'code' => 0,
            'data' => [
                //'pagination' => $list,
                'list' => $list,
                'cat_list' => $cat_list,
            ],
        ];
    }
}
