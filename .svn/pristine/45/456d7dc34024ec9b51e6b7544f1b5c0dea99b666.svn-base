<template>
  <div id="mergeNode">
    <Modal v-model="getMergeNodeModalState" title="合并节点" :styles="{top: '160px'}">
      <Form ref="formItem" :label-width="110">
        <FormItem label="请选择合并为：">
          <RadioGroup v-model="defaultId">
            <Radio v-for="(item,index) in getMergeIdList" :label="item" :key="index">{{item}}</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelMergeNode">取消</Button>
        <Button type="default" @click="okMergeNode">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
    export default {
        name: "merge-node",
        data() {
          return {
            defaultId:"",
            secondId:""
          }
        },
        created() {

        },
        computed:{
          getMergeNodeModalState:{
            get:function () {
              return this.$store.state.isMergeNode;
            },
            set:function () {
              this.$store.commit("showMergeNodeModal");
            }
          },
          getMergeIdList:function () {
            return this.$store.state.mergeNodeIdList;
          }
        },
        inject:[
          "changeRightConTabValue",
          "statisticsObjectAccount"
        ],
        mounted() {
        },
        methods: {
          cancelMergeNode() {
            this.defaultId = "";
            this.getMergeIdList = [];
            this.$store.commit("showMergeNodeModal",false);
          },
          //合并
          mergeNode(){
            var _this = this;
            let currentGraphModel = this.$store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            this.getMergeIdList.forEach(function (value){
              if(value != _this.defaultId){
                _this.secondId = value;
              }
            });
            //未选择为合并中心的点
            let anotherTarget = cy.nodes().filter(function (ele) {
              if(ele.data().name == _this.secondId){
                return ele;
              }
            });
            //选择为合并中心的点
            var firstNode = cy.nodes().filter(function (ele) {
              if(ele.data().name == _this.defaultId){
                return ele;
              }
            });
            var defaultId = firstNode.id();
            var secondId  = anotherTarget.id();
            //选择点的所有线
            this.firstNodeEdges = firstNode.connectedEdges();
            //未选择的点的所有线
            this.relationEdge = anotherTarget.connectedEdges();

            //存储合并之前的边和线的数据
            var anotherTargetData = cy.nodes(anotherTarget).json().data;
            var position = cy.nodes(anotherTarget).json().position;
            var mergeBeforeNode = {
              group:"nodes",
              data:anotherTargetData,
              position:position
            };
            var relateEdgeArr = [];
            this.relationEdge.forEach(function (value) {
              relateEdgeArr.push(cy.edges(value).json().data);
            });
            //合并节点之前的边  删掉的点  加上去的边   mergeBeforeEdges mergeBeforeNode  mergeAfterAddEdges
            this.$store.commit("mergeBeforeEdges",relateEdgeArr);
            this.$store.commit("mergeBeforeNode",mergeBeforeNode);

            this.addData  = [];
            this.relationEdge.forEach(function (value) {
              if (value._private.data.target === secondId) {
                value._private.data.target = defaultId;
              } else if(value._private.data.source === secondId) {
                value._private.data.source = defaultId;
              }
              //去掉source和target一样的边
              if (value._private.data.target !== value._private.data.source) {
                _this.addData.push({
                  group:"edges",
                  data:value._private.data
                });
              }
            });

            let removeNode = cy.getElementById(secondId);

            //去掉与选择点已有重复的边
            this.addData = _.reject(this.addData , function (addEdge) {
              return _.find(_this.firstNodeEdges, function (edge) {
                if (addEdge.data.type === edge.data('type')
                  && addEdge.data.source === edge.data('source')
                  && addEdge.data.target === edge.data('target')) {
                  return addEdge
                }
              })
            });

            //取出添加边的ID
            let addDataId = _.map(this.addData, function (edge) {
              return edge.data.id
            });
            this.$store.commit("mergeAfterAddEdges",addDataId);

            cy.remove(removeNode);
            cy.add({edges: this.addData});

            currentGraphModel.ur.do("remove",removeNode);
            this.$store.state.currentGraphModel.data.nodes = cy.json().elements.nodes;
            this.$store.state.currentGraphModel.data.edges = cy.json().elements.edges;
            this.$store.commit("setRightConTabName", "statistics");
            this.$store.commit("showStatisticsAndAnalyzeCon", true);
            this.$store.commit("showMergeNodeModal",false);
            // var nodes = this.$store.state.currentGraphModel.data.nodes;
            // var edges = this.$store.state.currentGraphModel.data.edges;
            /*setTimeout(function (){
              _this.statisticsObjectAccount(nodes,edges);
            },20);*/
          },
          //撤销
          cancelMerge(){
            let _this = this;
            let currentGraphModel = this.$store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            let mergeBeforeEdges = this.$store.state.mergeBeforeEdges;
            let mergeBeforeNode = this.$store.state.mergeBeforeNode;
            let mergeAfterAddEdges = this.$store.state.mergeAfterAddEdges;
            //删除合并之后的节点，增加合并之前的点和点有关的线
            mergeAfterAddEdges.forEach(function (value) {
              cy.getElementById(value).remove();
            });
            cy.add(mergeBeforeNode);
            mergeBeforeEdges.forEach(function (value) {
              var obj = {
                group:"edges",
                data:value
              };
              cy.add(obj);
            });

            var nodes = this.$store.state.currentGraphModel.data.nodes;
            var edges = this.$store.state.currentGraphModel.data.edges;
          /*  setTimeout(function () {
              _this.statisticsObjectAccount(nodes,edges);
            },20);*/
          },
          okMergeNode() {
            var _this = this;
            if(this.defaultId != ""){
              let currentGraphModel = this.$store.state.currentGraphModel;
              let cy = currentGraphModel.cy;
              let ur = currentGraphModel.ur;
              //合并和撤销方法
              ur.action('mergeOperation',this.mergeNode,this.cancelMerge);
              ur.do("mergeOperation");
              this.$store.commit("setSnapshotConfirm",true);//合并成功后图发生变化，设置true
            }else {
              this.$Message.warning('请至少选择一个点！');
            }
          }
        }
    }
</script>

<style scoped>

</style>
