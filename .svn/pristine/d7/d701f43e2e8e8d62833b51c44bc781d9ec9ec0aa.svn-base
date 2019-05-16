<template>
    <div id="right-con" :class="isActive ? 'active' : ''">
      <Tabs v-if="isLoadTaskCon" :value="tabName" size="small" @on-click="changeTabName">
        <TabPane label="任务" name="task">
          <task ref="task" @ModelInfo="ModelInfo" @statisticsSelectNode="statisticsSelectNode" @analyzeNodes="analyzeNodes" @setSingleLvls="setSingleLvls"></task>
        </TabPane>
        <TabPane v-if="isLoadStatisticsAndAnalyzeCon" label="统计" name="statistics">
          <statistics ref="statistics" @showSocialExponent="showSocialExponent"></statistics>
        </TabPane>
        <TabPane v-if="isLoadStatisticsAndAnalyzeCon" label="分析" name="analyze">
          <analyze ref="analyze" @handleSetlvl="handleSetlvl"></analyze>
        </TabPane>
      </Tabs>
    </div>
</template>

<script>
  import Analyze from "@/components/rightCon/Analyze"
  import Statistics from "@/components/rightCon/Statistics"
  import Task from "@/components/rightCon/Task"
  import {URL} from "../../../api/urlsConfig"
  import * as Handle from "../graph/js/handle"

    export default {
        name: "rightCon",
        data() {
            return {
              taskData: {},
            }
        },
        props:["isActive"],
        components: {
          Statistics,
          Analyze,
          Task
        },

        computed: {
          tabName: {
            get: function () {
              return this.$store.state.rightConTabName
            }
          },
          isLoadStatisticsAndAnalyzeCon: {
            get: function () {

              return this.$store.state.isLoadStatisticsAndAnalyzeCon
            },
            set: function () {
              this.$store.commit("showStatisticsAndAnalyzeCon");
            }
          },
          isLoadTaskCon: {
            get: function () {
              return this.$store.state.isLoadTaskCon
            },
            set: function () {
              this.$store.commit("showTaskCon");
            }
          }
        },

        created() {

        },
        mounted() {

        },
        methods: {
          //手动更改标签指标
          handleSetlvl(){
            this.$emit('getHandSetLabel')
          },
          //刷新模型统计
          ModelInfo(){
            this.$emit('getModelInfo')
          },
          //setSingleLvl
          setSingleLvls(){
            this.$emit("setSingleLvl")
          },
          changeTabName (name){
            this.$store.commit("setRightConTabName", name);
          },

          //刷新分析模型列表
          refreshAnalyticalModelList() {
            if(!_.isEmpty(this.$refs.task)){
              this.$refs.task.refreshAnalyticalModelList();
            }
          },

          //选择色卡群组刷新群组统计
          refreshGroupStatistics(groupData) {
            if(!_.isEmpty(this.$refs.statistics)){
              this.$refs.statistics.refreshGroupStatistics(groupData);
            }
          },

          refreshCustomTag(){
            this.$refs.analyze.customTag();
          },

          //统计菜单选中点
          statisticsSelectNode(selectItem) {
            if(!_.isEmpty(this.$refs.statistics)){
              this.$refs.statistics.statisticsSelectNode(selectItem);
            }
          },
          //统计分析选中节点
          analyzeNodes(){
            if(!_.isEmpty(this.$refs.analyze)){
              this.$refs.analyze.analyzeSelectNodes();
            }
          },
          //统计所有的边和关系
          statisticsObjectAccount(nodes, edges){
            if(!_.isEmpty(this.$refs.statistics)){
              this.$refs.statistics.initContainer(nodes, edges);
            }
          },

          //展示当前类型社交参数
          showSocialExponent(typeGroup) {
            this.$emit('showSocialExponent', typeGroup)
          }
        },

    }
</script>

<style scoped>
  .active{
    visibility:hidden;

  }
  #right-con{
    height:calc(100% - 20px);
  }
  #right-con .ivu-tabs{
    height:100%;
  }

</style>
<style>
  #right-con .ivu-tabs-bar {
    margin-bottom: 16px;
  }
  #right-con .ivu-tabs-ink-bar {
    height: 6px;
    box-sizing: border-box;
    background-color: #7098f2;
    position: absolute;
    left: 0;
    bottom: 1px;
    z-index: 1;
    transition: transform .3s ease-in-out;
    transform-origin: 0 0;
  }
  #right-con .ivu-tabs-mini .ivu-tabs-tab {
    text-align: center;
    width:33.3%;
  }
  #right-con .ivu-tabs-nav{
    width:100%;
  }
  .ivu-tabs-nav-wrap >>> .ivu-tabs-ink-bar{
    width:95px;
  }
  .ivu-tabs-nav-wrap >>> .ivu-tabs-tab-active{
    width:95px;
  }
  #right-con .ivu-tabs-content{
    height:calc(100% - 41px);
  }
</style>

