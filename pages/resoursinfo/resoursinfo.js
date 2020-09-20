// pages/resoursinfo/resoursinfo.js
var localdate = require("../../utils/util.js")
Page({
  /*** 页面的初始数据*/
  data: {
    onunit:true,
    unit:"台",
    amount:"0.0",
    showattion:false,
    inputdata:"",
    active:false    
  },
  valued(e){   
    let that=this
    let value=e.detail.value   
    let x=(value*that.data.baseprice).toFixed(2); 
    that.setData({
      amount:x
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
  guide(e){ 
    console.log(e)
    let that=this
    that.setData({active:true})
    if(getApp().globalData.login!=true){
      console.log("客户未登陆状态")
      wx.showToast({ title: '您尚未登录', icon: 'loading', duration: 3000,mask:'true',success:function(){ that.setData({
        active:!that.data.active,
      })}})
    }else{/*
    if(getApp().globalData.mark!=true){
      console.log("客户首次登陆")
      wx.showToast({ title: '您暂无当币账户', icon: 'loading', duration: 3000,mask:'true',success:function(){ that.setData({
        active:!that.data.active,
      })}})
    }else{*/
      if(getApp().globalData.account){        
        wx.getStorage({
          key: 'addresslist',
          success (res) { 
            let addr=res.data
            console.log("地址信息",addr)
            let sdr=addr.map(function(item){return item.community+item.detail})
            wx.showActionSheet({
              itemList: sdr,
              success (res) {
                wx.showLoading({
                  title: '加载中',
                })
                let tapIndex=res.tapIndex
                if(e.detail.value.goodsdetail!=""){
                  const db = wx.cloud.database()
                  var unit=(!that.data.onunit?"kg":that.data.unit) 
                  console.log(addr)
                  let outTradeNo=that.orderCode()
                  //订单号检测函数
                  wx.cloud.callFunction({
                    // 云函数名称
                    name: 'checkconvertNO',
                    // 传给云函数的参数
                    data: {outTradeNo: outTradeNo},
                    success: function(res){
                      if(res.result.total==0){
                        console.log(e.detail.value.reservedate)
                        console.log(that.data.date)
                        if(e.detail.value.reservedate==that.data.date){
                        if(Number(e.detail.value.reservetime.substring(0,2))-Number(that.data.time.substring(0,2))>=1){
                        if(e.detail.value.goodsweight!=undefined){                                      
                         console.log(addr[tapIndex])                        
                          db.collection('resources-order').add({             
                            data: {
                              _id:outTradeNo,                              
                              user:addr[tapIndex].name,
                              tel:addr[tapIndex].tel,
                              community:addr[tapIndex].represent,
                              date:that.data.date,
                              time:that.data.time,
                              reservedate:e.detail.value.reservedate,
                              reservetime:e.detail.value.reservetime,
                              addr:sdr[tapIndex],
                              order:[{                                
                                num:e.detail.value.goodsweight,
                                price:that.data.baseprice,
                                unit:unit,
                                name:that.data.name,
                                amount:that.data.amount,
                               }],
                               description:e.detail.value.goodsdetail,
                              addr:sdr[tapIndex],
                              vet:false,
                              task:false,
                              resourse:true
                            },
                            success: function(res) {
                              wx.hideLoading()
                              wx.showModal({
                                title: '提示',
                                content: '您的兑换申请已成功提交',
                                showCancel:false,
                                confirmText:"返回",
                                success (res) {
                                  if (res.confirm) {
                                  wx.navigateBack({
                                    delta: 1,
                                  })
                                  } 
                                }                
                              })                
                            },
                            fail: console.error
                          }) 
                           
                        }else{
                          console.log("数量")
                          if(e.detail.value.goodsquantity!=undefined){                           
                          db.collection('resources-order').add({             
                            data: {
                              _id:outTradeNo,                              
                              user:addr[tapIndex].name,
                              tel:addr[tapIndex].tel,
                              community:addr[tapIndex].represent,
                              date:that.data.date,
                              time:that.data.time,
                              reservedate:e.detail.value.reservedate,
                              reservetime:e.detail.value.reservetime,
                              addr:sdr[tapIndex],
                              order:[{                                
                                num:e.detail.value.goodsquantity,
                                unity:unit,
                                price:that.data.baseprice,
                                name:that.data.name,
                                amount:that.data.amount,
                               }],
                              description:e.detail.value.goodsdetail,
                              addr:sdr[tapIndex],
                              vet:false,
                              task:false,
                              resourse:true                  
                                                  
                            },
                            success: function(res) {
                              wx.hideLoading()
                              wx.showModal({
                                title: '提示',
                                content: '您的兑换申请已成功提交',
                                showCancel:false,
                                confirmText:"返回",
                                
                                success (res) {
                                  if (res.confirm) {
                                    wx.navigateBack({
                                      delta: 1,
                                    })
                                  }else{
                                    that.setData({
                                      active:!that.data.active,
                                    })
                                  }
                                }
                              })                
                            },
                            fail: console.error
                          }) 
                        }else{
                          wx.showToast({
                            title: '请检查输入是否有误',
                            icon: 'loading',
                            duration: 2000
                          })
              
                        } 
                        }
                        
                      }else{
                        wx.showToast({
                          title: '错误：预约时间需在当前时间1小时后',
                          icon: 'none',
                          duration: 4000,
                          success:function(){ that.setData({
                            active:!that.data.active,
                          })}
                        })
                      }
                    }else{
                      //非当天
                      if(e.detail.value.goodsweight!=undefined){                                      
                        console.log(addr[tapIndex])                        
                         db.collection('resources-order').add({             
                           data: {
                             _id:outTradeNo,                              
                             user:addr[tapIndex].name,
                             tel:addr[tapIndex].tel,
                             community:addr[tapIndex].represent,
                             date:that.data.date,
                             time:that.data.time,
                             reservedate:e.detail.value.reservedate,
                             reservetime:e.detail.value.reservetime,
                             addr:sdr[tapIndex],
                             order:[{                                
                               num:e.detail.value.goodsweight,
                               price:that.data.baseprice,
                               unit:unit,
                               name:that.data.name,
                               amount:that.data.amount,
                              }],
                              description:e.detail.value.goodsdetail,
                             addr:sdr[tapIndex],
                             vet:false,
                             task:false,
                             resourse:true
                           },
                           success: function(res) {
                             wx.hideLoading()
                             wx.showModal({
                               title: '提示',
                               content: '您的兑换申请已成功提交',
                               showCancel:false,
                               confirmText:"返回",
                               success (res) {
                                 if (res.confirm) {
                                 wx.navigateBack({
                                   delta: 1,
                                 })
                                 } 
                               }                
                             })                
                           },
                           fail: console.error
                         }) 
                          
                       }else{
                         console.log("数量")
                         if(e.detail.value.goodsquantity!=undefined){                           
                         db.collection('resources-order').add({             
                           data: {
                             _id:outTradeNo,                              
                             user:addr[tapIndex].name,
                             tel:addr[tapIndex].tel,
                             community:addr[tapIndex].represent,
                             date:that.data.date,
                             time:that.data.time,
                             reservedate:e.detail.value.reservedate,
                             reservetime:e.detail.value.reservetime,
                             addr:sdr[tapIndex],
                             order:[{                                
                               num:e.detail.value.goodsquantity,
                               unit:unit,
                               price:that.data.baseprice,
                               name:that.data.name,
                               amount:that.data.amount,
                              }],
                             description:e.detail.value.goodsdetail,
                             addr:sdr[tapIndex],
                             vet:false,
                             task:false,
                             resourse:true                  
                                                 
                           },
                           success: function(res) {
                             wx.hideLoading()
                             wx.showModal({
                               title: '提示',
                               content: '您的兑换申请已成功提交',
                               showCancel:false,
                               confirmText:"返回",
                               
                               success (res) {
                                 if (res.confirm) {
                                   wx.navigateBack({
                                     delta: 1,
                                   })
                                 }else{
                                   that.setData({
                                     active:!that.data.active,
                                   })
                                 }
                               }
                             })                
                           },
                           fail: console.error
                         }) 
                       }else{
                         wx.showToast({
                           title: '请检查输入是否有误',
                           icon: 'loading',
                           duration: 2000
                         })
             
                       } 
                       }
                    }
                      }else{
                        that.guide()
                      }
                    }})              
                 
                
                }else{
                  wx.showToast({
                    title: '请填写详情描述',
                    icon: 'loading',
                    duration: 2000,
                    success:function(){ that.setData({
                      active:!that.data.active,
                    })}
                  })
                }
              },
              fail (res) {
                wx.showToast({ title: '请您选择地址！', icon: 'loading', duration: 2000,mask:'true'})
                console.log(res.errMsg)
              }
            })
          },
          fail(err){
            console.log(err)
            wx.showModal({
              title: '提示',
              content: '请添加地址信息！',
              success (res) {
                if (res.confirm) {
                 wx.navigateTo({
                   url: '../address/address',
                   success:res=>{
                    that.setData({
                      active:!that.data.active,
                    })
                   }
                 })
                } 
              }
            })
            
            
          }
        })

      }else{
        console.log("客户无账户")
        wx.showToast({ title: '您暂无当币账户', icon: 'loading', duration: 3000,mask:'true',success:function(){ that.setData({
          active:!that.data.active,
        })}})
      }
   // }
   
 }           
  },
orderCode() {
    var orderCode='';
    for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
    {
      orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
    console.log(orderCode)
    return orderCode;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var local = localdate.formatTime(new Date());
    let num=options.num
    this.setData({
      date: local[0],
      time: local[1],
      currentdate:local[0],
      currenttime: local[1],
      name:options.name,
      baseprice:options.baseprice
    })
 switch(num){
   case "0":
     if(options.id<7){
          this.setData({
            onunit:!this.data.onunit
          })
     }else if (options.id>=7 && options.id<10)
     {
      this.setData({
        unit:"个"
      })
     }else{
      this.setData({
        unit:"件",
        showattion:!this.data.showattion
       })
     }
   break;
   case "2":
   if(options.id>4&&options.id<8){
    this.setData({
      unit:"只"
     })
   }else if(options.id>=8) {
    this.setData({
      onunit:!this.data.onunit,

     })
       }
   break;
 }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
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