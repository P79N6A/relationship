import store from  "../../../vuex/store"
import mutations from  "../../../vuex/mutations"
import * as Handle from './handle'
import {Message} from 'iview'
import axios from '@/utils/axios'
import * as urlApi from "@/../api/urlsConfig"
/**
 *新增案件标识节点
 */
export function addCasnodes(data) {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy.add(data);
  let layout = cy.nodes('[mark='+1+']').layout({
    name:"grid",
    fit:false,
    boundingBox:{x1:0,y1:0,w:1,h:1},
    avoidOverlap: true,
    type:'star'
  });
  layout.run();
  cy.center(cy.nodes('[mark='+1+']'));
  cy.nodes().unselect();
  let addNodeIds = _.map(_.map(data.nodes, 'data'), 'id');
  _.each(cy.nodes(), function (node) {
    if(_.includes(addNodeIds, node.id())){
      node.select()
    }
  });

  //新增点的标识替换
  _.each(cy.nodes('[mark='+1+']'), function(node){
    node.data().casemark = 0
  });
  //案件标识号码设置形状  参数：shape,  star:形状名称
  let nodes=cy.nodes('[casemark='+0+']')
  cy.style()
    .selector(nodes)
    .style("shape","star")
    .update();
  //添加数据至当前model
  refreshRightCon(cy);
}
/**
 * 新增节点
 */
export function addNode(data) {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy.add(data);
  //右键点击坐标
  let rightClick_position = store.state.rightClick_position;
  let menuAddNode = store.state.menuAddNode;

  let layout = cy.nodes('[mark='+1+']').layout({
    name:"grid",
    fit:false,
    boundingBox:{x1:menuAddNode ?rightClick_position.x: 0,y1:menuAddNode ?rightClick_position.y: 0,w:1,h:1},
    avoidOverlap: true
  });
  layout.run();
if(!menuAddNode){
  cy.center(cy.nodes('[mark='+1+']'));
}
  cy.nodes().unselect();
  cy.nodes('[mark='+1+']').select();
  //选中添加的点，包含与已有的点重复的点
  let addNodeIds = _.map(_.map(data.nodes, 'data'), 'id');
  _.each(cy.nodes(), function (node) {
    if(_.includes(addNodeIds, node.id())){
      node.select()
    }
  });

  //新增点的标识替换
  _.each(cy.nodes('[mark='+1+']'), function(node){
    node.data().mark = 0
  });
  if(!menuAddNode){
    cy.center(cy.nodes('[mark='+0+']'));
  }
  //添加数据至当前model
  if(_.isEmpty(currentGraphModel.data)) {
    currentGraphModel.data = data;
  }else {
    currentGraphModel.data.nodes = _.flatten([data.nodes, currentGraphModel.data.nodes]);
  }
  store.commit("showStatisticsAndAnalyzeCon", true);
  store.commit("menuAddNode",false)
  // //未保存显示任务星号
  // let taskStarId = currentGraphModel.taskModel.taskStarId;
  // if(taskStarId && document.getElementById(taskStarId)) {
  //   document.getElementById(taskStarId).style.visibility = 'visible';
  // }
}

/**
 * 扩线查询
 * @param data
 * @param cy
 */
export function expandLine(data, cy) {
  // cy.remove("[id='" + cy._private.curNode.id() + "']");
  //当为新添加的点，删除后显示扩线后的点
  let connectedEdges = cy._private.curNode.connectedEdges();
  let expandCurrentNode = _.find(data.nodes, function (node) {
    if(node.data.name === cy._private.curNode.data('name') && node.data.type === cy._private.curNode.data('type')) {
      return node;
    }
  });
  if(cy._private.curNode.data('id')=== cy._private.curNode.data('name')){
    cy.remove("[id='" + cy._private.curNode.id() + "']");
  }else {
    //过滤掉当前点
    data.nodes = _.reject(data.nodes, expandCurrentNode);
    //过滤当前图上已有的线
    data.edges = _.reject(data.edges, function (addEdge) {
      return _.find(connectedEdges, function (edge) {
        if (addEdge.data.type === edge.data('type')
          && addEdge.data.source === edge.data('source')
          && addEdge.data.target === edge.data('target')) {
          return addEdge
        }
      })
    });
    cy.nodes("[id='" + cy._private.curNode.id() + "']").data().flag = 1;
  }
  let newData = {nodes: data.nodes, edges: data.edges};
  cy.add(newData);
  // //给当前扩线点加标识
  let curNode_x= cy._private.curNode.position().x;
  let curNode_y= cy._private.curNode.position().y;
  let layout = cy.nodes('[flag='+1+']').layout({
    name:"concentric",
    fit:false,
    boundingBox:{x1: curNode_x, y1: curNode_y, w: 1,h: 1},
    avoidOverlap: true
  });
  layout.run();
  //将手动添加的线重新加到画布中
  let newEdges = [];
  _.each(connectedEdges, function (edge) {
    let newEdge = {data: edge.data()};
    if(newEdge.data.source === cy._private.curNode.data('id')){
      newEdge.data.source = expandCurrentNode.data.id
    }
    if(newEdge.data.target === cy._private.curNode.data('id')){
      newEdge.data.target = expandCurrentNode.data.id
    }
    newEdges.push(newEdge)
  });
  cy.add({edges: newEdges});
  cy.nodes('[flag='+1+']').select();
  _.each(cy.nodes('[flag='+1+']'), function(node){
    node.data().flag = 0
  })
}

/**
 * 节点隐藏
 */
