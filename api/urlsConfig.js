
var debug=true;
// var debug=false;  //true 静态json false 动态url

// var contextPath = debug ?  "" : "/rfsWeb";  //发布时通过网关访问时这样写
var contextPath = debug ? "" : "http://192.168.1.52:8082";  //直接连接后台时这样写  //http://localhost:8088/rfsWeb

var DEBUG = {
  debug: debug,

  queryModuleTree: contextPath + '/api/leftCon/caseTreeData.json',
  queryLayoutDatas: contextPath + '/api/graph/treeData.json',
  queryExpansionLine1: contextPath + '/api/graph/queryExpansionLine6000.json',
  queryExpansionLine2: contextPath + '/api/graph/queryExpansionLine2.json',//分析模型的json
  queryExpansionLine3: contextPath + '/api/graph/queryExpansionLine3.json',
  queryExpansionLine4: contextPath + '/api/graph/queryExpansionLine4.json',
  queryExpansionLine5: contextPath + '/api/graph/queryExpansionLine5.json',

  /********************************前端打包测试 start******************************************/
  //单人关系模型json
  queryModelData201: contextPath + '/api/graph/queryModelData201.json',
  //群组分析模型json
  queryModelData202: contextPath + '/api/graph/queryModelData202.json',
  //关联发现模型json
  queryModelData203: contextPath + '/api/graph/queryModelData203.json',
  //社团扩展模型json
  queryModelData204: contextPath + '/api/graph/queryModelData204.json',
  //关系呈现模型json
  queryModelData205: contextPath + '/api/graph/queryModelData205.json',

  //快照1json
  querySnapshotData1: contextPath + '/api/graph/querySnapshotData1.json',
  //快照2json
  querySnapshotData2: contextPath + '/api/graph/querySnapshotData2.json',
  //快照3json
  querySnapshotData3: contextPath + '/api/graph/querySnapshotData3.json',


  //第一次扩线查询
  queryExpansionLineData1: contextPath + '/api/graph/queryExpansionLineData1.json',
  //第二次扩线查询
  queryExpansionLineData2: contextPath + '/api/graph/queryExpansionLineData2.json',
  //第三次扩线查询
  queryExpansionLineData3: contextPath + '/api/graph/queryExpansionLineData3.json',

  /********************************前端打包测试 end******************************************/



  //拆分节点
  splitNode: contextPath + '/api/graph/splitNode.json',

  /*任务*/
  queryTaskData: contextPath + '/api/rightCon/taskData.json',

  //模板下载
  templateDownload:contextPath + "/right/download.do",

  //文件上传接口
  uploadPath: contextPath + '/handExcelFile.do',
  /********************************head start******************************************/
  //查询字典
  queryBaseDictionData: contextPath + '/api/header/queryBaseDictionData.json',
  //新建分析模型
  saveOrUpdateTaskResultDatas: contextPath + '/api/header/saveOrUpdateTaskResultDatas.json',
  //模型使用情况统计
  statisticsAlanysisModel: contextPath + '/api/header/statisticsAlanysisModel.json',
  //设置路径
  queryManage: contextPath + '/api/header/queryManage.json',
  //退出系统
  queryURLConfig: contextPath + '/api/header/queryURLConfig.json',
  //用户信息
  queryUser: contextPath + '/api/header/queryUser.json',
  //案件标识数据
  queryUserNumByCaseId:contextPath + '/api/header/queryUserNumByCaseId.json',
  /********************************head end******************************************/



  /********************************leftCon start******************************************/
  //案件树
  queryCaseTree: contextPath + '/api/leftCon/queryCaseTree.json',
  //案件下拉
  queryCaseData: contextPath + '/api/leftCon/queryCaseData.json',
  //根据案件id获取主任务列表
  queryTaskList: contextPath + '/api/leftCon/queryTaskList.json',
  //检查任务名称是否已存在
  checkTaskNameIsExists: contextPath + '/api/leftCon/checkTaskNameIsExists.json',
  //保存任务
  saveOrUpdateTaskDatas: contextPath + '/api/leftCon/addTask.json',
  //删除任务
  deleteTask: contextPath + '/api/leftCon/deleteSnapshot.json',
  //查询快照列表
  queryTaskSnapShotList: contextPath + '/api/leftCon/queryTaskSnapShotList.json',
  //删除快照
  deleteSnapShot: contextPath + '/api/leftCon/deleteSnapshot.json',
  //案件树设置
  queryTreeDeepByUserId: contextPath + '/api/leftCon/queryTreeDeepByUserId.json',
  /********************************leftCon end******************************************/

  /********************************toolbar start******************************************/
  //工具条导出节点
  exportNodeLabel:contextPath + '/api/header/exportNodeLabel.json',
  saveExcelSesion:contextPath+'/right/deleteSnapshot.json',
  /********************************toolbar end******************************************/


  /********************************graph start******************************************/
  //查询图的json数据 包括主任务的 快照的 和分析任务的json数据
  queryResultJsonById: contextPath + '/api/graph/queryResultJsonById.json',
  //初始化显示默认图标
  selectNodeImageData: contextPath + '/api/graph/selectNodeImageData.json',
  //扩线查询
  queryExpansionLine: contextPath + '/api/graph/queryExpansion.json',
  //人本溯源
  queryRootFromPerson: contextPath + '/api/graph/queryRootFromPerson.json',
  //默认图标
  getDefaultIcon: contextPath + '/api/graph/getDefaultIcon.json',
  //保存点图标
  updateImageData: contextPath + '/api/graph/insertIntoNodeIcon.json',
  //编辑完节点更新图形数据
  updateResultJsonByRId: contextPath + '/api/graph/updateResultJsonByRId.json',
  //行为列表导出数据
  //保存基本参数
  saveFilterParams:contextPath +'/api/graph/saveFilterParams.json',
  //导出
  exportData:contextPath +'/api/graph/exportData.json',
  //添加节点
  addNode:contextPath+'/api/graph/addNode.json',
  /********************************graph end******************************************/


  /********************************rightCon start******************************************/
  //查询当前任务分析模型列表
  queryTaskModelResultList: contextPath + '/api/rightCon/queryTaskModelResultList.json',
  //删除分析模型
  deleteTaskModelStatus: contextPath + '/api/rightCon/deleteTaskModelStatus.json',
  //更新模型缩略图
  updateBaseImage: contextPath + '/api/rightCon/deleteTaskModelStatus.json',
  //新建分析模型 新增快照
  saveSnapshot: contextPath + '/api/leftCon/addTask.json',
  //模型任务重发
  repeatExcuteTask: contextPath + '/api/rightCon/deleteTaskModelStatus.json',
  //模型查看参数
  viewParams: contextPath + '/api/rightCon/viewParams.json',
  //获取模型状态
  getModuleStatus: contextPath + '/api/rightCon/getModuleStatus.json',
  /********************************rightCon end******************************************/
  //查询所有的自定义标记
  queryAllDefinedLabel: contextPath + '/api/graph/queryAllDefinedLabel.json',
  //获取当前结果图中节点的所有自定义标记
  queryCurrentResultDefinedLabel: contextPath + '/api/graph/queryCurrentResultDefinedLabel.json',
  //删除当前用户自定义标签
  deleteUserDefinedLabel: contextPath + '/api/graph/deleteUserDefinedLabel.json',
  //新增/修改当前用户自定义标签
  saveOrupdateUserDefinedLabel:contextPath + '/api/graph/saveOrupdateUserDefinedLabel.json',
  //行为明细详单
  queryEdgeDetail:contextPath +'/api/graph/queryEdgeDetail.json',
  //权限控制--获取当前用户的操作权限
  getPermissionsResource:contextPath +'/api/right/getPermissionsResource.json'
};

