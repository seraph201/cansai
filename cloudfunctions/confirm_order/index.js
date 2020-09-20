// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  const wxContext = cloud.getWXContext()
  return await db.collection("advance-order").where({    
    _id:event._id,
    _openid: wxContext.OPENID,   
}).get().then(  async res=>{
  if(res.data[0].arrive==true){
    return true
  }else{
   return await db.collection("advance-order").where({ id:event._id,_openid: wxContext.OPENID, }).update({
      data: {
        arrive:true
      },
    }).then(res=>{if(res.result.stats.updated==1){return true}else{return false}})
  }
})
  
/*return*/
  
  
}