export function hideNodes() {

  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let selectNode =  cy.$(":selected");
  if(selectNode.length>0){//节点隐藏同时隐藏有标记的小对号
    _.forEach(selectNode,function (value) {
      if (value._private.classes.size > 0) {
        var name = value.data().name
        let el = document.getElementById(`${name}_label`);
        if (el) {
          el.parentNode.style.display = "none";
        }
      }
      if(value.locked()==true){
         value.show()
      }else {
        value.data().tollMark=1;
        value.hide()
      }
    })
  }

}

/**
 * 节点显示
 */
export function showNodes() {
  debugger
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let selectNode =  cy.$(":hidden");
  _.filter(selectNode,function (node) {
    if(node.data().tollMark==1){
      node.show()
    }
  })
  if(selectNode.length>0){//节点显示同时显示有标记的小对号
    _.forEach(selectNode,function (value) {
      if (value._private.classes.size > 0&&value.data().tollMark==1) {
        var name = value.data().name
        let el = document.getElementById(`${name}_label`);
        if (el) {
          el.parentNode.style.display = "block";
        }
      }
    })
  }
}
/**
 * 点/框选节点删除
 */
export function deleteNodes() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let collection = cy.collection()

  let nodes = cy.$(":selected");
  let deleteNodes=_.filter(nodes,function (node) {
    if (node.locked() == true) {
      // store.state.isRightSelect=true;
    }else {
      return node


    }
  })
  collection.merge(deleteNodes)
  currentGraphModel.ur.do("remove",collection);
  cy.scratch('deleteNode',collection);   //利用暂存区存储被删除的元素  可使用 window.cy.scratch(deleteNode) 查看该暂存区内的值
  cy.scratch('deleteNode');
  //有节点删除切换任务弹出是否保存快照提示框
  if(deleteNodes.length>0){
    store.commit("setSnapshotConfirm",true);
    //分组处理
    let nodesAll = currentGraphModel.data.nodes;
    let groupBase = _.groupBy(nodesAll,function (node) {
      return node.data.group;
    })

    if(currentGraphModel.data.groups){
      dealGroups(cy,deleteNodes,collection);
      let groups = [];
      _.each(groupBase,function (value,groupId) {
        var group = {
          "select": true,
          "groupId": 3,
          "num": 0
        }
        group.groupId = groupId;
        group.num = value.length;
        if(groupId != "undefined"){
          groups.push(group)
        }
      })
      store.commit("setGroups",groups);
    }

  }


  //刷新右侧统计树
  refreshRightCon(cy);
  //未保存显示任务星号
  // let taskStarId = currentGraphModel.taskModel.taskStarId;
  // if(taskStarId && document.getElementById(taskStarId)) {
  //   document.getElementById(taskStarId).style.visibility = 'visible';
  // }
}

function dealGroups(cy,deleteNodes,collection) {
  var groupsAll = store.state.groupsAll;
  var groupsBase= store.state.groupsBase;

  //未删除的nodes
  let noDeleteNodes = cy.nodes().difference(collection);
  if(noDeleteNodes.length==0){//说明节点全部删除
    groupsAll.groups = [];
    groupsAll.otherGroupList = [];
    groupsAll.ready = false;
    groupsAll.colorDispaly = false;
  }else{
    let groups = groupsAll.groups;
    let otherGroupList = groupsAll.otherGroupList;

    let groupDeleteBase = _.map(deleteNodes,function (node) {
        return node.data().group;
    })
    let groupsDelete = _.uniq(groupDeleteBase);//删除节点的分组集合

    if(groupsDelete.length>0){
      let groupsRepeat = _.map(noDeleteNodes, function (node) {
        return node.data().group;
      })
      let groupLst = _.uniq(groupsRepeat);//存在节点的分组集合
      let deleteGroups = [];//彻底删除的分组，节点中不再存在
      groupsDelete.forEach(function (e) {
        if(groupLst.indexOf(e) <= -1){
          deleteGroups.push(e)
        }
      })

      if(deleteGroups.length>0){
        if(otherGroupList.length>0){
          _.remove(otherGroupList,function (e) {
            return deleteGroups.indexOf(e.groupId) > -1
          })
          if(otherGroupList.length==0){//移除合并分组
            groups = _.dropRight(groups)
            groupsAll.ready = false;
          }
        }
        _.remove(groups,function (e) {
          return deleteGroups.indexOf(e.groupId) > -1
        })
      }
    }
    groupsAll.groups = groups;
    groupsAll.otherGroupList = otherGroupList;
    groupsAll.colorDispaly = true;
    store.commit("setGroupsAll",groupsAll)
  }
}
/**
 * 获取锁定的节点
 */
function nodesLocked() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  // let s=cy.nodes()
  return cy.$(":selected").locked()
}

/**
 * 节点禁用
 */
export function unSelectify() {

  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy.$(":selected").lock();
  cy.nodeHtmlLabel(
    [
      {
        query:':locked',
        halign:'top',
        valign:'right',
        cssClass:'locked-node',
        tpl:function (data) {
          return `<div id=${data.name}_lock></div>`;
        }
      }
    ]
  );
  //触发样式更新，每次颜色设置不一样，样式一样不会触发更新
  let colorVal = cy._private.curNode.style().textOutlineColor;
  if(colorVal == 'rgb(255,255,255)'){
    colorVal = 'rgb(255,250,250)';
  }else{
    colorVal = 'rgb(255,255,255)';
  }
  cy.style()
    .selector(cy._private.curNode)
    .style("text-outline-color", colorVal)
    .update();
}

/**
 * 节点解锁
 */
export function Selects() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy.$(":selected").unlock();
}

/**
 *清除选中状态
 */
