<template>
  <div :class="isShowSocialExponent ? 'show' : 'hide'" id="socialExponent">
    <div slot="close" class="cls-close">
      <span class="exponent-title-span">社交指数 - {{nodeType}}</span>
      <span id="question-groupmodel" style="margin-left: 364px;font-size:16px;cursor: pointer" >
          <i class="iconfont icon-mendian-"></i>
         </span>
      <Icon type="ios-close" class="f-csp exponent-icon" @click="closeSocialExponent"></Icon>

    </div>
    <div class="socialExponent-header">
      <Row style="line-height:34px;margin-top:5px;padding-left:6px">
        <!--<span>排序</span>-->
        <!--<Icon type="ios-arrow-round-up" style="font-size: 18px;font-weight: bolder; margin: 0 -3px 3px -3px;"></Icon>-->
        <!--<Select v-model="paramsDegreeModel" size="small" style="margin-bottom: 3px; width: 120px;">
          <Option v-for="item in paramsDegree" :value="item" :key="item">{{ item }}</Option>
        </Select>-->
        <Input v-model="exponentSearchContent" @on-keyup="searchNodeExponent(exponentSearchContent)" icon="ios-search" size="small" placeholder="搜索..."
               style="width: 200px"></Input>
      </Row>
    </div>

      <div style="padding:6px 17px 10px 17px">
        <Table :columns="columnsNode" id="socialTable"  :data="nodeList" @on-sort-change="sortHandler" stripe size="small" @on-row-click="graphNodeSelect"></Table>
      </div>

      <div class="pageList">
        <span style="margin-left: 20px">共 {{nodeTotal}} 条</span>
        <Page style="float: right" @on-change="changePage" :current="currentPage" :page-size="pageSize" :total="nodeTotal" simple></Page>
      </div>
    <div id="modelInfo">
      <div class="mainTitle">度中心度</div>
      <p>表示节点邻居的多少，连接其他点关系的多少，度中心度越大，其重要性就越高</p>
      <div class="mainTitle">接近中心度</div>
      <p>表示节点与网络中其他节点的平均距离，距离越小，则接近中心度越高，该节点越重要</p>
      <div class="mainTitle">中介中心度</div>
      <p>表示在网络结构中经过该节点的最短路径，最短路径数量越多，该节点越重要</p>
      <div class="mainTitle">偏心距</div>
      <p>表示该节点在网络结构中与其它节点的最大距离，距离越小，偏心距越小，该节点越重要</p>
      <div class="mainTitle">pageRank</div>
      <p>表示节点在网络结构中的影响力，pageRank值越大，该节点就越重要</p>
    </div>
  </div>
</template>

