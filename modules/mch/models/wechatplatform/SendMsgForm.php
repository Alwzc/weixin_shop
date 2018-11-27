<?php
/**
 * @author Lu Wei
 * Created by IntelliJ IDEA
 * Date Time: 2018/7/6 19:07
 */


namespace app\modules\mch\models\wechatplatform;

use app\models\tplmsg\TplmsgSender;
use app\models\User;
use app\modules\mch\models\MchModel;

class SendMsgForm extends MchModel
{
    public $store_id;
    public $send_all;
    public $open_id_list;
    public $tpl;

    public function rules()
    {
        return [
            [['tpl'], 'required'],
            [['send_all'], 'safe'],
            [['tpl', 'open_id_list',], 'string'],
        ];
    }

    public function send()
    {
        if (!$this->validate()) {
            return $this->getErrorResponse();
        }
        if ($this->send_all == 1) {
            $this->open_id_list = $this->getAllOpenIdList();
        } else {
            $this->open_id_list = \Yii::$app->serializer->decode($this->open_id_list);
        }
        $this->tpl = \Yii::$app->serializer->decode($this->tpl);
        $data = [
            'touser' => '',
            'template_id' => $this->tpl['tpl_id'],
            'url' => $this->tpl['url'],
            'miniprogram' => $this->tpl['miniprogram'],
            'data' => [],
        ];
        if (is_array($this->tpl['maps'])) {
            foreach ($this->tpl['maps'] as $map) {
                $data['data'][$map['key']] = [
                'value' => $map['value'],
                'color' => $map['color'] ? $map['color'] : '#000000',
                ];
            }
        }
        $sender = new TplmsgSender($this->store_id);
        $error_list = [];
        $data_list = [];
        foreach ($this->open_id_list as $item) {
            $data['touser'] = $item;
            $data_list[] = $data;
            if (!$sender->send($data)) {
                $error_list[] = [
                    'msg' => $sender->getErrorMessage(),
                    'data' => $data,
                ];
            }
        }
        return [
            'code' => 0,
            'msg' => '发送成功。',
            'data' => [
                'count' => count($this->open_id_list),
                'error_count' => count($error_list),
                'error_list' => $error_list,
                //'data_list' => $data_list,
            ],
        ];
    }

    public function getAllOpenIdList()
    {
        $query = User::find()->where([
            'AND',
            ['IS NOT', 'wechat_platform_open_id', null],
            ['!=', 'wechat_platform_open_id', ''],
            ['is_delete' => 0,],
            ['store_id' => $this->store_id,],
        ]);
        $query->select('wechat_platform_open_id');
        $list = $query->asArray()->all();
        $open_id_list = [];
        foreach ($list as $item) {
            $open_id_list[] = $item['wechat_platform_open_id'];
        }
        return $open_id_list;
    }
}
