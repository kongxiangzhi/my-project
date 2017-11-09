<template lang="html">
  <div class="main">
    <p class="hei30"></p>
    <div class="userInfo">
      <div class="userTop">
        <p class="photo"><img :src="userInfo.headimgurl" ></p>
        <div  v-if="!userLogined">
          <div class="Isay" v-on:click="toRecord">我也要说</div>
        </div>
        <div   v-if="userLogined">
          <div class="Isay" v-if="userInfo.is_record == 2" v-on:click="toRecord">我也要说</div>
          <div class="say_center" v-if="userInfo.is_record == 1">
            <p class="say_audio mar_t40" v-if="userInfo.status==1">
              <span class="say_audio_l"></span>
              <span class="say_audio_r"
                    v-bind:style="{width:userInfo.record_duration/60*268+'px'}"
                    v-on:click="playerSelf">
                <span class="bigin_audio fl"   v-bind:class="{audioing:Record}" ></span>
                <span style="color: #fff" class="fl">点击听一听</span>
              </span>
              <span class="record_duration">{{userInfo.record_duration}}”</span>
              <audio id="myRecord" :src="userInfo.record_url"></audio>
            </p>
            <p class="say_audio mar_t40" v-if="userInfo.status==2 && userInfo.is_approved==2 ">
                <span style="display: inline-block">你上传的录音属于非法内容！</span>
            </p>
            <p class="say_audio mar_t40" v-if="userInfo.status==2 && userInfo.is_approved==1 ">
                <span class="Isay" style="display: inline-block"  v-on:click="toRecord">我也要说</span>
            </p>
          </div>
        </div>
      </div>
      <div class="userCenter">
        <ul>
          <li>
            <p class="fl">昵称</p><p class="fr" style="color: #666">{{userInfo.nickname}}</p>
          </li>
          <li>
            <p class="fl">得票数(张)</p>

            <p class="fr red" v-if="userInfo.status==2">--</p>
            <p class="fr red" v-else>{{userInfo.virtual_num}}</p>
          </li>
          <li style="border: none">
            <p class="fl">现在排名(位)</p>
            <p class="fr red" v-if="userInfo.status==2">--</p>
            <p class="fr red" v-else>{{userInfo.record_ranking}}</p>

          </li>
        </ul>
      </div>
    </div>
    <div class="runklist">
      <div class="runkTop"></div>
      <div class="list" v-bind:class=" {rankMore:more}">
        <table>
          <tr style="color: #999">
            <td style="width:110px">名次</td>
            <td style="width:245px">昵称</td>
            <td style="width:245px">票数</td>
            <td style="width:85px"></td>
          </tr>
          <tr v-for="(list,index) in runkList">
            <td>{{list.rank}}</td>
            <td class="red" v-on:click="toDetail(list)">
              {{list.nickname}}</td>
            <td>{{list.virtual_num}}</td>
            <td>
              <span class="audioImg" v-bind:class="{audioing:list.Record}" v-on:click="player($event,runkList,list,index)"></span>
              <audio :src="list.record_url"></audio>
            </td>
          </tr>
        </table>
      </div>
      <div class="toggle_btn" v-on:click="showMore">
        <p v-if="!more">展开<span class="arrow_b"></span></p>
        <p v-if="more">收起<span class="Arrow_t"></span></p>
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
  import axios from 'axios'
  export default{
    data () {
      return {
        more:false,
        runkList:[],
        userInfo:[],
        Record:false,
        userLogined:false,
        showRule:false,
        showGray:false,
        Msg:null,
        timer:null
      }
    },
    mounted() {
      var _this = this;
      axios.get('/record/userRank')
        .then(function(response){
          if (response.data.status == 200){
            _this.userLogined = true;
            _this.userInfo = response.data.data;
            console.log(_this.userInfo);
          }
          else {
            _this.userInfo.headimgurl = "../assert/photo.png";
            _this.userInfo.nickname = "--";
            _this.userInfo.praise_num = 0;
            _this.userInfo.record_ranking = 0;

          }
        })
        .catch(function(err){
          console.log(err);
        });
      axios.get('/record/recordRank')
        .then(function(response){
          if (response.data.status == 200){
            _this.runkList = response.data.data;
            //console.log(_this.runkList);
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
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: "【想说不要等！】说出你想说的话还能赢5000元大奖！", // 分享标题
                link: axios.defaults.baseURL+"/index.html#/runkList", // 分享链接
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
                link: axios.defaults.baseURL+"/index.html#/runkList", // 分享链接
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
        }
      ).catch(function(err){
        console.log(err);
      });
    },
    methods :{
      showMore:function () {
        this.more ? this.more = false : this.more=true;
      },
      playerSelf:function () {
        this.Record ? this.Record = false : this.Record=true;
        let Player = document.getElementsByTagName("audio");
        let that = this;
        for (let i= 0;i<Player.length;i++){
          Player[i].pause();
        };
        if(this.Record){
          clearInterval(this.timer);
          $("#myRecord")[0].play();
          this.timer = setInterval(function () {//
            that.Record = false;
          },that.userInfo.record_duration*1000)
        }
        else {
          $("#myRecord")[0].pause();
        }
      },
      player:function (e,runkList,list,index) {
        for (let i in runkList){
          //console.log(i,index);
          if(i == index) continue;
          runkList[i].Record=false;
        };
        list.Record ? list.Record = false : list.Record=true;

        let Player = document.getElementsByTagName("audio");
        for (let i= 0;i<Player.length;i++){
          Player[i].pause();
        };
        if (list.Record){
          clearInterval(this.timer);
          $(e.target).siblings("audio")[0].play();
          this.timer = setInterval(function () {//
            list.Record = false;
          },list.record_duration*1000)
        }
        else {
          $(e.target).siblings("audio")[0].pause();
        }

      },
      gray: function () {//关闭弹框
        this.showRule = false;
      },
      closeMsg: function () {
        this.showGray = false;
      },
      toRecord:function () {
        var _this = this;
        axios.post('/record/isLogin').then(//判断登录
          function (respond) {
            if (respond.data.status == 200){
              axios.post('/record/isSubscribe').then(//判断关注
                function(response){
                  if (response.data.status == 200){
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
                  else if(response.data.status == 201 ){//未关注
                    _this.showRule = true;
                  }
                })
                .catch(function(err){
                  console.log(err);
                });
            }
            if(respond.data.status == 201){//未登录
              var _url=encodeURIComponent(axios.defaults.baseURL+"/index.html#/chooseType");
              window.location.href=axios.defaults.baseURL+"/record/sayLogin?returnurl="+_url+"&luyin=1";
            }
          }
        ).catch(function(err){
          console.log(err);
        });
      },
      toDetail:function (list) {
        this.$router.push({path: '/detail',query:{unionid:list.unionid}})
      }
    }
  }
</script>
<style>
  .main .runklist .audioing{
    background: url("../assets/playing_r.gif") no-repeat;
    background-size: 53%;
    background-position: 0 -2px;
    animation: none;

  }
  .audioImg{
    width: 30px;
    height: 22px;
    background: url("../assets/lision.png") no-repeat;
    background-size: 100%;
    margin: 0 auto;
    display: inline-block;
  }
  .Isay{
    width: 264px;
    height: 60px;
    line-height: 60px;
    background: #ff5555;
    border-radius: 6px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    float: right;
    margin-top: 40px;
  }
  .hei30{
    height: 30px;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .red{
    color: #ff5555;
  }
  mar_t40{
    margin-top: 40px;
  }
  .main .rankMore{
    height: auto;
  }
  .userInfo{
    width: 630px;
    height:340px;
    padding: 30px;
    background: #fff;
    box-shadow: 0 0 30px 1px #d4d4d4;
    margin: 0 auto;
    border-radius: 6px;
  }
  .userInfo .say_audio{
    margin-top: 30px;
    line-height: 60px;
  }
  .userTop{
    height:130px;
    margin-bottom: 30px;
  }
  .userTop p{
    float: left;
    font-size: 24px;
  }
  .userTop p.say_vedio{
    margin: 30px;
    color: #fff;
    height: 62px;
    width: 300px;
    line-height: 62px;
    background: url("../assets/say_bg.png") no-repeat;
    background-size: 100%;
  }
  .lang{
    color: #ff5555;
    margin-top: 30px;
  }
  .userCenter li{
    height:70px;
    line-height: 70px;
    font-size: 30px;
    color: #999999;
    border-bottom: 1px solid #eee;
  }
  .runklist{
    height: auto;
    width: 690px;
    background: #fff;
    box-shadow: 0 0 30px 1px #d4d4d4;
    margin: 55px auto;
    border-radius: 6px;
    position: relative;
    min-height: 624px;
    padding-bottom: 40px;
  }
  .runkTop{
    width: 552px;
    height: 161px;
    background: url("../assets/runk_01.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top: -24px;
    left: 70px;
  }
  .list{
    padding-top: 150px;
    height: 300px;
    overflow: hidden;
    width: 100%;
    text-align: center;
  }
  .list table{
    width: 100%;
  }
  .list table td{
    height: 60px;
  }
  .list img{
    width: 30px;
  }
  .toggle_btn{
    width: 358px;
    height: 58px;
    color: #ff5555;
    line-height: 58px;
    text-align: center;
    border: 1px solid #ff5555;
    border-radius: 6px;
    margin: 30px auto;
    position: relative;
  }
  .arrow_b{
    display: inline-block;
    width: 23px;
    height: 12px;
    background: url("../assets/rarrow_t.png");
    background-size: 100%;
    position: absolute;
    top: 25px;
    left: 215px;
  }
  .Arrow_t{
    display: inline-block;
    width: 23px;
    height: 12px;
    background: url("../assets/arrow_t.png");
    background-size: 100%;
    position: absolute;
    top: 25px;
    left: 215px;
  }
</style>
