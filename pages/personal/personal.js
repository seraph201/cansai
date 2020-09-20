// pages/personal/personal.js
const app = getApp()
Page({
  /*** 页面的初始数据 */
  data: {   
    avatarUrl: '/images/proxy.png',
    nickName: "请登录",
    title:"我的订单",
    opptiondata:[
      { src:"/images/payment.png",text:"待付款"},
      { src: "/images/wait.png", text:"待配送"},
      { src: "/images/get.png", text: "待收货" },
      { src: "/images/retreat.png", text: "退换货" },
    ]
  },
  userinfo(e) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res)       
        let  avatarUrl= res.userInfo.avatarUrl
        let  nickName=  res.userInfo.nickName
        app.globalData.login=true
        app.globalData.nickname= nickName 
        app.globalData.avatarUrl= avatarUrl             
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,         
        })
        wx.cloud.callFunction({
          // 云函数名称
          name: 'login',
          complete: res => {  
            console.log(res)         
            if(typeof res.result!="string"){
             console.log("返回用户数据",res.result)
             let id=res.result[0]._id;
             let addresslist=res.result[0].addresslist;
             let calathus=res.result[0].calathus;
             let collect=res.result[0].collect;
             let waitpay=res.result[0].waitpay;
             let deliver=res.result[0].deliver;
             let confirm=res.result[0].confirm;
             let quit=res.result[0].quit;
             let account=res.result[0].account;
             app.globalData.mark=true                       
              wx.setStorageSync('id', id)
             if (calathus != "" && calathus != undefined){
               console.log("水果篮数据",calathus)
             // let datalist=JSON.stringify(calathus)
              wx.setStorageSync('calathus', calathus) }

              if (collect != "" && collect != undefined){
                console.log("收藏数据",collect)
                //let datalist=JSON.stringify(collect)
                wx.setStorageSync('collect', collect) }

             if (addresslist != "" && addresslist != undefined){
              //let datalist=JSON.stringify(addresslist)
              console.log("地址数据",addresslist)
              wx.setStorageSync('addresslist', addresslist) }

            if (waitpay != "" && waitpay != undefined){
              //let datalist=JSON.stringify(waitpay)
              wx.setStorageSync('waitpay',waitpay) }           

              if (confirm != "" && confirm != undefined){
               // let datalist=JSON.stringify(confirm)
                wx.setStorageSync('confirm', confirm) }

              if (quit != "" && quit != undefined){
                //let datalist=JSON.stringify(quit)
                wx.setStorageSync('quit', quit) }

            if (account != "" &&  account != undefined){
              getApp().globalData.account=account
              console.log(getApp().globalData.account)
               // let datalist=JSON.stringify( account)
              //  wx.setStorageSync('account', datalist)
             } 
                that.onShow()
                that.tempwait()          
            }else{
              app.globalData.mark=false 
              console.log("字符串")
              that.tempwait()             
              console.log("当前login值",app.globalData.login)
              console.log("当前mark值",app.globalData.mark)
            }                     
          }      
    })
   
      },
      fail(){
        wx.showToast({
          title: '登陆失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
        
        
      }
    })
    
    
  },
  menuopption(e) {console.log(e)
    if(app.globalData.login==true){
  let id= e.currentTarget.id
  wx.navigateTo({
    url: '../myorder/myorder?id=' + id 
  })}else{
    wx.showToast({title: '您尚未登陆',
    icon: 'loading',
    duration: 2000})
  }},

  shoppingcart(e){
       wx.switchTab({
      url: '../calathus/calathus',
    })
  },

  setter(e){
    if(app.globalData.login==true){
   wx.navigateTo({
     url: '../setter/setter',
   })
  }else{
    wx.showToast({title: '您尚未登陆',
    icon: 'loading',
    duration: 2000})
  }},
  address(e) {
    if(app.globalData.login==true){
    wx.navigateTo({
      url: '../address/address',
    })
  }else{
    wx.showToast({title: '您尚未登陆',
    icon: 'loading',
    duration: 2000})
  }
  },
  collect(e) {
    if(app.globalData.login==true){
    wx.navigateTo({
      url: '../collect/collect',
    })
  }else{
    wx.showToast({title: '您尚未登陆',
    icon: 'loading',
    duration: 2000})
  }
  },
