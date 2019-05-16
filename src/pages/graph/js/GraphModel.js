export default class GraphModel {

  constructor(graphId, taskId, data, rid, selectedNodes) {
    this.graphId = graphId;
    this.taskId = taskId;
    this.data = data;
    this.rid = rid;
    this.unsaved = false;
    this.selectedNodes = selectedNodes
  }


  getTaskId() {
    return this.taskId;
  }

  setTaskId(value) {
    this.taskId = value;
  }

  getTaskName() {
    return this.taskName;
  }

  setTaskName(value) {
    this.taskName = value;
  }

  getData() {
    return this.data;
  }

  setData(value) {
    this.data = value;
  }

  getShow() {
    return this.show;
  }

  setShow(value) {
    this.show = value;
  }

  getIsSave() {
    return this.isSave;
  }

  setIsSave(value) {
    this.isSave = value;
  }

  setCy(value) {
    this.cy = value;
  }

  getCy(value) {
    return this.cy;
  }

  setSelectedNodes(value) {
    this.selectedNodes = value
  }

  getSelectedNodes() {
    return this.selectedNodes
  }
}
