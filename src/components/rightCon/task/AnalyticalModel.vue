<template>
  <div id="analytical-model">
    <ul id="tasks-list-container">
      <li v-for="(model,index) in analyticalModelList" :key="model.rid" @click="currentModelInfo(index,$event,model,model.rtype,model.rstatus,model.rname)" style="cursor: pointer" class="cls-taskModels">
        <div  class="task-analytical-model"  :class="index===currentindex ? (hasBorder ? 'border-menumodel' : 'menumodel') : ''"   :id="model.rid">
          <Row :gutter="8">
            <Col span="9">
            <div class="model-img">
              <img @mouseenter="mouseEnter($event)" @mouseleave="mouseLeave($event)" @click="changeGraphModel(index,$event,model,model.rtype,model.rstatus,model.rname)" class="analytical-model-img f-csp" title="查看结果"
                   v-if="model.rstatus === '4' && model.baseImage"  :src="model.baseImage">
              <div v-else class="loader-container">
                <Spin>
                  <div class="loader">
                    <Icon v-show="model.rstatus === '3'" type="ios-loading" size="30" class="demo-spin-icon-load"></Icon>
                    <span v-if="model.rstatus === '3'" style="height:20px;position:absolute;left:42px;top:22px;text-align:center">{{model.progressNum}}%</span>
                    <div style="color: red; font-weight: bolder;width:100%;height:100%" v-show="model.rstatus === '5'" id="errorModel"></div>
                  </div>
                </Spin>
              </div>
            </div>
            </Col>
            <Col span="15">
            <div class="model-content">
              <ul>
                <li class="model-content-li model-title" :title="model.rname" ><span>{{model.rname}}</span></li>
                <li class="model-content-li model-time" :title="model.modelType" ><span style="font-weight:bold">模型类型:</span><span>{{model.modelType}}</span></li>
		            <li class="model-content-li model-time">
                    <span v-if='isUpdateTime(model)'>{{model.createtime}}</span>
                    <span v-else >{{model.updatetime}}</span>
                </li>
                <li class="model-content-li" style="margin-top: 3px">
                  <div id="cls-modelinfo">
                    <Tooltip placement="top" theme="dark">
                      <div slot="content">
                        <p v-if="model.inputCount ===''|| model.inputCount===undefined ">输入：0</p>
                        <p v-else>输入：{{model.inputCount}}</p>
                      </div>
                    <img  src="../../../assets/img/inpro.png" style="margin-right: 5px" @click="selectIsInputNode(0,$event,index)" class="cls-Icon">
                    </Tooltip>
                   <span >{{getModelNodeSize(model.inputCount, model)}}</span>
                    <Tooltip placement="top" theme="dark">
                      <div slot="content">
                        <p v-if="model.outputCount ===''|| model.outputCount===undefined ">输出：0</p>
                        <p v-else>输出：{{model.outputCount}}</p>
                      </div>
                    <img :title="model.outputCount" src="../../../assets/img/outpro.png" style="margin-right: 5px;margin-left:10px" @click="selectIsInputNode(1,$event,index)" class="cls-Icon">
                    </Tooltip>
                    <span >{{getModelNodeSize(model.outputCount, model)}}</span>
                  </div>

                </li>
                <li class="model-content-li" :class="{contentli4:index===currentindex}" id="toolscontent" style="position: absolute;  right: -11px; margin-top: 0px;" >
                  <div class='model-tools' style="cursor: pointer">
                    <Tooltip content="查看参数" placement="top">
                      <i class="iconfont icon-chakanxiangqing" type="ios-paper" @click="viewModelParams(model,$event)"></i>
                    </Tooltip>

                    <Tooltip content="任务重发" placement="top" v-if="(!isCloseCase&&model.rstatus === '4'&&resendTask) || (!isCloseCase&&model.rstatus === '5'&&resendTask)">
                      <i class="iconfont icon-shuaxin1" @click="retryModel(model,$event)" type="md-refresh"></i>

                    </Tooltip>

                    <Tooltip content="模型复制" placement="top" v-if="(!isCloseCase&&model.rstatus === '4') || (!isCloseCase&&model.rstatus === '5')">
                      <Icon type="ios-copy" @click="modelCopy(model)" style="font-size: 19px; margin-bottom: 5px;"></Icon>
                    </Tooltip>

                    <Tooltip content="删除模型" placement="top-end" v-if="(!isCloseCase&&model.rstatus === '4') || (!isCloseCase&&model.rstatus === '5')">
                      <i class="iconfont icon-shanchu" @click="deleteAnalyticalModel(model,$event)" type="ios-trash"></i>

                    </Tooltip>

                  </div>
                </li>

              </ul>
            </div>
            </Col>
          </Row>
        </div>
      </li>
      <div v-show="index === '0'">
        <span class="loadMoreSpan" @click="queryModelMore">查看更多</span>
      </div>
    </ul>
    <analytical-model-params ref="analyticalModelParams"></analytical-model-params>
    <create-statistics-model ref="createStatistics" @refreshAnalyticalModelList="refreshAnalyticalModelList" @getModelUseInfo="getModelUseInfo"></create-statistics-model>
  </div>
