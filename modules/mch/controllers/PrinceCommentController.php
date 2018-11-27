<?php

/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2018/7/20
 * Time: 16:53
 */

namespace app\modules\mch\controllers;

use app\models\Goods;
use app\models\OrderComment;
use app\models\User;
use app\models\PrinceVirtualUser;
use app\models\PrinceReplaceRule;
use app\modules\mch\models\PrinceCollectCommentForm;
use app\modules\mch\models\PrinceVirtualUserForm;
use app\modules\mch\models\PrinceReplaceRuleForm;
use yii\data\Pagination;
use yii\helpers\Html;

class PrinceCommentController extends Controller
{
    public function actionIndex()
    {
        $query = PrinceVirtualUser::find()->alias('oc')->where(['oc.store_id' => $this->store->id, 'oc.is_delete' => 0]);
        $count = $query->count();
        $pagination = new Pagination(['totalCount' => $count, 'pageSize' => 20]);
        $list = $query
            ->select('oc.id,oc.virtual_user,oc.virtual_avatar')
            ->orderBy('oc.id DESC')->limit($pagination->limit)->offset($pagination->offset)->asArray()->all();

        return $this->render('user_list', [
            'list' => $list,
            'pagination' => $pagination,
        ]);
    }

	//采集
    public function actionCollect($id = null)
    {
        $model = OrderComment::findOne([
            'id' => $id,
            'store_id' => $this->store->id,
            'is_virtual' => 1,
        ]);

        if (!$model) {
            $model = new OrderComment();
        }

        if (\Yii::$app->request->isPost) {
			
			
            $form = new PrinceCollectCommentForm();

            $form->store_id = $this->store->id;
            $form->attributes = \Yii::$app->request->post();
	
        	$arr = explode('?', \Yii::$app->request->post('url'));
			if (strpos($arr[0], 'taobao') || strpos($arr[0], 'tmall')) {
				$id_array = $this->preg_substr('/(\?id=|&id=)/', '/&/', \Yii::$app->request->post('url'));
				$id=$id_array[0];
			}else{
				$id =intval(\Yii::$app->request->post('url'));
			}
			if (count($arr) < 2 && $id<1) {
				return [
					'code' => 1,
					'msg' => '被采集商品链接或ID错误，请检查'
				];
			}
		
            $addtime = \Yii::$app->request->post('addtime');
            $form->addtime = strtotime($addtime) ? strtotime($addtime) : time();

            $get_reply = \Yii::$app->request->post('get_reply');
            $get_pics = \Yii::$app->request->post('get_pics');
            $no_repeat = \Yii::$app->request->post('no_repeat');
			$need_key=addslashes(trim(\Yii::$app->request->post('need_key')));
			$remove_key=addslashes(trim(\Yii::$app->request->post('remove_key')));
            $need_key = explode(',',str_replace('，',',',$need_key));
            $remove_key = explode(',',str_replace('，',',',$remove_key));

            $form->model = $model;
            $page = \Yii::$app->request->post('page');
            return $form->collect_comment($id,intval($page),$get_reply ,$get_pics,$need_key ,$remove_key,$no_repeat );

        } else {
            $list = OrderComment::find()->select(['u.*', 'g.name'])->alias('u')
                ->where(['u.id' => $id, 'u.store_id' => $this->store->id, 'g.store_id' => $this->store->id, 'u.is_virtual' => 1])
                ->leftJoin(['g' => Goods::tableName()], 'u.goods_id=g.id')
                ->asArray()->one();

            if ($list['addtime']) {
                $list['addtime'] = date("Y/m/d H:i:s", $list['addtime']);
            }
            return $this->render('collect', [
                'model' => $list,
            ]);
        }
    }

