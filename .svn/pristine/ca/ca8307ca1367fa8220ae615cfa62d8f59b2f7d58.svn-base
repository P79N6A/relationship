<template>
  <div id="graphical-statistics">
    <div v-show="isShowOverallInfo" id="overall-info">
      <div class="statistics-info">
        <Row>
          <Col span="8">
          <div id="statistics-max-contact" class="statistics-liquidFillInfo"></div>
          </Col>
          <Col span="8">
          <div id="statistics-min-contact" class="statistics-liquidFillInfo"></div>
          </Col>
          <Col span="8">
          <div id="statistics-all-groups" class="statistics-liquidFillInfo"></div>
          </Col>
        </Row>
      </div>
    </div>
    <div v-show="isShowGroupInfo" id="group-info">
      <div class="statistics-info">
        <Row>
          <Col span="8">
          <div id="statistics-average-contact-time" class="statistics-liquidFillInfo"></div>
          </Col>
          <Col span="8">
          <div id="statistics-intimacy" class="statistics-liquidFillInfo"></div>
          </Col>
          <Col span="8">
          <div id="statistics-stability" class="statistics-liquidFillInfo"></div>
          </Col>
        </Row>
      </div>
    </div>
    <div v-show="isShowSingleInfo" id="single-info">
      <div class="statistics-info">
        <ul style="list-style: none">
          <li class="single-info-container">
             <label class="pre-title">{{currentNode.type}}：</label>
            <Tooltip :content="currentNode.name">
              <span class="next-content">{{currentNode.name}}</span>
            </Tooltip>
          </li>
          <li v-for="(item,index) in labelInfo" class="single-info-container">
            <label class="pre-title">{{item.dicName}}：</label>
            <Tooltip :content="item.dicVal">
              <span class="next-content">{{item.dicVal}}</span>
            </Tooltip>
          </li>
          <li class="single-info-container" v-if="signLabel.length!=0">
            <label class="pre-title">标记信息：</label>
            <Tooltip :content="signLabel.join(',')">
              <span  class="next-content">{{signLabel.join(",")}}</span>
            </Tooltip>
          </li>
          <!--<li class="single-info-container">
            <label>个体名称：</label><span>{{currentNode.name}}</span>
          </li>-->
          <!--<li class="single-info-container">
            <label>度中心度：</label><span>{{currentNode.degree}}</span>
          </li>
          <li class="single-info-container">
            <label>中介中心度：</label><span>{{currentNode.betweenness}}</span>
          </li>
          <li class="single-info-container">
            <label>接近中心度：</label><span>{{currentNode.closeness}}</span>
          </li>
          <li class="single-info-container">
            <label>偏心距：</label><span>{{currentNode.eccentricDistance}}</span>
          </li>
          <li class="single-info-container">
            <label>pageRank：</label><span>{{currentNode.pageRank}}</span>
          </li>-->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import 'echarts-liquidfill'

  export default {
    name: "graphical-statistics",
    data() {
      return {
        isShowOverallInfo: true,
        isShowGroupInfo: false,
        isShowSingleInfo: false,
        currentNode: {
          name: '',
          type: '',
          degree: '',
          betweenness: '',
          closeness: '',
          eccentricDistance: '',
          pageRank: ''
        },
        labelInfo:[],
        signLabel:[],
      }
    },
    props: ["selectNode"],
    create() {

    },
    mounted(){
      this.initOverallInfo();
    },
    methods: {
      initOverallInfo() {
        this.isShowOverallInfo = true;
        this.isShowGroupInfo = false;
        this.isShowSingleInfo = false;
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let edges = currentGraphModel.data.edges;
        //对象联系个数
        let edgeCount = _.map(cy.nodes(), function(node){
          return node.connectedEdges().length
        });
        let maxContact = _.isEmpty(edges) ? 0 : _.max(edgeCount);
        let minContact = _.isEmpty(edges) ? 0 : _.min(edgeCount);
        let groupsCount = _.isEmpty(currentGraphModel.data.groups) ? 0 : currentGraphModel.data.groups.length;
        this.$nextTick(function () {
          this.initLiquidFillInfo('statistics-max-contact', -1, maxContact + '/次', '最多关联边数', '#9e4be1');
          this.initLiquidFillInfo('statistics-min-contact', -1, minContact + '/次', '最少关联边数', '#1aa167');
          this.initLiquidFillInfo('statistics-all-groups', -1, groupsCount + '/个', '团体总数', '#bf942b');
        })
      },

      initGroupInfo(groupData) {
        let _this = this;
        this.isShowOverallInfo = false;
        this.isShowGroupInfo = true;
        this.isShowSingleInfo = false;
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;

        //平均关联次数: 通联总次数/总人数
        let averageContactTime = Math.floor(groupData.group.totalTimes/ groupData.group.num) +　'/次';

        //亲密度: 团体内部边数/(团体的点数*(团体的点数-1)/2)
        let intimacy = Math.floor(groupData.group.groupInsideEdge / (groupData.group.num * (groupData.group.num-1)/2)*1000)/ 10;

        //稳固度: 团体内部人数/团体的外部人数
        let stability = Math.floor((groupData.group.num /(groupData.group.groupOutsideNode + groupData.group.num)) * 1000)/10;

        this.$nextTick(function () {
          _this.initLiquidFillInfo('statistics-average-contact-time', -1, averageContactTime, '平均关联次数', '#9e4be1');
          _this.initLiquidFillInfo('statistics-intimacy', intimacy/100, intimacy +'%'　, '亲密度', '#1aa167');
          _this.initLiquidFillInfo('statistics-stability', stability/100, stability +'%', '稳固度', '#bf942b');
        })
      },

      initSingleInfo(selectNode) {
        let _this = this;
        this.isShowOverallInfo = false;
        this.isShowGroupInfo = false;
        this.isShowSingleInfo = true;
        this.currentNode.name = selectNode.name;
        let nodeProBase = this.$store.state.queryBaseDictionData.nodePro;
        let nodePro = _.find(nodeProBase, {'label': selectNode.type});
        this.currentNode.type = _.isEmpty(nodePro) ? '' : nodePro.indexName;
       /* this.currentNode.degree = _.isEmpty(selectNode.degreeIndicators) ? '未知' : selectNode.degreeIndicators.degree;
        this.currentNode.betweenness = _.isEmpty(selectNode.degreeIndicators) ? '未知' : selectNode.degreeIndicators.betweenness;
        this.currentNode.closeness = _.isEmpty(selectNode.degreeIndicators) ? '未知' : selectNode.degreeIndicators.closeness;
        this.currentNode.eccentricDistance = _.isEmpty(selectNode.degreeIndicators) ? '未知' : selectNode.degreeIndicators.eccentricDistance;
        this.currentNode.pageRank = _.isEmpty(selectNode.degreeIndicators) ? '未知' : selectNode.degreeIndicators.pageRank;*/
        this.labelInfo =[];
        let  baseDictionData = this.$store.state.dictionDataAll;
        if(selectNode.labels!=undefined){
          Object.keys(selectNode.labels).forEach((item,index)=>{
            var t = _.find(baseDictionData,['dicCode',item]);
            if(!_.isEmpty(t)&&t.dicCode!="00000"){
              this.labelInfo.push({
                'dicName':t.dicName,
                'dicVal':selectNode.labels[t.dicCode]
              })
            }
          })
        }
        let labelsData = this.$store.state.currentResultDefinedLabel;
        let  labelData =  _.filter(labelsData, ['nodeId', selectNode.name]);
        let labelLst = [];
        this.signLabel =[];
        if(!_.isEmpty(labelData)){
          labelLst = labelData[0].labels
        }
        if( !_.isEmpty(labelLst)){
          labelLst.forEach((item,index)=>{
            this.signLabel.push(item.labelName)
          })
        }
      },

      initLiquidFillInfo (id, data, formatter, text, backgroundColor){
        if(_.isEmpty(document.getElementById(id))){
          return false
        }
        let char =  this.$echarts.init(document.getElementById(id));
        let option = {
          title:[{
            text: text,
            textAlign: 'center',
            top: '28%',
            left: '45%',
            textStyle: {
              fontWeight: 'normal',
              color: '#FFF',
              fontSize: '11',
              textAlign: 'center'
            }
          }],
          series: [{
            type: 'liquidFill',
            data: [data],
            color: [backgroundColor],
            radius: '78%',
            shape: 'roundRect',
            backgroundStyle:{
              color: backgroundColor
            },
            outline: {
              borderDistance:0,
              itemStyle: {
                borderWidth: 0,
                borderColor: '#2ec7c9',
                shadowBlur: 0,
                shadowColor: 'rgba(255, 0, 0, 1)'
              }

            },
            label: {
              normal: {
                position: ['50%','65%'],
                fontWeight: 'normal',
                formatter: formatter,
                color: '#FFF',
                fontSize: 14,
              }
            }
          }],
        };
        window.addEventListener("resize", function () {
          char.resize();
        });
        char.setOption(option);
      },
    }

  }
</script>

<style scoped>
  #graphical-statistics .span-text {
    margin: 5px auto;
    display: inline-block;
    text-align: center;
    width: 92px;
  }

  /*#graphical-statistics .statistics-info {*/
    /*margin: 5px 0 10px 0;*/
  /*}*/

  .statistics-liquidFillInfo{
    height: 100px;
    padding: 2px;
  }

  #graphical-statistics .single-info-container {
    width: calc(50% - 22px);
    margin: 4px 10px;
    display: inline-block;
  }
  #graphical-statistics .sign-info-container {
    margin: 4px 10px;
  }

  #graphical-statistics  #single-info{
    width: 95%;
    border: 1px #686db5 dashed;
    margin: 8px;
    border-radius: 5px;
  }
  .pre-title{
    display: inline-block;
    vertical-align: middle;
  }
  .next-content{
    display: inline-block;
    width: 70px;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
    white-space: nowrap;
  }

</style>
