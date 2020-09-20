// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
// 云函数入口函数
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const countResult= await db.collection('confirm-order').count()
  const total = countResult.total
  // 计算需分几次取  
  if(total>0){
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('confirm-order').where({_openid:wxContext.OPENID}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  
  // 等待所有
  return   {data:(await Promise.all(tasks)).reduce((acc, cur) => {return acc.data.concat(cur.data)}),total:total}
}else{
  return {
    data: [],
    total:total  
}
}
}

  
  
