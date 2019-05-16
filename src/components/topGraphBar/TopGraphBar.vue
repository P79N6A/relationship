<template>
  <div id="topGraphBar">
    <div class="menuBox">
      <span class="toolbarItem f-csp">
        <Icon type="md-list-box"></Icon>
      </span>
      <span>数据源</span>
    </div>
    <div class="menuBox">
      <span class="toolbarItem f-csp">
        <Icon type="md-film"></Icon>
      </span>
      <span @click="showSnapshot">快照</span>
    </div>
    <div class="menuBox">
      <Input v-model="searchContent" placeholder="Enter something..." style="width: 142px"></Input>
      <span class="toolbarItem f-csp">
        <Icon type="md-search" @click="search"></Icon>
      </span>
    </div>
  </div>
</template>

<script>
  import Input from "iview/src/components/input/input";

  export default {
    components: {Input},
    name: "top-graph-bar",

    data() {
      return {
        searchContent: '',
      }
    },

    methods: {
      showSnapshot() {
        this.$emit("showSnapshot")

      },
      search() {
        this.$emit("search", this.searchContent)
      }
    }

  }
</script>

<style scoped lang="less">
  #topGraphBar {
    z-index: 9999;
    width: 365px;
    position: absolute;
    display: inline-block;
    font-size: 16px;
    top: 35px;
    right: 25px;
    padding: 0px 12px 9px 12px;
    border: 1px solid #cccccc;
    border-radius: 3px;
    -webkit-box-shadow: 0 3px 3px #ccc;
    box-shadow: 0 3px 3px #ccc;
    background-color: #f6f9fe;
    user-select:none;
  }

  #topGraphBar .menuBox {
    height: 30px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin: 0 4px;
    .toolbarItem {
      font-size: 22px;
      margin: 2px 0px;
      color: #333;
    }
  }
</style>
