<template>
    <div id="graph">
      <!--<div style="width: 1000px;height: 600px;border: 1px solid #333">-->
        <!--<img id="exportImage" style="width: 1000px;height: 600px;"/>-->
      <!--</div>-->
      <div name="canvasContainer" class="task" :id=currentGraphModel.graphId  @dblclick="fullScreenDisplay"></div>
      <canvas id="draw"></canvas>

      <div id="cyNavigator">
        <div class="flag" @click="zoomNavigator">
          <div id="directIcon" class="addDirectRb" style="width: 20px;height: 20px;"></div>
        </div>
        <div class="cytoscape-navigator"></div>
      </div>

      <!--<div class="flag" @click="spreadNavigator">flag</div>-->
      <bottom-taskbar ref="bottomTaskbar" v-if="isLoadStatisticsAndAnalyzeCon"></bottom-taskbar>
      <right-menu v-if="ready" :currentGraphId="currentGraphModel.graphId" ref="rightMenu" :hasGroup="showColor" @getAllDefinedLabel="getAllDefinedLabel" @deleteLabels="deleteLabels" @getDefaultIconData="getDefaultIconData"></right-menu>
      <!--<Row>-->
        <!--<Col span="12" class="tabs-style" style="height: 98%;padding:0px;">-->
        <!--<Tabs :value="currentGraphModel.taskName" :animated="false" @on-click="changeGraph" type="card" style="height: 100%" id="tabs">-->
          <!--<TabPane style="position: relative" v-for="item in graphModelList" :key="item.graphId" :label=getTabLabel(item) :name="item.taskName">-->
            <!--<div class="task" :id=item.graphId></div>-->
          <!--</TabPane>-->
          <!--&lt;!&ndash;<Button icon="md-add" @click="handleTabsAdd" size="small" slot="extra"></Button>&ndash;&gt;-->
          <!--<right-menu v-if="ready" :currentGraphId="currentGraphModel.graphId" ref="rightMenu"></right-menu>-->
        <!--</Tabs>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<toolbar ref="toolbar" :taskId="taskId" @selectArea="selectArea" @hideNodes ="hideNodes"></toolbar>-->

      <toolbar ref="toolbar" @saveCurrentTask="saveCurrentTask" @getlabel="initgetBaseAllLabel"></toolbar>

      <!--<top-graph-bar ref="topGraphBar" @search="" @showSnapshot="showSnapshot"></top-graph-bar>-->
      <add-edge></add-edge>
      <add-snapshot ref="addSnapshot" @refreshSnapshotList="refreshSnapshotList"></add-snapshot>
      <export-select-nodes ref="exportnodes"></export-select-nodes>
      <color-bar v-if="showColor" ref="colorBar" @refreshGroupStatistics="refreshGroupStatistics"></color-bar>

      <ExpansionSet ref="expansionSet"></ExpansionSet>
      <advanced-search ref="AdvancedSearch"></advanced-search>
      <add-label v-if="readyLabel" ref="addLabel" @refreshCustomTag = "refreshCustomTag"></add-label>
      <!--节点编辑-->
      <node-edit ref="nodeEdit"></node-edit>
      <!--拆分节点-->
      <split-node></split-node>
      <!--合并节点-->
      <merge-node></merge-node>
      <!--右键添加任务-->
      <right-add-task @sendTaskInfo="getRightTaskInfo"></right-add-task>
      <!--图形指标-->
      <graphical-quota ref="graphicalquota"></graphical-quota>
      <!--退出系统-->
      <logout></logout>
      <!--产品介绍-->
      <product-introduction></product-introduction>
    </div>
</template>

