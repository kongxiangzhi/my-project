<template lang="html">
  <div class="wrap">
    <h2 class="time" id="timetext">00:0<span class="minute">{{minute}}</span>:<span class="second">{{second}}</span></h2>
    <div class="begin_btn" v-if="Begin"
         v-bind:class="{pulse:Pulse}"
         v-on:click="record">
    </div>
    <div class="begin_btn_starting" v-if="Starting" v-on:click="stopRcording"></div>
    <div class="begin_btn_stop" v-if="Stop"></div>
    <div class="words">
      <div v-if="Starting">
        <span class="hand"></span>
        <span class="tips">点击停止录音</span>
      </div>
      <div v-if="Begin">
        <span class="hand"></span>
        <span class="tips">点击开始录音</span>
      </div>
    </div>
    <div class="save_btn"></div>
    <div class="confirm" style="padding-top: 0">
      <div class="other">
        <div class="other_btn"  v-if="Stop">
          <p class="audition" v-on:click="testPlay">
            <span style="margin-left: 70px">试听</span>
            <span class="bigin_audio red_audio" v-bind:class="{audioing:audioing}"></span>
          </p>
          <p class="again" v-on:click="restart">重新录制</p>

        </div>
      </div>
      <!--<p style="font-size: 12px">{{serverId}}</p>-->
      <div class="confirm_btn"  v-bind:class="{create:Stop}" v-on:click="created">确认生成</div>
    </div>
    <div class="bg_window" v-if="showLoading"></div>
    <div class="showLoading" v-if="showLoading">
      <div class="LoadingImg"><img src="../assets/loading.gif" width="100%" alt=""></div>
    </div>
    <div class="bg_window" v-if="showGray"></div>
    <div class="msgBox" v-if="showGray">
      <div class="Msg">{{Msg}}</div>
      <div class="closeMsg" v-on:click="closeMsg">关闭</div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    data () {
      return {
        Begin:true,
        Pulse:false,
        Starting:false,
        Stop:false,
        create:false,
        audioing:false,
        step:1,
        second:0,
        minute:0,
        timer : null,
        recordTimer:null,
        START:null,
        END:null,
        voiceId:null,
        typeId:this.$route.query.typeId,
        lang:null,//录音时长,
        serverId:0,
        showLoading:false,
        showGray:false,
        Msg:null,
    }
    },
    mounted(){
      this.second = this.p(this.second);
      //console.log(encodeURIComponent(location.href.split("#")[0]));
      axios.post("/weixin/share/",$.param({all_url:encodeURIComponent(location.href.split("#")[0]),origin: 'wxqy'})).then(
        function (respond) {
          if (respond.status == 200){
            //console.log(respond)
            wx.config({
              debug: false,
              appId: respond.data.data.appId,
              timestamp: respond.data.data.timestamp,
              nonceStr: respond.data.data.nonceStr,
              signature: respond.data.data.signature,
              jsApiList: [
                // 所有要调用的 API 都要加到这个列表中
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'uploadVoice',//上传录音
                'stopRecord',//停止录音
                'startRecord',//开始录音
                'playVoice',//播放录音
                'stopVoice',//暂停播放录音
                'downloadVoice'//下载录音
              ]
            });
          }
        }
      ).catch(function(err){
        console.log(err);
      });
    },
    methods:{
      record:function () { //开始录音
        var _this = this;
        axios.get('/record/userIsApproved')
          .then(function(response){
            if (response.data.status == 200){
              _this.Pulse = true;
              setTimeout(function () {
                _this.Begin = false;
                _this.Starting = true;
              },500)
              _this.beginRecord();
            }
            else {
              _this.showGray = true;
              _this.Msg = "录音只有一次机会哦！";

            }

          })
          .catch(function(err){
            console.log(err);
          });
      },
      stopRcording:function () {//停止录音
        this.Starting = false;
        this.$nextTick(function () {
          this.Stop = true;
          this.stop();
          this.stopRecord();
        });

      },
      start : function () {
        clearInterval(this.timer);
        var _this = this;
        if (_this.minute == 1){
          _this.minute = 0;
        }
        this.timer = setInterval(function() {
          _this.second = parseInt(_this.second) + 1;
          if (_this.second >= 59) {
//            _this.second = 0;
//            _this.minute = 1;
            _this.Begin = false;
            _this.stopRcording();
          }
          if (_this.second < 10) {
            _this.second = _this.p(_this.second);
          }
        },1000)
      },
      stop : function ()//暂停
      {
        clearInterval(this.timer);
        this.timer = null;
      },
      restart: function () //重新开始
      {
        this.stop();
        this.stopPlay();
        this.second ='0' + 0;
        this.p(this.second);
        this.minute = 0;
        this.Begin = true;
        this.Pulse=false;
        this.Starting = false;
        this.Stop=false;
      },
      beginRecord:function () {
        //event.preventDefault();
        let _this = this;
        this.recordTimer = setTimeout(function(){
          wx.ready(function () {
            wx.startRecord({
              success: function(res){
                _this.start();
                _this.START = new Date().getTime();
                console.log(res)
                localStorage.rainAllowRecord = 'true';
              },
              cancel: function () {
                alert('同意访问麦克风才能参加活动哦!');
              }
            });
          })
        },500);
      },
      stopRecord:function () {//微信停止录音
        this.END = new Date().getTime();
        this.lang = (this.END-this.START)/1000;
        console.log(this.lang)
        var _this = this;
        if(this.lang  < 0.5){
          this.END  = 0;
          this.START = 0;
          alert("录音时长不能小于0.5秒哦!");
          //小于500ms，不录音
          clearTimeout(this.recordTimer);
          return;
        }else{
          wx.ready(function () {
            wx.stopRecord({
              success: function (res) {
                //console.log(res)
                _this.voiceId = res.localId;
              },
              fail: function (res) {
                console.log(JSON.stringify(res));
              }
            });
          })
        }
      },
      testPlay:function () {//试听
        var _this = this;
        if(this.audioing){
          this.stopPlay();
        }
        else {
          this.audioing=true;
          wx.ready(function () {
            wx.playVoice({
              localId: _this.voiceId // 需要播放的音频的本地ID
            });
          });
          clearInterval(this.timer);
          this.timer = setInterval(function() {
            _this.audioing=false;
          },(_this.lang)*1000)
        }

      },
      stopPlay:function () {
        var _this = this;
        _this.audioing = false;
        wx.ready(function () {
          wx.stopVoice({
            localId: _this.voiceId // 需要停止的音频的本地ID
          });
        });
      },
      created : function () {//生成录音
        if (this.Stop){
          //this.stopRcording();
          this.uploadVoice();
        }
      },
      uploadVoice:function () {
        this.showLoading = true;
        var recordId = this.voiceId;
        var _this = this;
        this.stopPlay();
        wx.ready(function () {
          wx.uploadVoice({
            localId: recordId, // 需要上传的音频的本地ID
            isShowProgressTips: 1, // 默认为1
            // ，显示进度提示
            success: function (res) {
              var serverId = res.serverId;
              _this.serverId = serverId;
              //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                  axios.post("/record/dowloadVoice",$.param({
                    mediaid:serverId,//录音id
                    record_type:_this.typeId,//录音类型
                    record_duration:_this.lang//录音时长
                  })).then(
                    function (respond) {
                      if (respond.data.status == 200){
                        //alert("后台传回的:"+respond.data.data);
                        _this.$router.push({path:'/share'})
                      }
                      else {
                        _this.showLoading = false;
                        _this.showGray = true;
                        _this.Msg = "上传失败，请重试！";
                      }
                    }
                  ).catch(function(err){
                    _this.showLoading = false;
                    _this.showGray = true;
                    _this.Msg = "上传失败，请重试！";
                  });
            }
          });
        })
      },
      p : function (s) {
        return s < 10 ? '0' + s: s;
      },
      closeMsg: function () {
        this.showGray = false;
      },
    },

    components : {},
  }
