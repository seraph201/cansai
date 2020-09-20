// pages/resourcesdisplace/resourcesdisplace.js
const app = getApp()
Page({
  /*** 页面的初始数据*/
  data: { 
    isShadow:false,//遮罩层
    showmodel:false,//模块展示    
    acbtn:false,//
    condition:false,
    onselsect:"",
    resource:[{name:"纸张",src:'/images/daliyuse/paper.png',baseprice:"0.8" },{name:"纸箱",src:'/images/daliyuse/cartons.png'},{name:"杂纸",src:'/images/daliyuse/adpaper.png',baseprice:"0.6"},{name:"泡沫",src:'/images/daliyuse/foamy.png'},{name:"塑料",src:'/images/daliyuse/plastic.png'},{name:"纺织物",src:'/images/daliyuse/textile.png'},{name:"鞋子",src:'/images/daliyuse/shoes.png'},{name:"玻璃瓶",src:'/images/daliyuse/bottle.png'},{name:"易拉罐",src:'/images/daliyuse/cans.png'},{name:"饮料瓶",src:'/images/daliyuse/watterbottles.png'},{name:"家具",src:'/images/daliyuse/closet.png'}],
    electric:[{name:"手机",src:'/images/elappliance/telphone.png',baseprice:"20"},{name:"电视" ,src:'/images/elappliance/tv.png'},{name:"电脑",src:'/images/elappliance/computer.png'},{name:"洗衣机",src:'/images/elappliance/washing.png'},{name:"冰箱",src:'/images/elappliance/icebox.png'},{name:"空调",src:'/images/elappliance/conditioner.png'},{name:"吸尘器",src:'/images/elappliance/cleaners.png'},{name:"燃气热水器",src:'/images/elappliance/gaswater.png'},{name:"电热水器",src:'/images/elappliance/electricwater.png'}],
    kitchen:[{name:"电磁炉",src:'/images/elkitchen/elrange.png',baseprice:"0.8"},{name:"燃气灶",src:'/images/elkitchen/gasrange.png',baseprice:"10"},{name:"洗碗机",src:'/images/elkitchen/dishwash.png'},{name:"电饼铛",src:'/images/elkitchen/cakebell.png'},{name:"多士炉",src:'/images/elkitchen/toaster.png'},{name:"电饭煲",src:'/images/elkitchen/elcook.png'},{name:"高压锅",src:'/images/elkitchen/cooker.png'},{name:"锅具",src:'/images/elkitchen/pot.png'},{name:"其它",src:'/images/elkitchen/scoop.jpg'}] 
  },
  //分类明细事件
  onresources(e){
   /*  if(getApp().globalData.login!=true){
      wx.showModal({
        title: '提示',
        content: '您尚未登陆，请点击确定登陆',
        showCancel:false,
        success (res) {if (res.confirm) {
            //跳转登陆         
          wx.switchTab({url: '../personal/personal'})            
        }}
      })
    }else{*/
    let id=e.currentTarget.id
    let num=e.currentTarget.dataset.num
    let classify=e.currentTarget.dataset.classify
    let baseprice=e.currentTarget.dataset.baseprice
    console.log(e)
   wx.navigateTo({url: '../resoursinfo/resoursinfo?name='+classify+'&num='+num+'&id='+id+'&baseprice='+baseprice,})
  //}
  },
  //我的账户事件
  myaccount(e){ 
    let that=this        
    //判断用户是否登陆
    if(app.globalData.login==true){
      //if(app.globalData.account){
      //判断有无账户
      console.log(getApp().globalData.account)  
     // wx.getStorage({ key: 'account', success (res) {
         // console.log(res)     
      if(getApp().globalData.account){
        that.setData({
          showmodel:!that.data.showmodel,
          isShadow:!that.data.isShadow,
          condition:true,
          onselsect:true,
          acbtn:true})
      }else{
   // },
//fail(err){
      console.log("客户登录，无账户状态")  
  wx.showModal({
    title: '提示',
    content: '您还没有账户，是否创建？',
    cancelText:"否",
    confirmText:"是",
    success (res) {
      if (res.confirm) {
        that.setData({
          showmodel:!that.data.showmodel,
          isShadow:!that.data.isShadow
        })
      }
    }
  })      
    }
  //})
/*}else{
  console.log("客户登录，初次使用，无缓存记录状态")  
  wx.showModal({
    title: '提示',
    content: '您还没有账户，是否创建？',
    cancelText:"否",
    confirmText:"是",
    success (res) {
      if (res.confirm) {
        that.setData({
          showmodel:!that.data.showmodel,
          isShadow:!that.data.isShadow})
      }
    }
  })  
} */
    }else{
      console.log("客户未登陆状态")
      wx.showToast({ title: '您尚未登录', icon: 'loading', duration: 3000,mask:'true'})
    }  
  
  },
  //取消模块显示
  canselmodel(e){
   this.setData({
      showmodel:!this.data.showmodel,
      isShadow:!this.data.isShadow,     
    })
  },
  //提交账户密码
  formSubmit(e){   
   let that=this
   console.log(that.data.condition)
   //判断用户登录或申请状态
   if(that.data.condition==true){
     //验证账号和密码
    if(e.detail.value.account !="" && e.detail.value.secret!=""){
      if(e.detail.value.check=="true"){        
      //wx.getStorage({key: 'account',success (res) {         
          //let data=JSON.parse(res.data)
          let data=getApp().globalData.account
          console.log("账户数据",data)
          if(data.dbaccount==e.detail.value.account &&data.secret==e.detail.value.secret){
            wx.navigateTo({
              url: '../dbaccount/dbaccount',
              success: function(res) {   
                that.setData({
                  account:"",
                  secret:"",
                  showmodel:!that.data.showmodel,
                  isShadow:!that.data.isShadow

                })      
                // 通过eventChannel向被打开页面传送数据
               // res.eventChannel.emit('acceptDataFromOpenerPage', { data:data.accountrecode})
              }            
            })            
          }else{
            wx.showToast({ title: '账号或密码有误', icon: 'loading', duration: 2000,mask:'true'})
           
          }       
    //},
    //fail: console.error
     // })
    
    }else{wx.showToast({ title: '请确认活动约定', icon: 'loading', duration: 2000,mask:'true'})}
    }else{ wx.showToast({ title: '账号或密码有误', icon: 'loading', duration: 2000,mask:'true'})}
    }else{
    console.log(e)
    if(e.detail.value.check=="true"){
      var re = /^1\d{10}$/
       var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if (re.test(e.detail.value.account)){
          if(!reg.test(e.detail.value.secret)){
      var account={};
      account.dbaccount=e.detail.value.account.replace(/\s*/g,"");
      account.secret=e.detail.value.secret.replace(/\s*/g,"")
      app.globalData.account=account
     /* const db=wx.cloud.database()
       db.collection('clientinfo').add({
         data:{
           account:account
         },
        success:res=>{*/
          wx.showToast({
            title: '账号创建成功',
            icon: 'success',
            duration: 2000,
            success(){
              that.setData({
                showmodel:!that.data.showmodel,
                isShadow:!that.data.isShadow,
              })
              console.log(app.globalData.account)
            }
          })
      //  }
    //  })
      
    }else{wx.showToast({ title: '密码不能包含中文字符', icon: 'loading', duration: 2000,mask:'true'})}
    }else{wx.showToast({ title: '账号输入有误', icon: 'loading', duration: 2000,mask:'true'})}
      }else{
    wx.showToast({ title: '请确认活动约定', icon: 'loading', duration: 2000,mask:'true'})}
  }
  },
  //阅读条约
  contractpage(e){ 
   wx.navigateTo({
     url: '../contract/contract',
   })
   
  }, 

  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) { },
  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {},
  /*** 生命周期函数--监听页面显示*/
  onShow: function () { },
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {},
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () { },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () { }
})