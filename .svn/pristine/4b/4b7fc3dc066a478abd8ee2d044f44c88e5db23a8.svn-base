import store from "../../../vuex/store"

export function createSnapshot(snapshotName, currentGraphModel) {
  let cy = currentGraphModel.cy;
  let resultJson = cy.json().elements;
  let img = cy.png({maxWidth: 120, maxHeight: 90});
  let taskId = currentGraphModel.taskId;
  let saveJson = {
    nodes: _.map(resultJson.nodes, function (node) {
      return _.pick(node, ['data', 'position'])
    }),
    edges: _.map(resultJson.edges, function (node) {
      return _.pick(node, ['data'])
    }),
    groups: currentGraphModel.data.groups,
    maxWeight: currentGraphModel.data.maxWeight,
    minWeight: currentGraphModel.data.minWeight,
    maxNodeWeight:currentGraphModel.data.maxNodeWeight,
    minNodeWeight:currentGraphModel.data.minNodeWeight,
    maxEdgeWeight:currentGraphModel.data.maxEdgeWeight,
    minEdgeWeight:currentGraphModel.data.minEdgeWeight,

  };
  let snapshot = {
    sname: snapshotName,
    taskId: taskId,
    resultJson: JSON.stringify(saveJson),
    baseImage: img
  };
  return snapshot;
}


export function snapshot2() {
  console.log("快照相关方法二");
}


export function snapshot3() {
  console.log("快照相关方法三");
}

