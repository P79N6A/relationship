<template>
    <div class="content">
      <div class="main-content">
        <router-view></router-view>
      </div>
      <!--<div class="footer">-->
        <!--<div class="lego-bottom">{{copyRight}}</div>-->
      <!--</div>-->
    </div>
</template>
<style scoped lang="less">
  .content{
    height:100%;
  }
  .main-content{
    height: -webkit-calc(100% - 13px);
    height: -moz-calc(100% - 13px);
    height: calc(100% - 13px);
  }
  .footer{
    width: 100%;
    height:13px;
  }
  .footer .lego-bottom {
    width: 100%;
    text-align: center;
    line-height: 13px;
    font-size: 12px;
    background: #3a3a3f;
    height: 13px;
    color: #616165;
  }

</style>
<script>
  import {URL} from "../../api/urlsConfig"
  export default {
    name:"Home",
    data() {
      return {
        showHeader:true
      }
    },
    provide:function(){
      return {
        initDate:this.initDate,
      }
    },
    created() {

    },
    components: {

    },
    methods:{
      //时间组件默认值
      initDate(){
        let endDate = new Date().getTime();
        let startDate = new Date(endDate - 7*24*60*60*1000);
        return [startDate,new Date()];
      }
    }
  }
</script>
