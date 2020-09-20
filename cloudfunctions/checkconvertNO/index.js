// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const $ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
 return  db.collection('resources-order').where({
   _id: $.eq(event.outTradeNo)
  }).count()
}