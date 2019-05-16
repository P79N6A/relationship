import * as canvasMange from '@/pages/graph/js/canvasManage'

import * as allOperation from '@/pages/graph/js/allOperation'


import * as labelManage from '@/pages/graph/js/lableManage'

import * as layoutManage from '@/pages/graph/js/layoutManage'

import * as snapshotManage from '@/pages/graph/js/snapshotManage'

import * as selectManage from '@/pages/graph/js/selectManage'

import store from  "../../vuex/store"

function expandLine(obj,data) {
  obj.$store.commit("showExpansionSetModal",true)
}
/**
 *添加节点右键出口
 * */

function rightMenuAdd(obj) {
  obj.$store.commit("showAddNodeModal",true);
}
function addLabel(obj) {
  obj.$store.commit("showAddLabelModal",true);
}
function intelligentSearch(obj) {
  store.commit("ShowAdvancedSearchModal", true);
}

export default {
  //改变布局
  changeLayout:layoutManage.changeLayout,
  //添加标签
  addLabel:addLabel,
  //删除标签
  removeLable:"",
  //拆分节点
  splitNode:allOperation.splitNode,
  //合并已选
  mergeSelected:allOperation.mergeSelected,
  //反选其他
  inverseOther:allOperation.opposeNodes,
  //显示关联节点
  selectLink:selectManage.neighborhoodNodes,
  //全选节点
  allSelectNode:selectManage.selectAllNodes,
  //全选关系
  allSelectRelation:selectManage.selectAllEdges,
  //添加
  rightAdd:rightMenuAdd,
  //添加关系
  addEdge: allOperation.addRelation,
  //添加任务
  addTask:allOperation.addNewTask,
  //保存
  save:"",
  //删除
  deleteHandle:allOperation.deleteNodes,
  //隐藏
  hideHandle:allOperation.hideNodes,
  //节点编辑
  nodeEdit:allOperation.nodeEdit,
  //复制
  copy:allOperation.Copy,
  //粘贴
  paste:allOperation.Paste,
  //锁定
  lock:allOperation.unSelectify,
  //全面扩线
  expandLine:expandLine,
  //本体溯源
  findRoot:allOperation.findRoot,
  //智能搜索
  intelligentSearch:intelligentSearch,
  //手动组合
  manualCombination:allOperation.manualCombination,
  //取消手动组合
  removeManualCombination:allOperation.removeManualCombination,
  //团体组合
  groupCombination:allOperation.groupCombination,
  //取消团体组合
  removeGroupCombination:allOperation.removeGroupCombination
}


