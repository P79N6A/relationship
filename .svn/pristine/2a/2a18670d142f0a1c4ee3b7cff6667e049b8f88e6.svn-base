<template>
  <div id="header">
    <div class="logo">
      <img src="../../assets/logo.png">
    </div>
    <div class="title">
      关系分析系统
    </div>
    <div>
      <ul class="headerRouter">
        <Dropdown v-if="addable && !isCloseCase">
          <li class="f-csp dropDown-li">
            <div class="cls-icn"><span class="iconfont icon-getifenxi" style="font-size:24px"></span></div>
            <div class="menuText">个体分析</div>
          </li>
          <DropdownMenu slot="list">
            <DropdownItem v-for="item in singlePro" @click.native="createStatisticsSingleModel(item)" :key="item.dicName">{{item.dicName}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <!--群体分析下拉-->
        <Dropdown v-if="addable && !isCloseCase ">
          <li class="f-csp dropDown-li">
            <div class="cls-icn"><span class="iconfont icon-quntifenxi" style="font-size:24px"></span></div>
            <div class="menuText">群体分析</div>
          </li>
          <DropdownMenu slot="list">
            <DropdownItem v-for="items in manyPros" @click.native="createStatisticsManyModel(items,items.dicCode)" :key="items.dicName">{{items.dicName}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <!--搜索过滤下拉-->
        <Dropdown>
          <li class="f-csp dropDown-li">
            <div class="cls-icn"><span class="iconfont icon-sousuo" style="font-size:22px"></span></div>
            <div class="menuText">搜索过滤</div>
          </li>
          <DropdownMenu slot="list" style="width: 100px;left: 495px">
            <DropdownItem @click.native="showAdvancedSearch">高级搜索</DropdownItem>
            <!--<Dropdown placement="right-start">-->
              <!--<DropdownItem>节点类型搜索</DropdownItem>-->
            <!--<DropdownMenu slot="list">-->
              <!--<a v-for="(item,key) in this.numlist" :key="key"><DropdownItem @click.native="confirmSearch(item.label)">{{item.name}}</DropdownItem></a>-->
            <!--</DropdownMenu>-->
        <!--</Dropdown>-->
          </DropdownMenu>

        </Dropdown>
        <span class="linefix"></span>
        <!--添加下拉-->
        <Dropdown  placement="bottom-start" v-if="addable && !isCloseCase">
          <li class="f-csp dropDown-li" >
            <div class="cls-icn"><span class="iconfont icon-tianjia" style="font-size:20px"></span></div>
            <div class="menuText">添加</div>
          </li>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="addNode">添加节点</DropdownItem>
            <!--<DropdownItem @click.native="addTask">添加任务</DropdownItem>-->
          </DropdownMenu>
        </Dropdown>

        <Dropdown @mouseenter.native="showSnapshotContent($event)" @mouseleave.native="hiddenSnapshot">
          <li class="f-csp dropDown-li">
            <div class="cls-icn"><span class="iconfont icon-kuaizhao" style="font-size:20px"></span></div>
            <div class="menuText">快照</div>
          </li>
          <snapshot ref="snapshot" @statisticsSelectNode="statisticsSelectNode" @getSingleLvl="getSingleLvl"></snapshot>
        </Dropdown>
      </ul>
      <AddModal ref="addNode"></AddModal>
      <create-statistics-model ref="createStatistics" @refreshAnalyticalModelList="refreshAnalyticalModelList" @getModelUseInfo="getStatistics"></create-statistics-model>
    </div>
    <div class="rightmenu">
      <li>
        <a href="javascript:void(0)">
          <Icon type="ios-help-circle" size="20" id="modelIntroduction" title="模型介绍"></Icon>
        </a>
      </li>

      <li>
        <a href="javascript:void(0)" style="display: inline-block;width: 160px;height: 56px;">
          <span style="float: left;;height: 56px;">模型使用情况统计</span> <span id="sparklineBar" class="sparklineBar" style="float: left;width: 60px;height: 56px;"></span>
        </a>
      </li>

      <li class="settingList">
        <Dropdown>
          <li class="f-csp dropDown-li">
            <a href="javascript:void(0)">
              <Icon type="md-settings" size="20" title="设置"></Icon>
            </a>
          </li>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="systemSettingManage('user')"><Icon type="ios-contact" size="16"></Icon>用户管理</DropdownItem>
            <DropdownItem @click.native="systemSettingManage('case')"><Icon type="ios-stats" size="16"></Icon>案件管理</DropdownItem>
            <DropdownItem @click.native="systemSettingManage('rbac')"  v-if="manage"><Icon type="ios-unlock" size="16"></Icon>权限管理</DropdownItem>
            <DropdownItem @click.native="systemSettingManage('dataManage')"><Icon type="ios-cube" size="16"></Icon>数据治理</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>

      <li>
        <a href="javascript:void(0)" @click="checkOperateDocument">
          <Icon type="ios-document" size="20" title="操作文档"></Icon>
        </a>
      </li>

      <li>
        <a href="javascript:void(0)" @click="aboutProduct">
          <Icon type="logo-codepen" size="20" title="关于产品"></Icon>
        </a>
      </li>

      <li>
        <a href="javascript:void(0)" @click="setTheme('a')" v-if="theme=='b'">
          <Icon type="ios-shirt" size="20" title="换肤"></Icon>
        </a>
        <a href="javascript:void(0)" @click="setTheme('b')"  v-if="theme=='a'">
          <Icon type="ios-shirt" size="20" title="换肤"></Icon>
        </a>
      </li>
      <li class="user-info-li">
        <Dropdown>
            <li class="f-csp dropDown-li">
              <a href="javascript:void(0)" >
                <Icon type="md-person" id="userManager" size="20" title="管理员"></Icon>
              </a>
            </li>
            <DropdownMenu slot="list">
              <DropdownItem ><label style="width:51px;display:inline-block">用户名:</label><label class="userItemInfo" :title="userData.username">{{userData.username}}</label></DropdownItem>
              <DropdownItem ><label style="width:51px;display:inline-block">真实姓名:</label><label class="userItemInfo" :title="userData.fullname">{{userData.fullname}}</label></DropdownItem>
              <DropdownItem ><label style="width:51px;display:inline-block">角色名称:</label><label class="userItemInfo" :title="userData.dutyName">{{userData.dutyName}}</label></DropdownItem>
              <DropdownItem ><label style="width:51px;display:inline-block">部门名称:</label><label class="userItemInfo" :title="userData.departName">{{userData.departName}}</label></DropdownItem>
            </DropdownMenu>
        </Dropdown>
      </li>
      <li>
        <a href="javascript:void(0)" @click="logout">
          <Icon type="md-log-out" size="20" title="退出"></Icon>
        </a>
      </li>
    </div>

    <div class="modelinfo">
      <div class="headTitle">个体分析</div>

      <div class="mainTitle">单人关系</div>
      <p>1.展现单个号码的一度关系人，以及一度直接联系人相互间的关系信息。并发现组织中不同人的重要程度，并以可视化的方式呈现社交网络。</p>

      <div class="headTitle">群体分析</div>

      <div class="mainTitle">社团扩展</div>
      <p>1.对已知某社团中部分成员进行研判，深度挖掘发现这些号码在指定的分析时段内共同所在的同一社团中的其他成员。</p>
      <div class="mainTitle">群组分析</div>
      <p>2. 对大量目标中潜藏的不同群体组织进行挖掘发现，区分人群中不同属性的群体。对给定号码在指定的分析时段中存在的组织进行挖掘，发现各组织   内其他成员和组织中的重要节点。</p>

      <div class="mainTitle">关联发现</div>
      <p>3.给定两个不直接相关的号码发现其可能的关联路径，推荐共同好友数最多的最短路径，并发现整体的社交网络结构.</p>

      <div class="mainTitle">关系呈现</div>
      <p>4. 简单呈现输入号码群体间的直接联系和一度联系好友。其模型不具有关系挖掘功能。  旨在观察号码间的基础社交网络结构（查看哪些节点影响力  广，查看号码间的联系情况等）。</p>
    </div>

<!--    <div id="userInfo">
      <div>用户名：{{userData.username}}</div>
      <div>真实姓名：{{userData.fullname}}</div>
      <div>角色名称：{{userData.dutyName}}</div>
      <div>部门名称：{{userData.departName}}</div>
    </div>-->

  </div>
</template>

<script>
  import {URL} from "../../../api/urlsConfig"
  import AddModal from "@/components/modals/AddNode"
  import Snapshot from "@/components/snapshot/Snapshot"
  import CreateStatisticsModel from "@/components/modals/CreateStatisticsModel"
  import * as Handle from "../../pages/graph/js/handle"
  import store from  "../../vuex/store"
    export default {
        name: "HeaderBar",
        data() {
            return {
              singlePro: [], //个体分析菜单
              manyPro: [], //群体分析菜单
              manyPros:[],
              numlist:'',
              goalCode:'',
              theme:"",
              nodequota: 0,
              labelquota: 5,
              minquota:0,
              connectquota:0,
              statisticsInfo:'',
              baseInfoList:'',
              settingList:[
                {
                  "name":"用户管理"
                },
                {
                  "name":"案件管理"
                },
                {
                  "name":"权限管理"
                },
                {
                  "name":"数据治理"
                }
              ],
              userManage:"",
              caseManage:"",
              permissionManage:"",
              userData:{
                departName:"",
                dutyName:"",
                fullname:"",
                username:""
              }
            }
        },
        components: {
          AddModal,
          Snapshot,
          CreateStatisticsModel
        },
        created() {
          //含服务号码类型列表,分析模型列表，群组分析列表
          let typelist = this.$store.state.queryBaseDictionData;
          this.singlePro = typelist.singlePro;
          this.manyPros = typelist.manyPro;
          //下拉列表数据
          this.numlist = typelist.nodePro;
        },
        mounted() {
          this.getStatistics();
          this.queryUser();
          this.queryManageData();
          /**从本地存储取上次所保存的皮肤类型标志*/
          let theme = localStorage.getItem("theme");
          if(!!theme){
            this.$store.commit("themeType",theme);
            this.theme=theme;
            document.getElementsByTagName('body')[0].className = 'theme'+theme;
          }else {
            this.$store.commit("themeType","a");
            /**本地没有存储皮肤标志时，加载默认样式*/
            document.getElementsByTagName('body')[0].className = 'themea';
            this.theme="a";
          }
          this.userInfoEnter();
        },
        computed:{
          addable:function(){
            return this.$store.state.jurisdiction.addable;
          },
          manage:function(){
            return this.$store.state.jurisdiction.manage;
          },
          isCloseCase:function(){
            return this.$store.state.closeCase;
          }
        },
        methods: {
          //setSingleLvl
          getSingleLvl(){
            this.$emit("setSingleLvl")
          },
          //获取模型使用情况
          getStatistics(){
            let _this=this
            this.$http.request({
              method: 'get',
              url: URL.statisticsAlanysisModel,
              params: {},
              success: (data) => {
                if (data.code === 200){
                  _this.statisticsInfo=data.data
                  let typelist = this.$store.state.queryBaseDictionData;
                  let manyProList=typelist.manyPro;
                  let singleProList=typelist.singlePro;
                  let lengthMany=manyProList.length;
                  let lengthSing=lengthMany.length;
                  for (let i=0;i<manyProList.length;i++){
                    for (let j=0;j<singleProList.length;j++){
                      if(manyProList.length>0){
                        if(manyProList[i].dicCode===singleProList[j].dicCode){
                          manyProList.splice(i,1);
                          lengthMany --;
                        }
                      }
                    }
                  }
                  let newlist=[];
                  for (let i=0;i<manyProList.length;i++){
                    newlist.push(manyProList[i])
                  }
                  for (let n=0;n<singleProList.length;n++){
                    newlist.push(singleProList[n])
                  }
                  _this.baseInfoList=newlist;
                   _this.statisticsInfo.forEach(function (e) {
                  var data = _.find(_this.baseInfoList,function (vx) {
                     if(e.type==vx.dicCode){
                       return vx
                     }
                   })
                     if(!_.isEmpty(data)){
                       e['dicName']=data.dicName
                     }
                 })
                  let newData=_.filter(_this.statisticsInfo,function (item) {
                    if(item.dicName!=undefined){
                      return item
                    }
                  })
                  this.renderSparkLine(newData)
                }
              }
            });
          },
          setTheme : function (value) {
            this.theme=value;
            document.getElementsByTagName('body')[0].className = 'theme'+value;
            /**添加当前选择到本地存储*/
            localStorage.setItem("theme",value);
            this.$store.commit("themeType",value);
            let currentGraphModel = this.$store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            if(currentGraphModel.cy) {
              if ('b' == value) {
                var nodehightlight = currentGraphModel.cy.$(".a-nodehightlight");
                var edgehightlight = currentGraphModel.cy.$(".a-edgehightlight");
                nodehightlight.removeClass("a-nodehightlight");
                edgehightlight.removeClass("a-edgehightlight");
                nodehightlight.addClass("b-nodehightlight");
                edgehightlight.addClass("b-edgehightlight");
                //标签字体颜色根据皮肤适配
                cy.style()
                  .selector("node")
                  .style('color','#161616')
                  .selector("edge[?shortestFlag]")
                  .css(
                    {
                      'width': 5,
                      'opacity': 1,
                      'line-color': value === 'a' ? '#b8c7b8' : '#101010'
                    }
                  )
                  .selector(':selected')
                  .css(
                    {
                      "border-color": '#000000',
                    }
                  )
                  .update()
                // cy.style()
                //   .selector("edge")
                //   .style('color','#7f171a')
                //   .update()
              } else {
                var nodehightlight = currentGraphModel.cy.$(".b-nodehightlight");
                var edgehightlight = currentGraphModel.cy.$(".b-edgehightlight");
                nodehightlight.removeClass("b-nodehightlight");
                edgehightlight.removeClass("b-edgehightlight");
                nodehightlight.addClass("a-nodehightlight");
                edgehightlight.addClass("a-edgehightlight");
                //标签字体颜色根据皮肤适配
                cy.style()
                  .selector("node")
                  .style('color','#f8f8f8')
                  .selector("edge[?shortestFlag]")
                  .css(
                    {
                      'width': 5,
                      'opacity': 1,
                      'line-color': value === 'a' ? '#b8c7b8' : '#101010'
                    }
                  )
                  .selector(':selected')
                  .css(
                    {
                      "border-color": '#FFFFFF',
                    }
                  )
                  .update();
                // cy.style()
                // //   .selector("edge")
                // //   .style('color','#ffffff')
                // //   .update()
              }
            }
          },
          //确认搜索内容
          confirmSearch(data){
            //获取图上所有点的labels
            let _this=this
            let currentGraphModel = store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            cy.nodes().unselect();
            this.goalCode=data
            if(this.goalCode!=''){
              cy.nodes().forEach(function (ele,i,eles) {
                let typelist=ele._private.data.type;
                if (typelist==_this.goalCode){
                  ele.select();
                  cy.center(ele)
                }
              })
            }
          },
          showAdvancedSearch() {
            this.$store.commit("ShowAdvancedSearchModal", true);
          },
          //个体分析
          createStatisticsSingleModel(model) {
            let currentGraphModel = this.$store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            if(_.isEmpty(cy)){
              this.$Message.warning("先选择任务");
              return false
            }
            let selectNodes =cy.nodes(":selected");
            if(selectNodes.length > 0){
              let titleName = "新建" + model.dicName + "模型";
              this.$refs.createStatistics.showModal(model, titleName, selectNodes, 'new');
            }else {
              this.$Message.warning("请选择对象");
            }
          },

          //群体分析
          createStatisticsManyModel(model, code) {
            //根据获取的code改变核心,联络指标的显示
            // if(code === '202'){
            //   this.$store.commit("showMoreSlider", true);
            // }else {
            //   this.$store.commit("showMoreSlider", false);
            // }
            let currentGraphModel = this.$store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            if(_.isEmpty(cy)){
              this.$Message.warning("先选择任务");
              return false
            }
            let selectNodes =cy.nodes(":selected");
            if(selectNodes.length > 1 ){
              let titleName = "新建" + model.dicName + "模型";
              this.$refs.createStatistics.showModal(model, titleName, selectNodes, 'new');
            }else {
              this.$Message.warning("至少选中两个对象");
            }
          },

          //刷新分析模型列表
          refreshAnalyticalModelList() {
            this.$emit("refreshAnalyticalModelList");
          },

          addNode() {
            this.$store.commit("showAddNodeModal",true)
          },
          // addTask() {
          //   this.$store.commit("showAddTaskModal", true)
          // },

          showSnapshotContent(event) {
            this.$refs.snapshot.showSnapshotContent(event.target.offsetLeft);
          },

          hiddenSnapshot() {
            this.$refs.snapshot.hiddenSnapshot();
          },

          refreshSnapshotList() {
            // this.$refs.snapshot.initSnapShot();
            // console.log(111)
          },
          //统计菜单选中点
          statisticsSelectNode(selectItem) {
            this.$emit("statisticsSelectNode", selectItem);
          },

          renderSparkLine(data){
            let axData= _.map(data,"value")
            let ybData=_.map(data,'dicName')
            let myChart = this.$echarts.init(document.querySelector('#sparklineBar'));
            myChart.setOption({
              text:{
              },
              tooltip:{
                trigger: 'axis',
                position:[-65,10],
                formatter:'{b}<br/>次数：{c}'
              },
              grid: {

              },
              xAxis: {
                axisLabel: {
                  show: false,
                  textStyle: {
                    color: '#767F8C'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#767F8C'
                  }
                },
                data: ybData
              },
              yAxis: {
                  splitLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    show: false,
                    textStyle: {
                      color: '#767F8C'
                    }
                  },
                  axisLine: {
                    show: false,
                    lineStyle: {
                      color: '#767F8C'
                    }
                  },
                  boundaryGap: [0.5, 0.5]
                },
              series:[{
                name:"占比",
                type:"bar",
                barWidth:5,
                color:'#fff',
                barCategoryGap:1,
                data:axData
              }]
            });
            window.addEventListener("resize", function () {
              myChart.resize();
            });
          },
          //查看操作文档
          checkOperateDocument(){
            window.open("","_blank");
          },
          //请求用户信息
          queryUser(){
            let _this = this;
            this.$http.request({
              method: 'get',
              url: URL.queryUser,
              params: {},
              success: (data) => {
                if (data.code === 200){
                  this.userData = data.data;
                }
              }
            });
          },
          //使用说明动画
          userInfoEnter(){
            $('#modelIntroduction').mouseenter(function () {
              $('.modelinfo').animate({},function () {
                $('.modelinfo').css({
                  'transform':'scale(1)'
                })
              })
            });
            $('#modelIntroduction').mouseleave(function () {
              $('.modelinfo').animate({},function () {
                $('.modelinfo').css({
                  'transform':'scale(0)'
                })
              })
            })

          },
          //设置路径
          queryManageData(){
            let _this = this;
            this.$http.request({
              method: 'get',
              url: URL.queryManage,
              params: {},
              success: (data) => {
                if (data.code === 200){
                  this.userManage = data.data.userManage;
                  this.caseManage = data.data.caseManage;
                  this.permissionManage = data.data.permissionManage;
                  this.dataManage = data.data.baseManage;
                }
              }
            });
          },
          //用户管理，案件管理，权限管理
          systemSettingManage(type){
            switch (type){
              case 'user':
                window.open(this.userManage, "_blank");
                break;
              case 'case':

                window.open(this.caseManage, "_blank");
                break;
              case 'rbac':
                var rfsUrl = this.permissionManage;
                var rfsWindow = window.open(rfsUrl);
                var ends = 0;
                // 每隔一秒钟定时发送一次，超过五秒关闭
                var timer = setInterval(function(){
                  if(ends == 5000){
                    clearInterval(timer);
                  }else {
                    ends += 1000;
                    rfsWindow.postMessage("rfs", rfsUrl);
                  }
                },1000);
                break;
              case 'dataManage':
                window.open(this.dataManage);
            }
          },
          //退出系统
          logout(){
            this.$store.commit("setLogoutState", true);
          },
          //关于产品
          aboutProduct(){
            this.$store.commit("showProductModal", true);
          },



        },
    }
</script>

<style lang="less">

  .cls-icn{

    i{font-weight: 700;
      font-size: 18px;
    }
  }
  .rightmenu{
    width: 500px;
    height: 56px;
    float: right;

    li{
      height: 56px;
      float: left;
      list-style: none;
      line-height: 56px;
      margin:0px 10px;
    }

  }
  .linefix{
    display: block;
    height: 20px;
    width: 2px;
    background:#3d4382;
    margin:0px 10px;
  }
  #header{
    width: 100%;
    height:56px;
    background-color: #141a1f;
    .logo{
      img{
        float:left;
        height: 56px;
        margin-left: 10px;
      }
    }
    .title{
      float: left;
      line-height: 55px;
      color: #ddd;
      font-size: 18px;
      font-weight: 600;
      font-style: normal;
      font-family: "微软雅黑";
      box-sizing: border-box;
    }
    .headerRouter{
      margin: 0 163px;
      float: left;
      display: flex;
      align-items: center;
      .dropDown-li{
        list-style: none;
        font-size: 24px;
        display: block;
        height: 56px;
        width:80px;
        padding:0px 5px 0px 10px;
        div{
          text-align: center;
        }
        .menuText{
          font-size: 8px;
        }
      }
    }
  }
  .dataBaseIcon{
    float: right;
    height: 70px;
    font-size: 26px;
    color: #ddd;
    line-height: 70px;
    margin-right: 20px;
  }
  #header{
    .ivu-select-dropdown{
      top:50px!important;
      background-color:#6269a9;
      border-radius:0px!important;
      color:white;
    }
    .ivu-dropdown-item{
      color:white;
      /*height:auto!important;*/
      /*width:auto!important;*/
      /*padding:10px 5px;*/
      text-align: center;
      &:hover{
        background-color:transparent!important;
        color:#2d8cf0!important;
      }
    }
  }
  #cls-menu{
    color:#ddd;
    height:auto!important;
    width:auto!important;
    padding:0px 16px!important;
    text-indent:0px!important;
    display: flex;
    >span{
      display: block;
      width:70px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: white;
      margin-right: 10px;
    }
    >.ivu-slider{
      width: 100%;
    }
  }

  .settingList{
    .ivu-dropdown-menu>.ivu-dropdown-item{
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 80%;
      padding: 0;
    }
  }
  .user-info-li{
    .ivu-dropdown-menu>.ivu-dropdown-item{
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 80%;
      padding: 0;
    }
  }
  #header .ivu-dropdown-item:hover {
    color:#fff !important;
  }
  .userItemInfo{
    display:inline-block;
    width:50px;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    vertical-align:middle;
  }
  .sparklineBar canvas{
    vertical-align: middle!important;
  }

  .modelinfo{
    width: 500px;
    position: absolute;
    top:70px;
    right: 180px;
    z-index: 999;
    background: #6269A9;
    border-radius: 3px;
    transform: scale(0);
    padding:10px;
    transition: all .5s;
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
/*  #userInfo{
    position: absolute;
    top: 56px;
    right:5px;
    z-index: 999;
    width: 150px;
    height: 120px;
    padding: 10px;
    text-align: center;
    display:none;
  }
  #userInfo>div{
    height: 25px;
    line-height: 25px;
  }*/

</style>

