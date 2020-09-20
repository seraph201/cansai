// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid= wxContext.OPENID 
  try{
    let res=await db.collection('clientinfo').where({ _openid:openid, }).get(); 
   if(res.data.length!=0){return res.data}else{return openid}
}catch(err){
  console.log(err)
}
}