export function unselect() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  if(currentGraphModel.collectionNodes != undefined){
    currentGraphModel.collectionNodes.length = 0;
    cy.nodes().forEach(function (ele,i,eles) {
      ele.unselect();
      currentGraphModel.collectionNodes = currentGraphModel.collectionNodes.union(ele);
    });
  }
  $('#toolbar span').css({backgroundColor:'',boxShadow: ''})
}
/**
 * 导出选中节点
 */
export  function exportSelectNodes() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let nodes =cy.$(":selected");
  if(nodes.length>0){
   return true
  }
}
//解锁，清除解锁标记
export  function  unSelectifys() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let nodes=_.filter(cy.nodes(),function (node) {
     if(node.locked()){
       return node
     }
  })
  _.each(nodes,function (node) {
    node.data().isLock = 0;
    let name = node.data().name;
    let el = document.getElementById(`${name}_lock`).parentNode
    el.className = "unlocked-node";
  })
  cy.nodes().unlock();
}
/**
 * 视图刷新，隐藏节点显示
 */
export function reset() {
  showNodes();
  unselect();
  unSelectifys();
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let cyRef = cy;
  //同心圆，力，预设布局点数少时刷新会变化大小，进行特殊处理
  if(currentGraphModel.data.nodes != undefined && currentGraphModel.data.nodes.length <= 15
    && ('concentric' == cy._private.layoutName
      || 'preset'  == cy._private.layoutName
      ||  'euler'== cy._private.layoutName )){
  }else{
    let options = store.state.options;//滚轮缩放参数
    var elesToFit = options.fitSelector?cyRef.elements(options.fitSelector):cyRef.elements();
    if( elesToFit.size() === 0 ){
      cyRef.reset();
    } else {
      var animateOnFit = typeof options.animateOnFit === 'function' ? options.animateOnFit.call() : options.animateOnFit;
      if(animateOnFit){
        cyRef.animate({
          fit: {
            eles: elesToFit,
            padding: options.fitPadding
          }
        }, {
          duration: options.fitAnimationDuration
        });
      } else {
        cyRef.fit( elesToFit, options.fitPadding );
      }
    }
  }
  //刷新图形恢复之前的样式
  cy.nodes().removeClass('otherNodeColor');
  cy.edges().removeClass('otherEdgeColor');
  cy.zoom(store.state.currentZoom);
  cy.center();
  return false;
}
/**
 * 撤销
 */
export function undoHandler() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  //先撤销，再显示节点取消选中
  if(!currentGraphModel.ur.isUndoStackEmpty()) {
		currentGraphModel.ur.undo();
  }
  showNodes();
  unselect();

  if(currentGraphModel.data.groups){
    refreshColorBar(cy);
  }
  //刷新右侧统计树
  refreshRightCon(cy);
}

function deepClone(obj) {
  let _obj = JSON.stringify(obj);
  let objClone = JSON.parse(_obj);
  return objClone;
}

function refreshColorBar(cy) {
  //根据图上的点计算分组，用于分组更新后色条刷新
  var nodesAll =  cy.json().elements.nodes;
  let groupBase = _.groupBy(nodesAll,function (node) {
    return node.data.group;
  })

  //图上存在点的group集合
  let groupLst = [];
  _.each(groupBase,function (value,groupId) {
    var group = {
      "select": true,
      "groupId": 3,
      "num": 0
    }
    group.groupId = groupId;
    group.num = value.length;
    if(groupId != "undefined"){
      groupLst.push(group)
    }
  })

   let groupIdLst = _.map(groupLst,function (e) {
     return e.groupId;
   })

  let groupsBase = store.state.groupsBase;
  //深copy一份初始化分组信息操作，始终不能更改初始化分组信息
  let groupsAll = deepClone(groupsBase);
  let groups  = groupsAll.groups;
  let otherGroupList = groupsAll.otherGroupList;
  let groupsNew = [];
  let otherGroupListNew = [];
  //重组新的group，和原来的顺序保持一致
  groups.forEach(function (e,id) {
    if(groupIdLst.indexOf(e.groupId.toString())>-1){
      groupsNew.push(e);
      groupsAll.colorDispaly = true;//有分组显示色条
      groupsAll.ready =false;//合并分组小箭头
    }
  })

  let mergeGroupId = "";
  otherGroupList.forEach(function (e,id) {
    if(groupIdLst.indexOf(e.groupId.toString())>-1){
      otherGroupListNew.push(e);
      mergeGroupId = mergeGroupId + e.groupId + ",";
    }
  })
  mergeGroupId = mergeGroupId.substring(0,mergeGroupId.length-1)

  //合并分组不为空，加入groupsNew
  if(mergeGroupId != ""){
    let mergeGroup = groups[groups.length-1];//groups最后一个组为合并分组
    mergeGroup.groupId = mergeGroupId;//更新最后一个分组的id，其他信息不变

    groupsNew.push(mergeGroup);
    groupsAll.colorDispaly = true;
    groupsAll.ready =true;
  }
  groupsAll.groups = groupsNew;
  groupsAll.otherGroupList = otherGroupListNew;
  store.commit("setGroupsAll",groupsAll);
  store.commit("setGroups",groupLst);
}
/**
 * 保存
 */
export function saveNodes() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let newNodeList  =  cy.json();
  return newNodeList;
}


/**
 * 导出图片
 */
export function downloadImg(name) {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  var datas = cy.png();
   downloadFile(name,datas)
}
/**
 * base64转blob
 */
 function base64ToBlob(code) {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1]; //处理拿到的数据
  let raw =window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Arry = new Uint8Array(rawLength);
  for (let i=0;i<rawLength;i++) {
    uInt8Arry[i]= raw.charCodeAt(i);
  }
  return new Blob([uInt8Arry],{type:contentType});
}
/**
 * 预下载处理
 */
