// pages/play/play.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲列表
    musicList:[],
    // 当前歌曲下标
    nowIndex:"",
    // 当前歌曲数据
    music:{},
    musicId:"",
    // 播放状态
    action:{
      "method":"play",
    },
    // 定义歌词数据
    lrcData:[],
    // 当前歌词下标
    index:-1,
    // 滚动条位置
    top:0,
    qiehuan:"liebiaoxunhuan",
    // 当前播放的时间
    playTime:"00:00",
    // 总时长
    timeLength:"05:20",
    // 进度条最大值
    max:0,
    move:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    
    // 获取页面传输过来的歌曲数据并进行了存储
    eventChannel.on('acceptDataFromOpenerPage', data => {
      // console.log(data);
      const musicList = data.data.musicList
      const nowIndex = data.data.nowIndex
      // 存储当前播放歌曲的信息
      const music = musicList[nowIndex]
      // console.log(music);
      this.setData({
        nowIndex,
        musicList,
        // music,
        musicId:music.id
      })
      // console.log(music.id);
      // 调用获取歌曲详情的方法
      this.getMusicDetail()
      // 调用获取歌词
      this.getlrc()
  })
},
  getMusicDetail(){
    wx.request({
      url: 'http://localhost:3000/song/detail?ids='+this.data.musicId,
      success: (result) => {
        // console.log(result.data.songs[0]);
        this.setData({
          music:result.data.songs[0]
        })
      },
      fail: (res) => {},
    })
  },

  // 播放控制
  playData(){
    // 获取当前状态
    let data = this.data.action.method
    // 判断当前状态
    if(data === 'play'){
      this.setData({
        action:{
          "method":"pause"
        }
      })
    }else{
      this.setData({
        action:{
          "method":"play"
        }
      })
    }
  },
  // 获取歌词
  getlrc(){
    wx.request({
      url: 'http://localhost:3000/lyric?id='+this.data.musicId,
      success: (result) => {
        // console.log(result.data.lrc.lyric);
        const lrcstr = result.data.lrc.lyric
        this.lrcShow(lrcstr)
      }
    })
  },
  // 整理歌词
  lrcShow(lrc){
    // 定义空列表
    let lrcData = []

    const lrcList = lrc.split("\n")
    // console.log(lrcList);
    // 分离时间和歌词
    // 定义正则[00:36.840]
    const re = /\[\d{2}:\d{2}\.\d{2,3}\]/
    lrcList.forEach(item =>{
      // console.log(item);
      // 获取时间
      let itemData = item.match(re)
      // console.log(itemData);
      // 判断提出空时间
      if(itemData){
        itemData = itemData[0]
        // 整理时间，拆分出[]
        itemData = itemData.slice(1,-1)
        // console.log(itemData);
        // 对时间进行拆分
        const timeList = itemData.split(":")
        const time0 = timeList[0]
        const time1 = timeList[1]
        // console.log(time0);
        // 整理拿到最终时间值
        const time = parseFloat(time0)*60+parseFloat(time1)
        // 找个词,替换发方法，把符合时间清除掉
        const lrcstr = item.replace(re,"")
        // 歌词和时间整合
        lrcData.push([time, lrcstr])
      }
    })
    // console.log(lrcData);
    // 存储
    this.setData({
      lrcData:lrcData
    })
  },
  // 播放进度触发
  timeChange:function(res){
    // console.log(res.detail.currentTime);
    // 当前播放时间
    var playtime = res.detail.currentTime
    // 歌词时间
    var lrcdata = this.data.lrcData
    // console.log(this.data.lrcData);
    for(var i=0;i<lrcdata.length-1 ;i++){
      // console.log(lrcdata[i][0]);
      // 判断每一句歌词区间
      if(lrcdata[i][0]<playtime&&playtime<lrcdata[i+1][0]){
        // 设置当前歌词下标
        this.setData({
          index:i
        })
      }
      // 定位自动滚动
      // 拿到刚刚的index
      var index = this.data.index
      // if(this.data.index>5){
      //   this.setData({
      //     top:(index-5)*24
      //   })
      //   // console.log((index-5)*30);
      // }
    }
    // 进度条时间的数据更新
    // console.log(playtime);
    /**
     * 1. playtime当前播放时间 进行分钟秒钟的格式化并存储
     * 2. 总时长进行格式化并存储
     * 3. 
     */
    // 总时长
    var timelength = res.detail.duration 
    var sum_m = Math.floor(timelength/60)
    var sum_s = Math.floor(timelength%60)
    // 十位数补0
    if(sum_m<10){
      sum_m = '0'+sum_m
    }
    if(sum_s<10){
      sum_s = '0'+sum_s
    }
    // 定义播放时间
    var play_m = Math.floor(playtime/60)
    var play_s = Math.floor(playtime%60)
    if(play_m<10){
      play_m = '0'+play_m
    }
    if(play_s<10){
      play_s = '0'+play_s
    }
    // 进行数据更新
    // console.log(play_m+":"+play_s);
    this.setData({
      playtime:play_m+":"+play_s,
      timelength:sum_m+":"+sum_s,
      max:timelength,
      move:playtime
    })
  },
  // 切换图标
  qiehuan(e){
    if(this.data.qiehuan==="liebiaoxunhuan"){
      this.setData({
        qiehuan:"danquxunhuan"
      })
    }else{
      this.setData({
        qiehuan:"liebiaoxunhuan"
      })
    }
  },
  // 当歌曲播放完毕执行
  changeMusic(){
    // console.log("播放完毕");
    // danquxunhuan,liebiaoxunhuan
    var mode = this.data.qiehuan
    if(mode==="danquxunhuan"){
      // 单曲循环不更改id
      this.setData({
        musicId:this.data.musicId
      })
      // 刷新播放状态
      this.setData({
        action:{
          "method":"play",
        }
      })
    }else{
      this.nextSong()
    }
  },
  // 循环下一首
  nextSong(){
    // 拿到当前歌曲id
    // 找idList
    // console.log(this.data.musicList);
   
    var index = this.data.nowIndex
    if(index==this.data.musicList.length-1){
      this.setData({
        nowIndex:0,
        musicId:this.data.musicList[0].id
      })
    }else{
      this.setData({
        musicId:this.data.musicList[index+1].id,
        nowIndex:index+1
      })
    }
    this.setData({
      action:{
        "method":"play",
      }
    })
    this.getMusicDetail()
    // console.log(this.data.musicId);
    // console.log(this.data.nowIndex);
  },
  // 上一首
  prevSong(){
// 拿到当前歌曲id
    // 找idList
    // console.log(this.data.musicList);
    var index = this.data.nowIndex
    var length = this.data.musicList.length
    if(index==0){
      this.setData({
        nowIndex:length-1,
        musicId:this.data.musicList[length-1].id
      })
    }else{
      this.setData({
        musicId:this.data.musicList[index-1].id,
        nowIndex:index-1
      })
    }
    this.setData({
      action:{
        "method":"play",
      }
    })
    this.getMusicDetail()
  },
  // 进度条拖动快进
  sliderchange(e){
    // 当前拖动的值
    var v = e.detail.value
    // 进行move修改
    this.setData({
      move:v,
      action:{
        method:'setCurrentTime',
        data:v
      }
    })
    // 更新播放状态为play
    this.setData({
      action:{
        method:'play'
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.audioCtx = wx.createInnerAudioContext('myAudio')
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

  },
  
})