// 云函数入口文件
const cloud = require('wx-server-sdk')
const  md5 = require('md5');//加密工具
const request = require("request")
const xmlreader = require("xmlreader")
const ksort = require('./ksort.js');//排序工具
const random = require("outtrade.js")
const nonceStr = require("nonceStr.js")
const xmlDATA = require("xmlDATA.js")
var year=new Date().getFullYear()
var mouth=new Date().getMonth()+1
var day=new Date().getDate()
const unifiedorder="https://api.mch.weixin.qq.com/pay/unifiedorder"
cloud.init()
const partnerKey='dfetgerudjjgfsedoylcgseykfyoe587'
var paramers={
  appid:"wx95d434a4a1a2a1b2",
  mch_id:"1584971181",
  nonce_str:nonceStr,//随机字符串，长度要求在32位以内*
  body:"莊果鲜达在线支付",
  out_trade_no: year.toString()+mouth.toString()+day.toString()+random,//商户系统内部订单号，要求32个字符内*
  total_fee:1,
  notify_url:"https//www.huiujia.com/demo",
  trade_type:"JSAPI",
  spbill_create_ip:"127.0.0.1"
}
// 云函数入口函数
exports.main = async (event, context) => {  
  const wxContext = cloud.getWXContext()//*   
  let signtemp=ksort(paramers)  
  let signstring=signtemp+"&key="+partnerKey //拼接上key   
  paramers.sign=md5(signstring).toUpperCase()  //MD5运算,得到的字符串所有字符转换为大写   
  // paramers.sign="45AE834B05920D3AACD1EFD306F078A5"
  paramers.openid= wxContext.OPENID
  let xml=xmlDATA(paramers)   
  
   return await request({url:unifiedorder,body: xml,method:'POST'},(err,response,body)=>{
    if(!err && response.statusCode == 200){
        console.log(body); }

})
}