<script>
    import ExportSelectNodes from "@/components/modals/ExportSelectNodes"
    import bottomTaskbar from "@/components/bottomtaskbar/bottomTaskbar"
    import Toolbar from "@/components/toolbar/Toolbar"
    import TopGraphBar from "@/components/topGraphBar/TopGraphBar"
    import RightMenu from "@/components/rightMenu/RightMenu"
    import GraphModel from "./js/GraphModel"
    import * as Handle from "./js/handle"
    import * as styleManage from "./js/setStyleManage"
    import AddEdge from "@/components/modals/AddEdge"
    import AddSnapshot from "@/components/modals/AddSnapshot"
    import AddTask from "@/components/modals/AddTask"
    import ColorBar from "@/components/colorBar/colorBar"
    import {URL} from "../../../api/urlsConfig"
    import * as CanvasMange from './js/canvasManage'
    import * as uuId from "../../utils/uuid"
    import ExpansionSet from "@/components/modals/ExpansionSet"
    import AdvancedSearch from "@/components/modals/AdvancedSearch"
    import NodeEdit from "@/components/modals/NodeEdit"
    import SplitNode from "@/components/modals/SplitNode"
    import MergeNode from "@/components/modals/MergeNode"
    import Logout from "@/components/modals/Logout"
    import AddLabel from "@/components/modals/AddLabel"
    import RightAddTask from "@/components/modals/RightAddTask"
    import GraphicalQuota from "@/components/modals/GraphicalQuota"
    import ProductIntroduction from "@/components/modals/ProductIntroduction"
    import store from  "../../vuex/store"

    export default {
        name: "graph",
        data() {
            return {
              handle:{},
              //框拉选择的节点
              readyLabel:false,
              // showColor:false,
              isShow:false,
              overviewShow:true,
              widthValue:null,
              nodeImgList:[],
              ready:false,
            }
        },
        components: {
          AddLabel,
          Toolbar,
          RightMenu,
          TopGraphBar,
          AddEdge,
          AddSnapshot,
          AddTask,
          ColorBar,
          bottomTaskbar,
          ExportSelectNodes,
          ExpansionSet,
          AdvancedSearch,
          NodeEdit,
          Logout,
          SplitNode,
	        MergeNode,
          RightAddTask,
          GraphicalQuota,
          ProductIntroduction
        },
        created() {

        },
        mounted() {
          this.initKeyEvent();
          // this.getSliderLvl()
        },
        watch:{
          widthValue:function(n,o){
            let cy = this.$store.state.currentGraphModel.cy;
            if(cy){
              setTimeout(function(){
                cy.resize();
                //cy.fit();
                cy.center();
              },200)
            }
          },
          rMenuReady:function(){
            this.ready = this.rMenuReady;
          },
          rid:function(){
            this.$refs.rightMenu.resetMenu();
          }
        },
        computed: {
         //  //滑块弹窗
         //  getSliderModel: {
         //    get: function () {
         //     if(this.$store.state.isshowsliderModel==false){
         //       this.nodequota= 5;
         //       this.labelquota= 0;
         //       this.minquota=0;
         //       this.connectquota=0;
         //     }
         //      return this.$store.state.isshowsliderModel
         //    },
         //    set: function () {
         //      this.$store.commit("showSliderModel");
         //    }
         //
         //  },
         // //核心，联络指标显示
         //  getShowMoreSlider: {
         //    get: function () {
         //      return this.$store.state.isshowMoreSlider
         //    },
         //    set: function () {
         //      this.$store.commit("showMoreSlider");
         //    }
         //  },
          rMenuReady:{
            get:function(){
              return this.$store.state.rightMenuReady;
            },
            set:function(data){
              return this.$store.commit("rightMenuReady",data);
            }
          },
          rid:function(){
            return this.$store.state.currentGraphModel.rid;
          },
          currentGraphModel: {
            get: function () {
              this.$nextTick(function (o) {
                this.initGraph();
              });
              return this.$store.state.currentGraphModel;
            },
            set: function () {
              this.$store.commit("setCurrentGraphModel");
            }
          },

          showColor: {
              get: function () {
              return this.$store.state.showColor;
            },
            set: function (val) {
              this.$store.commit("showColorBar",val);
            }
          },

          isLoadStatisticsAndAnalyzeCon: {
            get: function () {

              return this.$store.state.isLoadStatisticsAndAnalyzeCon
            },
            set: function () {
              this.$store.commit("showStatisticsAndAnalyzeCon");
            }
          },

        },
        methods: {
          //手动改变标签指标
          setlabel(){
            this.$refs.graphicalquota.watchLabel()
          },
          //获取指标框状态
          getSliderLvl(){
            this.$refs.graphicalquota.setSliderLvL()
          },
          //初始化
          initRightCon: function () {
            let _this = this;
            setTimeout(function () {
              //渲染图形颜色
              let currentModel = _this.$store.state.currentGraphModel;
              if(!_.isEmpty(currentModel) && !_.isEmpty(currentModel.graphId)){
                if(!currentModel.data.groups){
                  //_this.showColor = false;
                  _this.$store.commit("showColorBar", false);
                }else{
                  //_this.showColor = true;
                  _this.$store.commit("showColorBar", true);
                }
              }
              //右侧功能区切换任务后默认显示任务页签
              _this.$store.commit("setRightConTabName", "task")
              //刷新右侧任务显示
              _this.$store.commit("showTaskCon", true);
              //刷新右侧统计和标签显示
              _this.$store.commit("showStatisticsAndAnalyzeCon", true);
            }, 100);
          },

          // setSelectedStyle: function () {
          //   let _this = this;
          //   setTimeout(function () {
          //     let currentModel = _this.$store.state.currentGraphModel;
          //     currentModel.cy.style()
          //       .selector(':selected')
          //       .css(
          //         {
          //           "border-width": "0.5px",
          //             "border-color": "#000000",
          //             "border-opacity": "1",
          //             "background-color": "#ff151a",
          //             "text-outline-color": "#ff151a"
          //         }
          //       )
          //       .selector('.nodehightlight')
          //       .css(
          //         {
          //           "border-color": "#8e918a",
          //           "background-color": "#8e918a",
          //           "text-outline-color": "#8e918a",
          //         }
          //       )
          //       .selector('.neighborNodeColor')
          //       .css(
          //         {
          //           "background-color": "#A20808",
          //         }
          //       )
          //       .selector('.neighborEdgeColor')
          //       .css(
          //         {
          //           "line-color": "#A20808",
          //         }
          //       )
          //       .selector('.otherNodeColor')
          //       .css(
          //         {
          //           "background-color": "#cccccc",
          //         }
          //       )
          //       .selector('.otherEdgeColor')
          //       .css(
          //         {
          //           "line-color": "#cccccc",
          //         }
          //       )
          //       .selector('.edgehightlight')
          //       .css(
          //         {
          //           "line-color":"#8e918a"
          //         }
          //       )
          //       //线选中样式
          //       .selector("edge:selected")
          //       .css({
          //         'line-color':'#A20808'
          //       })
          //       .update();
          //   },200)//延时大于点线渲染的延时
          // },

          initGraph() {
            // this.ready = false;
            this.readyLabel = false;
            var overviewDiv = $("#cyNavigator");
            let currentModel = this.$store.state.currentGraphModel;
            if(!_.isEmpty(currentModel) && !_.isEmpty(currentModel.graphId)){
              this.selectNodeImageData();
              let cy = Handle.init(currentModel);
              currentModel.setCy(cy);

              this.initRightCon();


              styleManage.setSelectedStyle(this);//设置选装节点的样式，须在点线渲染完成后设置，否则背景色不生效
              this.bindSelectNode(cy);
              this.readyLabel = true;
            }
            this.ready = true;
          },
          //请求点的默认图标
          selectNodeImageData(){
            let _this = this;
            let currentModel = this.$store.state.currentGraphModel;
            this.$http.request({
              method: 'get',
              params: {rid:currentModel.rid},
              url:URL.selectNodeImageData,
              success: (data) => {
                if(data.code === 200){
                  _this.nodeImgList = data.data;
                  this.$store.commit("setDefaultNodeImgList",this.nodeImgList);
                }
              },
              error: (data) => {
                this.$Message.warning('请求数据失败！');
              }
            });
          },
          //调用导出节点内标签加载的方法
          initgetBaseAllLabel(){
            this.$refs.exportnodes.getBaseAllLabel();
          },
          //接收rightAddtask传来的参数
          getRightTaskInfo(taskName,caseID){
            this.$emit("getRightAddTsk",taskName,caseID);
          },
          //调用新增标记内的获取所有标记的方法
          getAllDefinedLabel(){
            this.$refs.addLabel.queryAllDefinedLabel();
          },

          refreshCustomTag(){
            this.$emit("refreshCustomTag");
          },

          deleteLabels(){
            this.$refs.addLabel.deleteLabels()
          },

          initKeyEvent() {
            let _this = this;
            //ctrl+s保存当前任务
            // document.onkeydown = function (event) {
            //   if(event.ctrlKey === true && event.keyCode === 83) {
            //     event.returnValue = false;
            //     _this.saveCurrentTask();
            //   }
            // }
          },

          //保存当前任务
          saveCurrentTask(){
            let taskId = this.currentGraphModel.taskId;
            let taskName = this.currentGraphModel.taskModel.taskName;
            let caseId = this.currentGraphModel.taskModel.caseId;
            /*let resultJson = CanvasMange.saveCurrentTask();
            //保存json留下有用字段
            let saveJson = {
              nodes: _.map(resultJson.nodes, function(node){
                return _.pick(node, ['data', 'position'])
              }),
              edges: _.map(resultJson.edges, function(node){
                return _.pick(node, ['data'])
              }),
            };*/
            this.$http.request({
              method: 'post',
              params: {taskId: taskId, taskName: taskName, caseId: caseId},
              url:URL.saveOrUpdateTaskDatas,
              success: (data) => {
                if(data.code === 200){
              // console.log(this.currentGraphModel);
                  //隐藏任务星号
                  // let taskStarId = this.currentGraphModel.taskModel.taskStarId;
                  // if(taskStarId && document.getElementById(taskStarId)) {
                  //   document.getElementById(taskStarId).style.visibility = 'hidden';
                  // }
              let currentGraphModel=this.$store.state.currentGraphModel;
              currentGraphModel.taskId = data.data;
              currentGraphModel.taskModel.taskId=data.data;
              this.$Message.success('保存成功！');
                  $('#toolbar span').css({backgroundColor:'',boxShadow: ''})
                }
              },
              error: (data) => {
                this.$Message.warning('请求数据失败！');
                $('#toolbar span').css({backgroundColor:'',boxShadow: ''})
              }
            });
          },

          //添加快照刷新快照列表
          refreshSnapshotList() {
            this.$emit("refreshSnapshotList");
          },

          //选择色卡群组刷新群组统计
          refreshGroupStatistics(groupData) {
            this.$emit("refreshGroupStatistics", groupData);
          },

          //画布绑定点击事件
          bindSelectNode(cy) {
            let _this = this;
            cy.on('click',function (e) {
              //单击屏幕
              if(e.target.eh){
                //显示整体信息
                _this.$emit("statisticsSelectNode", '');
                //移除置灰
                cy.nodes().removeClass("b-nodehightlight");
                cy.nodes().removeClass("a-nodehightlight");
                cy.edges().removeClass("b-edgehightlight");
                cy.edges().removeClass("a-edgehightlight");
              }else if(e.target.length && (e.target.isNode() || e.target.isEdge())){
                //展开右侧功能区
                _this.$store.commit("setRightConTabName", "statistics");
                let flag = _this.$store.state.isAddRelation;
                if(flag){
                  _this.$store.commit("isAddRelation", false);
                } else {
                  _this.$emit("statisticsSelectNode", e.target);
                }

              }
            });
          },
          //缩放鹰眼图区域
          zoomNavigator(){
            var overviewDiv = $("#cyNavigator");
            var directIcon = document.getElementById('directIcon');
            if (this.overviewShow) {
              $(overviewDiv).animate({
                width: "20px",
                height: "20px"
              });
              directIcon.className = "addDirectLt";
              this.overviewShow = false;
            } else {
              $(overviewDiv).animate({
                width: "230px",
                height: "188px"
              });
              directIcon.className = "addDirectRb";
              this.overviewShow = true;
            }
          },
          //全屏显示
          fullScreenDisplay(){
            this.$emit("fullScreenDisplay");
            this.changeWidthValue();
          },
          changeWidthValue(){
            let el = document.querySelector("#graph");
            this.widthValue = el.clientWidth;
          },
          //节点编辑获取通用图标和实体图标
          getDefaultIconData(){
            this.$refs.nodeEdit.getDefaultIcon();
          }
      },

    }
