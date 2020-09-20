// pages/classify/classify.js
const db = wx.cloud.database()
Page({
  /*** 页面的初始数据 */
  data: {
    curNav:0,
    curIndex: 0
  },
  //事件处理函数  
  switchRightTab: function (e) {
   // 获取item项的id，和数组的下标值  
    let id = e.target.id;
      // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: id
    })
  },  
  classifyShow(e) {  
    
    let id = e.currentTarget.id;
    let datalist=e.currentTarget.dataset.datalist[id]; 
    wx.navigateTo({
      url: '../productdetails/productdetails',
      success: function(res) {         
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data:datalist})
      }
    })

  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
        
    let that=this
    db.collection('classify').get({
     success: function(res) {    
       console.log(res) 
      that.setData({
        classify:res.data,
        curNav:options.data
      })
     },    
   });
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