function downloadFile(fileName,content) {
  let aLink =document.createElement('a');
  let blob= base64ToBlob(content);
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("click",false,true);               //initEvent 不加这两个参数在FF会报错，事件类型，是否冒泡，是否组织浏览器默认行为
  aLink.download=fileName;
  aLink.href=URL.createObjectURL(blob);
  $('#toolbar span').css({backgroundColor:'',boxShadow: ''});

  aLink.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window})); //兼容火狐
}

/**
*复制
 */
export function Copy(e) {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
   return cy.clipboard().copy(cy.$(":selected"))
}

/**
 *粘贴
 */
export function Paste() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  currentGraphModel.ur.do('paste');
}

/**
 *自由选择
 */
export function freeSelectNodes() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  //禁止鼠标移动图形
  cy.userPanningEnabled(false);
  cy.panningEnabled(false);
  var $container = $($(cy.container())[0]);
  var w = $container.width();
  var h = $container.height();
  var drawLayer = document.getElementById("draw");
  var drawCtx = drawLayer.getContext('2d');
  showDrawLayer();

  drawLayer.onmousedown = function (ev) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
    document.onmousemove = function (em) {
      var x2 = em.offsetX;
      var y2 = em.offsetY;
      drawCtx.lineTo(x2, y2);
      drawCtx.stroke();
    };
    document.onmouseup = function (e) {
      $("#legendPanel").find(".color").css({
        "border": "none"
      });//移除色签选中样式
      $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
      drawCtx.closePath();
      document.onmousemove = null;
      document.onmouseup = null;
      let nodesSelect = cy.nodes().filter(function (ele) {
        let n = ele.renderedPosition();
        let x = n.x;
        let y = n.y;
        if (drawCtx.isPointInPath(x, y)) {
          return ele;
        }
      });

      if (!e.ctrlKey) {
        cy.nodes().unselect();//清除之前选择的节点
        cy.$(nodesSelect).select();
        currentGraphModel.collectionNodes = cy.$(":selected");
      }else{
        cy.$(nodesSelect).select();
        currentGraphModel.collectionNodes = cy.$(":selected");
      }
      $("#draw").hide();
      cy.userPanningEnabled(true);
      cy.panningEnabled(true);
    };
  };
}
/**
 *拉框选择
 */
export function frameSelect() {
  $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  //禁止鼠标移动图形
  cy.userPanningEnabled(false);
  cy.panningEnabled(false);
  var $container = $($(cy.container())[0]);
  var w = $container.width();
  var h = $container.height();
  var drawLayer = document.getElementById("draw");

  var drawCtx = drawLayer.getContext('2d');
  showDrawLayer();

  var startX, startY, endX, endY;
  drawLayer.onmousedown = function (ev) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    startX = ev.offsetX;
    startY = ev.offsetY;
    document.onmousemove = function (em) {
      var x2 = em.offsetX - x;
      var y2 = em.offsetY - y;
      endX = em.offsetX;
      endY = em.offsetY;
      drawCtx.clearRect(0, 0, w, h);
      drawCtx.fillRect(x, y, x2, y2);
      drawCtx.strokeRect(x, y, x2, y2);
    };
    document.onmouseup = function (e) {
      $("#legendPanel").find(".color").css({
        "border": "none"
      });//移除色签选中样式
      $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
      document.onmousemove = null;
      document.onmouseup = null;

      let nodesSelect = cy.nodes().filter(function (ele) {
        var n = ele.renderedPosition();
        var x3 = n.x;
        var y3 = n.y;
        if (
          (endX > x3 && x3 > startX && endY > y3 && y3 > startY) ||
          (endX > x3 && x3 > startX && endY < y3 && y3 < startY) ||
          (endX < x3 && x3 < startX && endY < y3 && y3 < startY) ||
          (endX < x3 && x3 < startX && endY > y3 && y3 > startY)
        ) {
          return ele;
        }
      });
      if (!e.ctrlKey) {
        cy.nodes().unselect();
        cy.$(nodesSelect).select();
        currentGraphModel.collectionNodes = cy.$(":selected");
      }else{
        cy.$(nodesSelect).select();
        currentGraphModel.collectionNodes = cy.$(":selected");
      }
      $("#draw").hide();
      cy.userPanningEnabled(true);
      cy.panningEnabled(true);
    };
  };
}
/**
 *圆形选择
 */
export function circleSelect(){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  //禁止鼠标移动图形
  cy.userPanningEnabled(false);
  cy.panningEnabled(false);
  var $container = $($(cy.container())[0]);
  var w = $container.width();
  var h = $container.height();
  var drawLayer = document.getElementById("draw");
  var drawCtx = drawLayer.getContext('2d');
  showDrawLayer();

  drawLayer.onmousedown = function (ev) {
    let x = Math.abs(ev.offsetX);
    let y = Math.abs(ev.offsetY);
    document.onmousemove = function (em) {
      let currentX = em.offsetX -x;
      let currentY = em.offsetY -y;
      let r = Math.sqrt(currentX*currentX+currentY*currentY);
      drawCtx.beginPath();
      drawCtx.clearRect(0, 0, w, h);
      drawCtx.arc(x, y, r, 0,Math.PI*2,true);
      drawCtx.stroke();
    };
    document.onmouseup = function (e) {
      $("#legendPanel").find(".color").css({
        "border": "none"
      });//移除色签选中样式
      $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
      drawCtx.closePath();
      document.onmousemove = null;
      document.onmouseup = null;
      let nodesSelect = cy.nodes().filter(function (ele) {
        var n = ele.renderedPosition();
        var x = n.x;
        var y = n.y;
        // let id = ele.json().data.id;
        // cy.$("#"+id).json({selected:true});
        if (drawCtx.isPointInPath(x, y)){
          return ele;
        }
      });

      if (!e.ctrlKey) {
        cy.nodes().unselect();//清除之前选择的节点
        cy.$(nodesSelect).select();
        currentGraphModel.collectionNodes = cy.$(":selected");
        console.log(cy.$(":selected").jsons());
      }else{
        cy.$(nodesSelect).select();
        currentGraphModel.collectionNodes = cy.$(":selected");
      }
      $("#draw").hide();
      cy.userPanningEnabled(true);
      cy.panningEnabled(true);
    };
  };
}


