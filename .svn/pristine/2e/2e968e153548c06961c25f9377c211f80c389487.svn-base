<template>
  <div id="app" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{}
  },
  created(){
    //页面刷新时清除本地存储的皮肤，使用默认色
    window.localStorage.removeItem('theme');
  }
}
</script>

<style>
.app-main{
  height:100%;
}
</style>
