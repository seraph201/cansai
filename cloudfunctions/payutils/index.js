// 云函数入口文件
const cloud = require('wx-server-sdk')
const ip = require('ip')
const random = require("outtrade.js")
var year=new Date().getFullYear()
var mouth=new Date().getMonth()+1
var day=new Date().getDate()
// 初始化 cloud
cloud.init()
const appId = 'wx95d434a4a1a2a1b2' // 小程序appid
const mchId = '1584971181' //商户id
const key = 'dfetgerudjjgfsedoylcgseykfyoe587'//商户密匙
const timeout = 10000 // 毫秒
const {WXPay,  WXPayUtil,WXPayConstants } = require('wx-js-utils');
let wxpay = new WXPay({ appId, mchId, key, timeout, signType: WXPayConstants.SIGN_TYPE_MD5, useSandbox: false });
exports.main = async (event, context) => {
  const wxcontext = cloud.getWXContext();

  var time_stamp_jj = '' + Math.ceil(Date.now() / 1000)
  // 统一下单
  var reqObj = {
    body: '莊果鲜达在线支付',
    out_trade_no:  year.toString()+mouth.toString()+day.toString()+random+event.amount,   //订单号每次支付不能重复,(这里写死仅做测试)
    total_fee: event.amount,   //支付费用（单位是分不是元）   
    spbill_create_ip: ip.address() || '127.0.0.1',
    notify_url: 'http://www.qq.com',
    trade_type: 'JSAPI',    
    time_stamp:time_stamp_jj,
    openid: wxcontext.OPENID
};
  var resobj = await wxpay.unifiedOrder(reqObj)
  
  var preid = 'prepay_id=' + resobj.prepay_id
  const paySign = await WXPayUtil.generateSignature({
    appId: resobj.appid,
    nonceStr: resobj.nonce_str,
    package: preid,
    signType: 'MD5',
    timeStamp: time_stamp_jj
  }, key);
//返回给小程序端调起支付的支付参数
  return{
    timeStamp:time_stamp_jj,
    nonce_str:resobj.nonce_str,
    package: preid,
    signType:'MD5',
    paySigns:paySign
  }
}