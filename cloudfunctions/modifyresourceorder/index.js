// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
return await db.collection('clientinfo').where({_openid:event.openid,'account.accountrecode.0.flowlist.0._id':'123456'
}).get().then(res => {
  // res.data 包含该记录的数据
  return res.data[0].account.accountrecode[0].flowlist
})



}