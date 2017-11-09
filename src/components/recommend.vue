<template>
  <div class="main" style="background: none;">
    <div class="words_03">
      <p class="arrow_t" v-on:click="slideup"></p>
    </div>
    <div class="hotTit">热门推荐</div>
    <div class="say_list_box">
      <ul class="say_list">
        <li class="" v-for="(record,index) in recordList">
          <p class="photo"><img :src="record.headimgurl" ></p>
          <div class="say_center">
            <p class="say_type">{{record.nickname}} {{record.record_title}}</p>
            <p class="say_audio">
              <span class="say_audio_l"></span>
              <span class="say_audio_r"
                    v-bind:style="{width:record.record_duration/60*268+'px'}"
                    v-on:click="player(index, record,recordList)">
                <span class="bigin_audio" v-bind:class="{audioing:record.Record}"></span>
              </span>
              <span class="record_duration">{{record.record_duration}}”</span>
              <audio :src="record.record_url"></audio>
            </p>
          </div>
          <div class="say_right">
            <div class="zanBox">
              <div class="zanMove">
                <p class="zan grey"
                   v-bind:class="{active:record.is_praise,bigger:record.is_praise}"
                   v-on:click="praise(record,recordList)">
                  <span class="red" v-if="record.is_praise">+1</span>
                </p>
              </div>
            </div>
            <p class="zanNum"><span class="red">{{record.virtual_num}}</span>人支持</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="say_btn_box">
      <div class="btn_list">
        <p class="more_btn"  v-on:click="goChoice(url01)">更多</p>
        <p class="say_btn" v-on:click="goChoice(url02)">我也要说</p>
      </div>
    </div>
    <div class="bg_window" v-if="showRule"></div>
    <div class="bg_window" v-if="showGray"></div>
    <div class="msgBox" v-if="showGray">
      <div class="Msg">{{Msg}}</div>
      <div class="closeMsg" v-on:click="closeMsg">关闭</div>
    </div>
    <div class="rule" v-if="showRule">
      <img src="../assets/rule.png" alt="">
      <div class="close" v-on:click="gray"></div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios';
  export default{
    data () {
      return {
        recordList:[],
        isActive:false,
        showRule:false,
        showGray:false,
        canPrice:false,
        showLoading:false,
        Msg:null,
        url01:"runkList",
        url02:"chooseType",
        timer:null
      }
    },
    mounted() {
      var _this = this;
      axios.get('/record/hotRecommend')
        .then(function(response){
          if (response.status == 200){
            _this.recordList = response.data.data;
            for(let i=0;i<_this.recordList.length;i++){
//              console.log(_this.recordList[i].is_praise);
              if(_this.recordList[i].is_praise == 2){
                _this.recordList[i].is_praise = false;
              }
              if (_this.recordList[i].is_praise == 1){
                _this.recordList[i].is_praise = true;
              }

            }
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: "【想说不要等！】说出你想说的话还能赢5000元大奖！", // 分享标题
                link: axios.defaults.baseURL+"/index.html#/recommend", // 分享链接
                imgUrl:axios.defaults.baseURL+"/resources/images/shareImg.jpg", // 分享图标
                success: function () {
                  // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                }
              });
              wx.onMenuShareAppMessage({
                title: "【想说不要等！】说出你想说的话还能赢5000元大奖！", // 分享标题
                desc: "生命的最后一分钟你想说什么？参与活动说出心里话，还能赢取多重好礼！", // 分享描述
                link: axios.defaults.baseURL+"/index.html#/recommend", // 分享链接
                imgUrl:axios.defaults.baseURL+"/resources/images/shareImg.jpg", // 分享图标
                success: function () {
                  // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                }
              });




            });
          }
        })
        .catch(function(err){
          console.log(err);
        });
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
              ]
            });
          }
        }
      ).catch(function(err){
        console.log(err);
      });
    },
    methods: {
      slideup: function () {
        $('.words_03').slideUp();
        $('.say_list_box').css('height', '1202px');
        //$(".say_btn_box").animate({height: "198px"});
      },
      stop : function ()//清空定时
      {
        clearInterval(this.timer);
        this.timer = null;
      },
      praise: function (record) {
        var _this = this;
        if (!record.is_praise){//判断是否点赞
          axios.post('/record/isLogin').then(//判断登录
            function (respond) {
              if (respond.data.status == 200){
                axios.post('/record/isSubscribe').then(//判断关注
                  function(response){
                    if (response.data.status == 200){
                      axios.get('/record/recordPraise',
                        {params:{record_id:record.id}})
                        .then(function(response){
                          if (response.data.status == 200){
                            record.is_praise = true;
                            record.virtual_num += 1;
                          }
                        })
                        .catch(function(err){
                          console.log(err);
                        });
                    }
                    else if(response.data.status == 201 ){//未关注
                      _this.showRule = true;
                    }
                  })
                  .catch(function(err){
                    console.log(err);
                  });
              }
              if(respond.data.status == 202){//未登录
                var _url=encodeURIComponent(axios.defaults.baseURL+"/index.html#/recommend");
                window.location.href="/record/sayLogin?returnurl="+_url;
              }
            }
          ).catch(function(err){
            console.log(err);
          });
        }

      },
      gray: function () {
        this.showRule = false;
      },
      closeMsg: function () {
        this.showGray = false;
      },
      player:function (index, record,list) {
        this.stop();
        //console.log(index);

        for (let i in list){
          console.log(i,index);
          if(i == index) continue;
          let player = document.getElementsByTagName("audio")[i];
          player.pause();

          list[i].Record=false;
        };
        record.Record ? record.Record = false : record.Record=true;
        let thisPlayer = document.getElementsByTagName("audio")[index];
        if(record.Record){
          thisPlayer.play();
          this.timer = setInterval(function () {//
            record.Record = false;
          },record.record_duration*1000)
        }
        else {
          thisPlayer.pause();
        }
//        if(record.Record){
//          record.Record=false;
//          console.log(record.Record);
//        }
      },
      goChoice:function (local) {
        var _this = this;
        axios.post('/record/isLogin').then(//判断登录
          function (respond) {
            if (respond.data.status == 200){
              console.log(respond);
              axios.post('/record/isSubscribe').then(//判断关注
                function(response){
                  if (response.data.status == 200){
                    if (local == "runkList"){
                      _this.$router.push({path:'/runkList'})
                    }
                    if (local == "chooseType"){
                      axios.get('/record/userIsApproved').then(//判断是否存在录音
                        function(response){
                          if (response.data.status == 200){
                              _this.$router.push({path:'/chooseType'})
                            }
                            else if(response.data.status == 201 ){//已录音
                              _this.showGray = true;
                              _this.Msg = "您好，每个用户仅可录音一次！";
                            }
                            else if (response.data.status == 203){//已被举报
                              _this.showGray = true;
                              _this.Msg = "您已被他人举报，不能参加录音！";
                            }
                          else if (response.data.status == 204){//已被
                            _this.showGray = true;
                            _this.Msg = "您的违规录音已被删除，不能参加录音！" ;
                          }
                          })
                          .catch(function(err){
                            console.log(err);
                          });
                        }
                      }
                  else if(response.data.status == 201 ){//未关注
                    _this.showRule = true;
                  }
                })
                .catch(function(err){
                  console.log(err);
                });
            }
            if(respond.data.status == 202){//未登录
              var _url=encodeURIComponent(axios.defaults.baseURL+"/index.html#/"+local);
              //alert(_url);
              window.location.href=axios.defaults.baseURL+"/record/sayLogin?returnurl="+_url+"&luyin=1";
            }
          }
        ).catch(function(err){
          console.log(err);
        });
      },
    }
  }

