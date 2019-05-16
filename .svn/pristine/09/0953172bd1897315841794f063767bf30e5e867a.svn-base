<template>
    <div id="split-pane">
      <span class="f-csp" :class="spanClass" @click="handleChange">
        <Icon type="ios-options "style="font-size: 18px" :class="isActive ? 'active' : ''"></Icon>
      </span>
    </div>
</template>

<script>
    export default {
        name: "split-pan",
        data() {
            return {}
        },
        props:["spanClass","isActive"],
        components: {},
        created() {
        },
        mounted() {
        },
        methods: {
          handleChange() {
            this.$emit("onHandleChange")
          },
        },

    }
</script>

<style scoped lang="less">
  #split-pane{
    width:100%;
    padding-left: 5px;
    height:20px;
    line-height: 20px;
    span{
      width:20px;
      position: absolute;
      color: #6184d2;
    }
    .left{
      left:0;
      .active{
        transform:rotate(180deg);
      }
    }
    .right{
      right:0;
      i{
        transform:rotate(180deg);
      }
      .active{
        transform:rotate(360deg);
      }
    }

  }

</style>