</script>

<style lang="less">
  #graph{
    position:relative;
    padding-top:3px;
    width:100%;
    height:100%;
    #cy{
      width:100%;
      height:100%;
      .link {
        stroke: #999;
      }
      .selected {
        stroke: black;
      }
    }
    .addDirectRb{
      background: url("../../../static/image/direct_rb.png");
    }
    .addDirectLt{
      background: url("../../../static/image/direct_lt.png");
    }
  }
</style>
<style>
  #graph > .ivu-row {
    height: 100%;
    width: 100%;
  }

  .ivu-tabs-content {
    height: 100%;
    width: 100%;
    position:relative;
  }

  .ivu-tabs-tabpane {
    height: 100%;
    width: 100%;
  }

  .task{
    height: 100%;
    width: 100%;
    position:relative;
  }

  .tabs-style.ivu-col.ivu-col-span-12 {
    width: 100%;
  }

  tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
    color: #c8c5ec;
  }
  tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
  }
  tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
  #graph .ivu-tabs-nav-container {
    height: 27px;
  }

  #graph .ivu-tabs-tab-focused {
    height: 27px !important;
  }

  #graph .ivu-tabs-tab {
    height: 26px;
  }

  #graph .ivu-tabs-nav-scroll{
    padding:0 10px 0 10px;
  }
  .addGraphButton {
    position: absolute;
    top: 1px;
    left: 106px;
  }
  #draw {
    background-color: rgba(150, 255, 255, 0.1);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200000;
    display: none;
  }
  /*鼠标放在节点上标签的样式*/
  .popper-div{
    width:190px;
    color:#fff;
    background-color:#383838;
    z-index:9999;
    border:1px solid rgb(51, 51, 51);
    border-radius:4px;
    padding:10px;
    overflow-y:auto;
  }
  .label-name{
    font-size:16px;
    font-weight:600
  }
  .label-circle{
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-radius: 10px;
    background-color: #d48265;
    display: inline-block
  }
</style>

