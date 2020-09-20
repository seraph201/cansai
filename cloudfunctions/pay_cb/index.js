
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  let { 
        returnCode = 'FAIL',
        resultCode = 'FAIL',
        outTradeNo = '',
        openid = '',
        } = event || {}
  if(returnCode == "SUCCESS" && resultCode == "SUCCESS"){    
    var order = await db.collection('advance-order').doc(outTradeNo).get()
    
    if(order.data.pay == true){
      // 此处假设订单有state字段，并且为2是表示已成功已支付过了，不再对订单记录做任何处理，则直接返回SUCCESS，告诉微信服务器不需要再异步通知了
      return { errcode:0, errmsg:'SUCCESS' }
    }else if(order.data.pay == false){
      //更新订单状态等等业务
      var upd = await db.collection('advance-order').doc(outTradeNo).update({
        data:{
         pay: true 
        }
      })
      
      if(upd.stat.updated == 1){
        // 表示更新成功,则返回SUCCESS，告诉微信服务器不需要再异步通知了
       
        return { errcode:0, errmsg:'SUCCESS' }
      }else{
        // 记录错误信息
       // conslog.log('更新订单出错：', event)
        await db.collection('paiderror').doc(event.outTradeNo).set({data:event})
        // 否则返回FAIL，告知微信服务器还需要再异步通知
        // 注意：同个支付订单异步通知次数有限的
        // 所以这个时候你可以将异步通知的数据，存到一个专门的表里
        // 以便后续出问题好人工手动处理
        return { errcode:1, errmsg:'FAIL' }
      }
    }
  }else{
    // 记录错误信息
   
    await db.collection('non-payment').doc(event.outTradeNo).set({
      data:event
    })
    return { errcode:1, errmsg:'FAIL' }
  }
}