</script>
<style>
  .Msg{
    text-align: center;
    padding-top: 60px;
    font-size: 26px;
  }
  .closeMsg{
    width: 150px;
    height:50px;
    border: 1px solid #ff5555;
    text-align: center;
    font-size: 30px;
    color: #ff5555;
    line-height: 50px;
    margin:60px auto 0;
  }
  .msgBox{
    width: 500px;
    height:250px;
    background: #fff;
    position: absolute;
    top: 500px;
    left: 130px;
    z-index: 4;
  }
  .record_duration{
    font-size: 24px;
    color: #666;
    padding-left: 12px;
  }
  .say_audio{
    height: 60px;
    line-height: 65px;
  }
  .say_audio span{
    display: inline-block;
  }
  .say_audio_l{
    float: left;
    width: 35px;
    height: 60px;
    background: url("../assets/say_bg_l.png") no-repeat;
    background-size: 100%;
  }
  .say_audio .say_audio_r{
    min-width: 80px;@importent
  }
  .say_audio_r{
    float: left;
    background: #ff5555;
    border-radius: 0 30px 30px 0;
    height: 60px;
    width: 250px;
  }
  .bigin_audio{
    width: 18px;
    height: 28px;
    background: url("../assets/play_03.png") no-repeat center left;
    overflow: hidden;
    background-position: 2px 4px;
    background-size: 85%;
  }
  .main .audioing{
    background: url("../assets/playing_w.gif") no-repeat;
    background-size: 80%;
    background-position: 2px 4px;
  }
  .bg_window{
    background: rgba(0,0,0,.6);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 2;
  }
  .rule{
    width: 550px;
    height: 1040px;
    position: absolute;
    top: 65px;
    left: 99px;
    user-select:all;
    z-index: 9;
  }
  .rule img{
    width: 100%;
    user-select:all;
  }
  .close{
    width: 40px;
    height: 40px;
    margin-left:490px;
    margin-top: 20px;
    position: absolute;
    top: 0;
  }
  .words_03{
    width: 100%;
    height: 346px;
    position: relative;
    background: url("../assets/words03.jpg") no-repeat;
    background-size: 100%;

  }
  .arrow_t{
    width: 30px;
    height: 27px;
    background: url("../assets/arrow.png") no-repeat;
    background-size: 100%;
    position: absolute;
    right: 32px;
    bottom: 38px;
  }
  .hotTit{
    height:68px;
    line-height: 68px;
    width: 100%;
    background: #ff5555;
    color: #fff;
    font-size: 36px;
    text-indent: 30px;
  }
  .say_list_box{
    width: 100%;
    background: url("../assets/say_bg.jpg") no-repeat;
    background-size: 100%;
    height: 600px;
  }
  .say_btn_box{
    height:170px;
    width: 100%;
    background: url("../assets/btn_bg.jpg") no-repeat;
    background-size: 100%;
    font-size: 30px;
    padding-top:45px;
    position:fixed;
    bottom: -12px;
  }
  .say_list{
    width:690px;
    margin: 0 auto;
    height: 100%;
    overflow: scroll;


  }
  .say_list li{
    height:130px;
    padding: 28px 0;
    border-bottom: 1px solid #ff5555;
    display: flex;
  }
  .photo{
    height: 130px;
    width: 130px;
    border-radius: 70px;
    overflow: hidden;
    margin-right: 30px;
  }
  .photo img{
    width: 100%;
  }
  .say_center{
    width: 360px;
    overflow: hidden;
    height:100%;
  }
  .say_type{
    color: #111;
    font-size: 28px;
    margin-top: 14px;
    height: 52px;
  }
  .red{
    color: #ff5555;
  }
  .zanBox{
    padding-top: 70px;
    height:40px;
  }
  .zanMove{
    position: relative;
    width: 36px;height: 37px;
    float: right;
  }
  .zan{
    height:42px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .zanNum{float: right;margin-top:2px; }
  .grey{background: url("../assets/zan.png") no-repeat;background-size: 100%;width: 36px;height: 37px;}
  .active{background: url("../assets/zaned.png") no-repeat;background-size: 100%;}
  .say_right{
    font-size: 24px;
    color: #666;
    width: 160px;
  }
  .btn_list{
    height: 60px;
    width: 560px;
    margin: 0 auto;
    text-align: center;
  }
  .more_btn{
    float: left;
    width: 258px;
    height: 58px;
    line-height: 60px;
    border: 1px solid #ff5555;
    border-radius: 5px;
    color: #ff5555;
  }
  .say_btn{
    float: left;
    width: 260px;
    height: 60px;
    line-height: 60px;
    background: #ff5555;
    border-radius: 5px;
    color: #fff;
    margin-left: 40px;
    box-shadow: 0 0 4px 2px #fecfce;
  }
</style>
