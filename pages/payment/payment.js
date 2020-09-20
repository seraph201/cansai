// pages/payment/payment.js
var localdate = require("../../utils/util.js")
var  orderNo = require("../../utils/creatorderNO.js")
const db = wx.cloud.database()
const app = getApp()
Page({
  /*** 页面的初始数据*/
  data: {
   // password:"123456",
    on:0,//支付方式
    wallet:"0.00",//钱包剩余金额
    isShadow:false, //遮罩
    paytoken:false,
    amount:0,      
    addrchange:true,
    ondetill:true,
    bechoice: [],
    addresslist: [],    
  },    
  //查看配送须知
  deliveryarea(e){
   console.log(e)
    this.setData({
      ondetill: !this.data.ondetill,
      isShadow:!this.data.isShadow
    })
  },
  //点击任意位置取消配送范围查看
  ondetill(e){
    this.setData({
      ondetill: !this.data.ondetill,
      isShadow:!this.data.isShadow
    })
  }, 
  //添加地址
  addtheaddress(){
   wx.navigateTo({
     url: '../address/address',
   })
  },
  //修改预约日期
  dateChange(e) {
    this.setData({
      currentdate: e.detail.value
    })
  },
  
  //修改预约时间
  freqChange(e) {    
    this.setData({
      currenttime: e.detail.value
    })
  },
  bindPlus(e){   
    console.log(e);
    let id=e.target.id
    let product=this.data.bechoice
    let num=product[id].num
    let total = 0;  
    num++
    product[id].num = num;  
    for (let i in product){           
      // 所有价格加起来 count_money
     total += product[i].num *  product[i].price;       
    }
    this.setData({
      bechoice:product,
      amount:total.toFixed(2)})  
  },
  bindMinus(e){
    console.log(e)
    let that=this
    let id=e.currentTarget.id
    let product=that.data.bechoice
    let num=product[id].num  
    let total = 0;  
   if(num>1){
     num--
     product[id].num = num;
     for (let i in product){           
      // 所有价格加起来 count_money
     total += product[i].num *  product[i].price;       
    }
     that.setData({
      bechoice:product,
      amount:total.toFixed(2)
        })
      }
  },
  
  //选择支付方式
  selectpayment(e){   
    //判断用户有无缓存
    if(app.globalData.account){
    let that=this
    let id=e.target.id
    //判断选择的付款方式
    if(id!=0){ 
      let wallet=that.data.wallet
      that.setData({on:id})
      //判断剩余金额是否大于消费金额
     if(Number(wallet)<that.data.amount){wx.showToast({title: '可用额度不足',
      icon: 'loading',
      duration: 4000,
      success(){
        setTimeout(function(){that.setData({ on:0})},4000); }
    })
    }
    }else{
    that.setData({
      on:id
    })}
  }else{
    wx.showModal({
      title: '提示',
      content: '您还未开通当币账户，请开通后使用！',
      confirmText:'去开通',
      success (res) {
        if (res.confirm) {
          console.log('用户点击登陆')          
          wx.navigateTo({
            url: '../resourcesdisplace/resourcesdisplace',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  }
  },
  //跳转商品详情页
  product_info(e){ 
    let id=e.currentTarget.id
    let datalist=this.data.bechoice[id];     
    wx.navigateTo({
      url: '../productdetails/productdetails?datalist='+JSON.stringify(datalist),
    })
  },
  //删除选中商品
  delindex(e){
    let id=e.currentTarget.id
    let total=0;
    let product=this.data.bechoice
    if(product.length>1){
    product.splice(id ,1)
    for(let i=0;i<product.length;i++){
      if(product[i].check==true){
      total += product[i].num *  product[i].price;  
    } 
  }    
    this.setData({
      bechoice:this.data.bechoice,
      amount:total.toFixed(2)
    })
  }else{
    wx.showToast({title: '最后一件商品了',
    icon: 'loading',
    duration: 2000})
  }
  },
 //当币支付成功，向组件函数传递金额
 payperform(e){
  db.collection('advance-order').doc(this.data.orderNO).update({data:{pay:true,convert:true},})   
  wx.navigateTo({
    url: '../payperform/payperform?amount='+this.data.amount,    
  })
},
//取消组件支付事件
onMyEvent(e){  
  this.waitpay(this.data.orderNO)
},
  /** 发起支付函数*/
 payup(e){   
    let that=this
    //app.globalData.address=that.data.addresslist 
      if(that.data.addresslist.length!=0){ 
          let addr=that.data.addresslist
          console.log(addr)       
          let outTradeNo=that.creatorder() 
          //检查订单号是否与已支付订单重号
          wx.cloud.callFunction({
            name:"checkorderNO",
            data:{outTradeNo:outTradeNo},
            success(res){
              console.log(res)
              if(res.result.total==0){
                if(that.data.currentdate==that.data.date){
                //存储预支付订单
                if(Number(that.data.currenttime.substring(0,2))-Number(that.data.time.substring(0,2))>=1){
                const db = wx.cloud.database()
                db.collection('advance-order').add({
                  data:{
                  _id:outTradeNo,
                  user:addr[0].name,
                  tel:addr[0].tel,
                  community:addr[0].represent,
                  date:that.data.date,
                  time:that.data.time,
                  addr:addr[0].community+addr[0].detail,    
                  order:that.data.bechoice,
                  reservedate:that.data.currentdate,
                  reservetime:that.data.currenttime,
                  pay:false,
                  task:false
                  },
                  success:res=>{
                    console.log("预支付订单成功上传")
                    //判断支付方式
                    if(that.data.on!=0){  
                      //当币支付   
                      that.setData({
                        orderNO:outTradeNo,
                        hidderkeyboard:true,
                        paytoken:true,
                        pickerShow:true,
                        Shadow:true
                        })
                    }else{ 
                      //微信支付                    
                      let amount=parseInt(that.data.amount*100) //合计金额  
                      //调用统一下单云函数  
                      wx.cloud.callFunction({
                       name: 'payup',
                       data:{amount:amount, outTradeNo:outTradeNo},
                       success: res => {
                         //发起支付
                        wx.requestPayment({
                           timeStamp: res.result.payment.timeStamp,
                           nonceStr: res.result.payment.nonceStr,
                           package: res.result.payment.package,
                           signType: res.result.payment.signType,
                           paySign: res.result.payment.paySign,        
                         success (res) {
                           db.collection('advance-order').doc(outTradeNo).update({data:{pay:true},})
                           wx.showLoading({title: '即将返回首页',})           
                           setTimeout(function () {
                            wx.hideLoading()      
                            wx.switchTab({url: '../main/main',})
                                                 }, 2000)                   
                         },
                          fail (res) {console.error('支付失败将商品存入待支付缓存', res);that.waitpay(outTradeNo)}
                         })            
                       },
                       fail:res=>{
                         console.log('未支付',res)
                         wx.hideLoading();
                         wx.showToast({title: '支付失败，请及时反馈或稍后再试',icon:'none' })
                         that.waitpay(outTradeNo)             
                       }
                     })
                   }	
                  },
                  fail:res=>{
                    console.log('预支付订单上传失败',res)
                  }
                })
              }else{//时间错误
                wx.showToast({
                  title: '错误：预约时间需在当前时间1小时后',
                  icon: 'none',
                  duration: 2000,
                  success:function(){ that.setData({
                    active:!that.data.active,
                  })}
                })
              }
            }else{
              //
              const db = wx.cloud.database()
              db.collection('advance-order').add({
                data:{
                _id:outTradeNo,
                user:addr[0].name,
                tel:addr[0].tel,
                community:addr[0].represent,
                date:that.data.date,
                time:that.data.time,
                addr:addr[0].community+addr[0].detail,    
                order:that.data.bechoice,
                reservedate:that.data.currentdate,
                reservetime:that.data.currenttime,
                pay:false,
                task:false
                },
                success:res=>{
                  console.log("预支付订单成功上传")
                  //判断支付方式
                  if(that.data.on!=0){  
                    //当币支付   
                    that.setData({
                      orderNO:outTradeNo,
                      hidderkeyboard:true,
                      paytoken:true,
                      pickerShow:true,
                      Shadow:true
                      })
                  }else{ 
                    //微信支付                    
                    let amount=parseInt(that.data.amount*100) //合计金额  
                    //调用统一下单云函数  
                    wx.cloud.callFunction({
                     name: 'payup',
                     data:{amount:amount, outTradeNo:outTradeNo},
                     success: res => {
                       //发起支付
                      wx.requestPayment({
                         timeStamp: res.result.payment.timeStamp,
                         nonceStr: res.result.payment.nonceStr,
                         package: res.result.payment.package,
                         signType: res.result.payment.signType,
                         paySign: res.result.payment.paySign,        
                       success (res) {
                         db.collection('advance-order').doc(outTradeNo).update({data:{pay:true},})
                         wx.showLoading({title: '即将返回首页',})           
                         setTimeout(function () {
                          wx.hideLoading()      
                          wx.switchTab({url: '../main/main',})
                                               }, 2000)                   
                       },
                        fail (res) {console.error('支付失败将商品存入待支付缓存', res);that.waitpay(outTradeNo)}
                       })            
                     },
                     fail:res=>{
                       console.log('未支付',res)
                       wx.hideLoading();
                       wx.showToast({title: '支付失败，请及时反馈或稍后再试',icon:'none' })
                       that.waitpay(outTradeNo)             
                     }
                   })
                 }	
                },
                fail:res=>{
                  console.log('预支付订单上传失败',res)
                }
              })
            }              
            }else{
              console.log("订单号重复,重新发起订单")
              that.payup()}		  
           },
           fail:res=>{console.log('订单号检查函数调用失败')}
          })
    
    }else{
      wx.showModal({
        title: '提示',
        content: '您未设置收货地址',
        showCancel:false,
        confirmText:"去设置",
        success (res) {if (res.confirm) {wx.navigateTo({url: '../address/address',})}  }
                   })
      
    }
    },
 
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {     
    const eventChannel = this.getOpenerEventChannel();    
    eventChannel.on('acceptDataFromOpenerPage', (res) => {
      console.log("event数据",res) 
      let total = 0;  
    for (let i in res.data){           
      // 所有价格加起来 count_money
     total += res.data[i].num *  res.data[i].price;       
    }
    var local = localdate.formatTime(new Date());
    this.setData({
      date: local[0],
      time: local[1],
      currentdate:local[0],
      currenttime: local[1],
      bechoice:res.data,      
      amount:total.toFixed(2),     
    })    
    })
   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    //判断用户是否登陆，自动添加地址
    console.log(app.globalData.login)
    if(app.globalData.login!=true){
      wx.showModal({
        title: '提示',
        content: '您尚未登陆，请点击确定登陆',
        showCancel:false,
        success (res) {if (res.confirm) {
            //临时存储当前页面数据并跳转
          that.tempwait()   
          wx.switchTab({url: '../personal/personal'})            
        }}
      })
    }else{ 
         //设置当币账户金额
         console.log(getApp().globalData.account)
    if(getApp().globalData.account){ 
       let password=getApp().globalData.account.secret    
      wx.cloud.callFunction({
        name:"account_data",
        success:res=>{
          let applytotal=0
          let saletotal=0
          let apply=res.result[0].flowlist.data
          let sale=res.result[1].flowlist.data
          console.log("返回的数据",res)       
          for (let i of apply){
            console.log(i)
             if(i.vet==true){         
            // 所有价格加起来 count_money
            for(let s of i.order){            
           applytotal += (s.price*s.num); 
          console.log(applytotal)
          }      
          }
        }
          //消费金额累加
          for (let i of sale){              
            // 所有价格加起来 count_money
            for(let s of i.order){            
              saletotal += (s.price*s.num);         
            }     
          }
          that.setData({
            wallet:(applytotal-saletotal).toFixed(2),
            password:password
            
          })          
   },
   fail:console.error
   })
   
  }else{console.log("没有当币账户")}     
        //使用过
        let addresslists=wx.getStorageSync('addresslist');        
        console.log("地址字符串",addresslists)
        //判断用户缓存是否有地址列表
        if(addresslists != "" && addresslists != undefined){ 
          //let addresslist=JSON.parse(addresslists)
          console.log("地址数组",addresslists)
          var addr=[]
         for( let i of addresslists){
           if(i.check==true){
             console.log("包含真值",i)
             addr.push(i)                         
           }         
         }
         console.log(addr.length)
         if(addr.length==1){
          that.setData({
            addrchange:false,
            addresslist:addr
          })
         }else{
           addr.push(addresslists[0])
           that.setData({            
            addrchange:false,
            addresslist:addr
          })
         }          
        }         
      
    }      
  },
  

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {},
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {},
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () { },
  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function () {  },
 //存入待支付函数
 waitpay(e){
  db.collection('advance-order').doc(e).remove()
   let bechoice=this.data.bechoice
   let waitpay={_id:e,order:this.data.bechoice}
   console.log(waitpay)
   if(bechoice!=undefined||!empty(bechoice)){
   var arr = wx.getStorageSync('waitpay')||[];   
    arr.push(waitpay)
    try {
      wx.setStorageSync('waitpay', arr)             
      return;
    } catch (e) {console.log(e) }         
   /*if (arr != "" && arr != undefined) {
   console.log("缓存有数据")
   var data=JSON.parse(arr)
  for(let i of bechoice){ data.push(i) }
   var data = JSON.stringify(data);
   try {
         wx.setStorageSync('waitpay', data)          
         return;
       } catch (e) {console.log(e)}    
    }else{
    console.log("缓存无数据")
   for(let i of bechoice){ arr.push(i) }
   var data = JSON.stringify(arr);
    console.log(data) 
    
  }*/
 }
 },
 //临时缓存数据
 tempwait(){
  let bechoice=this.data.bechoice
  console.log(bechoice)
  if(bechoice!=undefined||!empty(bechoice)){
    getApp().globalData.tempdata=bechoice 
}
 },
 
 //订阅信息发送
 sendmessage(){
  wx.requestSubscribeMessage({
    tmplIds: ['s1_aiHvBgVE_pEBd8VhrKmuZ3y8fmlEZhTlcxdteVTM'],
    success (res) { }
  })
  //wx.navigateBack({delta:2})
 },
 //订单号生成
 creatorder(e){
  var year=new Date().getFullYear()
  var mouth=new Date().getMonth()+1
  var day=new Date().getDate()
  var seconds=new Date().getSeconds()
   
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 20;
  var randomstring = '';
for (var i=0; i<string_length; i++) {
var rnum = Math.floor(Math.random() * chars.length);
randomstring += chars.substring(rnum,rnum+1);
}
 
  return year.toString()+mouth.toString()+day.toString()+seconds.toString()+randomstring
 },
})