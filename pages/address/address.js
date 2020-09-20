// pages/address/address.js
//cur控制设为默认
Page({
  /*** 页面的初始数据 */
  data: {
    sn:"",
    ishave:true,
    addresslist:[],
    ishaveinput:false,
    selectdefault:"已设为默认",
    fault:"设为默认",   
    isShadow:false //遮罩
  },
  //选择默认
  selectradio(e){
    let i=e.detail.value 
    for(let x of this.data.addresslist){
      x.check=""
    }  
    this.data.addresslist[i].check=true
    console.log( this.data.addresslist)
   this.setData({addresslist:this.data.addresslist})   
  },
  //添加新增
  addrnew(e){
   this.setData({
     isShadow:!this.data. isShadow,
     ishaveinput: !this.data.ishaveinput,
     name:"",
     tel:"",
    community:"",
    detail:"",
     sn:""
   })
  },
  //删除
  del(e){    
    let id=e.target.id
    this.data.addresslist.splice(id, 1);
    this.setData({
      addresslist:this.data.addresslist
    })    
  },
  //编辑
  edit(e){
    let id = e.target.id    
    this.setData({
      sn:id,
      ishaveinput: !this.data.ishaveinput,
      name: this.data.addresslist[id].name,
      tel: this.data.addresslist[id].tel,
      community: this.data.addresslist[id].community,
      detail:this.data.addresslist[id].detail,
      isShadow:!this.data.isShadow
    })
  },
  //置顶
  top(e){   
    let id = e.target.id;
    let address = this.data.addresslist[id]
    this.data.addresslist.splice(id, 1);
    this.data.addresslist.unshift(address);   
    this.setData({
      addresslist: this.data.addresslist,      
    })   
  }, 
  //获取手机号
  getPhoneNumber(e){
    var that = this;   
    wx.showLoading({
      title: '获取手机号中...',
    })
    wx.cloud.callFunction({
      name: 'getphone',  // 对应云函数名
      data: {
        weRunData: wx.cloud.CloudID(e.detail.cloudID),         
      },
      success: res => {
        that.setData({
          tel:res.result.event.weRunData.data.phoneNumber
        })
        console.log(res.result.event.weRunData.data.phoneNumber)
        wx.hideLoading()
        
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败,请手动输入',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //社区查询
  querycommunity(e){    
    let that=this
    let community=e.detail.value.replace(/(^\s*)|(\s*$)/g, ""); 
       if(community){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'querycommunity',
      data: {
        community:community,       
      },
      success: function(res) {
        console.log(res)
        if(res.result.data.length!=0){
          that.setData({
            community:res.result.data[0].name,
            represent:res.result.data[0].represent,
            formSubmit:"formSubmit"            
          })
        }else{
          wx.showToast({
            title: '该社区暂未开通！',
            icon: 'none',
            duration: 3000,
            success(e){
              that.setData({community:"",detail:""})
            }
          });          
        }
      },
      fail: console.error
    })
    }
  },
  //添加新增
  formSubmit(e){
    console.log(e)
    var that = this;   
    if (e.detail.value.name.length == ""){
      wx.showToast({
        title: '请填写收货人',
        icon:'none',       
        duration: 2000
      })
    }else{     
      if (e.detail.value.tel.length == "") {
        wx.showToast({
          title: '请填写手机号码',
          icon: 'none',
          duration: 2000
        });
      }else{
        if (e.detail.value.detail.length == "") {
          wx.showToast({
            title: '请填写详细门牌号',
            icon: 'none',
            duration: 2000
          })
        }else{
          var re = /^1\d{10}$/
          if (re.test(e.detail.value.tel)){
            if (that.data.sn != "" && that.data.sn !="undefined"){
              console.log(e.detail.value)
              e.detail.value.represent=that.data.represent   
              that.data.addresslist[that.data.sn] = e.detail.value
              that.setData({
                isShadow:!this.data. isShadow, 
                addresslist: that.data.addresslist,
                ishaveinput: !this.data.ishaveinput,
                ishave: true})
            }else{ 
            e.detail.value.represent=that.data.represent            
            that.data.addresslist.push(e.detail.value)
           that.setData({
             isShadow:!this.data. isShadow, 
             addresslist: that.data.addresslist,
             ishaveinput: !this.data.ishaveinput,
             ishave: true
           })
          }
          }else{
            wx.showToast({
              title: '请检查输入是否有误！',
              icon: 'none',
              duration: 2000
            })

          }
        }

      }
    }
  },
  //取消新增
  inputcancel(e){   
    this.setData({
      ishaveinput: !this.data.ishaveinput,
      isShadow:!this.data. isShadow,      
    })
  },    
  /** * 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var arr = wx.getStorageSync('addresslist') || [];
    console.log("缓存地址数据",arr)
    if (arr != "" && arr != undefined) {
      //let addresslist = JSON.parse(arr);
      console.log(arr)
      this.setData({
        addresslist:arr,
             
      });
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
    console.log("onhide执行")
    let data=this.data.addresslist
    if (data != "" && data != undefined){
    //let datalist=JSON.stringify(data)
    wx.setStorageSync('addresslist', datalist) 
  }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onunload执行")
    let data=this.data.addresslist
    if (data != "" && data != undefined){
    //let datalist=JSON.stringify(data)
    wx.setStorageSync('addresslist', data) 
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