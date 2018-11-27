<?php

/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/10/11
 * Time: 9:38
 */

namespace app\modules\mch\controllers;

use app\models\GoodsSearchForm;
use app\models\Miaosha;
use app\models\MiaoshaGoods;
use app\models\MsGoods;
use app\models\MsSetting;
use app\modules\mch\models\MiaoshaCalendar;
use app\modules\mch\models\MiaoshaDateForm;
use app\modules\mch\models\MiaoshaGoodsEditForm;

class MiaoshaController extends Controller
{
    public function actionIndex()
    {
        $model = Miaosha::findOne([
            'store_id' => $this->store->id,
        ]);
        if (!$model) {
            $model = new Miaosha();
            $model->store_id = $this->store->id;
        }
        if (\Yii::$app->request->isPost) {
            $model->open_time = \Yii::$app->serializer->encode((array) \Yii::$app->request->post('open_time', []));
            $model->save();
            return [
                'code' => 0,
                'msg' => '保存成功',
            ];
        } else {
            return $this->render('index', [
                'model' => $model,
            ]);
        }
    }

    public function actionGoods()
    {
        $list = MiaoshaGoods::find()->alias('mg')
            ->leftJoin(['g' => MsGoods::tableName()], 'g.id=mg.goods_id')
            ->where(['mg.store_id' => $this->store->id, 'mg.is_delete' => 0, 'g.is_delete' => 0])->groupBy('mg.goods_id')
            ->select('g.name,mg.*,COUNT(mg.goods_id) miaosha_count')->asArray()->all();
        return $this->render('goods', [
            'list' => $list,
        ]);
    }

    public function actionGoodsEdit()
    {
        $model = new MiaoshaGoods();
        $miaosha = Miaosha::findOne([
            'store_id' => $this->store->id,
        ]);
        if (!$miaosha) {
            $miaosha = new Miaosha();
            $miaosha->store_id = $this->store->id;
            $miaosha->open_time = "[]";
        }
        if (\Yii::$app->request->isPost) {
            $form = new MiaoshaGoodsEditForm();
            $form->attributes = \Yii::$app->request->post();
            $form->store_id = $this->store->id;
            return $form->save();
        } else {
            return $this->render('goods-edit', [
                'model' => $model,
                'miaosha' => $miaosha,
            ]);
        }
    }

    public function actionGoodsSearch($keyword = null, $page = 1)
    {
        $form = new GoodsSearchForm();
        $form->keyword = $keyword;
        $form->page = $page;
        $form->store_id = $this->store->id;
        return $form->search();
    }

    public function actionGoodsDetail($goods_id)
    {
        $date_begin = \Yii::$app->request->get('date_begin', date('Y-m-d', strtotime('-30 days')));
        $date_end = \Yii::$app->request->get('date_end', date('Y-m-d'));
        $query = MiaoshaGoods::find()->alias('mg')->leftJoin(['g' => MsGoods::tableName()], 'mg.goods_id=g.id')
            ->where(['mg.goods_id' => $goods_id, 'mg.is_delete' => 0])->asArray()->select('mg.*,g.name')->orderBy('mg.open_date ASC,mg.start_time ASC');

        $query->andWhere([
            'AND',
            ['>=', 'mg.open_date', $date_begin],
            ['<=', 'mg.open_date', $date_end],
        ]);
        $count = $query->count();
        $list = $query->all();
        return $this->render('goods-detail', [
            'list' => $list,
            'count' => $count ? $count : 0,
            'date_begin' => $date_begin,
            'date_end' => $date_end,
        ]);
    }

    //删除单个秒杀记录
    public function actionMiaoshaDelete($id)
    {
        MiaoshaGoods::updateAll(['is_delete' => 1], [
            'id' => $id,
            'store_id' => $this->store->id,
        ]);
        return [
            'code' => 0,
            'msg' => '操作成功',
        ];
    }

    /**
     * @param $id
     * @param $index
     * @param $price
     * 秒杀价格修改
     */
    public function actionMiaoshaPriceEdit($id, $index, $price)
    {
        $miaosha = MiaoshaGoods::findOne($id);
        $attr = json_decode($miaosha->attr, true);
        $attr[$index]['miaosha_price'] = $price;

        MiaoshaGoods::updateAll([
            'attr' => \Yii::$app->serializer->encode($attr),
        ], [
            'id' => $id,
            'store_id' => $this->store->id,
        ]);
        return [
            'code' => 0,
            'msg' => '操作成功',
        ];
    }

    /**
     * @param $id
     * @param $index
     * @param $price
     * 秒杀数量修改
     */
    public function actionMiaoshaNumEdit($id, $index, $num)
    {
        $miaosha = MiaoshaGoods::findOne($id);
        $attr = json_decode($miaosha->attr, true);
        $attr[$index]['miaosha_num'] = $num;

        MiaoshaGoods::updateAll([
            'attr' => \Yii::$app->serializer->encode($attr),
        ], [
            'id' => $id,
            'store_id' => $this->store->id,
        ]);
        return [
            'code' => 0,
            'msg' => '操作成功',
        ];
    }

    //删除该商品的所有秒杀记录
    public function actionGoodsDelete($goods_id)
    {
        MiaoshaGoods::updateAll(['is_delete' => 1], [
            'goods_id' => $goods_id,
            'store_id' => $this->store->id,
        ]);
        return [
            'code' => 0,
            'msg' => '操作成功',
        ];
    }

    //秒杀商品（日历视图）
    public function actionCalendar()
    {
        if (\Yii::$app->request->isAjax) {
            $form = new MiaoshaCalendar();
            $form->attributes = \Yii::$app->request->get();
            $form->store_id = $this->store->id;
            $res = $form->search();
            return $res;
        } else {
            return $this->render('calendar', []);
        }
    }

    //秒杀日期商品列表
    public function actionDate()
    {
        $form = new MiaoshaDateForm();
        $form->attributes = \Yii::$app->request->get();
        $form->store_id = $this->store->id;
        $res = $form->search();
        $this->layout = false;
        return [
            'code' => 0,
            'data' => [
                'title' => $res['data']['date'] . '秒杀安排表',
                'content' => $this->render('date', $res['data']),
            ],
        ];
    }

    /**
     * @return string
     * 秒杀设置
     */
    public function actionSetting()
    {
        $setting = MsSetting::findOne(['store_id' => $this->store->id]);
        if (!$setting) {
            $setting = new MsSetting();
        }
        if (\Yii::$app->request->isPost) {
            $model = \Yii::$app->request->post('model');
            if ($setting->isNewRecord) {
                $setting->store_id = $this->store->id;
            }
            if ($model['unpaid'] < 0) {
                return [
                    'code' => 1,
                    'msg' => '请设置正确时间',
                ];
            }
            $setting->attributes = $model;
            if ($setting->save()) {
                return [
                    'code' => 0,
                    'msg' => '保存成功',
                ];
            } else {
                return [
                    'code' => 0,
                    'msg' => '保存失败，请重试',
                ];
            }
        }
        return $this->render('setting', [
            'setting' => $setting,
        ]);
    }
}
