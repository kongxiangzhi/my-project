<template lang="html">
  <div class="box">

    <div class="clock"><img src="../assets/clock.gif" alt=""></div>
    <div class="words_01">
      <p class="say swing animated" ></p>
    </div>
    <div class="Man"><img src="../assets/man.png" alt=""></div>
    <div class="women"><img src="../assets/women.png" alt=""></div>
  </div>
</template>
<script>
  //import router from './router';
  import axios from 'axios';
  export default{
    name:'box',
    data () {
      return {
        backMusic:true,
        message01:'',
        text2:'',
        seen:true,
        contont:0,
        isActive:false
      }
    },
    mounted(){
      var _this = this;
      axios.post('/record/isLogin').then(//判断登录
        function (respond) {
          if (respond.data.status == 200){
            setTimeout(function () {
              _this.$router.push({path:'/recommend'})
            },2000)
          }
          if(respond.data.status == 202){//未登录
            var _url=encodeURIComponent(axios.defaults.baseURL+"/index.html#/recommend");
            setTimeout(function () {
              window.location.href=axios.defaults.baseURL+"/record/sayLogin?returnurl="+_url+"&luyin=1";
            },2000)
          }
        }
      ).catch(function(err){
        console.log(err);
      });

    },
    methods:{
      backPlay:function () {
        var player = document.getElementById("back");
        if(!this.backMusic){
          this.backMusic=true;
          player.play();
        }
        else {
          this.backMusic=false;
          player.pause();
        }
      }
    }
  }

</script>
<style>
  html, body{margin: 0; height:100%; }
  .box{
    height:100%;
    background: url("../assets/bg_01.gif") no-repeat;
    background-size: 100%;
    border-top: 1px solid rgba(255,255,255,1);
    overflow: hidden;
    position: relative;
  }
  .words_01{
    height:557px;
    background: url("../assets/words01.png") no-repeat;
    background-size: 100%;
    position: relative;

  }
  .say{
    width: 324px;
    height: 99px;
    background: url("../assets/words02.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top: 490px;
    left: 280px;

  }
  .clock{
    position: absolute;
    width: 176px;
    height:205px;
    top: 261px;
    left: 321px;
  }
  .clock img{
    width: 100%;
  }
  .Man{
    width: 350px;
    height:660px;
    position: absolute;
    left:0;
    animation:moveDown 2s;
  }
  .women{
    width: 280px;
    height:510px;
    bottom:0px;
    right: 0;
    position: absolute;
    animation:goTop 2s;
    /*transition: all 2s ease-in-out;
    transform: translate(0,-50px);*/
  }

  .box img{
    width: 100%;
  }
</style>
