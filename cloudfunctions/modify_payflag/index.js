// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
 return await db.collection("advance-order").where({ _openid:event.openid,_id:event.id}).get().then(
   res=>{
     let data=res.data[0]  
     let datalist=Object.assign({},data)    
     delete datalist._id
    return db.collection("confirm-order").doc(data._id).set({
      data:datalist
      
    })
   }
 ) 
}