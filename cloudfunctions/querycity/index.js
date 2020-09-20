// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let addr=  await db.collection('districtorcommunity').where({country:event.country,city:event.city}).get()
  return addr

  
}
