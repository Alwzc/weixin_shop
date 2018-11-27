<?php
/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2017/6/26
 * Time: 14:38
 */

namespace app\modules\mch\models;

use app\models\Option;
use app\models\Store;
use app\models\WechatApp;

class StoreSettingForm extends MchModel
{
    public $store_id;
    public $name;
    public $order_send_tpl;

    public $app_id;
    public $app_secret;
    public $mch_id;
    public $key;
    public $cert_pem;
    public $key_pem;

    public $contact_tel;
    public $show_customer_service;
    public $dial;
    public $dial_pic;
    public $copyright;
    public $copyright_pic_url;
    public $copyright_url;

    public $delivery_time;
    public $after_sale_time;

    public $kdniao_mch_id;
    public $kdniao_api_key;

    public $cat_style;
    public $cut_thread;
    public $purchase_frame;
    public $is_recommend;
    public $recommend_count;

    public $address;
    public $cat_goods_cols;

    public $over_day;
    public $is_offline;
    public $is_coupon;

    public $cat_goods_count;
    public $send_type;
    public $nav_count;
    public $service;
    public $integral;
    public $integration;
    public $notice;
    public $postage;
    public $web_service;
    public $web_service_url;
    public $payment;
    public $wxapp;
    public $is_comment;

    public function rules()
    {
        return [
            [['name', 'app_id', 'app_secret', 'mch_id', 'key', 'order_send_tpl', 'contact_tel', 'copyright', 'copyright_pic_url', 'copyright_url', 'kdniao_mch_id', 'kdniao_api_key', 'address', 'cert_pem', 'key_pem', 'dial_pic', 'web_service', 'web_service_url', 'payment', 'wxapp'], 'trim'],
            [['name', 'cat_goods_cols', 'integral',], 'required'],
            [['order_send_tpl', 'contact_tel', 'kdniao_mch_id', 'kdniao_api_key', 'address', 'service', 'integration', 'notice', 'web_service', 'web_service_url'], 'string'],
            [['show_customer_service', 'cat_style', 'cut_thread', 'purchase_frame', 'is_recommend', 'cat_goods_cols', 'is_offline', 'is_coupon', 'cat_goods_count', 'send_type', 'nav_count', 'dial', 'is_comment'], 'integer'],
            ['cat_goods_count', 'default', 'value' => 6],
            [['cat_goods_count', 'recommend_count'], 'integer', 'min' => 0, 'max' => 100],
            [['cert_pem', 'key_pem'], 'default', 'value' => '0'],
            [['postage'], 'number', 'min' => -1],
            [['over_day'], 'number', 'min' => 0],
            [['delivery_time', 'after_sale_time', 'over_day',], 'integer', 'min' => 0],
            [['integral'],'integer','min'=>1]
        ];
    }

    public function attributeLabels()
    {
        return [
            'name' => '店铺名称',
            'app_id' => '小程序AppId',
            'app_secret' => '小程序AppSecret',
            'mch_id' => '微信支付商户号',
            'key' => '微信支付key',
            'cert_pem' => '微信支付apiclient_cert.pem',
            'key_pem' => '微信支付apiclient_key.pem',
            'order_send_tpl' => '发货模板消息id',
            'delivery_time' => '收货时间',
            'after_sale_time' => '售后时间',
            'over_day' => '未支付订单超时时间',
            'cat_goods_count' => '首页分类商品显示个数',
            'nav_count' => '首页导航',
            'service' => '客服图标',
            'integral' => '抵扣积分',
            'integration' => '积分使用规则',
            'notice' => '商城首页公告',
            'dial_pic' => '一键拨号图标',
            'postage' => '全局包邮金额',
            'purchase_frame' => '购买记录框',
            'is_recommend' => '推荐商品状态 1：开启 0 ：关闭',
            'recommend_count' => '推荐商品数量',
            'is_comment' => '评价开关',
        ];
    }

    public function save()
    {
        if (!$this->validate()) {
            return $this->errorResponse;
        }
        $store = Store::findOne($this->store_id);
        $store->name = $this->name;
        $store->order_send_tpl = $this->order_send_tpl;
        $store->contact_tel = $this->contact_tel;
        $store->show_customer_service = $this->show_customer_service;
        $store->dial = $this->dial;
        $store->dial_pic = $this->dial_pic;
        $store->copyright = $this->copyright;
        $store->copyright_pic_url = $this->copyright_pic_url;
        $store->copyright_url = $this->copyright_url;
        $store->delivery_time = $this->delivery_time;
        $store->after_sale_time = $this->after_sale_time;
        $store->kdniao_mch_id = $this->kdniao_mch_id;
        $store->kdniao_api_key = $this->kdniao_api_key;
        $store->cat_style = $this->cat_style;
        $store->cut_thread = $this->cut_thread;
        $store->address = $this->address;
        $store->cat_goods_cols = $this->cat_goods_cols;
        $store->over_day = $this->over_day;
        $store->is_offline = $this->is_offline;
        $store->is_coupon = $this->is_coupon;
        $store->cat_goods_count = $this->cat_goods_count;
        $store->send_type = $this->send_type;
        $store->nav_count = $this->nav_count;
        $store->integral = $this->integral ?: 10;
        $store->integration = $this->integration;
        $store->purchase_frame = $this->purchase_frame;
        $store->is_recommend = $this->is_recommend;
        $store->recommend_count = $this->recommend_count;
        $store->is_comment = $this->is_comment;
        $store->save();

//        Option::set('service', $this->service, $this->store_id, 'admin');
//        Option::set('notice', $this->notice, $this->store_id, 'admin');
        if (!$this->payment) {
            $this->payment['wechat'] = 1;
        }
        $payment = \Yii::$app->serializer->encode($this->payment);
        $wxapp = \Yii::$app->serializer->encode($this->wxapp);
        $list = [
            [
                'name' => 'service',
                'value' => $this->service
            ],
            [
                'name' => 'notice',
                'value' => $this->notice,
            ],
            [
                'name' => 'postage',
                'value' => $this->postage ? $this->postage : '',
            ],
            [
                'name' => 'web_service',
                'value' => $this->web_service
            ],
            [
                'name' => 'web_service_url',
                'value' => urlencode($this->web_service_url)
            ],
            [
                'name' => 'payment',
                'value' => $payment
            ],
            [
                'name' => 'wxapp',
                'value' => $wxapp
            ],
        ];
        Option::setList($list, $this->store_id, 'admin');

        return [
            'code' => 0,
            'msg' => '保存成功',
            'attr' => $store->attributes
        ];
    }
}
