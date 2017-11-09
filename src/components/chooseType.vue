<template lang="html">
  <div class="main">
    <div class="typeList">
      <ul>
        <li v-for="items in type">
          <div class="list_top">
            <span class="choose" v-bind:class="{choosed:items.isActive}" v-on:click="choose(items,type)"></span>
            <span class="type_title">{{items.name}}</span>
            <span class="arrow" v-bind:class="{more:items.isMore}" v-on:click="toggle(items,type)">
                听听大家怎么说 <i></i></span>
          </div>
          <div class="voice_list" style="height: 590px" v-if="items.isMore" v-bind:class="{listDown:items.isMore}">
            <ul class="say_list">
              <li class="" v-for="(record,index) in items.child.record">
                <p class="photo"><img :src="record.headimgurl" ></p>
                <div class="say_center">
                  <p class="say_type">{{record.nickname}} {{record.record_title}}</p>
                  <p class="say_audio">
                    <span class="say_audio_l"></span>
                    <span class="say_audio_r" :data="record.id"
                          v-bind:style="{width:record.record_duration/60*300+'px'}"
                          v-on:click="player(index, record,items.child.record, type,$event)">
                       <span class="bigin_audio"  v-bind:class="{audioing:record.Record}" ></span>
                    </span>
                    <span class="record_duration">{{record.record_duration}}”</span>
                    <audio  :src="record.record_url"></audio>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </li>

      </ul>
    </div>
    <div class="confirm">
      <div class="confirm_btn" v-bind:class="{promise:isChoose} " v-on:click="goSay">确定</div>
    </div>
    <!--<div class="bottom"></div>-->
  </div>
</template>
<script>
  import axios from 'axios';
  export default{
    data () {
      return {
        isChoose:false,
        isMore:false,
        typeId:null,
        timer:null,
        type:[
          { name:"致家人",
            isActive : 0,
            id:1,
            isMore:0,
            child: {}
          },
          { name:"致爱人",
            isActive : 0,
            id:2,
            isMore:0,
            child: {}
          },
          { name:"致友人",
            isActive : 0,
            id:3,
            isMore:0,
            child: {}
          },
          { name:"致全世界",
            isActive : 0,
            id:4,
            isMore:0,
            child: {}
          }
        ],
        recordList:[]
      }
    },
    mounted() {
      var _this = this;
      axios.get('/record/recordCategory')
        .then(function(response){
          if (response.data.status == 200){
            _this.recordList = response.data.data;
            for(var i = 1;i<=4;i++){
              _this.type[i-1].child = _this.recordList[i];
              //console.log(_this.recordList[i]);
            }
          }

        })
        .catch(function(err){
          console.log(err);
        });
    },
    methods:{
      choose:function (item,type) {
        for(let i in type){
          type[i].isActive = 0;
        }
        item.isActive = 1;
        this.isChoose = 1;
        this.typeId = item.id;
      },
      toggle:function (item,type) {
        if (item.isMore == 0){
          item.isMore = 1;
        }
        else {
          item.isMore = 0;
        }
      },
      goSay:function () {
        if (this.isChoose){
          this.$router.push({path: '/record',query:{typeId:this.typeId }})
        }
      },
      player:function (index, record,list,type,e) {
        let _id = event.target.getAttribute('data');
        for(var t = 0; t < type.length; t++){
           for (let i in type[t].child.record){

            if(type[t].child.record[i].id == _id) continue;

            type[t].child.record[i].Record=false;
          };
        }
        record.Record ? record.Record = false : record.Record=true;
        let Player = document.getElementsByTagName("audio");
        for (let i= 0;i<Player.length;i++){
          Player[i].pause();
        };
        if (record.Record){
          $(e.target).siblings("audio")[0].play();
          clearInterval(this.timer);
          this.timer = setInterval(function () {//
            record.Record = false;
          },record.record_duration*1000)
        }
        else {
          $(e.target).siblings("audio")[0].pause();
        }
      },
    },
    components: {}
  }
</script>
<style>
   .main{
     height: 100%;
     background: url("../assets/say_bg.jpg") repeat-y;
     overflow-y: scroll;
     background-size: 100%;
     font-size: 28px;
   }
   .bigin_audio{
     margin-top:15px;
   }
   .typeList li{
    border-bottom: 1px solid #ff5555;
   }
   .typeList li span{
     display: inline-block;
     float: left;
   }
   .choose{
     width:48px ;
     height:48px;
     margin-top: 14px;
     margin-right: 30px;
     background:url("../assets/type_defult.png") no-repeat;
     background-size: 100%;
   }
   .choosed{
     background:url("../assets/type_choose.png") no-repeat;
     background-size: 100%;
   }
   .listDown{
     animation:slideDowna 0.5s;
   }

   .typeList li .arrow{
     background-size: 100%;
     color: #999;
     float: right;
   }
   .typeList li .more{
     color: #ff5555;

   }
   .list_top{
     height:76px;
     line-height:76px;
     padding:0 30px;
   }
   .typeList .say_list li {
     border-bottom: 1px solid #e5e5e5;
   }
   .arrow i{
     display: inline-block;
     width: 22px;
     height: 12px;
     background:url("../assets/arrow_b.png") no-repeat;
     background-size: 100%;
   }
   .more i{
     background:url("../assets/arrow_t.png") no-repeat;
     background-size: 100%;
   }
  .voice_list{
    overflow: scroll;
  }
  .confirm{
    height:210px;
    padding-top: 80px;
  }
   .main .confirm .promise {
     background-color: #ff5555;
   }
   .typeList .say_list{
     background: #fff;
     width: auto;
     padding: 0 30px;
   }
  .confirm_btn{
    width: 260px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    background: #ff5555;
    border-radius: 6px;
    margin: 0 auto;
    box-shadow: 0 0 4px 3px #f7b8b3;
  }
  .bottom{
    position: absolute;
    bottom: 26px;
    background:url("../assets/bottom.png") no-repeat;
    background-size: 100%;
    height: 24px;
    width: 100%;
    z-index: 1;
  }
</style>
