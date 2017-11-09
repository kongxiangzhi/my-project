<template lang="html">
  <div class="main" style="height: 100%;overflow:hidden;">
    <div class="shareTop">
      <div class="userTop">
        <p class="photo fl"><img :src="headUrl"></p>
        <div class="say_center fl">
          <p class="say_type">{{nickname}}{{title}}</p>
          <p class="redS"><img src="../assets/success.png" alt="a">保存成功</p>
        </div>
      </div>
      <div class="shareBtn" v-on:click="shareTip">分享我的录音</div>
    </div>
    <div class="shareCen">
      <h2>您是第 <span>{{rank}}</span> 名成功参与者</h2>
      <p>
        1.	您已经成功保存了想说的话，记得让好友来支持一下！得票数前十名的用户将有惊喜大奖哦！
      </p>
      <p>
        2.	此活动截止时间：2017年x月x日xx点，获奖用户及兑奖方法将在xx月xx日在轻艺公众号公示
      </p>
    </div>
    <div class="bg_window" v-if="showGray" v-on:click="closeTip"></div>
    <div class="shareTips" v-if="showGray" v-on:click="closeTip"><img src="../assets/shareTip.png" alt="" width="80%"></div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    data () {
      return {
        headUrl:null,
        nickname:null,
        title:null,
        rank:null,
        shareUrl:null,
        showGray:false,
      }
    },
    mounted(){
      var _this = this;
      axios.get('/record/userRank')
        .then(function(response){
          if (response.status == 200){

            let data = response.data.data;
            _this.headUrl = data.headimgurl;
            _this.nickname = data.nickname;
            _this.rank = data.record_sequence;
            _this.shareUrl =axios.defaults.baseURL+"/index.html#/detail?unionid="+data.unionid;
            if(data.record_type==1){
              _this.title = "致亲人";
            }
            else if(data.record_type==2){
              _this.title = "致爱人";
            }
            else if(data.record_type==3){
              _this.title = "致友人";
            }
            else if(data.record_type==4){
              _this.title = "致全世界";
            }
            console.log(axios.defaults.baseURL+"/resources/images/shareImg.jpg");
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: _this.nickname+"：在我生命的最后一分钟，我想对你说……", // 分享标题
                link: _this.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl:axios.defaults.baseURL+"/resources/images/shareImg.jpg", // 分享图标
                success: function () {
                  // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                }
              });
              wx.onMenuShareAppMessage({
                title: _this.nickname+"：在我生命的最后一分钟，我想对你说…… ", // 分享标题
                desc: "如果现在已经是我生命中的最后一分钟，猜猜我想对你说什么，快来听，你肯定猜不到！", // 分享描述
                link: _this.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
      shareTip:function () {
        this.showGray=true;
      },
      closeTip:function () {
        this.showGray=false;
      }
    }
  }
</script>
<style>
  .redS{
    font-size: 28px;
    color: #ff5555;
    vertical-align: middle;
    margin-top: 10px;
  }
  .shareTop .userTop{
    height: 160px;
  }
  .fl{
    float: left;
  }
  .shareTop .say_center p{
    clear: both;
    width: 100%;
  }
  .shareTips{
    position: absolute;
    top: 50px;
    width: 100%;
    text-align: center;
    z-index: 999;
  }
  .shareTips img{
    display: inline-block;
  }
  .shareCen h2{
    font-size: 40px;
    color: #fff;
    padding: 100px 85px 80px;
  }
  .shareCen p{
    font-size: 26px;
    color: #fff;
    padding:0 70px 45px 80px;
    line-height: 35px;
  }
  .shareCen h2 span{
    font-size: 60px;
  }
  .shareTop{
    padding: 30px;

  }
  .shareTop .say_type{
    font-size: 28px;
    padding-top: 10px;
  }
  .shareBtn{
    width: 178px;
    height:36px;
    line-height: 36px;
    text-align: center;
    font-size: 24px;
    border: 1px solid #ff5555;
    border-radius: 20px;
    color: #ff5555;
    float: right;
  }
  .shareCen{
    height:995px;
    margin-top: 40px;
    background: url("../assets/share.png") no-repeat;
    background-size: 100%;
  }
</style>
