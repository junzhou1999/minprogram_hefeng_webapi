// pages/demo/demo.js
Page({
  /**
   * 页面的初始数据
   */ 
  data: {
    province:'',
    city:'',
    region:'',
    geoData: null, /* 存储城市具体信息 */
    now:{icon:'test'}, /* 存储服务器返回天气信息 */
    time:'', /* 存储服务器传来的时间数据 */
    customItem: '全部'
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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

  },

/* picker的选择传给变量 */
  changeRegion:function(e){
    this.setData({
      province:e.detail.value[0],
      city:e.detail.value[1],
      region:e.detail.value[2]
    })
    this.getRegion();
  },

/* 变量赋值给和风城市api获取城市信息 */
getRegion:function(){
  var that=this;
  wx.request({
    url: 'https://geoapi.qweather.com/v2/city/lookup?',
    data:{
      location:that.data.region,
      adm:that.data.city,
      key:"c0cb53273bbf4e119c7fcf4c134f5797"
    },
    success:function(res){
      //console.log(res);
      if(res.data.code==404) /* 如果服务器没有第三级地区信息就选择上一级再查询一次城市信息 */
      {
        that.getCity();
      }else{
      that.setData({
        geoData:res.data,
      });
        that.getWeather();
          }
    }
  })
},

/* 水平比较低，只能再写一个函数再次访问api */
getCity:function(){
  var that=this;
  wx.request({
    url: 'https://geoapi.qweather.com/v2/city/lookup?',
    data:{
      location:that.data.city,
      //adm:that.data.city,
      key:"c0cb53273bbf4e119c7fcf4c134f5797"
    },
    success:function(res){
      console.log(res)
      that.setData({
        geoData:res.data,
      });
      that.getWeather();
    }
  })
},

/* 城市locationId作为参数获取具体实时天气信息 */
getWeather:function (){
  var that=this;
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/now?',
    data: {
      location:that.data.geoData.location[0].id,
      key:"c0cb53273bbf4e119c7fcf4c134f5797"
    },
    success:function (res) {
      that.setData({
        now: res.data.now,
        time:res.data.now.obsTime.substring(0,10)+' '+res.data.now.obsTime.substring(11,16),
      });
    }
  })
}

})