</template>

<script>

  import {URL} from "../../../../api/urlsConfig"
  import GraphModel from "../../../pages/graph/js/GraphModel"
  import * as Handle from "../../../pages/graph/js/handle"
  import * as styleManage from "../../../pages/graph/js/setStyleManage"
  import AnalyticalModelParams from "@/components/modals/AnalyticalModelParams"
  import CreateStatisticsModel from "@/components/modals/CreateStatisticsModel"

  export default {
    name: "analytical-model",
    data() {
      return {
        allAnalyticalModelList: [],
        analyticalModelList: [],
        pageSize: 10,
        page: 1,
        currentModel: '',
        index: '1',
        currentindex:'',
        modelSearchContent:'',
        hasBorder:false
      }
    },
    props: [],

    components: {
      AnalyticalModelParams,
      CreateStatisticsModel
    },

    created() {

    },

    mounted() {
      this.initAnalyticalModel();

    },
    computed:{
      isCloseCase:function(){
        return this.$store.state.closeCase;
      },
      resendTask:function(){
        return this.$store.state.jurisdiction.resendTask;
      }
    },
    methods: {
      changeSetSingleLvl(){
        this.$emit("getsetSingleLvl")
      },
      //改变当前模型的样式条件
      currentModelInfo(index, e, model, code,rstatus,rname) {
        e.stopPropagation()
        this.currentindex = index;
        this.hasBorder = true;
        //切换rid
        this.$store.commit("modelRid",model.rid);
      },

      //初始化模型列表，并定时查询结果状态
      initAnalyticalModel() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        //第一次初始化
        this.queryTaskModelResult(currentGraphModel);
        this.createTimer(currentGraphModel);
        this.createCacheTimer(currentGraphModel);

      },

      //定时刷新
      createTimer(currentGraphModel) {
        //间隔10秒刷库
        window.anaModelTimer = setInterval(() => {
          this.queryTaskModelResult(currentGraphModel);
        }, 60000);
      },

      //定时刷新缓存
      createCacheTimer(currentGraphModel) {
        window.anaModelCacheTimer = setInterval(() => {
          this.getModuleStatus(currentGraphModel);
        }, 3000);
      },
     //点击图片模型切换
      changeGraphModel(index, e, model, code,rstatus,rname){
        this.changeSetSingleLvl()
        //切换rid
        this.$store.commit("modelRid",model.rid);
        //图形指标关闭，数值初始化
        this.$store.state.isshowSlider=true;
        this.$store.commit("showSliderModel", this.$store.state.isshowSlider);
        if(this.$store.state.isSnapshotConfirm){//图有变化弹出是否保存快照提示框
          e.stopPropagation()
          this.$store.commit("modelRid",model.rid);
          this.$Modal.confirm({
            title: '是否将当前步骤保存为快照',
            okText: '确认',
            cancelText: '取消',
            onOk: () =>{
              this.$store.commit("showAddSnapshotModal", true);//弹出添加快照窗口
            },
            onCancel:()=>{
              //切换图形显示加载图
              this.$store.commit("graphLoad",true);
              this.currentindex = index;
              this.hasBorder = false;
              this.$store.state.modelrname=rname;
              this.viewModelResult(model, e, code,rstatus)
            }
          });
        }else{
          //切换图形显示加载图
          this.$store.commit("graphLoad",true);
          this.$store.state.modelrname=rname;
          e.stopPropagation()
          this.currentindex = index;
          this.hasBorder = false;
          this.$store.commit("modelRid",model.rid);
          this.viewModelResult(model, e, code,rstatus)
        }
      },
      //获取模型状态
      getModuleStatus(currentGraphModel) {
        //获取正在进行的模型id
        let _this = this;

        //正在进行中个数
        let progressModelIds = _.map(_.filter(this.allAnalyticalModelList, {'rstatus': '3'}), 'rid');
        if (!_.isEmpty(progressModelIds)) {
          this.$http.request({
            method: 'get',
            params: {rids: _.join(progressModelIds, ',')},
            url: URL.getModuleStatus,
            success: (data) => {
              if (data.code === 200) {
                //刷新进度百分比
                _.each(_this.allAnalyticalModelList,function (model) {
                  model.progressNum = data.data[model.rid]
                });
                this.searchAnalyticalModel(this.modelSearchContent);

                _.each(data.data, function (value, key) {
                  //当有一个成功或者失败，百分比为100时，调用更新列表
                  if (value==="100") {
                    _this.queryTaskModelResult(currentGraphModel);
                    return false;
                  }
                });
              }
            },
            error: (data) => {
              this.$Message.warning('请求数据失败！');
            }
          })
        }
        //失败个数
        let errorModelIds = _.map(_.filter(this.allAnalyticalModelList, {'rstatus': '5'}), 'rid');
        if(!_.isEmpty(errorModelIds)){
          this.searchAnalyticalModel(this.modelSearchContent)
        }
      },

      //刷新模型列表
      refreshAnalyticalModelList() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.queryTaskModelResult(currentGraphModel);
      },

      //更新模型统计
      getModelUseInfo() {
        this.$emit("useModelInfo");
      },

      //获取任务模型
      queryTaskModelResult(currentGraphModel) {
        if (_.isEmpty(currentGraphModel.taskId)) {
          return
        }
        this.$http.request({
          method: 'get',
          params: {taskId: currentGraphModel.taskId, pageSize: this.pageSize, page: this.page},
          url: URL.queryTaskModelResultList,
          success: (data) => {
            if (data.code === 200) {
              this.allAnalyticalModelList = data.data.list;
              //index为0有更多，为1则无更多
              this.index = data.data.index;
              this.$emit('getModelsNum', data.data.totalCount);
              this.searchAnalyticalModel(this.modelSearchContent)
            }
          },
          error: (data) => {
            this.$Message.warning('请求数据失败！');
          }
        })
      },

      //物理删除分析模型
      deleteAnalyticalModel(model,e) {
        let _this=this
        e.stopPropagation()
        this.$Modal.confirm({
          title: '是否删除模型：' + model.rname,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.request({
              method: 'post',
              params: {rid: model.rid, rtype: model.rtype},
              url: URL.deleteTaskModelStatus,
              success: (data) => {
                if (data.code === 200 && data.data === "1") {
                  _this.allAnalyticalModelList = _.reject(_this.allAnalyticalModelList, {'rid': model.rid});
                  _this.analyticalModelList = _.reject(_this.analyticalModelList, {'rid': model.rid});
                  console.info("删除模型成功：" + model.rname);
                  //更新模型使用列表
                  //显示当前模型结果，删除后显示任务数据
                  if (model.rid === _this.currentModel.rid) {
                    _this.$store.commit("showStatisticsAndAnalyzeCon", false);
                    _this.$store.commit("showColorBar", false);
                    //查询当前任务最后一个快照json
                    _this.queryLayoutData();
                    _this.$emit("useModelInfo");
                  }

                }
              },
              error: (data) => {
                this.$Message.warning('请求数据失败！');
              }
            })
          }
        });
      },

      //请求当前图的所有标记(type:0为删除入口，1为查看入口)
      queryCurrentResultDefinedLabel(datas,currentGraphModel,type){
        let rid = datas.data.id;
        this.$http.request({
          method:'get',
          params:{
            rid:rid,
            code:type
          },
          url:URL.queryCurrentResultDefinedLabel,
          success:(data)=>{
            if(data.code===200){
              let currentResultDefinedLabel = data.data;
              this.$store.commit("setCurrentResultDefinedLabel",currentResultDefinedLabel);
              this.loadGraph(datas.data.resultJson, currentGraphModel)
            }
          },
          error:(data)=>{
            this.$Message.warning('请求数据失败！')
          }
        })
      },

      //请求图数据,删除后会调用，里面的type传0，请求任务最新快照数据
      queryLayoutData() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.$http.request({
          method: 'get',
          params: {taskId: currentGraphModel.taskModel.taskId, code: 0},
          url: URL.queryResultJsonById,
          success: (data) => {
            if (data.code === 200) {
              //加载图
              currentGraphModel.rid = data.data.id;
              currentGraphModel.code = 0;//删除请求最新快照，code为0
              this.queryCurrentResultDefinedLabel(data,currentGraphModel,0);//标记数据在图之前加载
            }
          },
          error: (data) => {
            this.$Message.warning('请求数据失败！');
          }
        });
      },

      //加载图
      loadGraph(data, currentGraphModel) {
        //刷新统计和分析页面
        this.$store.commit("showStatisticsAndAnalyzeCon", true);
        //this.$store.commit("showColorBar", true);
        if (!data.groups) {
          this.$store.commit("showColorBar", false);
        } else {
          this.$store.commit("showColorBar", true);
        }
        //渲染图
        currentGraphModel.data = data;
        let cy = Handle.init(currentGraphModel);
        currentGraphModel.setCy(cy);
        styleManage.setSelectedStyle(this);
        this.bindSelectNode(cy);
        this.$store.commit('setCurrentGraphModel', currentGraphModel);
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
            _this.$emit("statisticsSelectNode", e.target);
          }
        });
      },

      //模型复制重发
      modelCopy(model){
        let rid = model.rid;
        this.$http.request({
          method: 'get',
          params:{rid},
          url: URL.viewParams,
          success:(data) => {
            if (data.code === 200) {
              let res = data.data;
              let nodes = [];
              let paramNodes = res.accountVo.parpamVo;
              let nodeNames = _.split(paramNodes.value, '\n');
              let type = paramNodes.type;
              model.dicCode = model.rtype;
              _.each(nodeNames, function (name) {
                nodes.push({type: type, id: name, name: name})
              });
              this.$refs.createStatistics.showModal(data.data, '模型复制', nodes, 'copy');
            }
          },
          error: (data) => {
            this.$Message.warning('请求数据失败！');
          }
        });
      },

      //查看分析模型结果结果
      viewModelResult(model, e, code,rstatus) {

        //根据获取的code改变核心,联络指标的显示
        if(rstatus==='4') {
          if (code == '202') {
            this.$store.commit("showMoreSlider", true);
          } else {
            this.$store.commit("showMoreSlider", false);
          }
          this.currentModel = model;
          let _this = this;
          // //移除所有model背景
          // _.each(document.getElementsByClassName("task-analytical-model"), function (element) {
          //   element.classList.remove("selectModel");
          // });
          // //选中model添加背景
          // document.getElementById(model.rid).classList.add("selectModel")
          let currentGraphModel = this.$store.state.currentGraphModel;
          this.$store.commit("showStatisticsAndAnalyzeCon", false);
          this.$store.commit("showColorBar", false);

          //前端打包测试
           let url = URL['queryModelData' + model.rtype];
          this.$http.request({
            method: 'get',
            params: {rid: model.rid, code: 1},
            url: URL.debug?url:URL.queryResultJsonById,
//             url: url,   //前端打包测试
            success: (data) => {
              if (data.code === 200) {

                // if(data.resultJson.maxKshell!=undefined&&data.resultJson.minKshell!=undefined){
                  //获取核心指标最大最大最小值

                // }else {
                //   this.$store.commit("maxKshell",9)
                //   this.$store.commit("minKshell",0)
                // }

                currentGraphModel.type = "model";
                //加载图
                currentGraphModel.rid = data.data.id;
                currentGraphModel.code = 1;
                this.queryCurrentResultDefinedLabel(data,currentGraphModel,1);
                //this.loadGraph(data.data.resultJson, currentGraphModel);
                //工具条显示条件
                //   e.target.parentNode.parentNode.nextElementSibling.querySelector(".content-li-4").style.display = 'block';
                setTimeout(function () {
                  _this.saveModelImage(currentGraphModel.cy, currentGraphModel, model);
                }, 200);
                // let maxKshell=data.data.resultJson.maxKshell;
                // let minKshell=data.data.resultJson.minKshell;
                let datas=data.data.resultJson
                _this.$store.commit("ResultJsons",datas)
                console.log( _this.$store.commit("ResultJsons",datas))
                // this.$store.commit("maxKshell",datas)
                // this.$store.commit("minKshell",minKshell)
                currentGraphModel.type = "";
                console.info("查看模型结果：" + model.rname)
                this.$store.commit("Sliderlvl",0);//标签指标初始化
                this.$store.commit("baseLabelsFus",[]);//选择属性标签初始化
              }
            },
            error: (data) => {
              this.$Message.warning('请求数据失败！');
            }
          })
        }
      },

      //保存模型缩略图
      saveModelImage(cy, currentGraphModel, model) {
        if (_.isEmpty(cy.json().elements) || !_.isEmpty(model.baseImage)) {
          return false;
        }
        let baseImage = cy.png({maxWidth: 99, maxHeight: 72});
        this.$http.request({
          method: 'post',
          data: {
            rid: model.rid,
            baseImage: baseImage
          },
          url: URL.updateBaseImage,
          success: (data) => {
            if (data.code === 200) {
              console.info("更新模型缩略图：" + model.rname);
              this.queryTaskModelResult(currentGraphModel);
            }
          },
          error: (data) => {
            this.$Message.warning('更新模型失败');
          }
        });

      },

      //模型查看更多
      queryModelMore() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.pageSize += 10;
        this.queryTaskModelResult(currentGraphModel);
      },

      //失败任务模型重试
      retryModel(model,e) {
        this.$Modal.confirm({
          title: '是否重发模型：' + model.rname,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            let _this = this;
            e.stopPropagation();
            this.$http.request({
              method: 'post',
              params: {
                rid: model.rid,
              },
              url: URL.repeatExcuteTask,
              success: (data) => {
                if (data.code === 200) {
                  let currentGraphModel = this.$store.state.currentGraphModel;
                  if (model.rid === _this.currentModel.rid) {
                    this.currentindex = 0
                  }
                  this.queryTaskModelResult(currentGraphModel);
                  this.$Message.success("任务重发重发成功：" + model.rname);
                  console.log(model.index)
                } else if (data.code === 500) {
                  this.$Message.success("服务器异常，请稍后重试!")
                } else {
                  this.$Message.warning('任务重发重发失败');
                }
              },
              error: (data) => {
                this.$Message.warning('任务重发重发失败');
              }
            });
          }
        })
      },

      //查看模型参数
      viewModelParams(model,e) {
        e.stopPropagation()
        this.$refs.analyticalModelParams.initModelParams(model)
      },

      mouseEnter(event) {
        event.target.classList.add('analytical-mouse-top');
      },

      mouseLeave(event) {
        event.target.classList.remove('analytical-mouse-top');
      },
      //计算指标大小
      getModelNodeSize(count, model) {
        let nodeCount = count >= 0 ? count : 0;
        let allNodeCount = (model.inputCount >= 0 ? model.inputCount : 0) + (model.outputCount >= 0 ? model.outputCount : 0);
        return allNodeCount === 0 ? '0%' : (Math.round(nodeCount / allNodeCount * 1000) / 10) + '%'
      },
      //输入输出图中选中
      selectIsInputNode(flag, e,index){
          e.stopPropagation()
          //判断当前点击对象是否被选中
        let modelIndex= $('.cls-taskModels .task-analytical-model')[index]
          // let currentEle = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
          if (modelIndex.classList.contains('menumodel') === true) {
            let currentModel = this.$store.state.currentGraphModel;
            let cy = currentModel.cy;
            let graphNode = _.filter(cy.nodes(), function (node) {
              if (node.data().isInput === flag) {
                return node
              }
            });
            cy.$(cy.nodes()).unselect();
            let mapcollection = cy.collection();
            mapcollection.merge(graphNode);
            mapcollection.select();
            if(flag=='0'){
              cy.style()
                .selector(mapcollection)
                .style("shape", "pentagon")
                .update();
            }
            cy.center(graphNode);
          }
        },
      //搜索过滤分析模型
      searchAnalyticalModel(content) {
        let typeDiction = this.$store.state.queryBaseDictionData.typePro;
        this.modelSearchContent = content;
        this.analyticalModelList = _.filter(this.allAnalyticalModelList, function (model) {
          if(_.includes(model.rname, content)){
              if(model.rtype && typeDiction){
                model.modelType = typeDiction[model.rtype];
              }
            return model
          }
        });
      },
      beforeDestroy() {
        //清除定时器
        clearInterval(window.anaModelTimer);
        clearInterval(window.anaModelCacheTimer);
      },

      //是否为重发模型
      isUpdateTime(model){
        return _.isEmpty(model.updatetime)
      }
    }


  }
