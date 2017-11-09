<template lang="html">
  <div class="main">
    <div v-if="recordInfo.status == 1">
      <div class="detailTop">
          <div class="say_list" style="overflow: visible">
              <div class="userLeft fl" >
                <p class="photo"><img :src="recordInfo.headimgurl"></p>
                <p>{{recordInfo.nickname}}</p>
              </div>
              <div class="say_center fl">
                <p class="say_type">{{recordTitle}}
                  <span style="color: #999">:如果我的生命只剩下最后一秒钟，我想对你说</span>
                </p>
                <p class="say_audio">
                  <span class="say_audio_l"></span>
                  <span class="say_audio_r"
                        v-bind:style="{width:recordInfo.record_duration/60*300+'px'}"
                        v-on:click="player()">
                    <span class="bigin_audio" v-bind:class="{audioing:Record}"></span>
                  </span>
                  <span class="record_duration">{{recordInfo.record_duration}}”</span>
                  <audio id="userRcord" :src="recordInfo.record_url"></audio>
                </p>
              </div>
          </div>
          <div class="say_right">
            <p class="grey" v-bind:class="{active:recordInfo.is_praise,bigger:recordInfo.is_praise}" v-on:click="praise">
              <span class="red" v-if="Bigger">+1</span>
            </p>
            <p class="zanNum" style="margin:8px 0 0 8px"><span class="red">{{recordInfo.virtual_num}}</span>人支持</p>
            <p class="jub" v-on:click="showReport" v-bind:class="{red:reported}">举报</p>
          </div>
      </div>
      <div class="btn_form">
        <div class="confirm_btn" style="width: 400px;margin-top: 75px" v-on:click="goChoice(url02)">我也要说</div>

        <div class="red marT30 goMore" v-on:click="goChoice(url01)">更多>></div>
      </div>
      <div class="typeBg" v-if="Type==1"><img src="../assets/toFamily.png" alt=""></div>
      <div class="typeBg" v-if="Type==2"><img src="../assets/toLover.png" alt=""></div>
      <div class="typeBg" v-if="Type==3"><img src="../assets/toFrend.png" alt=""></div>
      <div class="typeBg" v-if="Type==4"><img src="../assets/toWorld.png" alt=""></div>
      <div class="jubBox" v-bind:class="{slideUp:!report}" style="z-index: 9">
        <p v-for="items in list" v-on:click="reports(items)" >
          <span v-bind:class="{actived:items.acitive}">{{items.name}}</span>
          <span class="mark" v-if="items.acitive"></span>
        </p>
      </div>
    </div>
    <div  v-if="recordInfo.status == 2">
      <div class="detailTop">
        <div class="say_list">
          <div class="userLeft fl">
            <p class="photo"><img :src="recordInfo.headimgurl"></p>
          </div>
          <div class="say_center fl">
            <p class="say_type" style="margin-top:66px;font-weight: bold">{{recordInfo.record_title}}</p>
          </div>
        </div>
        <div class="remove">
          <p class="cat"><img src="../assets/cat.png" alt=""></p>
          <p>由于您上传的内容涉嫌违法信息，已被删除！</p>
          <router-link :to="{path:'/recommend'}">
            <div class="confirm_btn" style="width: 400px;margin-top: 75px">返回首页</div>
          </router-link>
        </div>
      </div>
      <div></div>
    </div>
    <div class="bg_window" v-if="!report"  v-on:click="closeReport"></div>
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
    <div class="bottom"></div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    data () {
      return {
        praiseNum:null,
        report:true,
        Record:false,
        reported:false,
        acitive:false,
        isActive:false,
        Bigger:false,
        Type:null,
        recordTitle:null,
        Msg:null,
        url01:"runkList",
        url02:"chooseType",
        userId:this.$route.query.unionid,
        recordId:null,
        recordInfo:[],
        showRule:false,
        showGray:false,
        timer:null,
        list:[
          {
            name:"低俗内容",
            type:1,
            acitive:false,
          },
          {
            name:"违法信息",
            type:1,
            acitive:false,
          },
          {
            name:"不实信息",
            type:1,
            acitive:false,
          },{
            name:"冒充他人",
            type:1,
            acitive:false,
          },

        ]
      }
    },
    mounted(){
      var _this = this;
      axios.get('/record/userRank',{params:{unionid:_this.userId}})
        .then(function (response) {
          if (response.status == 200) {
            _this.recordInfo = response.data.data;
            _this.Type = _this.recordInfo.record_type;
            _this.recordId = _this.recordInfo.id;
            if(_this.recordInfo.is_praise == 2){
              _this.recordInfo.is_praise = false;
            }
            if (_this.recordInfo.is_praise == 1){
              _this.recordInfo.is_praise = true;
            }
            if(_this.Type==1){
              _this.recordTitle = "致我的家人";
            }
            else if(_this.Type==2){
              _this.recordTitle = "致我的爱人";
            }
            else if(_this.Type==3){
              _this.recordTitle = "致我的朋友";
            }
            else if(_this.Type==4){
              _this.recordTitle = "致全世界";
            }
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: "【想说不要等！】说出你想说的话还能赢5000元大奖！", // 分享标题
                link: axios.defaults.baseURL+"/index.html#/detail?unionid="+_this.userId, // 分享链接
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
                link: axios.defaults.baseURL+"/index.html#/detail?unionid="+_this.userId, // 分享链接
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
        .catch(function (err) {
          console.log(err);
        });
      //分享接口
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
    methods:{
      praise: function () {
        var _this = this;
        if (_this.recordInfo.is_praise){
          return;
        }
        else {
          axios.post('/record/isLogin').then(//判断登录
            function (respond) {
              if (respond.data.status == 200){
                axios.post('/record/isSubscribe').then(//判断关注
                  function(response){
                    if (response.data.status == 200){
                        console.log(_this.recordInfo.id);
                      axios.get('/record/recordPraise',
                        {params:{record_id:_this.recordInfo.id}})
                        .then(function(response){
                          if (response.data.status == 200){
                            _this.recordInfo.is_praise = true;
                            _this.recordInfo.virtual_num += 1;
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
                var _url=encodeURIComponent(window.location.href);
                window.location.href=axios.defaults.baseURL+"/record/sayLogin?returnurl="+_url;
              }
            }
          ).catch(function(err){
            console.log(err);
          });
        }
      },
      showReport: function () {
        let _this = this;
        if (this.report && !this.reported){
          axios.post('/record/isLogin').then(//判断登录
            function (respond) {
              if (respond.data.status == 200){
                axios.post('/record/isSubscribe').then(//判断关注
                  function(response){
                    if (response.data.status == 200){
                      _this.report=false;
                    }
                    else{//未关注
                      _this.showRule = true;
                    }
                  })
                  .catch(function(err){
                    console.log(err);
                  });
              }
              if(respond.data.status == 202){//未登录
                var _url=encodeURIComponent(window.location.href);
                //alert(_url);
                window.location.href=axios.defaults.baseURL+"/record/sayLogin?returnurl="+_url+"&luyin=1";
              }
            }
          ).catch(function(err){
            console.log(err);
          });
        }
      },
      reports:function (item) {
        let _this = this;
        axios.get('/record/recordInform',{params:{record_id:_this.recordId }})
          .then(function (response) {
            if (response.data.status == 200) {
              item.acitive=1;
              _this.reported=1;
              setTimeout(function () {
                _this.report=1;
              },500)
            }
            else if(response.data.status == 201 ){//举报达上限
              _this.showGray = true;
              _this.Msg = "您好，您举报的次数已达上限！";
              _this.report=1;
            }
          })
          .catch(function (err) {
            console.log(err);
          });

      },
      goChoice:function (local) {
        var _this = this;
        axios.post('/record/isLogin').then(//判断登录
          function (respond) {
            if (respond.data.status == 200){
             // console.log(respond);
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
                            _this.Msg = "您已被他人举报，不允许录音！";
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
      player:function () {
        this.Record ? this.Record = false : this.Record=true;
        let Player = document.getElementsByTagName("audio");
        for (let i= 0;i<Player.length;i++){
          Player[i].pause();
        };
        let that = this;
        if (this.Record){
          clearInterval(this.timer);
          $("#userRcord")[0].play();
          this.timer = setInterval(function () {//
            that.Record = false;
          },that.recordInfo.record_duration*1000)
        }
        else {
          $("#userRcord")[0].pause();
        }
      },
      closeMsg: function () {
        this.showGray = false;
      },
      gray: function () {
        this.showRule = false;
      },
      closeReport:function () {
        this.report=1;
      }
    },
    components: {},
  }
 </script>
<style>
  .typeBg{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
.goMore{
  height: 60px;
  line-height: 60px;
  width:160px;
  text-align: center;
  margin: 20px auto 0;
  cursor: pointer;
  position: relative;

}
  .goMore:after{
    position: absolute;
    left: -10px;
    top: -10px;
    bottom: -10px;
    right: -10px;
    content: '';
  }
  .typeBg img{
    width: 100%;
  }
  .detailTop .say_right p.red{
    color: #ff5555;
  }
  .detailTop{
    padding-top: 30px;
  }
  .detailTop .bigin_audio{
    background: url("../assets/play_04.png") no-repeat center left;
  }
  .detailTop .say_audio_l{
    background: url("../assets/say_bgk_l.png") no-repeat;
    background-size: 100%;
  }
  .detailTop .say_audio_r {
    background: none;
    height: 54px;
    border: 3px solid #ff5555;
    border-left: 0;
  }
  .detailTop .userLeft{
    width: 140px;
  }
  .main .detailTop .audioing{
    background: url("../assets/playing_r.gif") no-repeat;
    background-size: 80%;
    background-position: 0 -2px;
    animation: none;
  }
  .detailTop .say_list{
    height:180px;
  }
  .detailTop .fl{
    float: left;
  }
  .detailTop .say_center{
    width: 460px;
    margin-left: 50px;
  }
  .detailTop .say_type{
    height: 100px;
    line-height: 50px;
  }
  .detailTop .say_right{
    height: 50px;
    padding-left: 283px;
    position: relative;
    width: auto;
    margin-top: 20px;
  }
  .detailTop .say_right p{
    float: left;
    color: #999999;
  }
  .detailTop .say_right .grey{
    position: absolute;
    left: 240px;
  }
  .jub{
    font-size: 24px;
    color: #999;
    margin: 8px 0 0 250px;
  }
  .btn_form {
    text-align: center;
  }
  .mark{
    display: inline-block;
    float: right;
    width: 36px;
    height: 25px;
    background: url("../assets/choosed.jpg") no-repeat;
    background-size: 100%;
    margin: 35px;
  }
  .jubBox{
    height: 320px;
    width: 100%;
    background: #fff;
    position: absolute;
    bottom: 0;
    box-shadow: 0 0 4px 1px #d4d4d4;
    color: #666;
    position: absolute;
    opacity: 0;
    z-index: 99;
  }
  .jubBox p{
    height: 79px;
    line-height: 79px;
    border-bottom: 1px solid #666;
    text-indent: 30px;
    font-size: 30px;
  }
  .slideUp{
    opacity: 1;
    animation:slideup 0.5s;
  }
  @keyframes slideup {
    from{
      bottom: -320px;
      opacity: 0;
    }
    to{
      bottom: 0px;
      opacity: 1;
    }
  }
  .slideDown{
    opacity: 1;
    animation:slideDown 0.5s;
  }
  @keyframes slideDown {
    from{
      bottom: 0px;
      opacity: 0;
    }
    to{
      bottom: -320px;
      opacity: 1;
    }
  }
  .bigger{
    opacity: 1;
    animation:big 0.3s;
    top: 0;
  }
  @keyframes big {
    from{
      width: 36px;
      height: 37px;
      top: 0;
    }
    to{
      width: 46px;
      height: 47px;
      top: -10px;
    }
  }
  .grey span{
    opacity: 0;
    animation:movetop 0.3s;
    font-size: 14px;
    top: -10px;
    left: 30px;
    position: absolute;
  }
  @keyframes movetop {
    from{
      font-size: 14px;
      opacity: 0.5;
      top: -10px;
    }
    to{
      font-size: 24px;
      opacity: 1;
      top: -40px;
    }
  }
  .actived{
    color: #ff5555;
  }
  .remove{
    text-align: center;
    font-size: 28px;
    color: #666;
  }
  .cat{
    width: 214px;
    height:196px;
    margin: 145px auto 45px;
  }
  .cat img{width: 100%}
</style>