tempwait(e){
  let tempwait=getApp().globalData.tempdata 
 if(tempwait){
   console.log(tempwait)
   wx.navigateTo({
     url: '../payment/payment',
     success: function(res) {         
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit('acceptDataFromOpenerPage', { data: tempwait})
    }
   })
 }  
}, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /** 生命周期函数--监听页面显示 */
  onShow: function () {  
    let that=this
    if(app.globalData.login){
      that.setData({
        avatarUrl:app.globalData.avatarUrl,
        nickName:app.globalData.nickname,
        alse:true       
      })
    var arr = wx.getStorageSync('waitpay')|| [];    
    if (arr.length!= 0) {
    //let datalist = JSON.parse(arr);    
     // console.log(arr) 
      that.setData({
        waitpay:arr,
        waitpaybadge:arr.length,
        pay:true
      })
  }
  
  wx.cloud.callFunction({
    name: 'query_deliver',
  success:function(res) { 
    if(res.result!=null){
    console.log("待配送",res)
    that.setData({
      delivergoods:res.result.data,
      deliverbadge:res.result.data.length,
      deliver:true
    })
  }else{
    that.setData({
      deliver:false
    })
  }
  },
  fail:res=>{"待配送",res}
  })  
  wx.cloud.callFunction({
    name: 'confirm_arrive',
  success:function(res) { 
    if (res.result.total!= 0) {
      //let datalist = JSON.parse(arr);   
        that.setData({         
          confirmbadge:res.result.total,
          confirm:true
        })
      }else{
        that.setData({ confirm:false})
      }   
    }
  })
  wx.cloud.callFunction({
  name: 'quitorder',
success:function(res) {
  if(res.result.total>0){   
  that.setData({    
    quitbadge:res.result.total,
    quit:true
  })
}else{
  that.setData({
    quit:false
  })
}
},
fail:console.error
})  

}else{console.log("未登录")}
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that=this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      complete: res => {  
        console.log(res)         
        if(typeof res.result!="string"){
         console.log("返回用户数据",res.result)
         let id=res.result[0]._id;
         let addresslist=res.result[0].addresslist;
         let calathus=res.result[0].calathus;
         let collect=res.result[0].collect;
         let waitpay=res.result[0].waitpay;
         let deliver=res.result[0].deliver;
         let confirm=res.result[0].confirm;
         let quit=res.result[0].quit;
         let account=res.result[0].account;
         app.globalData.mark=true                       
          wx.setStorageSync('id', id)
         if (calathus != "" && calathus != undefined){
           console.log("水果篮数据",calathus)
         // let datalist=JSON.stringify(calathus)
          wx.setStorageSync('calathus', calathus) }

          if (collect != "" && collect != undefined){
            console.log("收藏数据",collect)
            //let datalist=JSON.stringify(collect)
            wx.setStorageSync('collect', collect) }

         if (addresslist != "" && addresslist != undefined){
          //let datalist=JSON.stringify(addresslist)
          console.log("地址数据",addresslist)
          wx.setStorageSync('addresslist', addresslist) }

        if (waitpay != "" && waitpay != undefined){
          //let datalist=JSON.stringify(waitpay)
          wx.setStorageSync('waitpay',waitpay) }           

          if (confirm != "" && confirm != undefined){
           // let datalist=JSON.stringify(confirm)
            wx.setStorageSync('confirm', confirm) }

          if (quit != "" && quit != undefined){
            //let datalist=JSON.stringify(quit)
            wx.setStorageSync('quit', quit) }

        if (account != "" &&  account != undefined){
          getApp().globalData.account=account
          console.log(getApp().globalData.account)
           // let datalist=JSON.stringify( account)
          //  wx.setStorageSync('account', datalist)
         } 
            that.onShow()
            //that.tempwait()          
        }else{
          app.globalData.mark=false 
          console.log("字符串")
          that.tempwait()             
          console.log("当前login值",app.globalData.login)
          console.log("当前mark值",app.globalData.mark)
        }                     
      }      
})
wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  
})