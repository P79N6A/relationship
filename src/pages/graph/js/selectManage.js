import store from  "../../../vuex/store"
import * as allOperation from './allOperation'
/**
 * 相邻节点
 */
export function neighborhoodNodes() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  //获取当前选中节点
  let target = cy._private.curNode;
  //获取选中节点id
  let targetId = cy._private.curNode.id();

  currentGraphModel.collectionNodes = cy.$(":selected");
  let edgesSelect = cy.edges().filter(function (ele) {
    if(ele._private.data.source == targetId || ele._private.data.target == targetId){
      return ele;
    }
  });

  let unCollectionNodes = cy.nodes().difference(target.neighborhood().merge(target));//反选其他组的节点
  let unCollectionEdges = cy.edges().difference(edgesSelect);//反选其他组的线
  cy.nodes().unselect();
  cy.edges().unselect();

  // target.neighborhood().merge(target).unselect();
  let themeType = store.state.themeType;
  if ('b' == themeType) {
    cy.nodes().removeClass('b-nodehightlight');
    cy.edges().removeClass('b-edgehightlight');
  } else {
    cy.nodes().removeClass('a-nodehightlight');
    cy.edges().removeClass('a-edgehightlight');
  }
  target.neighborhood().merge(target).unselect();

  target.select();
  if ('b' == themeType) {
    unCollectionNodes.addClass('b-nodehightlight');
    unCollectionEdges.addClass('b-edgehightlight');
  } else {
    unCollectionNodes.addClass('a-nodehightlight');
    unCollectionEdges.addClass('a-edgehightlight');
  }
  //隐藏置灰节点标签信息
  allOperation.setLabelDisplay(unCollectionNodes,target.neighborhood().merge(target));
  allOperation.setLabelStyle(unCollectionNodes,target.neighborhood().merge(target))

  return target;

  //获取点有关的线的集合
  //console.log(target.connectedEdges());
  //获取边有关的点的集合
  //console.log(cy.$('#id').connectedNodes());
}
/**
 * 全选节点
 */
export function selectAllNodes() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  //currentGraphModel.collectionNodes.length = 0;
  // cy.nodes().forEach(function (ele,i,eles) {
  //   let id = ele.json().data.id;
  //   cy.$("#"+id).json({selected:true});
  //   currentGraphModel.collectionNodes = currentGraphModel.collectionNodes.union(ele);
  // });
  let nodesSelect = cy.nodes();
  cy.$(nodesSelect).select();
  currentGraphModel.collectionNodes = cy.$(":selected");


}

/**
 * 全选所有线
 */
export function selectAllEdges() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  cy._private.edges_allSelect = true;
  let ur = currentGraphModel.ur;
  ur.action("selectAllEdges",edgesSelectAndUnselect.select,edgesSelectAndUnselect.unselect);
  ur.do("selectAllEdges");
}

export var edgesSelectAndUnselect = {
  select:function(){
    let currentGraphModel = store.state.currentGraphModel;
    let cy = currentGraphModel.cy;
    cy.edges().select();
  },
  unselect:function(){
    let currentGraphModel = store.state.currentGraphModel;
    let cy = currentGraphModel.cy;
    cy.edges().unselect();
  }
};

//选中图中点
export function selectNodeOnGraph(nodeId) {
  let currentModel = store.state.currentGraphModel;
  let cy = currentModel.cy;
  let graphNode = _.find(cy.nodes(), function (node) {
    if (node.data().id === nodeId) {
      return node
    }
  });
  cy.$(cy.nodes()).unselect();
  cy.zoom(1);
  cy.center(graphNode);
  cy.$(graphNode).select();
}

