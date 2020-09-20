// 云函数入口文件
const cloud = require('wx-server-sdk')
const random = require("outtrade.js")
const nonceStr = require("nonceStr.js")
var year=new Date().getFullYear()
var mouth=new Date().getMonth()+1
var day=new Date().getDate()
var seconds=new Date().getSeconds()
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  //return  year.toString()+mouth.toString()+day.toString()+seconds.toString()+random
  const wxContext = cloud.getWXContext()
  let noncestr=String(nonceStr)
  const res = await cloud.cloudPay.unifiedOrder({
    "subMchId" : "1584971181",
    "body" : "莊果鲜达在线支付",
    "outTradeNo" : random,
    "spbillCreateIp" : "127.0.0.1",
    "openid":wxContext.OPENID,
    "tradeType":"JSAPI",
    "nonceStr": noncestr,
    "totalFee" : event.amount,
    "subOpenid":wxContext.OPENID,
    "subMchId" : "1584971181",
    "envId": "zhuangguo-0yisj",//接收支付后的异步通知回调的云函数环境
    "functionName": "pay_cb"//接收支付后的异步通知回调的云函数
  })
  return res
}