/**
 * 区域放大
 */
export function frameEnlarge(){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let $container = $(cy.container());
  let w = $container.width();
  let h = $container.height();
  let drawLayer = document.getElementById("draw");
  let drawCtx = drawLayer.getContext('2d');
  showDrawLayer();
  let startX, startY, endX, endY;
  drawLayer.onmousedown = function (ev) {
    let x = ev.offsetX;
    let y = ev.offsetY;
      startX = ev.offsetX;
      startY = ev.offsetY;
    let dw = 0, dh = 0;
    drawLayer.onmousemove = function (em) {
      dw = em.offsetX - x;
      dh = em.offsetY - y;
      endX = em.offsetX;
      endY = em.offsetY;
      drawCtx.clearRect(0, 0, w, h);
      drawCtx.fillRect(x, y, dw, dh);
      drawCtx.strokeRect(x, y, dw, dh);
    };
    drawLayer.onmouseup = function (e) {
      $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
      drawLayer.onmousemove = null;
      drawLayer.onmouseup = null;

      let nodesSelect = cy.nodes().filter(function (ele) {
        var n = ele.renderedPosition();
        var x3 = n.x;
        var y3 = n.y;
        if (
          (endX > x3 && x3 > startX && endY > y3 && y3 > startY) ||
          (endX > x3 && x3 > startX && endY < y3 && y3 < startY) ||
          (endX < x3 && x3 < startX && endY < y3 && y3 < startY) ||
          (endX < x3 && x3 < startX && endY > y3 && y3 > startY)
        ) {
          return ele;
        }
      });
      //cy.$(nodesSelect).select();
      if (dw > 0 && dh > 0) {
        var zoomIn = w/dw;
        // cy.zoom({
        //   level:zoomIn,
        //   position:{x:x,y:y}
        // });

        //cy.panBy({x:x,y:y});

        let options = store.state.options;
        let factor = 1 + options.zoomFactor+zoomIn;
        zoom(factor);

        cy.center(cy.$(nodesSelect));
      }
      $("#draw").hide();
    }
  };
}

/**
 * 区域缩小
 */
export function frameZoomout(){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  var $container = $($(cy.container())[0]);
  var w = $container.width();
  var h = $container.height();
  var drawLayer = document.getElementById ("draw");
  var drawCtx = drawLayer.getContext('2d');
  showDrawLayer();

  var startX, startY, endX, endY;
  drawLayer.onmousedown = function (ev) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    startX = ev.offsetX;
    startY = ev.offsetY;
    var dw = 0, dh = 0;
    drawLayer.onmousemove = function (em) {
      dw = em.offsetX - x;
      dh = em.offsetY - y;
      endX = em.offsetX;
      endY = em.offsetY;
      drawCtx.clearRect(0, 0, w, h);
      drawCtx.fillRect(x, y, dw, dh);
      drawCtx.strokeRect(x, y, dw, dh);
    };
    drawLayer.onmouseup = function (e) {
      $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
      drawLayer.onmousemove = null;
      drawLayer.onmouseup = null;
      let nodesSelect = cy.nodes().filter(function (ele) {
        var n = ele.renderedPosition();
        var x3 = n.x;
        var y3 = n.y;
        if (
          (endX > x3 && x3 > startX && endY > y3 && y3 > startY) ||
          (endX > x3 && x3 > startX && endY < y3 && y3 < startY) ||
          (endX < x3 && x3 < startX && endY < y3 && y3 < startY) ||
          (endX < x3 && x3 < startX && endY > y3 && y3 > startY)
        ) {
          return ele;
        }
      });

      if (dw > 0 && dh > 0) {
        var zoomIn = dw/w;
        // cy.zoom({
        //   level:zoomIn//,
        //   // position:{x:x,y:y}
        // });
        //cy.panBy({x:-x,y:-y});

        let options = store.state.options;
        let factor = 1 + options.zoomFactor-zoomIn;
        zoom(factor);
        cy.center(nodesSelect);
      }
      $("#draw").hide();
    }
  };
}
/**
 * 框选区域
 */
function showDrawLayer(){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  var $container = $($(cy.container())[0]);
  var w = $container.width();
  var h = $container.height();
  var drawLayer = document.getElementById("draw");
  var drawCtx = drawLayer.getContext('2d');

  $("#draw").show();
  drawLayer.width = w;
  drawLayer.height = h;
  drawLayer.style.cursor = "crosshair";
  drawCtx.clearRect(0, 0, w, h);
  drawCtx.strokeStyle = "rgb(204,10,10)";
  drawCtx.fillStyle = "rgba(204,10,10,.3)";
  drawCtx.strokeWidth = 1;
  drawCtx.lineWidth = 1;
}

/**
*添加关系
* */
export function addRelation(node, cy) {
  cy.eh.enable();
  cy.eh.start(node);
  store.commit("isAddRelation",true);
  let el = document.querySelector("div[name='canvasContainer'] canvas:first-of-type");
  el.onmouseout = function(){
    cy.eh.stop();
    store.commit("isAddRelation",false);
  }
}

