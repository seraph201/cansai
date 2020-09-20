// pages/main/main.js
const db = wx.cloud.database()
Page({
  /*** 页面的初始数据*/
  data: {
    ishaveChild:true, //热销推荐   
    defaultimgUrls:[{imagesrc:"/images/delivery.png", url:"123"},{imagesrc: "/images/new.jpg",  }], //混动广告
    community:"点击查询",
    //菜单数据
    opptiondata:[
      {src: "/images/fruit.png", text: "水果"},
      {src: "/images/vergetable.png", text: "蔬菜"},
      {src: "/images/graninandoil.png", text: "粮油"},
      {src: "/images/eggbird.png", text: "蛋禽"},
      {src: "/images/grans.png", text: "杂粮"},
      {src: "/images/condiment.png", text: "调味"},
      {src: "/images/driedfruit.png", text: "干果"},
      {src: "/images/drinks.png", text: "酒水"},
      {src: "/images/dailay.png", text: "日用"},
      {src: "/images/green.png", text: "绿植"}
    ],
    
    bechoice_left:[
      { imglist: [{ src: "/images/new.jpg",},{ src: "/images/new.jpg",}], name: "类似飞机啊啊发顺丰", price: "12", unity: "kg", attention: "暂无内容",originplace:"山东烟台"},
      {imglist: [{ src: "/images/new.jpg"},{ src: "/images/new.jpg"}],price: "13", unity: "kg", attention: "暂无内容"},
      {imglist: [{ src: "/images/new.jpg"},{ src: "/images/new.jpg"}], price: "34", unity: "kg", attention: "暂无内容"},
      {imglist: [{ src: "/images/new.jpg"},{ src: "/images/new.jpg"}], name: "类似飞机啊啊发顺丰搭嘎", price: "26", unity: "kg", attention: "暂无内容" }
    ],
    bechoice_right:[
      { imglist: [{ src: "/images/new.jpg",},{ src: "/images/new.jpg",}], name: "类似飞机啊啊发", price: "12", unity: "kg", attention: "暂无内容",originplace:"山东烟台"},
      {imglist: [{ src: "/images/new.jpg"},{ src: "/images/new.jpg"}],price: "13", unity: "kg", attention: "暂无内容"},
      {imglist: [{ src: "/images/new.jpg"},{ src: "/images/new.jpg"}], price: "34", unity: "kg", attention: "暂无内容"},
      {imglist: [{ src: "/images/new.jpg"},{ src: "/images/new.jpg"}], name: "类似飞机啊啊发顺丰搭嘎", price: "26", unity: "kg", attention: "暂无内容" }
    ]
  },
  /**广告轮播页 */
  adnav(e){ if(e.currentTarget.dataset.url){ console.log(e)}else{console.log(false)}},
  
   //社区查询
  querycommunity(e){wx.navigateTo({url: '../querycommunity/querycommunity',}) },
  //资源置换
  resourcesdisplace(e){wx.navigateTo({url: '../resourcesdisplace/resourcesdisplace', })},
  /**菜单导航**/
  menuopption(e){    
    let id = e.currentTarget.id; 
    console.log(e)
    wx.reLaunch({url: '../classify/classify?data='+id, })},
  /**热销点击跳转**/
  bechoice(e){ 
    console.log(e)
    let id=e.currentTarget.id
    let area=e.currentTarget.dataset.area
    console.log(area)
    let that=this  
    if(area!="true"){
      wx.navigateTo({
        url: '../productdetails/productdetails',
        success: function(res) {         
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data.bechoice_left[id]})
        }
      })
    }else{
      wx.navigateTo({
        url: '../productdetails/productdetails' ,  
        success: function(res) {         
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data.bechoice_right[id]})
        }            
      })
    }  
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    //获取滑动广告数据
     db.collection('main-slidead').doc('adinfo').get({
      success: function(res) {    
        console.log(res) 
       that.setData({
        imgUrls:res.data.imgUrls
       })
      },    
    });
    //获取左侧栏数据
   db.collection('dechoice-left').get({
      success: function(res) {    
        console.log(res) 
       that.setData({
        dechoice_left:res.data
       })
      },    
    })
    //获取右侧栏数据
    db.collection('dechoice-left').get({
      success: function(res) {    
        console.log(res) 
       that.setData({
        dechoice_right:res.data
       })
      },    
    })
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
    return {
      title:'最新鲜的食材！',
      path:'/pages/main/main',
      imageUrl:'/images/miniprogram.jpg'

    }

  }
})