<script>
    export default {
      name: "social-exponent",

      data() {
        return {
          nodeType:'',
          exponentSearchContent: '',
          paramsDegree: [
            "度中心度",
            "接近中心度",
            "中介中心度",
            "偏心距",
            "pageRank"
          ],
          paramsDegreeModel:'度中心度',
          oriTotalNodes:[],
          sortTotalNodes:[],
          nodeList: [],
          allNodeList: [],
          isShowSocialExponent: false,
          currentPage: 1,
          pageSize: 10,
          nodeTotal: 0,
          sortType:"normal",
          columnsNode: [
            {
              title: "序号",
              width: 50,
              align: 'center',
              render:(h,params) => {
                return h('div',[
                  h('span',(params.index+1)+this.pageSize*(this.currentPage-1))
                ])
              }
            },
            {
              title: '名称',
              key: 'name',
              align:'center',
              width:80,
              render:(h,params) => {
                return h('p',[
                  h('Tooltip',{
                    props:{
                      placement:'top',
                      transfer:true
                    },
                    style:{
                      display: 'inline-block',
                      width:'80px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop:'5px'
                    }
                  },[
                    params.row.name,
                    h('p',{
                        slot:'content',
                        style:{
                          whiteSpace:'normal',
                          wordWrap:'bread-word',
                          wordBreak:'break-all'
                        }
                      },
                      params.row.name)
                  ])
                ])
              }
            },
            {
              title: '度中心度',
              key: 'degree',
              sortable:true,
              sortMethod:(a,b,type) => {
                // this.sortHandler("degree",type);
                return;
              },
              align:'center',
              width:80
            },
            {
              title: '接近中心度',
              key: 'closeness',
              sortable:true,
              sortMethod:(a,b,type) => {
                // this.sortHandler("closeness",type);
                return;
              },
              align:'center',
              width:80
            },
            {
              title: '中介中心度',
              key: 'betweenness',
              sortable:true,
              sortMethod:(a,b,type) => {
                // this.sortHandler("betweenness",type);
                return;
              },
              align:'center',
              width:80
            },
            {
              title: '偏心距',
              key: 'eccentricDistance',
              sortable:true,
              sortMethod:(a,b,type) => {
                // this.sortHandler("eccentricDistance",type);
                return;
              },
              align:'center',
              width:60
            },
            {
              title: 'pageRank',
              key: 'pageRank',
              align:'center',
              sortable:true,
              sortMethod:(a,b,type) => {
                // this.sortHandler("pageRank",type);
                return;
              },
              width:80
            }
          ]
        }
      },

      components: {
      },

      created() {

      },

      mounted() {
        this.changeGraph();
        this.userInfoEnter();
      },

      methods: {
        //使用说明动画
        userInfoEnter(){
          $('#question-groupmodel').mouseenter(function () {
            $('#modelInfo').animate({},function () {
              $('#modelInfo').css({
                'transform':'scale(1)'
              })
            })
          });
          $('#question-groupmodel').mouseleave(function () {
            $('#modelInfo').animate({},function () {
              $('#modelInfo').css({
                'transform':'scale(0)'
              })
            })
          })
        },

        initSocialExponent (typeGroup) {
          let allNodeList = typeGroup.children;
          this.nodeType = typeGroup.name;
          let nodeLists = [];
          let nodeList = [];
          if (!_.isEmpty(allNodeList)) {
            allNodeList.forEach((v, k) => {
              if (!_.isEmpty(v.degreeIndicators)) {
                nodeLists.push({
                  name: v.name,
                  betweenness: v.degreeIndicators.betweenness,
                  closeness: v.degreeIndicators.closeness,
                  degree: v.degreeIndicators.degree,
                  eccentricDistance: v.degreeIndicators.eccentricDistance,
                  pageRank: v.degreeIndicators.pageRank,
                })
              }
              if (k < 10) {
                if (!_.isEmpty(v.degreeIndicators)) {
                  nodeList.push({
                    name: v.name,
                    betweenness: v.degreeIndicators.betweenness,
                    closeness: v.degreeIndicators.closeness,
                    degree: v.degreeIndicators.degree,
                    eccentricDistance: v.degreeIndicators.eccentricDistance,
                    pageRank: v.degreeIndicators.pageRank,
                  })
                }
              }
            })
          }
          this.allNodeList = nodeLists;
          this.oriTotalNodes = JSON.parse(JSON.stringify(nodeLists));
          this.nodeList = nodeList;
          this.nodeTotal = this.allNodeList.length;
        },

        //展示当前类型社交参数
        showSocialExponent(typeGroup) {
          //关闭
          if(_.isEmpty(typeGroup)){
            this.isShowSocialExponent = false;
            this.exponentSearchContent = "";
            this.currentPage = 1;
            this.nodeList = [];
            return false
          }
          //不同类型社交指数切换, 第一次进来this.nodeType为空
          if(_.isEmpty(this.nodeType) || this.nodeType === typeGroup.name){
            this.isShowSocialExponent = !this.isShowSocialExponent;
            if(this.isShowSocialExponent){
              this.initSocialExponent(typeGroup);
            } else {
              this.closeSocialExponent()
            }
          }else {
            this.isShowSocialExponent = true;
            this.initSocialExponent(typeGroup);
          }

        },

        closeSocialExponent(){
          let currentModel = this.$store.state.currentGraphModel;
          let cy = currentModel.cy;
          this.isShowSocialExponent = false;
          this.exponentSearchContent = "";
          this.currentPage = 1;
          this.nodeList = [];
          if(cy){
            let selectNode = cy.$(":selected");
            if(selectNode.length >0){
              selectNode.unselect();
              cy.center();
            }
          }
        },
        changeGraph(){
          this.$store.watch(() =>{
            return this.$store.state.currentGraphModel.rid;
          },() => {
            this.closeSocialExponent();
          })
        },
        //选中点或者类型高亮graph图显示
        graphNodeSelect(rowData, index) {
          let name = rowData.name;
          let currentModel = this.$store.state.currentGraphModel;
          let cy = currentModel.cy;
          let graphNode = _.find(cy.nodes(), function(node){
            if(node.data().name === name) {
              return node
            }
          });
          cy.$(cy.nodes()).unselect();
          cy.$(graphNode).select();
          cy.zoom(1);
          cy.center(graphNode)
        },

        addHighlight(e) {
          e.target.style.color = '#2d8cf0'
        },

        cancelHighlight(e) {
          e.target.style.color = ''
        },

        //过滤node
        searchNodeExponent(content) {
          let sorted = document.querySelector(".ivu-table-sort i.on");
          if(sorted){
            sorted.click();
          }
          this.allNodeList = JSON.parse(JSON.stringify(this.oriTotalNodes));
          if(content !== ""){
            let filterNodeList= _.filter(this.allNodeList, function(node){
              return _.includes(node.name, content)
            });
            this.allNodeList = filterNodeList;
          } else {
            this.allNodeList = JSON.parse(JSON.stringify(this.oriTotalNodes));
          }
          this.nodeTotal = this.allNodeList.length;
          let nodeList = [];
          if(this.nodeTotal > 10){
            for(let i=0; i < this.pageSize; i++) {
              nodeList.push(this.allNodeList[i])
            }
          } else {
            nodeList = this.allNodeList;
          }
          this.nodeList = nodeList;
        },

        //划到底部加载
        handleReachEdge(dir) {
          return new Promise(resolve => {
            setTimeout(() => {
              if (dir > 0) {
                const first = this.nodeList[0];
                for (let i = 0; i < 10; i++) {
                  this.nodeList.unshift(first - i);
                }
              } else {
                const last = this.nodeList[this.nodeList.length - 1];
                for (let i = 0; i < 10; i++) {
                  this.nodeList.push(last + i);
                }
              }
              resolve();
            }, 100);
          });
        },

        changePage(page){
          this.currentPage = page;
          let currentNum = page * this.pageSize;
          let nodeList = [];
          for(let i = this.pageSize*(page - 1); i < (currentNum > this.nodeTotal ? this.nodeTotal : currentNum); i++){
            nodeList.push(this.allNodeList[i]);
          }
          this.nodeList = nodeList;
        },
        //排序
        sortHandler({column,key,order}){
          this.currentPage = 1;
          this.sortType = order;
          if(order == "desc"){
            this.desc(key);
          }
          else if(order == "asc"){
            this.ascSort(key);
          }
          else if(order == "normal"){
            this.allNodeList = JSON.parse(JSON.stringify(this.oriTotalNodes));
            let nodeList = [];
            if(this.allNodeList.length > this.pageSize){
              for(let i = 0; i < this.pageSize; i++){
                nodeList.push(this.allNodeList[i]);
              }
            } else {
              nodeList = this.allNodeList;
            }
            this.nodeList = nodeList;
          }
        },
        //升序排列
        ascSort(key){
          var min,temp,arr=this.allNodeList;
          for(var i = 0; i < arr.length - 1; i++){
            min = i;
            for(var j = i+1; j < arr.length; j++){
              if(arr[j][key] < arr[min][key]){
                min = j;
              }
            }
            temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
          }
          this.allNodeList = arr;
          this.sortTotalNodes = JSON.parse(JSON.stringify(arr));
          let nodeList = [];
          if(arr.length > this.pageSize){
            for(let i = 0; i < this.pageSize; i++){
              nodeList.push(arr[i]);
            }
          } else {
            nodeList = this.allNodeList;
          }
          this.nodeList = nodeList;
        },
        //降序排序
        desc(key){
          var min,temp,arr=this.allNodeList;
          for(var i = 0; i < arr.length - 1; i++){
            min = i;
            for(var j = i+1; j < arr.length; j++){
              if(arr[j][key] > arr[min][key]){
                  min = j;
              }
            }
            temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
          }
          this.allNodeList = arr;
          this.sortTotalNodes = JSON.parse(JSON.stringify(arr));
          let nodeList = [];
          if(arr.length > this.pageSize){
            for(let i = 0; i < this.pageSize; i++){
              nodeList.push(arr[i]);
            }
          } else {
            nodeList = this.allNodeList;
          }
          this.nodeList = nodeList;
        }
      }
    }