//手动增加连线
export function addEdge(cy) {
  let _this = this;
  let options = {
    complete: function (sourceNode, targetNode, addedEles) {
      cy.eh.disable();
      store.commit("showAddEdgeModal", true);
      store.commit("setAddEdgeData", addedEles.data());
    },
    stop: function () {
      //停止后屏蔽连线行为
      cy.eh.disable()
    },
    cancel: function () {
      //取消连线后屏蔽连线行为
      store.commit("isAddRelation",false);
      cy.eh.disable()
    }
  };
  let eh = cy.edgehandles(options);
  //关闭绘图模式
  eh.disableDrawMode();
  //初始化屏蔽连线行为
  eh.disable();
  cy.eh = eh;
}

/**
 *放大
 */
export function enlargeGraph() {
  let options = store.state.options;
  //let factor = 1 + options.zoomFactor+0.5;
  let factor = 1 + options.zoomFactor;
  zoom(factor);
}

/**
 *缩小
 */
export function shrinkGraph() {
  let options = store.state.options;
  //let factor = 1 - options.zoomFactor-0.5;
  let factor = 1 - options.zoomFactor;
  zoom(factor);
}

/**
 * 滚轮缩放
 * @param cy
 */
export function mouseZoom(cy) {
  let options = store.state.options;//滚轮缩放参数
  let factor;
  cy.userZoomingEnabled(false);//false不使用框架自带的zoom事件
  document.onmousewheel = function (e) {
    if(e.target.tagName == "CANVAS"){
      let event = e|| window.event;
      if(event.wheelDelta < 0){ //向下滚动
        factor = (1 - options.zoomFactor - 0.2);
      }else{  //向上滚动
        factor = (1 + options.zoomFactor + 0.2);
      }
      zoom(factor);
    }
  };

}

/**
 * 缩放关系图核心代码
 * @param factor
 */
function zoom(factor) {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let options = store.state.options;//滚轮缩放参数
  let cyRef = cy,$container = "",zx, zy,zooming = false;
  $(cy.container()).each(function(){
    $container = $(this);
  });
  startZooming();
  doZoom();

  function startZooming(){
    zooming = true;
    zx = $container.width()/2;
    zy = $container.height()/2;
  }
  function doZoom() {
    var zoom = cyRef.zoom();
    var lvl = cyRef.zoom() * factor;

    if( lvl < options.minZoom ){
      lvl = options.minZoom;
    }
    if( lvl > options.maxZoom ){
      lvl = options.maxZoom;
    }
    if( (lvl == options.maxZoom && zoom == options.maxZoom) ||
      (lvl == options.minZoom && zoom == options.minZoom)
    ){
      return;
    }
    zoomTo(lvl);
  }
  function zoomTo(level){
    if(!zooming){
      zx = $container.width()/2;
      zy = $container.height()/2;
    }
    cyRef.zoom({
      level: level,
      renderedPosition: { x: zx, y: zy }
    });
    if(window.popper) {
      window.popper.scheduleUpdate();
    }

  }
}
/**
 * 节点反选
 */
export function opposeNodes(){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy.$('.addBorderColor').removeClass('addBorderColor');
  cy.nodes().forEach(function (ele,i,eles) {
    let id = ele.json().data.id;
    currentGraphModel.collectionNodes = cy.collection();
    if(ele.selected()){
      ele.unselect()
    }else {
      ele.select()
      // cy.$("#"+id).json({selected:true});
      //currentGraphModel.collectionNodes = currentGraphModel.collectionNodes.union(ele);
    }
  });
  currentGraphModel.collectionNodes = cy.$(":selected");
}
/**
 * 节点编辑
 */
export function nodeEdit() {
  store.commit("showNodeEditModal", true);
}
/**
 * 拆分节点
 */
export function splitNode(){
  let splitNodeSelectData = store.state.splitNodeSelectData;
  if(splitNodeSelectData.length == 0){
    Message.warning('该节点无可拆分属性！');
  }
  else {
    store.commit("showNodeSplitModal",true);
  }
  store.commit("showStatisticsAndAnalyzeCon", true);
}


/**
 * 对数组去重
 */
function unique(arr) {
  let x = new Set(arr);
  return [...x];
}

/**
 * 手动组合
 */
export function manualCombination() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy._private.customManualRules = []; //创建一个空的手动组合rule
  store.commit("removeManualCombination",true);
  let isGroupComb = store.state.removeGroupCombinationFlag;
  var currentNodes = currentGraphModel.collectionNodes;//用户手动选中的点

  if(isGroupComb) { //团体组合开启
    let checkedGroup = [];  //用户选中的点中包含的组Id
    let allMoveNodes = null;
    _.each(currentNodes.jsons(),function (node) {
      checkedGroup.push(node.data.group);
    });
    let checkedUniqGroup = unique(checkedGroup);//去重后的组Id

    _.each(checkedUniqGroup,function (groupItem) {
      if(allMoveNodes==null){
        allMoveNodes = cy.nodes('[group='+groupItem+']');
      }else{
        allMoveNodes = allMoveNodes.union(cy.nodes('[group='+groupItem+']'));
      }
    });

    cy._private.customManualRules.push(cy.automove({
      nodesMatching:allMoveNodes,
      reposition:'drag',
      dragWith:allMoveNodes
    }));

  } else {  //团体组合未开启
    cy._private.customManualRules.push(cy.automove({
      nodesMatching:currentNodes,
      reposition:'drag',
      dragWith:currentNodes
    }));
  }
}

/**
 * 取消手动组合
 */