var RELEASE = {

  //文件上传接口
  uploadPath:contextPath+'/base/handExcelFile.do',
  //拆分节点
  splitNode: contextPath + '/api/graph/splitNode.json',

  //模板下载
  templateDownload:contextPath + "/base/download.do",
  /********************************head start******************************************/
  //查询字典
  queryBaseDictionData: contextPath + '/task/queryBaseDictionData.do',
  //新建分析模型
  saveOrUpdateTaskResultDatas: contextPath + '/taskResult/saveOrUpdateTaskResultDatas.do',
  //模型使用情况统计
  statisticsAlanysisModel: contextPath + '/taskResult/statisticsAlanysisModel.do',
  //设置路径
  queryManage: contextPath + '/taskResult/queryManage.do',
  //退出系统
  queryURLConfig:contextPath + '/base/queryURLConfig.do',
  //用户信息
  queryUser: contextPath + '/taskResult/queryUser.do',
  //案件标识
  queryUserNumByCaseId:contextPath +'/case/queryUserNumByCaseId.do',
  /********************************head end******************************************/

  /********************************leftCon start******************************************/
  //案件树
  queryCaseTree: contextPath + '/case/queryCaseTree.do',
  //案件下拉
  queryCaseData: contextPath + '/case/queryCaseData.do',
  //根据案件id获取主任务列表
  queryTaskList: contextPath + '/task/queryTaskList.do',
  //检查任务名称是否已存在
  checkTaskNameIsExists: contextPath + '/task/checkTaskNameIsExists.do',
  //保存任务
  saveOrUpdateTaskDatas: contextPath + '/task/saveOrUpdateTaskDatas.do',
  //删除任务
  deleteTask: contextPath + '/task/deleteTask.do',
  //案件树设置
  queryTreeDeepByUserId: contextPath + '/case/queryTreeDeepByUserId.do',
  /********************************leftCon end******************************************/


  /********************************graph start******************************************/
  //查询当前点击任务json
  queryResultJsonById: contextPath + '/task/queryResultJsonById.do',
  //初始化显示默认图标
  selectNodeImageData: contextPath + '/icon/selectNodeImageData.do',
  //扩线查询
  queryExpansionLine: contextPath+'/analysis/queryExpansionLine.do',
  //人本溯源
  queryRootFromPerson: contextPath + '/api/graph/queryRootFromPerson.json',
  //默认图标
  getDefaultIcon: contextPath + '/icon/getDefaultIcon.do',
  //保存点图标
  updateImageData: contextPath + '/icon/updateImageData.do',
  //编辑完节点更新图形数据
  updateResultJsonByRId: contextPath + '/taskResult/updateResultJsonByRId.do',
  //添加节点
  addNode:contextPath+'/analysis/addNode.do',
  /********************************graph end******************************************/


  /********************************toolbar start******************************************/
  //工具条导出节点
   exportNodeLabel:contextPath+'/base/exportNodeLabel.do',
  saveExcelSesion:contextPath+'/base/saveExcelSesion.do',
  /********************************toolbar end******************************************/



  /********************************rightCon start******************************************/
  //查询当前任务分析模型列表
  queryTaskModelResultList: contextPath + '/taskResult/queryTaskModelResultList.do',
  //删除分析模型
  deleteTaskModelStatus: contextPath + '/taskResult/deleteTaskModelStatus.do',
  //查询快照列表
  queryTaskSnapShotList: contextPath + '/snapshot/queryTaskSnapShotList.do',
  //删除快照
  deleteSnapShot: contextPath + '/snapshot/deleteSnapshot.do',
  updateBaseImage: contextPath + '/taskResult/updateBaseImage.do',
  //新建分析模型 新增快照
  saveSnapshot: contextPath + '/snapshot/saveSnapshot.do',
  //模型任务重发
  repeatExcuteTask: contextPath + '/taskResult/repeatExcuteTask.do',
  //模型查看参数
  viewParams: contextPath + '/taskResult/viewParams.do',
  //获取模型状态
  getModuleStatus: contextPath + '/taskResult/getModuleStatus.do',

  //新增/修改当前用户自定义标签
  saveOrUpdateUserDefinedLabel: contextPath + '/taskResult/saveOrUpdateUserDefinedLabel.do',
  //查询所有的自定义标记
  queryAllDefinedLabel: contextPath + '/taskResult/queryAllDefinedLabel.do',
  //获取当前结果图中节点的所有自定义标记
  queryCurrentResultDefinedLabel: contextPath + '/taskResult/queryCurrentResultDefinedLabel.do',
  //删除当前用户自定义标签
  deleteUserDefinedLabel:contextPath +'/taskResult/deleteUserDefinedLabel.do',
  //行为明细详单
  queryEdgeDetail:contextPath +'/analysis/getEdgeDetailsById.do',
  //行为列表导出数据
  //保存基本参数
  saveFilterParams:contextPath +'/analysis/saveFilterParams.do',
  //导出
  exportData:contextPath +'/analysis/exportDetailOrDetailsByData.do',
  //权限控制--获取当前用户的操作权限
  getPermissionsResource:contextPath +'/base/getPermissionsResource.do'
};

var URL = debug ? DEBUG : RELEASE;

export {
  URL, debug
}
