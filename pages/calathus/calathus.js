// pages/calathus/calathus.js
Page({
  /*** 页面的初始数据*/
  data: {  
    amount:"0.00", //总价 
    count:0,//商品总件数
    show:false,//底部功能菜单切换
    status: false,//顶部管理切换
    check: false,//是否选中    
    ishavedata:false,//购物车有无数据
    checkbox:[],
    selectitem:[]
  },
  manage(e) {this.setData({status: !this.data.status,show: !this.data.show,}) },  
  radiocon(e){ 
    let data=this.data.bechoice  
    if(this.data.check){
      console.log("1取消")       
        for(let j=0;j<data.length;j++){ data[j].check=false;}
          this.setData({check:!this.data.check,bechoice:data,amount:"0.00" })       
       }else{  
         console.log("2选中")          
         for(let j=0;j<data.length;j++){data[j].check=true;}        
           this.setData({check:!this.data.check,bechoice:data })
         this.count_amount()       
       }
       console.log(data)  
      }, 
      icon(e){
        let product=this.data.bechoice
        let id=e.currentTarget.dataset.index
        let data=[]
        product[id].check=false; 
        for(let i of product){ if(i.check==false){data.push(i)}}
        if(data.length!=product.length){this.setData({check:""})}  
        this.setData({bechoice:product}); 
        this.count_amount()
         
       
      },         
      iconon(e){
        let data=[]  
        let product=this.data.bechoice
        let id=e.currentTarget.dataset.index
        product[id].check=true
        for(let i of product){ if(i.check==true){data.push(i)}}
        if(data.length==product.length){this.setData({check:true})}      
        this.setData({bechoice:product,}); 
        this.count_amount()
        
      },    
 
  //减法
  bindMinus(e){
    
    console.log(e)
    let id=e.currentTarget.id
    let num=this.data.bechoice[id].num    
      if(num>1){
        num--
        this.data.bechoice[id].num = num;
        this.setData({bechoice:this.data.bechoice})
      }
      this.count_amount()
  },
  //加法
  bindPlus(e){
    let id=e.currentTarget.id
    let num=this.data.bechoice[id].num 
    num++
    this.data.bechoice[id].num = num;
    this.setData({bechoice:this.data.bechoice})  
    this.count_amount()
    
},  
  dele(e){  
    let data=[]     
    let product=this.data.bechoice
     for(let i of product){ if(i.check==true){data.push(i)}}
     if(data.length!=product.length){     
      for(var i = product.length - 1; i >= 0; i--){ if(product[i].check==true){ product.splice(i ,1)} } 
      this.setData({bechoice:product,count:product.length,check:""})
      this.count_amount()
  }else{
    console.log("执行全选删除")
    this.setData({bechoice:[],count:0,check:"",amount:"0.00"})
  }
  
  },
  payup(e){
   console.log("去结算")    
    if(this.data.bechoice!=undefined){
      let data=[]
    let product=this.data.bechoice
    for(let i of product){ if(i.check==true){data.push(i)}}
      if(data!=""){
      wx.navigateTo({url: '../payment/payment',
      success: function(res) {         
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data:data})
      }
    })
      this.setData({check:"",amount:"0.00"})
    }
    this.dele()
  }
  },
  
  count_amount(e){
    let total=0;
    let product=this.data.bechoice
    for(let i=0;i<product.length;i++){
      if(product[i].check==true){
      total += product[i].num *  product[i].price;  
    }     
    }   
   this.setData({ amount:total.toFixed(2)})
  
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var arr = wx.getStorageSync('calathus');
    console.log(arr)
      if (arr) {
     // let datalist = JSON.parse(arr);
      if(arr.length!=0){
        for(let i of arr){i.check=true}
      this.setData({
        bechoice: arr,
        count:arr.length,
        ishavedata:true, 
        check:true      
      });
    }
    this.count_amount()
    }

  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {
    console.log("页面隐藏执行")
    if(this.data.bechoice!=undefined){
    var datalist=this.data.bechoice;
    if(datalist != undefined){    
    if( datalist.length==0){
      console.log("无值时移除")
      wx.removeStorage({
        key: 'calathus'
      })
    }else{
      console.log("有值时保存")
      console.log( datalist)
    //var data = JSON.stringify( datalist);
    try {      
      wx.setStorageSync('calathus',datalist)     
    } catch (e) {
      console.log(e)
    }      
  }
}
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面卸载执行")
    if(this.data.bechoice!=undefined){
    var datalist=this.data.bechoice;
    if(datalist != "" && datalist != undefined){    
    if( datalist.length==0){
      console.log("无值时移除")
      wx.removeStorage({
        key: 'calathus'
      })
    }else{
      console.log("有值时保存")
      console.log( datalist)
    var data = JSON.stringify( datalist);
    try {      
      wx.setStorageSync('calathus', data)     
    } catch (e) {
      console.log(e)
    }      
  }
}
}
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