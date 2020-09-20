// components/keyboard/keyboard.js
Component({
  /*** 组件的属性列表*/
  properties: {
    password:{ // 属性名
      type: Number,
      value: ''
    },
    amount: { // 属性名
      type: Number,
      value: ''
    },
    paytoken: {
      type: Boolean, //定义传值的类型
      value: 'false',  //初始值
    },
    hidderkeyboard:{
      type: Boolean, //定义传值的类型
      value: 'false',  //初始值
    },
    pickerShow: {//定义类名
     type: Boolean, 
      value: false
    },
    Shadow: {//定义显示
      type: Boolean,
      value: true,
      observer(newVal, oldVal, changedPath) { }
    },       
    },

  /*** 组件的初始数据*/
  data: {
   
    hidderkeyboard:true,
    paytoken:true,   
    inputPassword: '',
    isheight:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //显示控制
    falsepaytoken(e){
       this.setData({paytoken:false,  hidderkeyboard:false,Shadow:false})
       this.triggerEvent("mytab") 
      },      
    controlkeyboard(e){ this.setData({hidderkeyboard:!this.data.hidderkeyboard,isheight:!this.data.isheight}) },
    conctolfalse(e){ this.setData({ hidderkeyboard:!this.data.hidderkeyboard,isheight:!this.data.isheight}) },
    
    delpassword(e){
      var index = this.data.inputPassword.length;
      if (index > 0) {
       var inputPassword = this.data.inputPassword.substr(0, index - 1);
       this.setData({
        inputPassword: inputPassword
       });
      }
    },   
    inputPassword(e) {
      //键盘输入的密码 赋值给inputPassword
      this.data.inputPassword = this.data.inputPassword + e.currentTarget.dataset.key;
      this.setData({
          inputPassword: this.data.inputPassword
      });
      //当输入密码正确时   
      if (this.data.inputPassword.length == 6 && this.data.password == this.data.inputPassword) {     
        this.setData({paytoken:false,  hidderkeyboard:false,Shadow:false})
        var pages = getCurrentPages();
        var prevPage = pages.pop();       
        prevPage.payperform()
      }
          //当输入密码错误时  给个提示 并且把输入的密码清零
      if (this.data.inputPassword.length == 6 && this.data.password != this.data.inputPassword) {
          wx.showModal({
              title: "提示",
              content: "输入密码错误",
          })
          this.setData({
              inputPassword: ''
          });
      }
  }

   
  }
  
   
})