</script>

<style scoped >
  #analytical-model{
    height:100%;
  }
  #tasks-list-container{
    height:100%;
    overflow-x:hidden;
    overflow-y:auto;
  }
  #toolscontent{
    display: none;
  }
  .contentli4{
    display: block!important;
  }
  .menumodel{
    padding:3px 18px 25px!important;
    /*background-color: rgb(194, 232, 238);*/
  }
  .menumodel {

  }
  #cls-modelinfo{
    width: 100%;
    height: 24px;
    display: -webkit-box;
    cursor: pointer;
    align-items: center;
    z-index: 99999;

  }
  #cls-modelinfo a{
    color: #afb3e0;
    display: block;
  }
  #cls-modelinfo span{
    cursor: pointer;
    display: block;
    height: 24px;
    line-height: 24px;
    font-weight: 700;
    font-size: 12px;
  }

  .task-analytical-model {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    width: 95%;
    margin: 6px;
    /*padding:6px 18px;*/
    padding:13px 18px 25px !important;
    border:1px solid transparent;
    border-radius: 5px;
    transition: all .3s;
  }
  .task-analytical-models{
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    width: 95%;
    margin: 6px;
    padding:13px 18px!important;
    border-radius: 5px;
    transition: all .3s;
  }
  .ivu-progress-wrong {
    background-color: #ed050b;
  }

  .ivu-progress-success {
    background-color: #19be6b;
  }

  #analytical-model .queryMore {
    text-align: center;
    margin: 2px auto;
    width: 276px;
    display: inline-block;
    text-decoration: underline;
    font-style: italic;
    color: #03A9F4;
  }



  .model-content-li {
  }
  /*.content-li-4{*/
    /*display: none;*/
  /*}*/
  .model-title{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 160px;
  }
  .model-time{
    color: #56578f;
  }
  #analytical-model .model-img {
    margin-top: 2px;
    margin-bottom: -3px;
  }

  #analytical-model .resultButton {
    margin-right: 1px;
    font-size: smaller;
    float: right;
    height: 22px;
    color: #FFF;
  }

  #analytical-model .resultContent{
    display: inline-block;
    width: 100%;
  }

  #analytical-model .resultSpan{
    font-weight: bolder;
  }

  #analytical-model .loadMoreSpan {
    text-align: center;
    width: 100%;
    margin: 1px auto;
    color: #2196F3;
    text-decoration: underline;
    font-style: italic;
    display: inline-block;
    cursor: pointer

  }

  #analytical-model .noMoreSpan {
    text-align: center;
    width: 100%;
    margin: 1px auto;
    color: #2196F3;
    font-style: italic;
    display: inline-block;
  }

  #analytical-model .model-icon{
    font-size: 18px;
    margin-right: 3px;
  }

  #analytical-model .model-tools{
    float: right;
    margin-right: 5px;

  }
  .model-tools{
    font-size: 16px;
    font-weight: 700;
  }
  #analytical-model li{
    list-style:none;
  }
  .analytical-model-img{
    width: 99px;
    height: 72px;
    border-radius: 5px;
  }
  .loader-container{
    cursor:not-allowed;
  }
  .loader{
    width: 99px;
    height: 72px;
    border-radius: 5px;
    border:1px dashed #6f77c7;
    line-height:72px;
  }
  .analytical-mouse-top {
    /*border: 2px solid #2C92B8;*/
    box-shadow: #98b1c6cc 1px 2px 2px 1px;
  }
</style>
<style>
  .task-analytical-model .ivu-row{
    margin-left: -14px !important;
    margin-right: -4px;
  }
  .task-analytical-model  .ivu-col-span-15{
    padding-left: 13px !important;
    padding-right: 4px;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
    position:relative;
    top:-10px;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>
