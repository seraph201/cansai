// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
// 云函数入口函数
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid= wxContext.OPENID
  const countResult = await db.collection('resources-order').where({_openid: wxContext.OPENID,}).count()
  const total = countResult.total
  // 计算需分几次取
  if(total>0){
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('resources-order').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
    var data1= (await Promise.all(tasks)).reduce((acc, cur) => {return acc.data.concat(cur.data)}) 
}else{ var data1={data:[]} } 
  
  const countresult = await db.collection('advance-order').where({_openid: wxContext.OPENID,convert:true}).count()
  const global = countresult.total
  // 计算需分几次取
  if(global>0){
  const frequency = Math.ceil(global / 100)
  // 承载所有读操作的 promise 的数组
  const project = []
  for (let i = 0; i < frequency; i++) {
    const skt = db.collection('advance-order').where({_openid: wxContext.OPENID,convert:true}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    project.push(skt)
  }
  var data2= (await Promise.all(project)).reduce((acc, cur) => {return acc.data.concat(cur.data)}) 
}else{var data2={data:[]}}
 let amountrecorder=[{title:"申请记录",flowlist:data1},{title:"消费记录",flowlist:data2},]
 return amountrecorder

}