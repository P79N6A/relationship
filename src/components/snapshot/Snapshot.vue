<template>
  <div v-show="isShowSnapshotContent" id="snapshot">
    <div class="snapshot-content">
      <div class="snapshot-container" v-for="snapshotModel in snapshotModelList">
        <ul>
          <li class="snapshot-li" @mouseleave="mouseLeave($event)" style="display: inline-table; position: relative">
            <img @mouseenter="mouseEnter($event)" @click="viewSnapshotModelResult(snapshotModel)" class="snapshot-base-img f-csp" :src="snapshotModel.baseImage"/>
            <Icon class="snapshot-delete-icon f-csp" @click="deleteSnapshotModel(snapshotModel) " type="ios-trash"></Icon>
          </li>
          <li class="snapshot-li">
            <span :title="snapshotModel.sname">{{snapshotModel.sname}}</span>
          </li>
          <li class="snapshot-li">
            <span>{{snapshotModel.createtime}}</span>
          </li>
        </ul>
      </div>
      <div v-show="index === '0'" style="display: inline-table;">
        <span title="查看更多" @click="querySnapShotModelMore" class="loadMoreSpan">...</span>
      </div>
    </div>
  </div>
</template>

<script>

  import {URL} from "../../../api/urlsConfig"
  import GraphModel from "../../pages/graph/js/GraphModel"
  import * as Handle from "../../pages/graph/js/handle"
  import * as styleManage from "../../pages/graph/js/setStyleManage"

  export default {
    name: "snapshot",
    data() {
      return {
        snapshotModelList: [],
        isShowSnapshotContent: false,
        currentSnapshotModel: '',
        pageSize: 10,
        page: 1,
        index: '1',

      }
    },

    mounted() {
    },
    computed:{
      deletable:function(){
        return this.$store.state.jurisdiction.deletable;
      }
    },
    methods: {

      initSnapShot() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.queryTaskSnapShotList(currentGraphModel)
      },

      queryTaskSnapShotList (currentGraphModel) {
        let _this = this;
        this.$http.request({
          method: 'get',
          params: {taskId: currentGraphModel.taskModel.taskId, pageSize: this.pageSize, page: this.page},
          url: URL.queryTaskSnapShotList,
          success: (data) => {
            if (data.code === 200) {
              this.snapshotModelList = data.data.list;
              if(_.isEmpty(this.snapshotModelList)){
                this.isShowSnapshotContent = false;
                this.$Message.warning("还没有保存快照！")
              }else {
                this.isShowSnapshotContent = true;
                _this.$nextTick(function (o) {
                  let snapshotClientWidth = document.querySelector('#snapshot').clientWidth;
                  let snapshotLeft = (-snapshotClientWidth/2) < -266 ? -266 : (-snapshotClientWidth/2);
                  document.querySelector('#snapshot').style.left = snapshotLeft + "px";
                });
              }
              this.index = data.data.index
            }
          },
          error: (data) => {
            this.$Message.warning('请求数据失败！');
          }
        })
      },

      showSnapshotContent(letf) {
        if(this.isShowSnapshotContent){
          this.isShowSnapshotContent = false;
          return false
        }
        let currentGraphModel = this.$store.state.currentGraphModel;
        if(_.isEmpty(currentGraphModel.taskModel)){
          return false
        }
        this.currentSnapshotModel = currentGraphModel;
        this.currentSnapshotModel.sid = currentGraphModel.rid;
        this.queryTaskSnapShotList(currentGraphModel);
      },

      hiddenSnapshot() {
        this.isShowSnapshotContent = false;
      },

      //删除快照
      deleteSnapshotModel(model) {
        let _this = this;
        this.$Modal.confirm({
          title: '是否删除快照：' + model.sname,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$http.request({
              method: 'post',
              params: {sid: model.sid},
              url:URL.deleteSnapShot,
              success:(data)=>{
                if (data.code === 200 && data.data === "1"){
                  this.snapshotModelList = _.reject(this.snapshotModelList, {'sid': model.sid});
                  console.info("删除快照成功：" + model.sname);
                  //显示当前模型结果，删除后显示任务数据
                  if(model.sid === _this.currentSnapshotModel.sid) {
                    //切换图形显示加载图
                    this.$store.commit("graphLoad",true);
                    this.$store.commit("showStatisticsAndAnalyzeCon", false);
                    this.$store.commit("showColorBar", false);
                    //查询当前任务最后一个快照json
                    this.queryLayoutData();
                  }
                }
              },
              error:(data)=>{
                this.$Message.warning('请求数据失败！');
              }
            })
          }
        });
      },

      //请求当前图的所有标记
      queryCurrentResultDefinedLabel(datas,currentGraphModel){

        let rid = datas.data.id;
        this.$http.request({
          method:'get',
          params:{
            rid:rid,
            code:0
          },
          url:URL.queryCurrentResultDefinedLabel,
          success:(data)=>{
            if(data.code===200){
              let currentResultDefinedLabel = data.data;
              this.$store.commit("setCurrentResultDefinedLabel",currentResultDefinedLabel);
              this.loadGraph(datas.data.resultJson, currentGraphModel);
            }
          },
          error:(data)=>{
            this.$Message.warning('请求数据失败！')
          }
        })
      },

      //请求图数据
      queryLayoutData(){
        let currentGraphModel = this.$store.state.currentGraphModel;
        let _this = this;
        this.$http.request({
          method: 'get',
          params: {taskId: currentGraphModel.taskModel.taskId, code:0},
          url:URL.queryResultJsonById,
          success: (data) => {
            if(data.code === 200){
              //加载图
              currentGraphModel.code = 0;
              if(data.data.id){
                currentGraphModel.rid = data.data.id;
                this.queryCurrentResultDefinedLabel(data,currentGraphModel);//标记记载在图加载之前
              }else {
                this.$store.commit("setCurrentResultDefinedLabel",[]);
                this.loadGraph(data.data.resultJson, currentGraphModel);
              }
            }
          },
          error: (data) => {
            this.$Message.warning('请求数据失败！');
          }
        });
      },

      // setSelectedStyle () {
      //   let _this = this;
      //   setTimeout(function () {
      //     let currentSnapshotModel = _this.$store.state.currentGraphModel;
      //     currentSnapshotModel.cy.style()
      //       .selector(':selected')
      //       .css(
      //         {
      //           "border-width": "0.5px",
      //           "border-color": "#000000",
      //           "border-opacity": "1",
      //           "background-color": "#ff151a",
      //           "text-outline-color": "#ff151a"
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
      //       .selector('.edgehightlight')
      //       .css(
      //         {
      //           "line-color": "#cccccc"
      //         }
      //       )
      //       .selector('edge:selected')
      //       .css(
      //         {
      //           'width':2,
      //           'opacity':1,
      //           'line-color':'#ff151a'
      //         }
      //       )
      //       //关联发现高亮推荐最短路径
      //       .selector("edge[?shortestFlag]")
      //       .css(
      //         {
      //           'width': 2,
      //           'opacity': 1,
      //           'line-color': '#bd0e14'
      //         }
      //       )
      //       .update()
      //   },100)//延时大于点线渲染的延时
      // },

      //加载图
      loadGraph (data, currentGraphModel) {
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
        this.currentSnapshotModel = ''

      },

      //画布绑定点击时间
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
      //getSingleLvl
      changeSingleLvl(){
        this.$emit("getSingleLvl")
      },
      //查看快照结果
      viewSnapshotModelResult(model) {
        //图形指标关闭，数值初始化
        this.$store.commit("showMoreSlider", false);
        this.$store.state.isshowSlider=true;
        this.$store.commit("showSliderModel", this.$store.state.isshowSlider);
        this.changeSingleLvl();
        if(this.$store.state.isSnapshotConfirm){//图形有变化弹出是否保存快照提示框
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
              this.querySnapshotById(model)
            },
          })
        }else{
          //切换图形显示加载图
          this.$store.commit("graphLoad",true);
          this.querySnapshotById(model)
        }
      },

      querySnapshotById(model){
        this.currentSnapshotModel = model;
        let _this = this;
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.$store.commit("showStatisticsAndAnalyzeCon", false);
        this.$store.commit("showColorBar", false);

        //前端打包测试
         let url = URL['querySnapshotData' + model.index];
        console.log('querySnapshotData' + model.index);
        this.$http.request({
          method: 'get',
          params: {rid: model.sid, code:0},
          url:URL.debug?url:URL.queryResultJsonById,
//           url:url,  //前端打包测试
          success:(data)=>{
            if (data.code === 200){
              //加载图
              currentGraphModel.rid = data.data.id;
              currentGraphModel.code = 0;
              this.queryCurrentResultDefinedLabel(data,currentGraphModel);
              console.info("查看快照结果：" + model.rname)
              this.$store.commit("Sliderlvl",0);//标签指标初始化
              this.$store.commit("baseLabelsFus",[]);//选择属性标签初始化
            }
          },
          error:(data)=>{
            this.$Message.warning('请求数据失败！');
          }
        })
      },

      //快照查看更多
      querySnapShotModelMore() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.pageSize += 10;
        this.queryTaskSnapShotList(currentGraphModel);
      },

      mouseEnter(event) {
        event.target.classList.add('snapshot-mouse-top');
        if(this.deletable && !this.$store.state.closeCase){
          event.target.parentElement.lastElementChild.style.display = 'block'
        }
      },

      mouseLeave(event) {
        event.target.firstElementChild.classList.remove('snapshot-mouse-top');
        event.target.lastElementChild.style.display = 'none'
      },

      mouseLeaveSnapshotContent() {
        this.isShowSnapshotContent = false;
      }
    },
  }
</script>

<style scoped>
  #snapshot{
    position: absolute;
    top: 56px;
    z-index: 999;
    max-width: 725px;
    color: #fff;
    padding:0 10px;
    background-color: #6269a9;
  }

  .snapshot-content {
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    background-color: #6269a9;
  }
  .snapshot-content::-webkit-scrollbal-track{
    background:#6269a9;
  }
  #snapshot .snapshot-li{
    list-style: none;
    margin: 2px 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 120px;
    text-align: center;
  }

  .snapshot-base-img {
    width: 120px;
    height: 90px !important;
    background-color: #f0f0f0;
    border-radius: 10px;
  }

  .snapshot-container {
    margin: 5px 10px;
    width: 120px;
    display: inline-table;
  }

  .snapshot-mouse-top {
    border: 2px solid #3f51b5;
  }

  .snapshot-delete-icon {
    position: absolute;
    left: 2px;
    top: 1px;
    font-size: 18px;
    display: none;
  }

  #snapshot .loadMoreSpan {
    margin: 1px 5px;
    cursor: pointer;
    font-size: 20px;

  }

</style>
