//app.js
App({
  globalData: {
    login: null,
    mark:null,
    nickName:null,
    avatarUrl:null,
    address:null,
    tempdata:null
  },
  onLaunch: function () {
    console.log("执行apponlaunch")
    if (!wx.cloud) {console.error('请使用 2.2.3 或以上的基础库以使用云能力')
     } else {wx.cloud.init({env: 'zhuangguo-0yisj', traceUser: true,})}       
  }, 
  onShow (options) {
  console.log("执行apponshow")
  console.log(this.globalData)
  if(this.globalData.login){
    wx.cloud.callFunction({     
      name: 'login',
      complete: res => {                      
        if(typeof res.result!="string"){
         console.log("返回用户数据",res.result)
         let id=res.result[0]._id;
         let addresslist=res.result[0].addresslist;
         let calathus=res.result[0].calathus;
         let collect=res.result[0].collect;
         let waitpay=res.result[0].waitpay;        
         let account=res.result[0].account;
         getApp().globalData.mark=true                       
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

        if (account != "" &&  account != undefined){
          getApp().globalData.account=account
          console.log(getApp().globalData.account)
           // let datalist=JSON.stringify( account)
          //  wx.setStorageSync('account', datalist)
         }             
               
        }           
      }      
})
  }
  }, 
  onHide () {
   console.log( getApp().globalData)    
   let that=this
    const db = wx.cloud.database() 
    const id= wx.getStorageSync('id');   
    let addresslist= wx.getStorageSync('addresslist');  
    let calathus= wx.getStorageSync('calathus');    
    let collect= wx.getStorageSync('collect');
    let waitpay= wx.getStorageSync('waitpay');   
    let account= wx.getStorageSync('account'); 
    
   //判断是否登陆
    if(getApp().globalData.login){
     //已登陆，判断数据库中有无客户
     if(id){ 
       console.log("全据变量mark", getApp().globalData.mark)
        that.setup(id)     
     }else{ 
       //新用户（数据库中无客户数据）   
       if(addresslist||calathus||collect||waitpay||account){      
            //客户未下单缓存信息
            that.setstrorage()             
        }else{console.log("客户无数据",)}
     }
    }else{
      //客户未登陆，不保存信息
      console.log("未登录不用户保存数据")}
    　wx.clearStorage()
   },
   onError (msg) {
    console.log(msg)
  },

  
  //上传新客户信息
  setstrorage(){
    const db = wx.cloud.database()
    db.collection('clientinfo').add({ 
      data: {            
        calathus:wx.getStorageSync('calathus')||[],
        collect:wx.getStorageSync('collect')||[],
        addresslist:wx.getStorageSync('addresslist')||[],
        waitpay:wx.getStorageSync('waitpay')||[],       
        account:getApp().globalData.account,         
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)  }
    })

  },
  //上传老用户信息
  setup(id){
  const db = wx.cloud.database()
  db.collection('clientinfo').doc(id).set({ 
    data: {            
      calathus:wx.getStorageSync('calathus')||[],
      collect:wx.getStorageSync('collect')||[],
      addresslist:wx.getStorageSync('addresslist')||[],
      waitpay:wx.getStorageSync('waitpay')||[],     
      account:getApp().globalData.account,          
    },
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log("老客户上传数据完成",res)  }
  })     
  }
})