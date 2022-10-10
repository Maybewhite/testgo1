// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word:'',
    songs:{}
  },
  // 监听input输入框值发生变化的方法
  keychange(res){
    // console.log(res);
    // 当本方法触发就进行修改
    var w = res.detail.value
    // console.log(w);
    this.setData({
      word:w
    })
  },
  // 触发搜索按钮执行的方法
  serach(){
    /*
    搜索思路
    1. 拿到输入值
    2. 改变接口当中的关键字
    3. 网络请求
    4. 获取json
    5. 解析并拿到数据存储到data中
    6. html当中遍历渲染
    */
   var w = this.data.word
   console.log(w);

    wx.request({
      url: 'http://localhost:3000/cloudsearch?keywords='+this.data.word,
      success:(res)=>{
        // console.log(res.data.result.songs);
        var songs = res.data.result.songs
        this.setData({
          songs
        })
      }
    })
  },
  
  playlink(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index
    const musicData = this.data.songs
    // 获取歌曲id
    const mId = musicData[index].id
    wx.request({
      url: 'http://localhost:3000/check/music?id=' + mId,
      success: (res) => {
        if (res.data.message === 'ok') {
          console.log('可以播放');
          // 定义数据对象
          const objData = {}
          objData.musicList = musicData
          objData.nowIndex = index
          // console.log(objData);
          wx.navigateTo({
            url: '/pages/play/play',
            success:(res)=>{
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: objData })
            }
          })
        } else {
          console.log("不能播放");
          wx.showModal({
            content: '歌曲没有版权，请选择其他歌曲',
            showCancel: true,
            title: '提示',
          })
        }
      }
    })
    // console.log(musicData);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})