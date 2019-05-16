<template>
  <div id="task">
    <ul style="height:100%">
      <li class="task-li f-cbli">
        <div class="task-container">
            <span class="task-icon f-csp">
              <Icon :class="menu.isShowDetails?'isUnfold':''" @click="unfold('isShowDetails')"
                    type="ios-arrow-forward"></Icon>
            </span>
          <span class="iconfont icon-xinxi" style="font-size:16px"></span>
          <span>任务基本信息</span>
        </div>
        <div v-show="menu.isShowDetails" class="task-info">
          <div class="detail-container">
            <label >任务名称： </label>
            <span class="task-title" :title="taskModel.taskName">{{taskModel.taskName}}</span>
          </div>
          <div class="detail-container">
            <label>案件名称： </label>
            <span>{{taskModel.caseName}}</span>
          </div>
          <div class="detail-container">
            <label>创建人： </label>
            <span>{{taskModel.createUser}}</span>
          </div>
          <div class="detail-container">
            <label>创建时间： </label>
            <span>{{taskModel.createtime}}</span>
          </div>
        </div>
      </li>
      <li class="task-li f-cbli" style="height:calc(100% - 150px)">
        <div class="task-container">
            <span class="task-icon f-csp">
              <Icon :class="menu.isShowAnalyticalModel?'isUnfold':''" @click="unfold('isShowAnalyticalModel')"
                    type="ios-arrow-forward"></Icon>
            </span>
          <span class="iconfont icon-moxing" style="font-size:16px"></span>
          <span>分析模型列表</span>
          <span>( {{modelsNum}} )</span>
          <Input class="analyticalModelSearch" v-model="modelSearchContent" @on-keyup="searchAnalyticalModel(modelSearchContent)"
                 icon="ios-search" size="small" placeholder="搜索模型..."></Input>
        </div>
        <div class="menu-main" v-show="menu.isShowAnalyticalModel">
          <analytical-model ref="analyticalModel" @getModelsNum="getModelsNum" @useModelInfo="useModelInfo" @statisticsSelectNode="statisticsSelectNode" @analyzeNodes="analyzeNodes" @getsetSingleLvl="getsetSingleLvl"></analytical-model>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {URL} from "../../../api/urlsConfig"
  import AnalyticalModel from "./task/AnalyticalModel"
  import * as DateUtil from "../../utils/date"
  export default {
    name: "task",
    data() {
      return {
        menu: {
          isShowDetails: true,
          isShowAnalyticalModel: true
        },
        taskModel: {},
        modelSearchContent: '',
        modelsNum: ''

      }
    },
    // props: {
    //   taskData: Object
    // },

    components: {
      AnalyticalModel
    },

    created() {
    },
    mounted() {
      this.initTaskInfo();

    },
    methods: {
      getsetSingleLvl(){
        this.$emit("setSingleLvls")
      },
      useModelInfo(){
        this.$emit("ModelInfo");
      },
      //时间转换
      changeTime(time){
        let date=new Date(time);
        let Y= date.getFullYear()+'-';
        let M= (date.getMonth()+1<10 ?'0'+(date.getMonth()+1):date.getMonth()+1)+'-';
        let D= date.getDate()+' ';
        let H= date.getHours()+':';
        let m= date.getMinutes()+':';
        let s= date.getSeconds();
        return Y+M+D+H+m+s;
      },
      initTaskInfo() {
       let currentGraphModel = this.$store.state.currentGraphModel;
       this.taskModel = currentGraphModel.taskModel;
        this.taskModel.createtime= this.changeTime(this.taskModel.createtime)
      },

      unfold(type) {
        this.menu[type] = !this.menu[type];
      },

      //刷新分析模型列表
      refreshAnalyticalModelList() {
        this.$refs.analyticalModel.refreshAnalyticalModelList();
      },

      //搜索过滤分析模型
      searchAnalyticalModel(content) {
        this.$refs.analyticalModel.searchAnalyticalModel(content)
      },

      //获取模型个数
      getModelsNum(modelsNum) {
        this.modelsNum = modelsNum
      },

      //统计菜单选中点
      statisticsSelectNode(selectItem) {
        this.$emit("statisticsSelectNode", selectItem);
      },
      //分析菜单
      analyzeNodes(){
        this.$emit("analyzeNodes")
      }
    },

  }
</script>

<style scoped>
  .task-title{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 160px;
  }
  #task {
    margin-top: -10px;
    height:100%;
  }

  #task .task-info{
    width: 95%;
    border: 1px #686db5 dashed;
    margin: 8px;
    border-radius: 5px;
  }

  .task-container {
    padding-bottom: 3px;
  }

  .task-icon {
    font-size: 20px;

  }

  .task-li {
    margin: 5px 0;
    list-style: none;
  }

  .isUnfold {
    transform: rotate(90deg);
  }

  .detail-container {
    margin: 4px;
    display: flex;
  }

  #task .menu-main {
    height:calc(100% - 30px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .analyticalModelSearch {
    width: 136px;
    float: right;
    margin-right: 10px;
    margin-top: 4px;
  }
</style>
