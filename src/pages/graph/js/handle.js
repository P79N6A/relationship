import store from  "../../../vuex/store"
import cytoscape from 'cytoscape'
import jquery from 'jquery'
import edgehandles from 'cytoscape-edgehandles'
import euler from 'cytoscape-euler'
import undoRedo from "cytoscape-undo-redo"
import automove from 'cytoscape-automove'
import popper from 'cytoscape-popper'
import clipboard from 'cytoscape-clipboard'
import navigator from 'cytoscape-navigator'
import noOverlap from 'cytoscape-no-overlap'
import nodeHtmlLabel from 'cytoscape-node-html-label'
import * as d3 from 'd3'

cytoscape.use(edgehandles);
cytoscape.use(euler);
cytoscape.use(automove);
cytoscape.use(popper);
cytoscape.use(noOverlap);
undoRedo(cytoscape);
navigator(cytoscape);
clipboard(cytoscape,jquery);
nodeHtmlLabel(cytoscape);

import * as allOperation from './allOperation'

var nodeLabels;
var color = ['#3f51b5', '#ff9800', '#EC407A', '#009688', '#AB47BC', '#03A9F4', '#8D6E63', '#8BC34A', '#FF7043', '#7B1FA2', '#26C6DA', '#CDDC39', '#FFCA28', '#4CAF50', '#5C6BCD', '#827717', '#00695C', '#7E57C2', '#015798', '#FFEB3B'];
class test{
  constructor(){

  }
  test1(){

  }
}
//单选，ctr多选
function clickNode(target, cy) {
  let currentGraphModel = store.state.currentGraphModel;
  store.state.isFrameSelect = false;//是否是拉框选择
  if(window.event.ctrlKey){
    currentGraphModel.collectionNodes = cy.collection();
    currentGraphModel.collectionNodes = currentGraphModel.collectionNodes.merge(target);
    console.log("多选",currentGraphModel.collectionNodes.jsons());
  }else{
    currentGraphModel.collectionNodes = cy.collection();
    currentGraphModel.collectionNodes.merge(target);
    console.log("单选",currentGraphModel.collectionNodes.jsons());
  }
}