</script>

<style scoped lang="less">
  /*.tableContent{
    border-top: 1px solid #ace;
  }*/
  #modelInfo{
    width: 480px;
    position: absolute;
    top: 6px;
    z-index: 999;
    background: #6269A9;
    border-radius: 3px;
    transform: scale(0);
    padding: 10px;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    >p{
      padding:2px 3px;
      color:#fff;
      margin-left: 10px;
    }
    .mainTitle{
      color: #FF6699;
      height: 20px;
      line-height: 20px;
      margin-left: 10px;
    }
    .headTitle{
      color: #DB7172;
      font-size: 15px;
      height: 20px;
      line-height: 20px;
      margin-bottom: 5px;
      margin-left: 5px;
    }
  }
  #socialExponent {
    position: absolute;
    right: 333px;
    width: 550px;
    top: 90px;
    border-radius: 5px;
    transform-origin:100% 0;
    transition:transform .5s;
    overflow: auto;
    z-index: 9999;
  }
  .show{
    transform:scale(1);
  }
  .hide{
    transform:scale(0);
  }
  .socialExponent-header{
    padding: 0 10px;
  }
  .socialExponent-content {
    overflow: auto;
    max-height: 622px;
  }
  .cls-close{
    height:30px;
    line-height:30px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:0px 10px;
  }
  .exponent-icon{
    font-size: 18px;
    font-weight: bolder;
  }

  .exponent-title-span{
    margin-right: 5px;
    margin-top: 3px;
  }
  .node-exponent-detail{
    /*border: 1px solid #c5b2b2;*/
    border-radius: 5px;
    padding: 5px;
    /*background-color: #eef2f5;;*/
    /*color: #fff;*/
  }

  #socialExponent .node-params-span {
    float: right;
    margin-right: 15px;
  }

  .exponentNode-node-select {
    background-color: #c6e2ec;
  }

  .noneExponentNode {
    width: 100%;
    text-align: center;
    display: inline-block;
    margin: 5px 0;
    color: #abc0c4;
    text-decoration: underline;
  }

  #socialExponent .ivu-table-cell {
     padding-left: 0;
     padding-right: 0;
  }
  .pageList{
    height:30px;
    line-height:30px;
    border-top:1px solid #dcdee2;
  }
</style>
<style>
  #socialTable .ivu-table-cell{
    padding:0px;
  }
  #socialTable .ivu-table-column-center{
    padding:0px;
  }
  #socialTable .ivu-table-small td {
    height: 30px;
  }
</style>