	//查找商品
    public function actionSearchGoods($keyword)
    {
        $keyword = trim($keyword);
        $query = Goods::find()->alias('u')->where([
            'AND',
            ['LIKE', 'u.name', $keyword],
            ['store_id' => $this->store->id],
            ['is_delete' => 0],
        ]);
        $list = $query->orderBy('u.name')->limit(30)->asArray()->select('id,name,cat_id,price')->all();
        return [
            'code' => 0,
            'msg' => 'success',
            'data' => (object) [
                'list' => $list,
            ],
        ];
    }

	
	//用户库列表
    public function actionUserList()
    {
        $query = PrinceVirtualUser::find()->alias('vu')->where(['vu.store_id' => $this->store->id, 'vu.is_delete' => 0]);
        $count = $query->count();
        $pagination = new Pagination(['totalCount' => $count, 'pageSize' => 20]);
        $list = $query
            ->select('vu.id,vu.virtual_user,vu.virtual_avatar')
            ->orderBy('vu.id DESC')->limit($pagination->limit)->offset($pagination->offset)->asArray()->all();

        return $this->render('user_list', [
            'list' => $list,
            'pagination' => $pagination,
        ]);
    }
	
	//编辑/添加用户
    public function actionUserEdit($id = null)
    {
        $model = PrinceVirtualUser::findOne([
            'id' => $id,
            'store_id' => $this->store->id,
        ]);

        if (!$model) {
            $model = new PrinceVirtualUser();
        }

        if (\Yii::$app->request->isPost) {
            $form = new PrinceVirtualUserForm();

            $form->store_id = $this->store->id;
            $form->attributes = \Yii::$app->request->post();

            $form->model = $model;
            return $form->save();

        } else {
            $list = PrinceVirtualUser::find()->select(['u.*'])->alias('u')
                ->where(['u.id' => $id, 'u.store_id' => $this->store->id])
                ->asArray()->one();

            return $this->render('user_edit', [
                'model' => $list,
            ]);
        }
    }
	
	//删除用户
    public function actionUserDelete($id, $status)
    {
        $user = PrinceVirtualUser::findOne([
            'store_id' => $this->store->id,
            'id' => $id,
        ]);
        if ($user) {
            $user->is_delete = $status;
            $user->save();
        }
        return [
            'code' => 0,
            'msg' => '操作成功',
        ];
    }
	
	
	//规则列表
    public function actionRuleList()
    {
        $query = PrinceReplaceRule::find()->alias('rr')->where(['rr.store_id' => $this->store->id, 'rr.is_delete' => 0]);
        $count = $query->count();
        $pagination = new Pagination(['totalCount' => $count, 'pageSize' => 20]);
        $list = $query
            ->select('rr.id,rr.before_word,rr.after_word')
            ->orderBy('rr.id DESC')->limit($pagination->limit)->offset($pagination->offset)->asArray()->all();

        return $this->render('rule_list', [
            'list' => $list,
            'pagination' => $pagination,
        ]);
    }
	
	//编辑/添加规则
    public function actionRuleEdit($id = null)
    {
        $model = PrinceReplaceRule::findOne([
            'id' => $id,
            'store_id' => $this->store->id,
        ]);

        if (!$model) {
            $model = new PrinceReplaceRule();
        }

        if (\Yii::$app->request->isPost) {
            $form = new PrinceReplaceRuleForm();

            $form->store_id = $this->store->id;
            $form->attributes = \Yii::$app->request->post();

            $form->model = $model;
            return $form->save();

        } else {
            $list = PrinceReplaceRule::find()->select(['r.*'])->alias('r')
                ->where(['r.id' => $id, 'r.store_id' => $this->store->id])
                ->asArray()->one();

            return $this->render('rule_edit', [
                'model' => $list,
            ]);
        }
    }
	
	//删除规则
    public function actionRuleDelete($id, $status)
    {
        $rule = PrinceReplaceRule::findOne([
            'store_id' => $this->store->id,
            'id' => $id,
        ]);
        if ($rule) {
            $rule->is_delete = $status;
            $rule->save();
        }
        return [
            'code' => 0,
            'msg' => '操作成功',
        ];
    }
	
    /**
     * @param $start
     * @param $end
     * @param $str
     * @return array
     * 正则截取函数
     */
    public function preg_substr($start, $end, $str) // 正则截取函数
    {
        try {
            $temp = preg_split($start, $str);
        } catch (\Exception $e) {
            var_dump($str);
            exit();
        }
        $result = [];
        foreach ($temp as $index => $value) {
            if ($index == 0) continue;
            $content = preg_split($end, $value);
            array_push($result, $content[0]);
        }
        return $result;
    }
}