function getGroups(data) {
  //分组放到前台处理
  let groupBase = _.groupBy(data.nodes,function (node) {
    return node.data.group;
  })

  let groups = [];
  _.each(groupBase,function (value,groupId) {
    var group = {
      "select": true,
      "groupId": 3,
      "num": 0
    }
    group.groupId = groupId;
    group.num = value.length;
    groups.push(group)
  })
  _.sortBy(groups,function (e) {
    return -e.num;
  })
  return groups;
}
//初始化关系图
export function init(currentGraphModel) {

    //初始化关系图前隐藏右键菜单，重置右键菜单（通过改变vuex存储标示）
    store.commit("rightMenuReady",false);

    //初始化默认切换任务不弹出保存快照提示框
    store.commit("setSnapshotConfirm",false);

    let graphId = currentGraphModel.graphId;
    let data = currentGraphModel.data;
    let themeType = store.state.themeType;
    let labelColor = themeType === 'b' ? "#161616" : "#f8f8f8";
    let linear;//点大小比例尺
    let nodear;//线粗细比例尺
    if(null != data.maxNodeWeight && undefined != data.maxNodeWeight){
      nodear = d3.scaleLinear().domain([data.minNodeWeight,data.maxNodeWeight]).range([16,32]);
    }

    if(null != data.maxEdgeWeight && undefined != data.maxEdgeWeight){
      linear = d3.scaleLinear().domain([data.minEdgeWeight,data.maxEdgeWeight]).range([1,3.2]);
    }

    let i =0;
    let groups = data.groups;
    if(!_.isEmpty(groups)){
      groups.forEach(function (e) {
        if(i<12){
          e.color = color[i];
        }else{
          e.color = color[12]
        }
        i++;
      })
    }
    var cy = cytoscape({
      layout:{
        name:'preset'
      },
      ready:function(){
        store.commit("graphLoad",false);
      },
      container :document.getElementById(graphId),
      boxSelectionEnabled:false,
      hideEdgesOnViewport:true,
      // motionBlur:true,
      // textureOnViewport:true,
      //pixelRatio:1,
      style:[
        {
          selector:'node',

          style: {
            // 'label':'data(name)',
            'color': labelColor,
            'font-weight':'normal',
            'font-size':'5',
            'height':function (e) {
              if(null == data.maxNodeWeight || undefined == data.maxNodeWeight){
                e.data().height1 = 16;
                return 16
              }else{
                if(undefined == nodear(e._private.data.weight)){
                  e.data().height1 = 16;
                  return 16;
                }else{
                  let height = nodear(e._private.data.weight);
                  //存储节点高
                  e.data().height1 = height;
                  return height
                }
              }
            },
            'width':function (e) {
              if(null == data.maxNodeWeight || undefined == data.maxNodeWeight){
                //存储节点宽
                e.data().width1 = 16;
                return 16
              }else{
                if(undefined == nodear(e._private.data.weight)){
                  e.data().width1 = 16;
                  return 16;
                }else{
                  let width = nodear(e._private.data.weight);
                  e.data().width1 = width;
                  return width
                }
              }
            },
            "border-width": "0.1px",
            "border-color": '#161616',
            'background-color':function (e) {
              if(_.isEmpty(groups)){
                return '#3f51b5'
              }else{
                var group = e._private.data.group;
                if(undefined==group || -1 == group){
                  return '#3f51b5'
                }
                var groupInfo = _.find(groups,function (exe) {
                  return exe.groupId == group;
                })
                if(!_.isEmpty(groupInfo)){
                  return groupInfo.color;
                }else {
                  return '#3f51b5'
                }
              }
            },
            'shape':function (e) {
              if(e._private.data.isInput || undefined==e._private.data.isInput){
                return "ellipse"//1
              }else{
                return "pentagon"//0
              }
            },
            'display':function (e) {
              if(_.isEmpty(data.groups)){
                return 'element';
              }else{
                var group = e._private.data.group;
                var groupData = _.find(data.groups,function (ele) {
                  if(ele.groupId == group){
                    return ele;//返回是否勾选
                  }
                })
                if(groupData == undefined){
                  return 'element';
                }
                if(groupData.select){
                  return 'element';
                }else{
                  return 'none';
                }
              }
            }
          }
        },
        {
          selector:'edge',
          style:{
            // 'label':'data(type)',
            'color':"#e74b1d",
            'font-size':'2',
            'font-weight':'100',
            'curve-style':'bezier',
            'edge-text-rotation':'autorotate',
            'haystack-radius':0,
            //'width':'mapData(attributes.weight,0, 100, 1, 5)',
            'width':function (e) {
              if(null == data.maxEdgeWeight || undefined == data.maxEdgeWeight){
                e.data().edgewidth = 1;
                return 1
              }
              else{
                if(undefined==linear(e._private.data.weight)){
                  return 1
                }else {
                  let edgewidth=linear(e._private.data.weight)
                  e.data().edgewidth = edgewidth;
                  return edgewidth;
                }

              }
            },
            'opacity':0.8,
            //'line-color':'#3f51b5',
            'line-color':function (e) {
              if(_.isEmpty(groups)){
                return '#3f51b5'
              }else{
                var group = e.source()._private.data.group;
                var groupInfo = _.find(groups,function (exe) {
                  return exe.groupId == group;
                })
                if(!_.isEmpty(groupInfo)){
                  return groupInfo.color;
                }else {
                  return '#3f51b5'
                }
              }
            }
          }
        },

        // {
        //   selector:".eh-preview,.eh-ghost-edge",
        //   style:{
        //     "width":1,
        //     "height":1
        //   }
        // }
      ],
      // pixelRatio:1.0,
      elements:data,
      ready:function () {
        store.commit("graphLoad",false)
      }
      });
    //案件标识类号码添加星星形状
  let node=cy.nodes('[casemark='+0+']')
  cy.style()
    .selector(node)
    .style("shape","star")
    .update();

    // 数据少点过大问题修改
    if(data.nodes.length < 60){
      cy.zoom(1);
      let newZoom=cy.zoom();
      store.commit("currentZoom",newZoom)
      cy.center();
    }else {
      store.commit("currentZoom",cy.zoom())
      cy.center();
    }

    if(!_.isEmpty(data.nodes[0])&&_.isEmpty(data.nodes[0].position)){
        let val=store.state.nodeSize
        cy.layout({name:"grid"}).run();
        cy.layout({
          name:"euler",
          // avoidOverlapPadding:100,
          avoidOverlap:true,
          animate:true,
          animationDuration:6000,
          animationEasing:'spring(500,40)',
          // springCoeff:val,
          maxIterations:2000,
          maxSimulationTime:10000,
          stop:function () {
            console.log("stop");

          },
          ready:function () {
            console.log("ready")
          }
        }).run();
        cy._private.layoutName = 'euler';
    }else{
        cy._private.layoutName = 'preset';
    }


    currentGraphModel.ur = cy.undoRedo();
    let cb =cy.clipboard();

    if(window.nav) {
      $(".cytoscape-navigator").empty();
    }
    window.nav = cy.navigator({
      container: document.getElementsByClassName("cytoscape-navigator"), // 设置为false使用默认添加的dom
      viewLiveFramerate: false, //设置为false仅在拖动结束时更新图形平移
      dblClickDelay: 200, // milliseconds
      removeCustomContainer: true, // destroy the container specified by user on plugin destroy
      rerenderDelay: 2000
    });

    // //根据缩放比例设置label字体大小

    let oldZoom = cy.zoom();
    cy.on('zoom',function(evt){
      let newZoom = evt.cy.zoom();
      oldZoom = evt.cy.zoom();
      let newlvl='';
      let Sliderlvl=store.state.Sliderlvl;
      //选中标签code集合
      let baseLabelList=store.state.baseLabelsFus;
      //图上设置标签节点集合
      let baseLabelNodes=store.state.baseLabelsNodes;
     let baseSelectNodes= _.filter(cy.nodes(),function (node) {
        for (let i=0;i<baseLabelNodes.length;i++){
          if(node._private.data.name==baseLabelNodes[i]){
            return node;
          }
        }
      })
      //图上设置标签节点集合
      let collection = cy.collection()
      collection.merge(baseSelectNodes)
      //缩放等级和系数关系
      if(Sliderlvl==1){
          newlvl=16;
      }
      if( Sliderlvl==2){
          newlvl=14;
      }
      if( Sliderlvl==3){
          newlvl=12;
      }
      if(Sliderlvl==4){
          newlvl=10;
      }
      if(Sliderlvl==5){
          newlvl=8;
      }
      if(Sliderlvl==6){
          newlvl=6;
      }
      if(Sliderlvl==7){
          newlvl=3;
      }
      if(Sliderlvl==8){
          newlvl=2;
      }
      if(Sliderlvl==9){
          newlvl=1;
      }
      if(Sliderlvl==10){
          newlvl=0.1;
      }
      store.commit("setNewlvl", newlvl);
      //更换选中标签内容
      if(newlvl!=''&& Sliderlvl!=0){
        if(newZoom>=newlvl){
          if(baseLabelList.length==0){
            evt.cy.style()
              .selector("node")
              .style('label',function (evt) {
                //置灰节点不显示标签start
                let classes = evt._private['classes'];
                let classesLst =[];
                classes.forEach(function (e) {
                  classesLst.push(e);
                });
                //置灰节点不显示label
                if(_.includes(classesLst, 'a-nodehightlight') || _.includes(classesLst, 'b-nodehightlight')){
                  return ''
                }
                if(classesLst.indexOf('l2')>-1){
                  return '';
                }
                //置灰节点不显示标签end
                return evt._private.data['name']
              })
              .style('text-halign','right')
              .style('text-valign','center')
              .update();
          }else {
            cy.style()
              .selector(collection)
              .style('label',function (evt) {
                let o='';
                //置灰节点不显示标签start
                let classes = evt._private['classes'];
                let classesLst =[];
                classes.forEach(function (e) {
                  classesLst.push(e);
                })
                //置灰节点不显示label
                if(_.includes(classesLst, 'a-nodehightlight') || _.includes(classesLst, 'b-nodehightlight')){
                  return ''
                }
                if(classesLst.indexOf('l2')>-1){
                  return '';
                }
                //置灰节点不显示标签end
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
              .style('text-valign','center')
              .update();
          }

        }else {
          evt.cy.style()
            .selector("node")
            .style('label','')
            .update();
        }
      }else {
        evt.cy.style()
          .selector("node")
          .style('label','')
          .update();
      }
      //线上的标签
      // if(newlvl!=''){
      //   if(newZoom>=newlvl){
      //     evt.cy.style()
      //       .selector("edge")
      //       .style('label','data(name)')
      //       .style('font-size','2')
      //
      //       .update();
      //   }else {
      //     evt.cy.style()
      //       .selector("edge")
      //       .style('label','')
      //       .update();
      //   }
      // }else {
      //   evt.cy.style()
      //     .selector("edge")
      //     .style('label','')
      //     .update();
      // }

    });

    //图上有平移，缩放，说明有操作，切换任务会弹提示框
    // cy.on("viewport",function (e) {
    //   if(data.nodes != undefined && data.nodes.length > 0){
    //     store.commit("setSnapshotConfirm",true)
    //   }
    // })

    //节点有拖动，说明有操作，切换任务会弹提示框
    cy.on('drag','node',function (e) {
      store.commit("setSnapshotConfirm",true);
    })

    cy.on('mouseover','node',function (e) {
      //添加关系不显示
      if(e.cy && e.cy.eh && e.cy.eh.active){
        return false
      }

    let name = e.target._private.data.name;
    let labels = e.target._private.data.labels;
    //假数据
    // if(!labels){
    //   labels ={
    //     "00002": "50",
    //     "00003": "男",
    //     "00000": name,
    //     "00001": "张树宏",
    //     "00006": "延安市",
    //     "00004": "董彦龙"
    //   }
    // }
    let labelsData = store.state.currentResultDefinedLabel;
    let  labelData =  _.filter(labelsData, ['nodeId', name]);
    let labelLst = [];
    if(!_.isEmpty(labelData)){
      labelLst = labelData[0].labels
    }
    if(labels || !_.isEmpty(labelLst)) {
      let baseDictionData = store.state.dictionDataAll;
      var makeDiv = function (text) {
        let div = document.createElement('div');
        div.classList.add('popper-div');

        if( !_.isEmpty(labelLst)){
          let labelData = document.createElement("div");
          labelData.classList.add('label-name');
          labelData.innerHTML = '标记信息';
          div.appendChild(labelData);
          labelLst.forEach(function (t) {
            var labelItem = document.createElement("div");
            var labelText  = document.createElement("span");
            labelText.innerText = "admin" +" : "+ t.labelName; //user为假数据
            var labelCircle = document.createElement("span");
            labelCircle.classList.add('label-circle');
            labelItem.appendChild(labelCircle);
            labelItem.appendChild(labelText);
            div.appendChild(labelItem);
          })
        }

        if(labels){
          let labelName = document.createElement("div");
          labelName.classList.add('label-name');
          labelName.innerHTML = '标签信息';
          div.appendChild(labelName);
          nodeLabels = text;
          for(let key in text){
            var t = _.find(baseDictionData,['dicCode',key]);
            if(!_.isEmpty(t)){
              let labelItem = document.createElement("div");
              let labelText  = document.createElement("span");
              labelText.innerText = t.dicName +" : "+text[key];
              let labelCircle = document.createElement("span");
              labelCircle.classList.add('label-circle');
              labelItem.appendChild(labelCircle);
              labelItem.appendChild(labelText);
              div.appendChild(labelItem);
            }
          }
        }
        document.body.appendChild(div);
        return div;
      };
    }else{
      var makeDiv = function (text) {
        let div = document.createElement('div');
        div.classList.add('popper-div');

        var labelItem = document.createElement("div");
        var labelText  = document.createElement("span");
        labelText.innerText = "无";
        labelItem.appendChild(labelText);
        div.appendChild(labelItem);
        document.body.appendChild(div);
        return div;
      };
    }
      window.popper = e.target.popper({
        content:function () {
          return makeDiv(labels);
        }
      })
  });

    cy.on('mouseout',function (e) {
      cancelLabelView();
    });

    //取消右侧节点树点击高亮显示
    cy.on('tap',function (e) {
      cancelLabelView();
      cy.$('.right-selected').removeClass('right-selected');
      $("#legendPanel").find(".color").css({
        "border": "none"
      });//移除色签选中样式
      $("#legendPanel").find(".color").css({
        "box-shadow": ""
      });//移除色签背阴影

      //左键点击空白处清除高亮，点击节点或边不变
      if(e.target.eh != undefined && data.groups){
        data.groups.forEach(function (e) {
          e.isLighted = true;
        })
        //取消右侧分析-->选中标签的高亮
        $(".f-cspaH").removeClass("f-cspaH");
        $(".f-cspCusH").removeClass("f-cspCusH");


        setDefineLabel(cy);
        // cy.nodeHtmlLabel(
        //   [
        //     {
        //       query:'.l1',
        //       halign:'bottom',
        //       valign:'right',
        //       cssClass:'cy-title',
        //       tpl:function (data) {
        //         return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
        //       }
        //     },
        //     {
        //       query:'.l2',
        //       halign:'bottom',
        //       valign:'right',
        //       cssClass:'cy-title',//取消高亮全部变为cy-title
        //       tpl:function (data) {
        //         return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
        //       }
        //     }
        //   ]
        // );
        if(e.classes == 'l1' || e.classes =='l2' ){
          var name =e.data.name
          let el = document.getElementById(`${name}_label`);
          if(el){
            el.parentNode.style.display = "none";
          }
        }
        allOperation.setLabelDisplay(null,cy.nodes())//隐藏置灰节点标签信息

      }
    });

    cy.on("click","node",function (e) {
      //取消标签弹框
      cancelLabelView();
      var target = e.target;
      cy._private.curNode = target;
      clickNode(target, cy);
    });

    cy.on("cxttap",function(e){
      store.commit("rightClick_position",{
        x:e.position.x,
        y:e.position.y
      })
      cancelLabelView();
      // $("#legendPanel").find(".color").css({
      //   "border": "none"
      // });//移除色签选边框
      // $("#legendPanel").find(".color").css({
      //   "box-shadow": ""
      // });//移除色签背阴影
      //
      // //清除高亮
      // let groups = data.groups;
      // if(groups){
      //   groups.forEach(function (e) {
      //     e.isLighted = true;
      //   })
      // }

      cy.$('.addBorderColor').removeClass('addBorderColor');
      // cy.nodes().removeClass("a-nodehightlight"); //移除点高亮的样式
      // cy.edges().removeClass("a-edgehightlight"); //移除线高亮的样式
      // cy.nodes().removeClass("b-nodehightlight"); //移除点高亮的样式
      // cy.edges().removeClass("b-edgehightlight"); //移除线高亮的样式
    });

    cy.on("cxttap","node",function(e){
      cancelLabelView();
      e.stopPropagation();
      var target = e.target;
      cy._private.curNode = target;
      getCurNodeAttr(target);
      target.select();
      let currentGraphModel = store.state.currentGraphModel;
      currentGraphModel.collectionNodes = cy.$(":selected");
      target.emit("tap");
      cy._private.nodeRightClick = true;
    });

    cy.on("cxttap","edge",function(e){
      cancelLabelView();
      e.stopPropagation();
      currentGraphModel.collectionNodes = cy.collection();
    });

    //框拉选择节点
    cy.on('boxstart',function (e) {
      currentGraphModel.collectionNodes = cy.collection();
    });

    cy.on('box',function (e) {
      let target = e.target;
      let currentGraphModel = store.state.currentGraphModel;
      currentGraphModel.collectionNodes = currentGraphModel.collectionNodes.union(target);
    });

    // cy.nodes().nodeOverlap({padding:5})
    allOperation.mouseZoom(cy);

    allOperation.addEdge(cy);

    window.cy = cy;
    //初始化关系图完成后改变右键菜单标示
    store.commit("rightMenuReady",true);

    //添加自定义标记样式
     if(_.isEmpty(groups)){
       initDefinedLable(cy,groups);
     }
    return cy;
  }

function initDefinedLable(cy,groups) {
  let nodes = cy.nodes();
  let currentResultDefinedLabel = store.state.currentResultDefinedLabel;
  if(_.isEmpty(groups)){//无分组不存在高亮。有分组的走colorBar
    nodes.forEach(function (e) {
      var name = e.data().name;
      let nodeLabel = _.find(currentResultDefinedLabel,function (t) {
        if(name==t.nodeId && !_.isEmpty(t.labels)){
          return t;
        }
      })
      if(nodeLabel !=undefined && !_.isEmpty(nodeLabel.labels)){
        e._private['classes'] = new Set(["l1"])
      }
    })
  }

  cy.nodeHtmlLabel(
      [
        {
          query:'.l1',
          halign:'bottom',
          valign:'right',
          cssClass:'cy-title',
          tpl:function (data) {
            return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
          }
        }
      ]
    );
  }
function setDefineLabel(cy) {
  var removeEls = document.querySelectorAll(".cy-title,.cy-title_dark");
  removeEls.forEach(v=>{
    let parent = v.parentNode;
    if(parent.parentNode){
      parent.parentNode.removeChild(parent);
    }
  })

  let currentResultDefinedLabel = store.state.currentResultDefinedLabel;
  cy.nodes().forEach(function (node) {
    var name = node.data().name;
    let nodeLabel = _.find(currentResultDefinedLabel,function (t) {
      if(name==t.nodeId && !_.isEmpty(t.labels)){
        return t;
      }
    })
    if(nodeLabel !=undefined && !_.isEmpty(nodeLabel.labels)){
      node.addClass('l1')
      let name = node.data().name;
      if(node.style().display!='none'){//隐藏节点不显示
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
  });
}
function cancelLabelView() {
    let labelDiv = document.getElementsByClassName("popper-div")[0];
    if(labelDiv) {
      labelDiv.style.display = "none";
      document.body.removeChild(labelDiv);
      window.popper = null;
    }
  }
  //获取选中节点的属性，将其处理为[{key,value},{key,value}...]
function getCurNodeAttr(node){
    let nodeType = node._private.data.type;
    const nodeProDict = store.state.nodeProDict;

    let allSelectData = [],selectData = [];
    nodeProDict.forEach(v => {
      if(nodeType == v.label){
        allSelectData = v.proList;
      }
    })
    /*for(let i in nodeLabels){
      nodeProDict.forEach(v => {
        if(v.val1){
          var patt = eval(v.val1);
          if(patt.test(nodeLabels[i])){
            let obj = {};
            obj.key = v.dicName;
            obj.value = nodeLabels[i];
            obj.type = v.dicCode;
            selectData.push(obj);
          }
        }
      })
    }*/
    store.commit("splitNodeSelectData",selectData);
    nodeLabels = null;
  }





