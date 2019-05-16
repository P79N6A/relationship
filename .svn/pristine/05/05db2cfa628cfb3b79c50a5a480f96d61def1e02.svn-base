<template>
  <div class="menu-container" :id="currentGraphId" >
    <div v-for="(menu,index) in menuConfig" :key="index" >
      <div class="nav-v1-content" :class="'nav-v1-content' + (index+1)"@mouseenter ="cancelLabelView()">
        <!--<div width="10" height="10" style="background:red"></div>-->
        <span class="nav1-txt" :data-index="index">
          <div :class="'nav1-icon nav1-icon-'+index" :data-index="index"></div>
          <span :class="'nav1-tit nav1-tit-'+index" :data-index="index">{{menu.name}}</span>
        </span>
      </div>
      <div class="nav-v1-container" :class="'nav-v1-container' + (index+1)">
        <div :data-index="index" class="nav-v1"></div>

        <div class="nav-v2-container"  v-for="(submenu,k) in menu.children" :key="k" @mouseenter ="cancelLabelView()">
          <p class="nav-v2" @click="clickHandler(submenu.type)"
             :class="!jurisdictionHandler(submenu.name)?'disable-nav-v2': (submenu.show=='node'&& !atNode) ? 'disable-nav-v2' : !nodesShowMenu(submenu.name) ? 'disable-nav-v2' : ''"
          >
            <Icon type="ios-checkbox-outline" size="16"></Icon>
            <span>{{submenu.name}}</span>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import menuHandle from "./menuHandle.js"
  import store from  "../../vuex/store"
  export default {
    name: "right-menu",
    data (){
      return {
        atNode:false,
        clickContainer:false,
        clickEdge:false,
        selectedNodeNum:0,
        menuConfig:[],
        menuConfig1:[
          {
            name:"标记",
            children:[
              {
                name:"添加标记",
                type:"添加标记",
                show:"node"
              },
              {
                name:"删除所有标记",
                type:"删除所有标记",
                show:"node"
              }
            ]
          },
          {
            name:"布局",
            children:[
              {
                name:"矩阵布局",
                type:"grid",
                show:"all"
              },
              {
                name:"树形布局",
                type:"breadthfirst",
                show:"all"
              },
              {
                name:"环形布局",
                type:"circle",
                show:"all"
              },
              {
                name:"同心圆布局",
                type:"concentric",
                show:"all"
              },
              {
                name:"弹性力布局",
                type:"euler",
                show:"all"
              }
            ]
          },
          {
            name:"聚合",
            children:[
              {
                name:"拆分节点",
                type:"拆分节点",
                show:"node"
              },
              {
                name:"合并已选",
                type:"合并已选",
                show:"node"
              },
              {
                name:"手动组合",
                type:"手动组合",
                show:"node"
              },
              {
                name:"团体组合",
                type:"团体组合",
                show:"all"
              }
            ]
          },
          {
            name:"选择",
            children:[
              {
                name:"反选其他",
                type:"反选其他",
                show:"node"
              },
              {
                name:"显示关联节点",
                type:"显示关联节点",
                show:"node"
              },
              {
                name:"全选节点",
                type:"全选节点",
                show:"all"
              },
              {
                name:"全选关系",
                type:"全选关系",
                show:"all"
              }
            ]
          },
          {
            name:"操作",
            children:[
              {
                name:"添加节点",
                type:"添加节点",
                show:"all"
              },
              {
                name:"添加关系",
                type:"添加关系",
                show:"node"
              },
              {
                name:"添加任务",
                type:"添加任务",
                show:"node"
              },
              /*{
                name:"保存",
                type:"保存",
                show:"all"
              },*/
              {
                name:"删除",
                type:"删除",
                show:"node"
              },{
                name:"隐藏",
                type:"隐藏",
                show:"node"
              },
              {
                name:"节点编辑",
                type:"节点编辑",
                show:"node"
              }
            ]
          },
          {
            name:"分析",
            children:[
              {
                name:"全面扩线",
                type:"全面扩线",
                show:"node"
              },
             /* {
                name:"人本溯源",
                type:"人本溯源",
                show:"node"
              }*//*,
              {
                name:"智能搜索",
                type:"智能搜索",
                show:"all"
              }*/
            ]
          }
        ],
        menuConfig2:[
          {
            name:"标记",
            children:[
              {
                name:"添加标记",
                type:"添加标记",
                show:"node"
              },
              {
                name:"删除所有标记",
                type:"删除所有标记",
                show:"node"
              }
            ]
          },
          {
            name:"布局",
            children:[
              {
                name:"矩阵布局",
                type:"grid",
                show:"all"
              },
              {
                name:"树形布局",
                type:"breadthfirst",
                show:"all"
              },
              {
                name:"环形布局",
                type:"circle",
                show:"all"
              },
              {
                name:"同心圆布局",
                type:"concentric",
                show:"all"
              },
              {
                name:"弹性力布局",
                type:"euler",
                show:"all"
              }
            ]
          },
          {
            name:"聚合",
            children:[
              {
                name:"拆分节点",
                type:"拆分节点",
                show:"node"
              },
              {
                name:"合并已选",
                type:"合并已选",
                show:"node"
              },
              {
                name:"手动组合",
                type:"手动组合",
                show:"node"
              },
              {
                name:"取消团体组合",
                type:"取消团体组合",
                show:"all"
              }
            ]
          },
          {
            name:"选择",
            children:[
              {
                name:"反选其他",
                type:"反选其他",
                show:"node"
              },
              {
                name:"显示关联节点",
                type:"显示关联节点",
                show:"node"
              },
              {
                name:"全选节点",
                type:"全选节点",
                show:"all"
              },
              {
                name:"全选关系",
                type:"全选关系",
                show:"all"
              }
            ]
          },
          {
            name:"操作",
            children:[
              {
                name:"添加节点",
                type:"添加节点",
                show:"all"
              },
              {
                name:"添加关系",
                type:"添加关系",
                show:"node"
              },
              {
                name:"添加任务",
                type:"添加任务",
                show:"node"
              },
              /*{
                name:"保存",
                type:"保存",
                show:"all"
              },*/
              {
                name:"删除",
                type:"删除",
                show:"node"
              },{
                name:"隐藏",
                type:"隐藏",
                show:"node"
              },
              {
                name:"节点编辑",
                type:"节点编辑",
                show:"node"
              }
            ]
          },
          {
            name:"分析",
            children:[
              {
                name:"全面扩线",
                type:"全面扩线",
                show:"node"
              },
              /*{
                name:"人本溯源",
                type:"人本溯源",
                show:"node"
              }*//*,
              {
                name:"智能搜索",
                type:"智能搜索",
                show:"all"
              }*/
            ]
          }
        ],
        menuConfig3:[
          {
            name:"标记",
            children:[
              {
                name:"添加标记",
                type:"添加标记",
                show:"node"
              },
              {
                name:"删除所有标记",
                type:"删除所有标记",
                show:"node"
              }
            ]
          },
          {
            name:"布局",
            children:[
              {
                name:"矩阵布局",
                type:"grid",
                show:"all"
              },
              {
                name:"树形布局",
                type:"breadthfirst",
                show:"all"
              },
              {
                name:"环形布局",
                type:"circle",
                show:"all"
              },
              {
                name:"同心圆布局",
                type:"concentric",
                show:"all"
              },
              {
                name:"弹性力布局",
                type:"euler",
                show:"all"
              }
            ]
          },
          {
            name:"聚合",
            children:[
              {
                name:"拆分节点",
                type:"拆分节点",
                show:"node"
              },
              {
                name:"合并已选",
                type:"合并已选",
                show:"node"
              },
              {
                name:"取消手动组合",
                type:"取消手动组合",
                show:"all"
              },
              {
                name:"团体组合",
                type:"团体组合",
                show:"all"
              }
            ]
          },
          {
            name:"选择",
            children:[
              {
                name:"反选其他",
                type:"反选其他",
                show:"node"
              },
              {
                name:"显示关联节点",
                type:"显示关联节点",
                show:"node"
              },
              {
                name:"全选节点",
                type:"全选节点",
                show:"all"
              },
              {
                name:"全选关系",
                type:"全选关系",
                show:"all"
              }
            ]
          },
          {
            name:"操作",
            children:[
              {
                name:"添加节点",
                type:"添加节点",
                show:"all"
              },
              {
                name:"添加关系",
                type:"添加关系",
                show:"node"
              },
              {
                name:"添加任务",
                type:"添加任务",
                show:"node"
              },
              /*{
                name:"保存",
                type:"保存",
                show:"all"
              },*/
              {
                name:"删除",
                type:"删除",
                show:"node"
              },{
                name:"隐藏",
                type:"隐藏",
                show:"node"
              },
              {
                name:"节点编辑",
                type:"节点编辑",
                show:"node"
              }
            ]
          },
          {
            name:"分析",
            children:[
              {
                name:"全面扩线",
                type:"全面扩线",
                show:"node"
              },
            /*  {
                name:"人本溯源",
                type:"人本溯源",
                show:"node"
              }*//*,
              {
                name:"智能搜索",
                type:"智能搜索",
                show:"all"
              }*/
            ]
          }
        ],
        menuConfig4:[
          {
            name:"标记",
            children:[
              {
                name:"添加标记",
                type:"添加标记",
                show:"node"
              },
              {
                name:"删除所有标记",
                type:"删除所有标记",
                show:"node"
              }
            ]
          },
          {
            name:"布局",
            children:[
              {
                name:"矩阵布局",
                type:"grid",
                show:"all"
              },
              {
                name:"树形布局",
                type:"breadthfirst",
                show:"all"
              },
              {
                name:"环形布局",
                type:"circle",
                show:"all"
              },
              {
                name:"同心圆布局",
                type:"concentric",
                show:"all"
              },
              {
                name:"弹性力布局",
                type:"euler",
                show:"all"
              }
            ]
          },
          {
            name:"聚合",
            children:[
              {
                name:"拆分节点",
                type:"拆分节点",
                show:"node"
              },
              {
                name:"合并已选",
                type:"合并已选",
                show:"node"
              },
              {
                name:"取消手动组合",
                type:"取消手动组合",
                show:"all"
              },
              {
                name:"取消团体组合",
                type:"取消团体组合",
                show:"all"
              }
            ]
          },
          {
            name:"选择",
            children:[
              {
                name:"反选其他",
                type:"反选其他",
                show:"node"
              },
              {
                name:"显示关联节点",
                type:"显示关联节点",
                show:"node"
              },
              {
                name:"全选节点",
                type:"全选节点",
                show:"all"
              },
              {
                name:"全选关系",
                type:"全选关系",
                show:"all"
              }
            ]
          },
          {
            name:"操作",
            children:[
              {
                name:"添加节点",
                type:"添加节点",
                show:"all"
              },
              {
                name:"添加关系",
                type:"添加关系",
                show:"node"
              },
              {
                name:"添加任务",
                type:"添加任务",
                show:"node"
              },
              /*{
                name:"保存",
                type:"保存",
                show:"all"
              },*/
              {
                name:"删除",
                type:"删除",
                show:"node"
              },{
                name:"隐藏",
                type:"隐藏",
                show:"node"
              },
              {
                name:"节点编辑",
                type:"节点编辑",
                show:"node"
              }
            ]
          },
          {
            name:"分析",
            children:[
              {
                name:"全面扩线",
                type:"全面扩线",
                show:"node"
              },
             /* {
                name:"人本溯源",
                type:"人本溯源",
                show:"node"
              }*//*,
              {
                name:"智能搜索",
                type:"智能搜索",
                show:"all"
              }*/
            ]
          }
        ]
      }
    },
    props: {
      currentGraphId : String,
      hasGroup:Boolean
    },
    watch:{
      currentGraphId:function(o,v){
        this.showMenu();
      },
      groupCombinationFlag:function(){
        if(this.groupCombinationFlag && this.removeManualFlag){
          this.menuConfig = this.menuConfig4;
        }
        else if(this.groupCombinationFlag && !this.removeManualFlag){//取消团体，手动
          this.menuConfig = this.menuConfig2;

        } else if(!this.groupCombinationFlag && this.removeManualFlag) {
          this.menuConfig = this.menuConfig3;
        } else {
          this.menuConfig = this.menuConfig1;
        }
        this.removeGroup();
      },
      removeManualFlag:function () {
        if(this.groupCombinationFlag && this.removeManualFlag){
          this.menuConfig = this.menuConfig4;
        }
        else if(this.groupCombinationFlag && !this.removeManualFlag){//取消团体，手动
          this.menuConfig = this.menuConfig2;

        } else if(!this.groupCombinationFlag && this.removeManualFlag) {
          this.menuConfig = this.menuConfig3;
        } else {
          this.menuConfig = this.menuConfig1;
        }
        this.removeGroup();
      },
      /*hasGroup:function(){
        this.removeGroup();
      }*/
    },
    computed:{
      groupCombinationFlag(){
        return this.$store.state.removeGroupCombinationFlag;
      },
      removeManualFlag() {
        return this.$store.state.removeManualFlag;
      },
      addable:function(){
        return this.$store.state.jurisdiction.addable;
      },
      deletable:function(){
        return this.$store.state.jurisdiction.deletable;
      },
      exportable:function(){
        return this.$store.state.jurisdiction.exportable;
      }
    },
    inject:[
      "changeRightConTabValue"
    ],
    mounted() {
      this.$nextTick(function(){
        if(!_.isEmpty(this.currentGraphId)){
          this.showMenu();
        }
      })

    },
    methods:{
      jurisdictionHandler(name){
        switch(name){
          case "添加标记":
            return this.addable;
            break;
          case "删除所有标记":
            return this.deletable;
            break;
          case "拆分节点":
            return this.addable;
            break;
          case "合并已选":
            return this.deletable;
            break;
          case "添加节点":
            return this.addable;
            break;
          case "添加关系":
            return this.addable;
            break;
          case "添加任务":
            return this.addable;
            break;
          case "删除":
            return this.deletable;
            break;
          case "全面扩线":
            return this.addable;
            break;
          default:
            return true;
        }
      },
      nodesShowMenu(name){
        switch(name){
          case "拆分节点":
            if(this.selectedNodeNum!=1){
              return false;
            } else {
              return true;
            }
            break;
          case "合并已选":
            if(this.selectedNodeNum!=2){
              return false;
            } else {
              return true;
            }
            break;
          case "添加关系":
            if(this.selectedNodeNum!=1){
              return false;
            } else {
              return true;
            }
            break;
          case "全面扩线":
            if(this.selectedNodeNum!=1){
              return false;
            } else {
              return true;
            }
            break;
          case "显示关联节点":
            if(this.selectedNodeNum!=1){
              return false;
            } else {
              return true;
            }
            break;
          case "节点编辑":
            if(this.selectedNodeNum!=1){
              return false;
            } else {
              return true;
            }
            break;
          case "添加标记":
            if(this.selectedNodeNum!=1){
              return false;
            } else {
              return true;
            }
            break;
          default:
            return true;
        }
      },
      cancelLabelView() {
        let labelDiv = document.getElementsByClassName("popper-div")[0];
        if(labelDiv) {
          labelDiv.style.display = "none";
          document.body.removeChild(labelDiv);
          window.popper = null;
        }
      },
      showMenu(){
        const _this = this;
        if(!this.currentGraphId) {
          return;
        } else {
          let container = document.getElementById(this.currentGraphId);
          let menu = document.querySelector(".menu-container");
          menu.oncontextmenu = function(e){
            e.preventDefault();
          };
          container.oncontextmenu = (e) => {
            e.stopPropagation();
            _this.clickContainer = true;
            let isCloseCase = _this.$store.state.closeCase;
            if(!isCloseCase){//结案任务不显示右键菜单
              let activeNav = document.querySelector(".nav-active");
              if(activeNav) activeNav.className = activeNav.className.replace("nav-active","").trim();
              e.preventDefault();
              menu.className = "menu-container";
              menu.className += " show-menu";
              let x = e.offsetX,y = e.offsetY;
              let currentGraphModel = this.$store.state.currentGraphModel;
              let cy = currentGraphModel.cy;
              this.selectedNodeNum = cy.nodes(":selected").length;
              if(cy.nodes(":selected").length !== 0 && _this.clickContainer){
                _this.atNode = true;
                if(cy.nodes(":selected").length === 1){ //选择节点只有一个时以节点位置为中心点显示右键菜单
                  x = cy._private.curNode.renderedPosition().x;
                  y = cy._private.curNode.renderedPosition().y;
                  _this.clickContainer = false;
                  cy._private.nodeRightClick = false;
                } else {
                  _this.clickContainer = false;
                  cy._private.nodeRightClick = false;
                }
              } else {
                _this.atNode = false;
              }
              // _this.clickContainer && cy._private.nodeRightClick ? _this.atNode = true : _this.atNode = false;
              /*if(_this.atNode){
                //右键点击节点
                x = cy._private.curNode.renderedPosition().x;
                y = cy._private.curNode.renderedPosition().y;
                // console.info("右键：x-" + x + "; y-" +y);
                _this.clickContainer = false;
                cy._private.nodeRightClick = false;
              } else {
                //右键点击非节点
                let currentGraphModel = store.state.currentGraphModel;
                currentGraphModel.collectionNodes = cy.collection();
                cy._private.curNode = undefined;
                cy.nodes().removeClass('otherNodeColor');
                cy.edges().removeClass('otherEdgeColor');
                /!*cy.nodes().forEach(function (ele,i,eles) {
                    ele.unselect();
                });*!/
                x = e.offsetX, y = e.offsetY;
                _this.clickContainer = false;
                cy._private.nodeRightClick = false;
                if(cy._private.edges_allSelect){
                  cy.edges().unselect();
                }
              }*/
              menu.style.left = x + "px";
              menu.style.top = y + "px";
            }
          }

          //点击菜单如有下级菜单就展开下级菜单
          menu.onclick = function(e){
            let target = e.target;
            if(target.className == "nav1-txt" || target.className == "nav-v1" || target.className.indexOf("nav1-icon") !== -1 || target.className.indexOf("nav1-tit") !== -1){
              let index = target.dataset.index;
              let activeNav = document.querySelector(".nav-active");
              if(activeNav) activeNav.className = activeNav.className.replace("nav-active","").trim();
              let navs = document.querySelectorAll(".nav-v1-container");
              navs.forEach((v,k)=>{
                if(index == k){
                  v.className += " nav-active";
                }
              })
            }
          }

          //点击空白处取消菜单
          container.onclick = function(e){
            e.stopPropagation();
            cy.nodes().removeClass('otherNodeColor');
            cy.edges().removeClass('otherEdgeColor');
            let activeNav = document.querySelector(".nav-active");
            if(activeNav) activeNav.className = activeNav.className.replace("nav-active","").trim();
            menu.className = "menu-container";
          }
        }
      },

      getAllDefinedLabels(){
        this.$emit('getAllDefinedLabel');
      },

      deleteLabels(){
        this.$emit('deleteLabels');
      },
      resetMenu(){
        this.menuConfig = [
          {
            name:"标记",
            children:[
              {
                name:"添加标记",
                type:"添加标记",
                show:"node"
              },
              {
                name:"删除所有标记",
                type:"删除所有标记",
                show:"node"
              }
            ]
          },
          {
            name:"布局",
            children:[
              {
                name:"矩阵布局",
                type:"grid",
                show:"all"
              },
              {
                name:"树形布局",
                type:"breadthfirst",
                show:"all"
              },
              {
                name:"环形布局",
                type:"circle",
                show:"all"
              },
              {
                name:"同心圆布局",
                type:"concentric",
                show:"all"
              },
              {
                name:"弹性力布局",
                type:"euler",
                show:"all"
              }
            ]
          },
          {
            name:"聚合",
            children:[
              {
                name:"拆分节点",
                type:"拆分节点",
                show:"node"
              },
              {
                name:"合并已选",
                type:"合并已选",
                show:"node"
              },
              {
                name:"手动组合",
                type:"手动组合",
                show:"node"
              },
              {
                name:"团体组合",
                type:"团体组合",
                show:"all"
              }
            ]
          },
          {
            name:"选择",
            children:[
              {
                name:"反选其他",
                type:"反选其他",
                show:"node"
              },
              {
                name:"显示关联节点",
                type:"显示关联节点",
                show:"node"
              },
              {
                name:"全选节点",
                type:"全选节点",
                show:"all"
              },
              {
                name:"全选关系",
                type:"全选关系",
                show:"all"
              }
            ]
          },
          {
            name:"操作",
            children:[
              {
                name:"添加节点",
                type:"添加节点",
                show:"all"
              },
              {
                name:"添加关系",
                type:"添加关系",
                show:"node"
              },
              {
                name:"添加任务",
                type:"添加任务",
                show:"node"
              },
              /*{
                name:"保存",
                type:"保存",
                show:"all"
              },*/
              {
                name:"删除",
                type:"删除",
                show:"node"
              },{
                name:"隐藏",
                type:"隐藏",
                show:"node"
              },
              {
                name:"节点编辑",
                type:"节点编辑",
                show:"node"
              }
            ]
          },
          {
            name:"分析",
            children:[
              {
                name:"全面扩线",
                type:"全面扩线",
                show:"node"
              },
              /*{
                name:"人本溯源",
                type:"人本溯源",
                show:"node"
              }*//*,
              {
                name:"智能搜索",
                type:"智能搜索",
                show:"all"
              }*/
            ]
          }
        ];
        setTimeout(()=>{
         this.removeGroup();
        },400)
        let menu = document.querySelector(".menu-container");
        let activeNav = document.querySelector(".nav-active");
        if(activeNav) activeNav.className = activeNav.className.replace("nav-active","").trim();
        menu.className = "menu-container";
      },
      //菜单点击事件
      clickHandler(type){
        let _this = this;
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let nodes;
        if(_.isEmpty(currentGraphModel.collectionNodes)){
          nodes = window.curNode;
        } else {
          nodes = currentGraphModel.collectionNodes;
        }

        switch (type){
          //网格布局
          case "grid":
            menuHandle.changeLayout(type);
            break;
          //树型布局
          case "breadthfirst":
            menuHandle.changeLayout(type);
            break;
          //环形布局
          case "circle":
            menuHandle.changeLayout(type);
            break;
          //同心圆布局
          case "concentric":
            menuHandle.changeLayout(type);
            break;
          //弹性力布局
          case "euler":
            menuHandle.changeLayout(type);
            break;
          case "添加标记":
            this.getAllDefinedLabels();
            break;
          case "删除所有标记":
            this.deleteLabels();
            break;
          case "拆分节点":
            this.$store.commit("showStatisticsAndAnalyzeCon", false);
            setTimeout(() => {
              menuHandle.splitNode();
            }, 10);
            break;
          case "合并已选":
            this.$store.commit("showStatisticsAndAnalyzeCon", false);
            menuHandle.mergeSelected();
            break;
          case "手动组合":
            menuHandle.manualCombination();
            break;
          case "取消手动组合":
            menuHandle.removeManualCombination();
            break;
          case "团体组合":
            menuHandle.groupCombination();
            break;
          case "取消团体组合":
            menuHandle.removeGroupCombination();
            break;
          case "反选其他":
            menuHandle.inverseOther();
            break;
          case "显示关联节点":
            let target = menuHandle.selectLink();
            _this.$store.commit("setRightConTabName", "statistics");
            //区别选中点查看个体
            target.rightMenuNode = true;
            _this.changeRightConTabValue(target);
            break;
          case "全选节点":
            menuHandle.allSelectNode();
            break;
          case "全选关系":
            menuHandle.allSelectRelation();
            break;
          case "添加节点":
            _this.$store.commit("menuAddNode",true);
            menuHandle.rightAdd(this);
            break;
          case "添加任务":
            menuHandle.addTask();
            break;
          case "添加关系":
            menuHandle.addEdge(nodes, cy);
            break;
          case "保存":
            menuHandle.save();
            break;
          case "删除":
            this.$store.commit("showStatisticsAndAnalyzeCon", false);
            setTimeout(() => {
              menuHandle.deleteHandle();
            }, 10);
            break;
          case "隐藏":
            menuHandle.hideHandle();
            break;
          case "节点编辑":
            this.$emit("getDefaultIconData");
            menuHandle.nodeEdit();
            break;
          case "锁定":
            menuHandle.lock();
            break;
          case "全面扩线":
            menuHandle.expandLine(this,nodes);
            break;
          case "人本溯源":
            menuHandle.findRoot();
            break;
          case "智能搜索":
            menuHandle.intelligentSearch();
            break;
        }
        let menu = document.querySelector(".menu-container");
        let activeNav = document.querySelector(".nav-active");
        if(activeNav) activeNav.className = activeNav.className.replace("nav-active","").trim();
        menu.className = "menu-container";

      },
      removeGroup(){
        if(!this.hasGroup){
          this.menuConfig.forEach( v => {
            if(v.name == "聚合"){
              let index = v.children.length;
              v.children.splice(index-1,1);
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .menu-container{
    /*display:none;*/
    width:80px;
    height:80px;
    position:absolute;
    top:0;
    left:0;
    z-index:2;
    transform:scale(0);
    transform-origin:0 0;
    transition:transform .1s linear;
  }
  .nav-v1-container{
    width:90px;
    height:67px;
    position:absolute;
    transform-origin:0 0;
    z-index:2;
    transition:all .2s linear;
  }
  .nav-v1-container1{
    transform:rotate(0deg);
  }
  .nav-v1-container2{
    transform:rotate(60deg);
    .nav-v2-container:nth-child(6){
      p{
        span{
          transform:rotate(180deg)
        }
      }
    }
    .nav-v2-container:nth-child(7){
      p{
        span{
          transform:rotate(180deg)
        }
      }
    }
    .nav-v2-container:nth-child(8){
      p{
        span{
          transform:rotate(180deg)
        }
      }
    }
  }
  .nav-v1-container3{
    transform:rotate(120deg);
    .nav-v2-container:nth-child(2){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
  }
  .nav-v1-container4{
    transform:rotate(180deg);
    .nav-v2-container:nth-child(2){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
    .nav-v2-container:nth-child(3){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
  }
  .nav-v1-container5{
    transform:rotate(240deg);
    .nav-v2-container:nth-child(2){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
    .nav-v2-container:nth-child(3){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
    .nav-v2-container:nth-child(4){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
    .nav-v2-container:nth-child(5){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
  }
  .nav-v1-container6{
    transform:rotate(300deg);
    .nav-v2-container:nth-child(3){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
    .nav-v2-container:nth-child(4){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
    .nav-v2-container:nth-child(5){
      p{
        span{
          transform:rotate(180deg);
        }
      }
    }
  }
  .show-menu{
    transform:scale(1);
  }

  .nav1-txt{
    position:relative;
    width:100%;
    height:100%;
  }
  .nav1-icon{
    position:absolute;
    width:25px;
    height:25px;
    user-select:none;
  }
  .nav1-tit{
    position:absolute;
    width: 30px;
    height: 30px;
    user-select:none;
  }
  .nav1-icon-1 {
    left: -10px;
    top: 4px;
    background:url(../../assets/img/buju.png);
    background-size:100% 100%;
    transform: rotate(15deg);
  }
  .nav1-tit-1 {
    left: -20px;
    top: 18px;
    transform: rotate(17deg);
  }
  .nav1-icon-2 {
    left: -8px;
    top: 2px;
    background:url(../../assets/img/juhe.png);
    background-size:100% 100%;
    transform: rotate(14deg);
  }
  .nav1-tit-2 {
    left: -27px;
    top: 10px;
    transform: rotate(60deg);
  }
  .nav1-icon-3 {
    left: -4px;
    top: 10px;
    background:url(../../assets/img/xuanze.png) no-repeat;
    background-size:90% 90%;
    transform: rotate(-60deg);
  }
  .nav1-tit-3 {
    left: -35px;
    top: -5px;
    transform: rotate(-63deg);
  }
  .nav1-icon-4 {
    left: -12px;
    top: 14px;
    background:url(../../assets/img/caozuo.png);
    background-size:100% 100%;
    transform: rotate(-40deg);
  }
  .nav1-tit-4 {
    left: -13px;
    top: -18px;
    transform: rotate(3deg);
  }
  .nav1-icon-5 {
    left: -20px;
    top: 7px;
    background:url(../../assets/img/fenxi.png);
    background-size:100% 100%;
  }
  .nav1-tit-5 {
    left: 8px;
    top: -3px;
    transform: rotate(78deg);
  }
  .nav1-icon-0 {
    left: -15px;
    top: 2px;
    background:url(../../assets/img/biaoji.png) no-repeat;
    background-size:90% 90%;
    transform: rotate(32deg);
  }
  .nav1-tit-0 {
    left: -7px;
    top: 12px;
    transform: rotate(-43deg);
  }
  /*.disable-nav1-txt{
    porint-event:none;
  }*/
  .nav-v1{
    width:87px;
    height:68px;
    position:absolute;
    top:6px;
    left:-1px;
    background-image:url(../../assets/img/c1.png);
    background-size:contain;
    background-repeat:no-repeat;
    transform:rotate(-47deg);
    z-index:2;
    &:hover{
      background-image:url(../../assets/img/c1_h.png);
      background-size:contain;
      background-repeat:no-repeat;
    }
  }
  /*.disable-nav1{
    background-image:url(../../assets/img/c1_d.png) !important;
    porint-event:none;
  }*/
  .nav-v1-content{
    width:40px;
    height:40px;
    position:absolute;
    text-align:center;
    line-height:40px;
    font-family:"Microsoft YaHe";
    font-size:12px;
    color:#fff;
    font-weight:800;
    z-index:3;
    cursor:pointer;
    &:hover +.nav-v1-container>.nav-v1{
      background-image:url(../../assets/img/c1_h.png);
    }
  }

  .nav-v1-content1{
    top:18px;
    left:22px;
    transform:rotate(-3deg);
  }
  .nav-v1-content2{
    top: 32px;
    left: -30px;
    transform: rotate(-5deg);
  }
  .nav-v1-content3{
    top: -3px;
    left: -71px;
    transform: rotate(11deg);
  }
  .nav-v1-content4{
    top: -57px;
    left: -60px;
    transform: rotate(11deg);
  }
  .nav-v1-content5{
    top: -74px;
    left: -8px;
    transform: rotate(11deg);
  }
  .nav-v1-content6{
    top: -35px;
    left: 33px;
    transform: rotate(-5deg);
  }

  .nav-v2-container{
    width:1px;
    height:1px;
    position:absolute;
    transform-origin:0 0;
    transition:all .2s linear;
  }


  .nav-v2{
    width:110px;
    height:77px;
    display:none;
    color:#fff;
    flex-direction:column;
    background:url(../../assets/img/c2.png);
    background-size:100% 100%;
    position:absolute;
    top:76px;
    left:-30px;
    transform:rotate(-11deg);
    &:hover{
      background:url(../../assets/img/c2_h.png);
      background-size:100% 100%;
    }
  }

  .nav-active{
    .nav-v1{
      background-image:url(../../assets/img/c1_h.png);
    }
    .nav-v2-container:nth-child(2){
      transform: rotate(0deg);
    }
    .nav-v2-container:nth-child(3){
      transform: rotate(-40deg);
    }
    .nav-v2-container:nth-child(4){
      transform: rotate(-80deg);
    }
    .nav-v2-container:nth-child(5){
      transform: rotate(-120deg);
    }
    .nav-v2-container:nth-child(6){
      transform: rotate(-160deg);
    }
    .nav-v2-container:nth-child(7){
      transform: rotate(-200deg);
    }
    .nav-v2-container:nth-child(8){
      transform: rotate(-240deg);
    }
    .nav-v2-container:nth-child(9){
      transform: rotate(-280deg);
    }
    .nav-v2{
      display:flex;
      align-items:center;
      justify-content:center;
      span{
        pointer-events:none;
      }
    }
  }
  .nav3-container{
    position:absolute;
    width:98px;
    height:49px;
    /*background:#000;*/
  }
  /*禁用功能样式*/
  .disable-nav-v2{
    background-image:url(../../assets/img/c2_d.png);
    pointer-events:none;
  }
</style>
