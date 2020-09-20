// pages/querycommunity/querycommunity.js
const db = wx.cloud.database()
Page({
  /*** 页面的初始数据*/
  data: {
    communityrecord:true,
    community:['夏威夷南岸'],
    record:true,
    querynear:true,
    query_result:false,
    num:0,
    region: ['河北', '廊坊市', '三河市']
  },
  bindRegionChange: function (e) {
    let addr=e.detail.value
    let that=this
    console.log(addr[2].indexOf('区'))
    if(addr[2].indexOf('区') === -1){
      //县治
      console.log(addr[2])
      wx.cloud.callFunction({
        // 云函数名称
        name: 'querycontry',
        // 传给云函数的参数
        data: { country: addr[2]    
        },
        success: function(res) {
          console.log(res) 
          if(res.result.data.length!=0){
            console.log(res)
            that.setData({
              community:res.result.data[0].community,
              communityrecord:true
            })
          }else{
            that.setData({
              communityrecord:false
            })
          }
        },
        fail: console.error
      })
    }
      else{
        //区治        
        console.log(addr[1]+addr[2])
        wx.cloud.callFunction({
          // 云函数名称
          name: 'querycity',
          // 传给云函数的参数
          data: { country: addr[2],city:addr[1]   
          },
          success: function(res) {
            if(res.result.data.length!=0){
            console.log(res)
            that.setData({
              community:res.result.data[0].community,
              communityrecord:true
            })
          }else{
            that.setData({
              communityrecord:false
            })
          }
          },
          fail: console.error
        })
      }
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  querycommunity(e){
    let that=this
    let name=e.detail.value.unityname
    let num=that.data.num
    console.log(num)
    if(name!=""&&name!=undefined&&that.data.num==0){
      num++      
      wx.cloud.callFunction({
        // 云函数名称
        name: 'querycommunity',
        data: {
          community:name
        },
        success: function(res) {
          console.log("返回数据",res)
          if(res.result.data.length!=0){
            that.setData({
              query_result:true,
              communityname:name,
              condition:"已开通",
               num:num
              
            })
          }else{
            that.setData({
              query_result:true,
              communityname:name,
              condition:"未开通",
               num:num
            })
          }
        },
        fail: console.error
        
      })       
   }else{
    wx.showToast({
  title: '多次查询无效',
  icon: 'none',
  duration: 2000
})
  }
  },
  /*** 生命周期函数--监听页面加载   */
  onLoad: function (options) {  
  },  

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {
  },

  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () {
  },

  /*** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
  },

  /*** 页面上拉触底事件的处理函数   */
  onReachBottom: function () {
  },

  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {
  }
})