export function removeManualCombination() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let allManualComb =  cy._private.customManualRules;
  _.each(allManualComb,function(rule) {
    rule.destroy();
  });
  cy._private.customManualRules = [];
  store.commit("removeManualCombination",false);
}


/**
 * 团体组合
 */
export function groupCombination() {
  store.commit("removeGroupCombinationFlag",true);
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let allGroup = currentGraphModel.data.groups;
  cy._private.customAutoMoveRules = [];//团体组合生成的rules


  for(let i=0; i<allGroup.length; i++) {
    cy._private.customAutoMoveRules.push(cy.automove({
      nodesMatching:cy.nodes('[group='+allGroup[i].groupId+']'),
      reposition:'drag',
      dragWith:cy.nodes('[group='+allGroup[i].groupId+']')
    }));
  }
}

/**
 * 取消团体组合
 */

export function removeGroupCombination() {
  store.commit("removeGroupCombinationFlag",false);
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let autoRules = cy._private.customAutoMoveRules;
   _.each(autoRules,function(rule) {
     rule.destroy();
   });
  cy._private.customAutoMoveRules = [];

}


/**
 * 合并节点
 */
export function mergeSelected() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let curNode = cy._private.curNode;
  let selectNode = cy.$(":selected");
  var mergeNodeIdList = [];
  if(selectNode.length == 2){
    cy.$(":selected").forEach(function (value) {
      var name =value.data().name;
      mergeNodeIdList.push(name);
    });
    store.commit("setMergeNodeId",mergeNodeIdList);
    store.commit("showMergeNodeModal",true);
    // refreshRightCon(cy);
  }else{
    Message.warning('合并已选节点为两个！');
  }
}

/**
 * 人本溯源
 */
export function findRoot() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let curNode = cy._private.curNode;
  axios.request({
    method: 'get',
    params: {},
    url:urlApi.URL.queryRootFromPerson,
    success: (data) => {
      if(data.code === 200) {
        let nodesl = data.data.nodes.length;
        let edgesl = data.data.edges.length;
        if(nodesl == 0 && edgesl == 0) {
          Message.info('没有可溯源的节点！');
        } else {
          let graphData = data.data;
          _.each(graphData.nodes, function (node) {
            node.data.flag = 2
          });
          graphData.nodes = _.reject(graphData.nodes, function (node) {
            if(node.data.id === cy._private.curNode.id()) {
              return node;
            }
          });
          cy.add(graphData);
          //给当前溯源点加标识
          cy.nodes("[id='" + cy._private.curNode.id() + "']").data().flag = 2;
          let curNode_x= curNode.position().x;
          let curNode_y= curNode.position().y;
          /*let layout = cy.nodes('[flag='+2+']').layout({
            name:"breadthfirst",//concentric
            fit:false,
            boundingBox:{x1: curNode_x, y1: curNode_y, w: 1,h: 1},
            avoidOverlap: true,
            concentric:function(node){
              return node.degree();
            },
            levelWidth:function(nodes){
              return nodes.maxDegree()/4;
            }
          });*/
          /*let layout = cy.nodes('[flag='+2+']').layout({
            name:"breadthfirst",//concentric
            fit:false,
            directed:false,
            padding:10,
            circle:true,
            grid:false,
            avoidOverlap:true,
            nodeDimensionsIncludeLabels:false,
            roots:curNode,
            maximal:false,
            animate:false,
            animationDuration:500,
            animationEasing:undefined,
            animateFilter:function(node,i){ return true; },
            ready:undefined,
            stop:undefined,
            transform:function(node,position){ return position; },
            boundingBox:{x1: curNode_x, y1: curNode_y, w: 1,h: 1}
          })*/
          layout.run();
          cy.nodes('[flag='+2+']').select();
          // cy.center();
          _.each(cy.nodes('[flag='+2+']'), function(node){
            node.data().flag = 0
          })
          //添加数据至当前model
          // currentGraphModel.data.nodes = cy.json().elements.nodes;
          // currentGraphModel.data.edges = cy.json().elements.edges;
          //刷新节点树
          // this.$store.commit("showStatisticsAndAnalyzeCon", true);
          //未保存显示任务星号
          // let taskStarId = currentGraphModel.taskModel.taskStarId;
          // if(taskStarId && document.getElementById(taskStarId)) {
          //   document.getElementById(taskStarId).style.visibility = 'visible';
          // }
        }

      }
    },
    error: (data) => {
      Message.warning('溯源失败！');
    }
  });
}

/**
 * 最短路径
 */
export function shortestPath(cy, selectNodes) {
  let aStar = cy.elements().aStar({root:selectNodes[0], goal:selectNodes[1]});
  let firstDistance = aStar.distance;
  let selectEdges = cy.collection();
  if(aStar.found){
    let selectEle = aStar.path.edges().select();
    selectNodes.merge(aStar.path.nodes());
    selectEdges.merge(aStar.path.edges());
    recursionShortestPath(selectEle, selectNodes, selectEdges, firstDistance, cy.elements());
    setAshOther(cy, selectNodes, selectEdges);
  }else {
    Message.warning('没有最短路径！');
  }
}

/**
 * 递归显示多条相同最短路径
 */
export function recursionShortestPath(selectEle, selectNodes, selectEdges, firstDistance, elements) {
  let residueEle = elements.difference(selectEle);
  residueEle.merge(selectNodes);
  let aStar = residueEle.aStar({root:selectNodes[0], goal:selectNodes[1]});
  let distance = aStar.distance;
  if(aStar.found && distance === firstDistance){
    let cirSelectEle = aStar.path.edges().select();
    selectNodes.merge(aStar.path.nodes());
    selectEdges.merge(aStar.path.edges());
    recursionShortestPath(cirSelectEle, selectNodes, selectEdges, firstDistance, residueEle)
  }
}

