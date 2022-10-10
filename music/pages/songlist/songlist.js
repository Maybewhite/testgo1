// pages/songlist/songlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: {},
    artists: [],
    song: [],
    // 歌曲数量
    musicNum:10
  },
  // 获取banner
  getBanner() {
    wx.request({
      url: 'http://localhost:3000/banner',
      dataType: 'json',
      success: (res) => {
        // console.log(res.data.banners);
        this.setData({
          background: res.data.banners
        })
      }
    })
  },
  // 获取热门歌手数据
  getHostList() {
    wx.request({
      url: 'http://localhost:3000/top/artists?limit=10',
      success: (res) => {
        // console.log(res.data.artists);
        this.setData({
          artists: res.data.artists
        })
      }
    })
  },
  // 获取推荐歌曲
  getNewMusic() {
    var sum = this.data.musicNum
    wx.request({
      url: 'http://localhost:3000/personalized/newsong?limit='+sum,
      method: "GET",
      success: (res) => {
        // console.log(res.data.result);
        this.setData({
          song: res.data.result
        })
      }
    })
  },
  // 点击热门歌手
  hotlink: function (e) {
    // console.log(e.currentTarget.dataset.index);
    // 获取当前点击对象下标
    const index = e.currentTarget.dataset.index
    // 拿到当前数据
    const singer = this.data.artists
    // 跳转页面和传输数据
    wx.navigateTo({
      url: '/pages/singerDetail/singerDetail',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: singer[index] })
      }
    })
  },
  // 点击播放
  playlink(e) {
    // console.log(e);
    const index = e.currentTarget.dataset.index
    const musicData = this.data.song
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
    this.getBanner()
    this.getHostList()
    this.getNewMusic()
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
    var musicNum = this.data.musicNum
    // 每次新增
    musicNum += 5
    this.setData({
      musicNum
    })
    this.getNewMusic()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})