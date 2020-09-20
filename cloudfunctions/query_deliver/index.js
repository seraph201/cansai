// 云函数入口文件
//const cloud = require('wx-server-sdk')
//cloud.init()
// 云函数入口函数
//const db=cloud.database()
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const $ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let initdata= await db.collection('advance-order').where({ _openid: $.eq(wxContext.OPENID),pay: $.eq(true),task: $.eq(false)}).get() 
    let data=[]
  for(let value of initdata.data){
   if(value.task==false){
    data.push(value)
    
   }
    return data
  }
}