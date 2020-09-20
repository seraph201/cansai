// pages/dbaccount/dbaccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:"0.0",
    browse:"0",
    order:"0",
    curIndex:0,
    accountrecode:[
      {title:"申请记录",flowlist:[
        {name:"名称",date:"2020-2-14",current:"示例",coundion:""},
        {name:"名称",date:"2020-2-14",current:"示例",coundion:"示例"}
       
      ]},
      {title:"消费记录",flowlist:[
        {name:"名",date:"2020-2-14",current:"示例",coundion:"示例"},
        {name:"名",date:"2020-2-14",current:"示例",coundion:"示例"}
       
      ]}]
    

  },
  changflow(e){
    console.log(e)
    let id=e.currentTarget.id
    this.setData({
      curIndex:id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.cloud.callFunction({
      name:"account_data",
      success:res=>{
        let applytotal=0
        let saletotal=0
        let apply=res.result[0].flowlist.data
        let sale=res.result[1].flowlist.data
        console.log("返回的数据",res)
        if(apply.length>0){       
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
    }
        //消费金额累加
        if(sale.length>0){
        for (let i of sale){              
          // 所有价格加起来 count_money
          for(let s of i.order){            
            saletotal += (s.price*s.num);         
          }     
        }
      }
        that.setData({
          accountrecode:res.result,
          browse:applytotal.toFixed(2),
          order:saletotal.toFixed(2),
          count:(applytotal-saletotal).toFixed(2)
        })
      },
      fail:console.error
    })  },

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