//关系轨迹显示
export function drawEdgeTrack(selectEdgeId, event){
  let currentModel = store.state.currentGraphModel;
  let cy = currentModel.cy;
  cy.elements().unselect();
  let graphEdge = _.find(cy.edges(), function(edge){
    if(edge.data().id === selectEdgeId) {
      return edge
    }
  });
  if(_.isEmpty(graphEdge)){
    return false
  }

  if(event) {
    event.target.style.pointerEvents = "none";
  }

  cy.center(graphEdge);
  cy.$(graphEdge).select();
  let drawFrameBox = document.createElement('div');
  drawFrameBox.setAttribute('id', 'drawFrameBox');
  drawFrameBox.style.height = document.body.offsetHeight + 'px';
  drawFrameBox.style.width = document.body.offsetWidth + 'px';
  drawFrameBox.style.display = 'block';
  drawFrameBox.style.zIndex = '9999999999';
  drawFrameBox.style.top = '0';
  drawFrameBox.style.position = 'absolute';
  document.body.appendChild(drawFrameBox);
  let _this = this;
  let graphContainer = $("#graph");
  let drawLayer = document.createElement('canvas');
  drawLayer.setAttribute('id', 'drawGraphEdge');
  // this.drawLayer.width = 20;
  // this.drawLayer.height = 20;
  drawLayer.style.position = "absolute";
  drawLayer.style.zIndex = 2;
  drawLayer.style.backgroundColor = "rgba(255,255,255,0)";
  graphContainer.append(drawLayer);
  drawLayer.style.opacity = 0.8;

  let sourceNode = graphEdge.source();
  cy.$(sourceNode).select();
  let targetNode = graphEdge.target();
  cy.$(targetNode).select();
  let drawLayers = drawLayer.getContext('2d');
  drawLayers.beginPath();
  let r = sourceNode.renderedWidth() / 2 * 0.8;
  drawLayers.arc(r, r, r, 0, Math.PI * 2, false);
  drawLayers.stroke();
  let startX = sourceNode.renderedPosition().x;
  let startY = sourceNode.renderedPosition().y;
  let endX = targetNode.renderedPosition().x;
  let endY = targetNode.renderedPosition().y;
  let moveY, moveX;
  //移动量
  let num = Math.abs(endY - startY) > 1000 || Math.abs(endX - startX) > 1000 ? 30
    : Math.abs(endY - startY) > 500 || Math.abs(endX - startX) > 500 ? 15
      : Math.abs(endY - startY) > 300 || Math.abs(endX - startX) > 300 ? 9
        : Math.abs(endY - startY) > 100 || Math.abs(endX - startX) > 100 ? 6 : 3;
  if (endY - startY === 0) {
    moveY = 0;
    moveX = num;
  } else if (endX - startX === 0) {
    moveY = num;
    moveX = 0;
  } else {
    let k = (endY - startY) / (endX - startX);
    moveY = num;
    moveX = num / Math.abs(k);
    if (moveX > moveY) {
      moveX = num;
      moveY = moveX * Math.abs(k)
    }

  }
  drawLayer.style.top = startY - r * 0.8 + 'px';
  drawLayer.style.left = startX - r * 0.8 + 'px';
  drawLayers.fillStyle = '#da4373';
  // drawLayers.moveTo(startX-r, startY-r);
  let currentY = startY;
  let currentX = startX;
  let timer = setInterval(function () {
    currentY = endY > startY ? currentY + moveY : currentY - moveY;
    currentX = endX > startX ? currentX + moveX : currentX - moveX;
    if ((endY > startY && currentY > endY) || (endY < startY && currentY < endY)) {
      clearInterval(timer);
      drawLayer.style.top = endY - r * 0.8 + 'px';
      drawLayer.style.left = endX - r * 0.8 + 'px';
      // drawLayers.moveTo(endX-r, endY-r);
      drawLayers.clearRect(0, 0, 0, 0);
      cy.elements().unselect();
      $('#drawGraphEdge').remove();
      $('#drawFrameBox').remove();
      if(event) {
        event.target.style.pointerEvents = "auto";
      }

    }
    drawLayer.style.top = currentY - r * 0.8 + 'px';
    drawLayer.style.left = currentX - r * 0.8 + 'px';
    // drawLayers.moveTo(currentX, currentY);
  }, 20);
  drawLayers.closePath();
  drawLayers.fill();
}