</script>

<style>
  .wrap .pulse {
    animation-duration: 0.5s;
    animation-fill-mode: both;
  }
  .showLoading{
    position: absolute;
    width: 100%;
    top: 550px;
    z-index: 99;
  }
  .LoadingImg{
    width: 80px;
    margin: 0 auto;
  }
  .wrap{
    height: 100%;
    background: url("../assets/Isay_bg.jpg") no-repeat;
    background-size: 100%;
  }
  h2{
    font-weight: normal;
  }
  h2.time{
    font-size: 65px;
    color: #ff5555;
    text-align: center;
    padding: 378px 0 50px 0;
  }
  .begin_btn{
    height:231px;
    background: url("../assets/begin.png") no-repeat;
    background-size: 100%;
    margin: 0 auto;
  }
  .begin_btn_starting{
    height:231px;
    background: url("../assets/stop.gif") no-repeat;
    background-size: 100%;
    margin: 0 auto;
  }
  .begin_btn_stop{
    height:231px;
    background: url("../assets/stop.png") no-repeat;
    background-size: 100%;
    margin: 0 auto;
  }
  .other{
    height:155px;
    width: 590px;
    margin: 0 auto;
  }
  .other_btn{

  }
  .other_btn p{
    height:58px;
    line-height: 60px;
    text-align: center;
    color: #ff5555;
    background: #fff;

    width: 198px;
    font-size: 30px;
    border: 1px solid #ff5555;
    border-radius: 8px;

  }
  .other_btn .audition{
    float: left;
  }
  .other_btn .audition span{
    display: inline-block;
    float: left;
  }
  .other_btn .audition .red_audio{
    margin-top: 20px;
    margin-left: 5px;
    background: url("../assets/play_04.png") no-repeat;
    background-size: 84%;
    background-position: 3px 0;

  }
  .other_btn .audition .audioing{
    background: url("../assets/playing_r.gif") no-repeat;
    background-size: 80%;
    background-position: 1px 0px;
  }
  .other_btn .again{
    float: right;
  }
  .words{
    padding-top: 30px;
    font-size: 30px;
    text-align: center;
    color: #ff5555;
    margin-bottom: 30px;
    height:80px;
  }
  .words div{
    width: 225px;
    margin: 0 auto;
  }
  .words span{
    display: inline-block;
    float: left;
  }
  .words span.hand{

    width: 31px;
    height:39px;
    margin-right: 10px;
    background: url("../assets/hand.png") no-repeat;
    background-size: 100%;
  }
  .confirm .confirm_btn{
    background-color: #ff9e9c;
  }
  .confirm .create{
    background-color: #ff5555;
  }
</style>
