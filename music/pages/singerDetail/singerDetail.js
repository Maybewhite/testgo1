// pages/singerDetail/singerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前歌手数据
    singerData:{},
    // 歌手详情
    singerDetail:{},
    fans:0,
    // 歌手热门歌曲
    hotMusicList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    
    // 获取页面传输过来的歌手基本数据并进行了存储
    eventChannel.on('acceptDataFromOpenerPage', data => {
      // console.log(data.data)
      this.setData({
        singerData:data
      })
    })
    // 调用渲染页面的方法
    this.getDetail()
    this.getHotMusic()
  },
  getDetail(){
    const id= this.data.singerData.data.id
    // 通过id进行数据请求
    wx.request({
      url: `http://localhost:3000/artist/detail?id=${id}`,
      success: (result) => {
        // console.log(result);
        this.setData({
          singerDetail:result
        })
      },
    })
    wx,wx.request({
      url: `http://localhost:3000/artist/follow/count?id=${id}`,
      success:(res)=>{
        // console.log(res.data.data.fansCnt);
        this.setData({
          fans:res.data.data.fansCnt/10000?parseInt(res.data.data.fansCnt/10000)+'万':res.data.data.fansCnt
        })
      }
    })
  },
  // 获取歌手热门歌曲
  getHotMusic(){
    const id= this.data.singerData.data.id
    // 通过id进行数据请求
    wx.request({
      url: `http://localhost:3000/artist/top/song?id=${id}`,
      success: (result) => {
        // console.log(result.data.songs);
        this.setData({
          hotMusicList:result.data
        })
      },
    })
  },
  // 点击播放
  playlink(e) {
    // console.log(e);
    const index = e.currentTarget.dataset.index
    const musicData = this.data.hotMusicList.songs
    // console.log(musicData);
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