//置灰非最短路径
function setAshOther(cy, collectionNodes, collectionEdges) {
  let themeType = store.state.themeType;
  let unCollectionNodes = cy.nodes().difference(collectionNodes);//反选非最短路径的节点
  let unCollectionEdges = cy.edges().difference(collectionEdges);//反选非最短路径的线

  if (!_.isEmpty(unCollectionNodes)) {
    if ('b' === themeType) {
      unCollectionNodes.addClass("b-nodehightlight");//非最短路径的点进行置灰
    } else {
      unCollectionNodes.addClass("a-nodehightlight");//非最短路径的点进行置灰
    }
  }
  if (!_.isEmpty(unCollectionEdges)) {
    if ('b' === themeType) {
      unCollectionEdges.addClass("b-edgehightlight");//非最短路径的线进行置灰
    } else {
      unCollectionEdges.addClass("a-edgehightlight");//非最短路径的进行置灰
    }
  }
  setLabelDisplay(unCollectionNodes,collectionNodes);//隐藏置灰节点标签信息
  setLabelStyle(unCollectionNodes,collectionNodes);//置灰标记
}

/**
 * 添加任务
 */
export function addNewTask(){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let nodes =cy.$(":selected");
  if(nodes.length>0) {
    store.commit("showRightAddTaskModel", true)
  }
}

//画布变化刷新右侧统计菜单
function refreshRightCon(cy) {
  let currentGraphModel = store.state.currentGraphModel;
  currentGraphModel.data.nodes = cy.json().elements.nodes;
  currentGraphModel.data.edges = cy.json().elements.edges;
  store.commit('setCurrentGraphModel', currentGraphModel);

  store.commit("showStatisticsAndAnalyzeCon", true);
  //store.commit("showColorBar", true);
}

/**
 *置灰隐藏标签，高亮显示标签
 * @param unCollectionNodes
 * @param collectionNodes
 */
export function setLabelDisplay(unCollectionNodes,collectionNodes){
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let Sliderlvl=store.state.Sliderlvl;
  let newlvl = store.state.newlvl;
  let newZoom = cy.zoom();
  //选中标签code集合
  let baseLabelList=store.state.baseLabelsFus;

  if (!_.isEmpty(unCollectionNodes)) {
    cy.style()
      .selector(unCollectionNodes)
      .style('label','')
      .style('text-halign','right')
      .update();
  }

  if(Sliderlvl!=0){
    if(newZoom>=newlvl){
      if(baseLabelList.length==0){
        cy.style()
          .selector(collectionNodes)
          .style('label','data(name)')
          .style('text-halign','right')
          .update();
      }else {
        cy.style()
          .selector(collectionNodes)
          .style('label',function (evt) {
            let o='';
            if(evt._private.data.labels == undefined){
              return '';
            }
            if(baseLabelList.length==1){
              for (let i=0;i<baseLabelList.length;i++){
                if(evt._private.data.labels[baseLabelList[i]]==undefined){
                  o=o+' '
                }else {
                  o=evt._private.data.labels[baseLabelList[i]]
                }
              }
            }else {
              for (let i=0;i<baseLabelList.length;i++){
                if(evt._private.data.labels[baseLabelList[i]]==undefined){
                  o=o+' '+',';
                }else {
                  o=o+evt._private.data.labels[baseLabelList[i]]+','
                }
              }
            }
            return o
          })
          .style('text-halign','right')
          .update();
      }
    }
  }else{
    cy.style()
      .selector("node")
      .style('label','')
      .update();
  }


}

/**
 * 置灰高亮节点标记样式适配
 */
export function setLabelStyle(unCollectionNodes,collectionNodes) {
  let currentResultDefinedLabel = store.state.currentResultDefinedLabel;
  let removeEls = document.querySelectorAll(".cy-title,.cy-title_dark");
  removeEls.forEach(v=>{
    let parent = v.parentNode;
    if(parent.parentNode){
      parent.parentNode.removeChild(parent);
    }
  })
  cy.nodes().forEach(function(e){
    e._private['classes'].delete('l2');//高亮去l2
    e._private['classes'].delete('l1')
  })

  unCollectionNodes.forEach(function (e) {
    var name = e.data().name;
    let nodeLabel = _.find(currentResultDefinedLabel,function (t) {
      if(name==t.nodeId && !_.isEmpty(t.labels)){
        return t;
      }
    })
    if(nodeLabel !=undefined && !_.isEmpty(nodeLabel.labels)){
      e.addClass('l2')
      let name = e.data().name;
      if(e.style().display!='none'){
        cy.nodeHtmlLabel(
          [
            {
              query:"node[name='"+name+"']",
              halign:'bottom',
              valign:'right',
              cssClass:'cy-title_dark',
              tpl:function (data) {
                return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
              }
            }
          ]
        )
      }
    }
  });

  collectionNodes.forEach(function (e) {
    var name = e.data().name;
    let nodeLabel = _.find(currentResultDefinedLabel,function (t) {
      if(name==t.nodeId && !_.isEmpty(t.labels)){
        return t;
      }
    })
    if(nodeLabel !=undefined && !_.isEmpty(nodeLabel.labels)){
      e.addClass('l1')
      let name = e.data().name;
      if(e.style().display!='none'){
        cy.nodeHtmlLabel(
          [
            {
              query:"node[name='"+name+"']",
              halign:'bottom',
              valign:'right',
              cssClass:'cy-title',
              tpl:function (data) {
                return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
              }
            }
          ]
        )
      }
    }
  })
}
