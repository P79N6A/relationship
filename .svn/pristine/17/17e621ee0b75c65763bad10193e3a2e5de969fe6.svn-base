import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

// 应用初始状态
const state = {
  //权限控制
  jurisdiction:null,
  isSnapshotConfirm:false,//切换图是否弹出确认框
  nodeSize:"",
  rightMenuReady:false,
  queryBaseDictionData:'',
  isAdvancedSearchModal:false,
  isExportSelectNodes:false,
  isAddNodeModal:false,
  isExpansionSetModal:false,
  isAddEdgeModal:false,
  isAddSnapshotModal: false,
  isAddTaskModal: false,
  isRightAddTaskModal:false,
  isAddCaseModal:false,
  isNodeEdit:false,
  isMergeNode:false,
  isAddLabelModal:false,
  isNodeSplit:false,
  addEdgeData:{},
  graphModelList: [],
  mergeNodeIdList:[],
  newGraphIndex: 1,
  loadChildTaskStatus:false,//是否加载完案件树的子节点
  deleteGraph: false,
  isshowsliderModel:true,  //初始关闭标签窗口；
  labellvls:'',     //
  isshowMoreSlider:'',
  isRightSelect:false,    //是否选中锁定
  isLogout:false,
  isshowSlider:true,
  markSlider:true,
  //撤销
  mergeBeforeEdges:null,//合并节点之前的边
  mergeBeforeNode:null,//合并节点之前的点
  mergeAfterAddEdges:null,//合并节点之后的边
  defaultNodeImgList:[],//默认节点图片数组
  modelrname:'',
  labelLvl:'',              //控制便签显示的系数
  Sliderlvl:0,             //标签指标滑块的指数
  newlvl:'',
  maxKshell:'',            //核心指标最大值
  minKshell:'',            //核心指标最小值
  resultJsons:'',
  currentZoom:'',           //修改后的zoom
  options:{//鼠标缩放参数
    zoomFactor: 0.3, // zoom factor per zoom tick
    zoomDelay: 45, // how many ms between zoom ticks
    minZoom: 0.01, // min zoom level
    maxZoom: 10, // max zoom level
    fitPadding: 50, // padding when fitting
    panSpeed: 10, // how many ms in between pan ticks
    panDistance: 10, // max pan distance per tick
    panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
    panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
    panInactiveArea: 8, // radius of inactive area in pan drag box
    panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
    zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
    fitSelector: undefined, // selector of elements to fit
    animateOnFit: function(){ // whether to animate on fit
      return false;
    },
    fitAnimationDuration: 1000 // duration of animation on fit
  },
  currentGraphModel: {
    taskName: '',
    graphId: '',
    data: [],
    rid:''
  },
  //分析模型列表选择模型id
  modelRid:"",
  currentResultDefinedLabel:[],
  //加载右侧任务区
  isLoadTaskCon: false,
  //加载右侧功能区
  isLoadStatisticsAndAnalyzeCon: false,
  showColor:false,
  rightConTabName: 'task',
  selectEdge: {
  },
  //节点属性对照表
  nodeProDict:[],
  //拆分节点 节点属性下拉框数据
  splitNodeSelectData:[],
  //取消团体组合
  removeGroupCombinationFlag:false,
  //取消手动组合
  removeManualFlag:false,
  //皮肤标识code
  themeType:"a",
  //关系类型
  edgeTypeList: [],
  //右侧基础属性选中
  baseLabelsFus:'',
  //右侧基础标签在图上的节点集合
  baseLabelsNodes:'',
  //皮肤样式
  isAddRelation:false,
  //产品介绍
  isProductModal:false,
  groups:[],
  groupsAll:{
    groups:[],
    otherGroupList:[],
    ready:true,
    colorDispaly:true
  },
  groupsBase:{
    groups:[],
    otherGroupList:[],
    ready:true,
    colorDispaly:true
  },

  //是否显示图形加载
  graphLoad:false,
  closeCase:false,
  //修改任务名称
  caseNameModal:false,
  //右键点击位置
  rightClick_position:null,
  //右键菜单添加节点
  menuAddNode:false
};

// 创建 store 实例
export default new Vuex.Store({
  actions,
  state,
  getters,
  mutations
})

/**
 *  使用方法:本vuex将 action 和 getter 分离至 actions.js 和 getter.js中
 *  this.$store.commit('changeLoginStatus',true)
 *  this.$store.dispatch('addSex',data)
 * */
