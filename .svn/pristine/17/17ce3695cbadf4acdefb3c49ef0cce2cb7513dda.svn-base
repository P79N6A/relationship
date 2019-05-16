<template>
  <div id="index">
    <header-bar v-if="showLayout" ref="headerBar" @refreshAnalyticalModelList="refreshAnalyticalModelList" @statisticsSelectNode="statisticsSelectNode" @setSingleLvl="setSingleLvl"></header-bar>
    <!--<split-pane @onHandleChange="handleCollapsedChange"></split-pane>-->
    <Layout class="main">
      <Sider hide-trigger collapsible :width="260" :collapsed-width="20" v-model="collapsed" class="left-slider"
             >
        <split-pane @onHandleChange="leftCollapsedChange" :spanClass="rightClass" :isActive="collapsed"></split-pane>
        <left-con ref="leftCon" :isActive="collapsed" @setSingleLvl="setSingleLvl"></left-con>
      </Sider>

      <Layout>
        <Content class="main-content-con">
          <Layout class="main-layout-con">
            <graph v-if="showLayout" ref="mainGraph" @refreshSnapshotList="refreshSnapshotList"
                   @refreshGroupStatistics="refreshGroupStatistics" @statisticsSelectNode="statisticsSelectNode"
                   @getRightAddTsk="getRightAddTsk" @fullScreenDisplay="fullScreenDisplay"
                   @refreshCustomTag="refreshCustomTag"></graph>
          </Layout>
        </Content>
      </Layout>
      <Sider hide-trigger collapsible :width="330" :collapsed-width="20" v-model="rightCollapsed" class="left-slider">
          <split-pane @onHandleChange="rightCollapsedChange" :spanClass="leftClass" :isActive="rightCollapsed"></split-pane>
          <right-con ref="rightCon" :isActive="rightCollapsed" @showSocialExponent="showSocialExponent" @getModelInfo="getModelInfo" @setSingleLvl="setSingleLvl" @getHandSetLabel="getHandSetLabel"></right-con>
      </Sider>
    </Layout>
    <Footer v-if="showLayout">{{copyRight}}</Footer>
    <social-exponent ref="socialExponent"></social-exponent>
    <div id="load-mask" v-if="isLoading">
      <Icon type="ios-loading" size="50" class="demo-spin-icon-load" style="color:blue"></Icon>
    </div>
  </div>
</template>

