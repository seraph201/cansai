// pages/productdetails/productdetails.js
const app = getApp()
Page({
  /*** 页面的初始数据*/
  data: {   
    modelShow: false,//活动页状态
    attentionishave:false,//注意事项板块板块状态
    num:1, //默认数量值
    curkey:1, //轮播页码计数数量值   
    isShadow:false,//遮罩控制
    collectshow:false,
    collect:[],
    showbadge:false,
    number:0
  },
  //轮播页下数字下标
  slidechange(e){   
    let key = this.data.curkey, cur = e.detail.current;   
    if(cur>=key){ key++; this.setData({curkey:key }) }else{ key--; this.setData({ curkey:key}) } 
  },
   /**转首页*/
  returnhome(e) {wx.switchTab({ url: '../main/main', });},
  
  /**转水果篮*/
  barsket(e){  wx.switchTab({ url: '../calathus/calathus', }) },

   /**收藏*/
  collect(e) {    
   if(app.globalData.login){
    this.setData({ collectshow:!this.data. collectshow})
    wx.showToast({ title: '已添加到收藏', icon: 'none', duration: 1500})
    try {
      let that=this
      var arr = wx.getStorageSync('collect')||[];
      if (arr != "" && arr != undefined) {
        console.log(arr)
        //let datalist = JSON.parse(arr);              
        arr.push(that.data.product) 
        //let data=JSON.stringify(datalist)

         wx.setStorageSync('collect', arr)
        }else{
        arr.push(that.data.product)
       // let data=JSON.stringify(arr)
         wx.setStorageSync('collect', arr)
        }  
             
    } catch (e) {
      console.log(e)
    } }
    else{
      wx.showToast({
        title: '您尚未登陆！',
        icon: 'none',
        duration: 2000
      })
    }      
    },
    oncollect(e){
     let that=this
      that.setData({ collectshow:!that.data. collectshow})   
      wx.showToast({ title:'已取消收藏', icon: 'none', duration: 1500})
      try {        
        var arr = wx.getStorageSync('collect')||[];          
          //let datalist = JSON.parse(arr);
          for(let i=0;i<arr.length;i++){
           if(arr[i].id==that.data.product.id){
            arr.splice(i,1)  } 
          }       
          //let data=JSON.stringify(datalist)
           wx.setStorageSync('collect',arr)   
               
      } catch (e) {
        console.log(e)
      }    
     
    },
  /**加入水果篮*/
  joincollect(e) {   
    var arr = wx.getStorageSync('calathus') || [];
    let cal=[]
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==this.data.product.id){cal.push(i)      
          }
        }
    if(cal.length>0){
      let index=cal.pop()
    this.setData({modelShow: true, id: e.target.id,isShadow:!this.data.isShadow,num:arr[index].num})
  }else{
    this.setData({modelShow: true, id: e.target.id,isShadow:!this.data.isShadow})
  }
  
  },

  /**转支付页面*/
  payup(e) {
    var arr = wx.getStorageSync('calathus') || [];
    let cal=[]
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==this.data.product.id){cal.push(i)      
          }
        }
    if(cal.length>0){
      let index=cal.pop()
      this.setData({modelShow: true, id: e.target.id,isShadow:!this.data.isShadow,num:arr[index].num})
  }else{
    this.setData({modelShow: true, id: e.target.id,isShadow:!this.data.isShadow})
  }
  },

  //活动页取消
  cancelcollect(e) {
    this.setData({ modelShow: !this.data.modelShow,isShadow:!this.data.isShadow });
 },
 bindPlus(e){
   let num=this.data.num
   num++
   this.setData({
     num:num
   })
 },
 bindMinus(e){
  let num=this.data.num
  if(num>1){
    num--
    this.setData({
      num:num
    })
  }
 },

  //活动页确认
  confirmcollect(e) { 
    let number=this.data.number   
    let num=this.data.num
    let id=this.data.id; 
    this.setData({ modelShow: !this.data.modelShow, isShadow:!this.data.isShadow});
    if(id>0){
      console.log("用户点击立即购买")  
      let data=[]
      this.data.product.num=num;
      data.push(this.data.product)  
      wx.navigateTo({
        url: '../payment/payment?num='+this.data.num,
        success: function(res) {         
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: data})
        }
      })
    }else{
      console.log("用户点击加入水果篮")
      var arr = wx.getStorageSync('calathus') || [];      
      if (arr.length>0) {
        console.log("缓存内有值",arr)
        let el=[];
        for(let j=0;j<arr.length;j++){ 
          if(arr[j].id==this.data.product.id){ el.push(j)}         
         }        
       if(el.length>0) {
         console.log("缓存内的值ID与当前ID相同")
        let index=el.pop()
        arr[index].num=num
                     
        try {
          wx.setStorageSync('calathus', arr) 
          wx.showToast({title: '已为您添加到水果篮',icon: 'none',duration: 1500,mask:true,})  
          return;
        } catch (e) {
          console.log(e)
        }    
        }else{
          console.log("缓存内的值ID与当前ID不相同")
          this.setData({number:number+=1})
        console.log("缓存非空时非相同值加入果篮")   
        this.data.product.num=num;
        arr.push(this.data.product);  
        //var data = JSON.stringify(datalist);
        try {
          wx.setStorageSync('calathus', arr) 
          wx.showToast({title: '已为您添加到水果篮',icon: 'none',duration: 1500,mask:true})  
          return;
        } catch (e) {
          console.log(e)
        }       
      }
      }else{
        this.setData({number:number+=1})
        console.log("缓存时为空时加入水果篮")
        this.data.product.num=num        
        arr.push(this.data.product);
         //var data = JSON.stringify(arr);
        try {
          wx.setStorageSync('calathus', arr) 
          wx.showToast({title: '已为您添加到水果篮',icon: 'none',duration: 1500,mask:true})
          return;
        } catch (e) {
          console.log(e)
        }      
      }     
    }
    },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) { 
    let that=this 
    const eventChannel = this.getOpenerEventChannel();    
    eventChannel.on('acceptDataFromOpenerPage', (res) => {
      console.log("event数据",res.data) // my from index page
      var arr = wx.getStorageSync('collect')||[]; 
      if(arr.length>0){
        //判定收藏栏有无相同值      
        var data=arr
        let pop=[]
        for(let i=0;i<data.length;i++){
          if(data[i].id==res.data.id){pop.push(i)      
          }
        }
        if(pop.length!=0){
          console.log("收藏栏缓存在相同值")
          that.setData({
            product:res.data,
            name: res.data.name,
            price: res.data.price,
            unity: res.data.unity,
            originplace: res.data.originplace,
            attention: res.data.attention,
            imgUrls:res.data.imglist,
            tatal:res.data.imglist.length,
            collectshow:true
        })         
        }else{
          console.log("收藏栏无相同值")
          that.setData({
            product:res.data,
            name: res.data.name,
            price: res.data.price,
            unity: res.data.unity,
            originplace: res.data.originplace,
            attention: res.data.attention,
            imgUrls:res.data.imglist,
            tatal:res.data.imglist.length,
        })         
        }         
    }else{
      console.log("收藏栏无缓存添加")
      that.setData({
        product:res.data,
        name: res.data.name,
        price: res.data.price,
        unity: res.data.unity,
        originplace: res.data.originplace,
        attention: res.data.attention,
        imgUrls:res.data.imglist,
        tatal:res.data.imglist.length,
    })        
    }
		})       
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () { },

  /*** 生命周期函数--监听页面显示 */
  onShow: function () {
    var arr = wx.getStorageSync('calathus')||[];
    if(arr.length>0)
    this.setData({
      number:arr.length
    })
    },

  /** 生命周期函数--监听页面隐藏 */
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
  onShareAppMessage: function (e) {
    console.log(e)

  }
})