// pages/myorder/myorder.js
Page({
  /*** 页面的初始数据*/
  data: {
    id: 0,
    onquit:true,
    ordermenu: ["待付款", "待发货", "待收货", "退换货"]
  },

  orderselect(e) {
    console.log(e)
    let id = e.target.id
    this.setData({id: id})
    this.orderselects(id)
  },
 
 //取消订单
   falseorder(e){
     console.log(e)
    let id = e.target.id 
    let datalist = this.data.data;
    datalist.splice(id,1)        
        this.setData({
          data:datalist,          
          pay:true 
        })
    this.Storagedelwaitpay(id)          
  },
  //支付订单
  payorder(e){
    console.log("当前数据",this.data.data)
    console.log(e)
    let that=this
    let id = e.target.id    
      wx.navigateTo({
        url: '../payment/payment',
        success: function(res) {         
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data.data[id].order})
          that.Storagedelwaitpay(id)
        }
      })
    
  },  
  //确认到货
  confirmorder(e){
     //将预支付订单中的订单标记已收货
     let that=this     
     let data=that.data.data[e.target.id]
     let datalist=Object.assign({},data)      
      datalist.arrive=false  
     delete datalist._id
     delete datalist._openid  
     console.log(data) 
     const db=wx.cloud.database()
     db.collection('take-order').doc(data._id).set({data:datalist,      
        success:res=>{
          if(res.stats.created==1){
          console.log(res)
           let result=res
          db.collection('confirm-order').doc(data._id).remove({
            success: function(res) {
              console.log("收获存储",result)
              console.log("删除待确认订单",res)                            
               that.data.data.splice(e.target.id,1)
               that.setData({
                 data: that.data.data
               })
            }
          })
        }
        },
        fail:console.error
     })
     
  },
  //退货
  applyquit(e){
    let that=this
    let id=e.currentTarget.id
    let data=this.data.data[id]
    ////保存数据到待退货集合
    console.log(data)
    if(data.convert){
      wx.showToast({
        title: '此订单禁止退货',
        icon: 'loading',
        duration: 2000
      })
    }else{
    const db=wx.cloud.database()
    db.collection('take-order').doc(data._id).update({
     data:{
      condition:true
     },
     success:res=>{
       console.log(res)       
       wx.cloud.callFunction({
        name: 'all_order',
       success:function(res) { console.log(res)        
          if(res.result!=null){
           console.log("待配送",res)
           that.setData({
            data:res.result.reverse(),             
          })
       }
      }
    
  })
}
    })

    }  
    
   
    //将按钮文字改成申请中。
    //同意退货将该客户待退货数组中的标志quit改为true  
  },
  //订单函数
  orderselects(e){
    let that=this
    switch (e){
      //待支付
      case '0':
        console.log("执行数据0")
        var arr = wx.getStorageSync('waitpay')|| [];    
        //if (arr != "" && arr != undefined) {
        //let datalist = JSON.parse(arr);    
          console.log(arr) 
          that.setData({
            data:arr,            
            pay:true,
            deliver:false,
            confirm:false,
            quit:false,
          })
    //  }
      break;
      //待收货
      case '1':
        console.log("执行1")
        wx.cloud.callFunction({name: 'query_deliver',
         success:function(res) { 
           if(res.result!=null){
            console.log("待配送",res)
            that.setData({
            data:res.result.data.reverse(),             
             pay:false,
             deliver:true,
             confirm:false,
             quit:false,
    })
           }else{
            that.setData({
              data:[]})
           }
  },
  fail:console.error
  })    
      break;
      //待确认
      case '2':
        console.log("执行2")       
         wx.cloud.callFunction({
          name: 'confirm_arrive',
        success:function(res) { 
          if(res.result.total>0){
          console.log(res)
          that.setData({
            data:res.result.data.data.reverse(),            
            pay:false,
            deliver:false,
            confirm:true,
            quit:false,
        })}else{
          that.setData({
            data:[]})
        }
      },
        fail:console.error})
         
      break;
      //退换货
      case '3':
        console.log("执行3")
        wx.cloud.callFunction({
          name: 'all_order',
        success:function(res) { 
          if(res.result!=null){
           console.log("待配送",res)
           that.setData({
            data:res.result.reverse(),            
            pay:false,
            deliver:false,
            confirm:false,            
            quit:true
          
   })
  }else{ that.setData({
    data:[]})}
}
  })
       /* var arr = wx.getStorageSync('quit')|| [];    
        //if (arr != "" && arr != undefined) {
       // let datalist = JSON.parse(arr);    
          //console.log(datalist) 
          that.setData({
            data:arr.reverse(),            
            pay:false,
            deliver:false,
            confirm:false,            
            quit:true
          })*/
      
      break;

    }
  },
 
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
       id: options.id
    })
    this.orderselects(options.id)   
  },
  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () { },
  /*** 生命周期函数--监听页面显示  */
  onShow: function () {    
   
  },
  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () { },
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () { },
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  //删除待付款缓存订单
  Storagedelwaitpay(index){
    var arr = wx.getStorageSync('waitpay')|| [];    
          if (arr != "" && arr != undefined) {
            arr.splice(index,1)
            try {
              wx.setStorageSync('waitpay', arr)             
            } catch (error) {              
            }
          }
  },

  //删除待确认缓存订单
  Storagedelconfirm(index){
    var arr = wx.getStorageSync('confirm')|| [];    
    if (arr != "" && arr != undefined) {
      arr.splice(index,1)
      try {
        wx.setStorageSync('confirm', arr)
        var arr = wx.getStorageSync('confirm')|| [];  
        console.log(arr)
      } catch (error) {
        
      }
    }
  },
  //存储订单到退换货
  Storagetoquit(data){
    console.log("待存储数据",data)
    var arr = wx.getStorageSync('quit')|| [];     
      arr.push(data)
      try {
        wx.setStorageSync('quit', arr)
       var arr = wx.getStorageSync('quit')|| [];
      console.log("当前退换货订单",arr)
      } catch (error) {        
      }
    
  }
})