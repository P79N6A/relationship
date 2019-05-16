import GraphModel from "./GraphModel"
import * as uuId from "../../../utils/uuid"
import store from "../../../vuex/store"
import * as Handle from './handle'

//获取标签label
export function getTabLabel(item) {
  let _this = this;
  return (h) => {
    return h('div', [
      h('span', item.taskName),
      h('span', {
        style: {
          fontSize: '16px',
          display: 'inline'
        },
        attrs: {
          id: item.graphId + '_' + 'asterisk',
        },
      }, ' *'),
      h('Icon', {
        style: {
          fontSize: '20px',
          zIndex: '9999'
        },
        props: {
          type: 'ios-close',
        },
        on: {
          click(e) {
            handleTabRemove(item.graphId);
          }
        }
      }),
    ])
  }
}

function handleTabRemove(graphId) {
  let currentGraphModel = store.state.currentGraphModel;
  let graphModelList = store.state.graphModelList;
  let newGraphModelList = graphModelList.filter(model => model.graphId !== graphId);
  store.commit('setDeleteGraph', true);
  if (currentGraphModel.graphId === graphId) {
    if (_.isEmpty(newGraphModelList)) {
      //删除最后一个
      store.commit('setCurrentGraphModel', {
        taskName: '',
        graphId: '',
        data: []
      });
    } else {

      let showGraphModel;
      let lastModel = _.last(graphModelList);
      if (lastModel.graphId === graphId) {
        //是最后一个，删除后显示前一个
        let afterModel = _.last(newGraphModelList);
        store.commit('setCurrentGraphModel', afterModel);
      } else {
        //删除后显示后一个
        let deleteIndex = _.findIndex(graphModelList, {'graphId': graphId});
        let beforeModel = graphModelList[deleteIndex + 1];
        store.commit('setCurrentGraphModel', beforeModel);
      }
    }
  }
  store.commit('setGraphModel', newGraphModelList);
}

//添加新画布
export function handleTabsAdd(newTaskName) {
  // let newGraphIndex = store.state.newGraphIndex;
  let graphId = uuId.getUUID("graph");
  // let newTaskName = "任务" + newGraphIndex;
  let newGraphModel = new GraphModel(graphId, newTaskName, null, null);
  store.commit('setDeleteGraph', false);
  store.commit('graphModelAdd', newGraphModel);
  store.commit('setCurrentGraphModel', newGraphModel);
  // store.commit('setNewGraphIndex', newGraphIndex + 1);
}
//右键添加任务
export function rightTaskAdd(taskModel) {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  let selectedNodes = cy.nodes(":selected");
  let nodesElements = _.flatten(_.map(selectedNodes, '_private'));
  let nodes = [];
  _.each(nodesElements, function (nodesElement) {
    nodes.push({data: nodesElement.data, position: nodesElement.position})
  });

  let graphId = uuId.getUUID("graph");
  let edges = [];
  let allEdgeElements = cy.edges();
  if (allEdgeElements.length > 0) {
    let nodeIds = _.map(_.map(nodesElements, 'data'), 'id');
    _.each(allEdgeElements, function (edgeElement) {
      if (_.includes(nodeIds, edgeElement.data().source) && _.includes(nodeIds, edgeElement.data().target)) {
        edges.push({data: edgeElement.data()});
      }
    });
  }

  //分组
  let selectGroup = _.uniq(_.map(nodes, function(node){
    return node.data.group
  }));

  let group = _.filter(currentGraphModel.data.groups, function (group) {
    return _.includes(selectGroup, group.groupId)
  });

  let nodeWeightList = _.map(nodes, function(node){
    return node.data.weight
  });
  let edgeWeightList = _.map(edges, function(edge){
    return edge.data.weight
  });

  let data = {
    nodes: nodes,
    edges: edges,
    groups: group,
    maxNodeWeight: _.max(nodeWeightList),
    minNodeWeight: _.max(nodeWeightList),
    maxEdgeWeight: _.max(edgeWeightList),
    minEdgeWeight: _.max(edgeWeightList),
  };

  let addGraphModel = new GraphModel(graphId, taskModel.taskId, data);
  addGraphModel.taskModel = taskModel;
  store.commit("showStatisticsAndAnalyzeCon", false);
  store.commit("showTaskCon", false);
  store.commit('graphModelAdd', addGraphModel);
  store.commit('setCurrentGraphModel', addGraphModel);
  this.$store.commit("showColorBar",true);
}


//添加任务
export function taskAdd(taskModel) {
  // let currentGraphModel = store.state.currentGraphModel;
  // let cy = currentGraphModel.cy;
  // let selectedNodes = cy.nodes(":selected");
  // let nodesElements = _.flatten(_.map(selectedNodes, '_private'));
  // let nodes = [];
  // _.each(nodesElements, function (nodesElement) {
  //   nodes.push({data: nodesElement.data})
  // });
  let graphId = uuId.getUUID("graph");
  // let edges = [];
  // let allEdgeElements = cy.edges();
  // if (allEdgeElements.length > 0) {
  //   let nodeIds = _.map(_.map(nodesElements, 'data'), 'id');
  //   _.each(allEdgeElements, function (edgeElement) {
  //     if (_.includes(nodeIds, edgeElement.data().source) && _.includes(nodeIds, edgeElement.data().target)) {
  //       edges.push({data: edgeElement.data()});
  //     }
  //   });
  // }
  // let data = {
  //   nodes: nodes,
  //   edges: edges
  // };
  let data = {
    nodes: [],
    edges: []
  };

  let addGraphModel = new GraphModel(graphId, taskModel.taskId, data);
  addGraphModel.taskModel = taskModel;
  store.commit("showStatisticsAndAnalyzeCon", false);
  store.commit("showTaskCon", false);
  store.commit('graphModelAdd', addGraphModel);
  store.commit('setCurrentGraphModel', addGraphModel);
}

//切换画布
export function changeGraph(taskName) {
  let graphModelList = store.state.graphModelList;
  let currentGraphModel = _.find(graphModelList, {'taskName': taskName});
  if (!_.isEmpty(currentGraphModel)) {
    store.commit("showStatisticsAndAnalyzeCon", false);
    store.commit("showTaskCon", false);
    store.commit('setCurrentGraphModel', currentGraphModel);
  }
}


export function saveCurrentTask() {
  let currentGraphModel = store.state.currentGraphModel;
  let cy = currentGraphModel.cy;
  $('#toolbar span').css({backgroundColor:'',boxShadow: ''})
  return cy.json().elements;
}