<script>
  //import { mapGetters, mapActions } from 'vuex'
  import {URL} from "../../../api/urlsConfig"
  import HeaderBar from "@/components/header/HeaderBar"
  import SplitPane from "@/components/common/SplitPane";
  import Graph from "@/pages/graph/Graph"
  import LeftCon from "@/pages/leftCon/LeftCon"
  import RightCon from "@/pages/rightCon/RightCon"
  import SocialExponent from "@/components/rightCon/statistics/SocialExponent"

  export default {
        name: "index",
        data() {
            return {
              collapsed: false,
              rightCollapsed:false,
              isAddNode:false,
              rightClass:"right",
              leftClass:"left",
              newGraphNodes:[],
              expansionData:[],
              showLayout: false,
              copyRight: '',
            }
        },
        components: {
          HeaderBar,
          SplitPane,
          Graph,
          LeftCon,
          RightCon,
          SocialExponent
        },
        provide:function(){
          return {
            changeRightConTabValue:this.statisticsSelectNode,
            statisticsObjectAccount:this.statisticsObjectAccount
          }
        },
        created() {

        },
        mounted() {
          this.getQueryBaseDictionData();
          // this.getModelInfo()
          // this.refreshSnapshotList()
        },
        computed:{
          isLoading:function(){
            return this.$store.state.graphLoad;
          }
        },
        methods: {
          //获取手动改变标签指标方法
          getHandSetLabel(){
            this.$refs.mainGraph.setlabel()
          },
          //获取标签列表数据
          getQueryBaseDictionData() {
            let _this=this;
            this.$http.request({
              methods: "get",
              params: "",
              url: URL.queryBaseDictionData,
              success: (data) => {
                if (data.code === 200) {
                  _this.showLayout = true;
                  _this.$store.commit("queryBaseDictionData",data.data);
                  _this.setBaseDictionDataAll(data.data);
                  let baseDictionData = data.data;
                  _this.copyRight = baseDictionData.copyRight;
                  _this.$store.commit("nodeProDict",data.data.nodePro);
                }else {
                  _this.$Message.error("请求字典失败")
                }
              },
              error: (data) => {
                _this.$Message.error("请求字典失败")
              }

            })
          },

          setBaseDictionDataAll(data){
              let list = [];
              for(var key in data){
                list = [...list,...data[key]]
              }
              this.$store.state.dictionDataAll = list;
            },

          leftCollapsedChange () {
            this.collapsed = !this.collapsed;
            this.$refs.mainGraph.changeWidthValue();
          },
          rightCollapsedChange () {
            this.rightCollapsed = !this.rightCollapsed;
            this.$refs.mainGraph.changeWidthValue();

          },
          //指标指数初始化
           setSingleLvl(){
            this.$refs.mainGraph.getSliderLvl()
           },
          //添加快照刷新快照列表
          refreshSnapshotList() {
            this.$refs.headerBar.refreshSnapshotList();
          },
          //获取模型统计
          getModelInfo(){
            this.$refs.headerBar.getStatistics();
          },
          //刷新分析模型列表
          refreshAnalyticalModelList() {
            this.$refs.rightCon.refreshAnalyticalModelList();
          },

          //选择色卡群组刷新群组统计
          refreshGroupStatistics(groupData) {
            this.$refs.rightCon.refreshGroupStatistics(groupData);
          },

          //统计菜单选中点
          statisticsSelectNode(selectItem) {
            this.$refs.rightCon.statisticsSelectNode(selectItem);
          },
          //统计所有的边和关系
          statisticsObjectAccount(nodes, edges){
            this.$refs.rightCon.statisticsObjectAccount(nodes, edges);
          },

          refreshCustomTag(){
            this.$refs.rightCon.refreshCustomTag();
          },

          //展示当前类型社交参数
          showSocialExponent(typeGroup) {
            this.$refs.socialExponent.showSocialExponent(typeGroup);
          },
          //获取左侧树中右键任务方法
          getRightAddTsk(taskName,caseID){
            this.$refs.leftCon.rightAddTask(taskName,caseID);
          },
          //全屏显示图形
          fullScreenDisplay(){
            if(this.$store.state.loadChildTaskStatus){
              //var task = this.$refs.leftCon.currentSelectTask;
              if(this.collapsed  == this.rightCollapsed){
                this.collapsed = !this.collapsed;
                this.rightCollapsed = !this.rightCollapsed;
                //this.$refs.leftCon.queryLayoutData(task);
              } else {
                this.collapsed = true;
                this.rightCollapsed = true;
              }
              this.$refs.mainGraph.changeWidthValue();
            }else {
              this.leftCollapsedChange();
              this.rightCollapsedChange();
            }
          }
        }
  }
</script>

<style scoped lang="less">
  #index{
    width:100%;
    height: 100%;
  }
  .main{
    height:calc(100% - 56px);
    width:100%;
   /* position:fixed;*/
    .left-slider{
      height:100%;
      background-color: #fff;
    }
    .main-content-con{
      height:100%;
      overflow: hidden;
    }
    .main-layout-con{
      height: 100%;
      overflow: hidden;
    }
  }
  #load-mask{
    position:fixed;
    display:flex;
    justify-content:center;
    align-items:center;
    top:0;
    width:100%;
    height:100%;
    background-color: rgba(55,55,55,.6);
    z-index: 999;
  }

  .ivu-layout-footer {
    background: #3a3a3f;
    padding: 0;
    color: #a7a7a9;
    font-size: 12px;
    line-height: 13px;
    height: 13px;
    width: 100%;
    text-align: center;
  }
</style>
