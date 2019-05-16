<template>
  <div id="splitNode">
    <Modal v-model="getSplitNodeModalState" title="拆分节点" :styles="{top: '160px'}" width="400">
      <Form ref="formItem" :label-width="110">
        <FormItem label="节点属性：" prop="nodeName">
          <Select v-model="nodeProperty" style="width:200px">
            <Option v-for="item in nodePropertyList" :value="item.value" :key="item.value">{{item.key}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelSplit">取消</Button>
        <Button type="default" @click="okSplit">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {URL} from "../../../api/urlsConfig"
  import store from "../../vuex/store"
  export default {
    name: "split-node",
    data() {
      return {
        nodeProperty:"",
        nodeType:""
      }
    },
    created() {

    },
    computed: {
      getSplitNodeModalState: {
        get: function () {
          return this.$store.state.isNodeSplit
        },
        set: function () {
          this.$store.commit("showNodeSplitModal");
        }
      },
      nodePropertyList(){
        return this.$store.state.splitNodeSelectData;
      }
    },
    mounted() {

    },
    watch:{
      nodeProperty:function(){
        let selectData = this.$store.state.splitNodeSelectData;
        selectData.forEach(v => {
          if(v.value == this.nodeProperty){
            this.nodeType = v.type;
          }
        })
      }
    },
    methods: {
      cancelSplit() {
        this.$store.commit("showNodeSplitModal", false);
        this.nodeProperty = "";
      },
      okSplit() {
        const _this = this;
        let currentGraphModel = store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let target = cy._private.curNode;
        let sourceId = target.id();
        let newNodeId = _this.nodeProperty;
        let target_x = target.position("x");
        let target_y = target.position("y");
        /*let ur = currentGraphModel.ur;
        var doSplitNode = function (){
          cy.add([
            {
              group:"nodes",
              data:{id:_this.nodeProperty},
              position:{
                x:target_x - 100,
                y:target_y + 100
              }
            },
            {
              group:"edges",
              data:{id:`splitNode-${_this.nodeProperty}`,source:sourceId,target:_this.nodeProperty}
            }
          ]);
          cy.$(":selected").unselect();
          let newNode = cy.getElementById(_this.nodeProperty);
          newNode.select();
          newNode.emit("tap");
        }
        var unSplitNode = function (){
          let newNode = cy.$id(newNodeId);
          cy.remove(newNode);
        }
        ur.action("splitNode",doSplitNode,unSplitNode);*/
        if(cy.getElementById(this.nodeProperty).length == 0){
          cy.add([
            {
              group:"nodes",
              data:{id:_this.nodeProperty},
              position:{
                x:target_x - 100,
                y:target_y + 100
              }
            },
            {
              group:"edges",
              data:{id:`splitNode-${_this.nodeProperty}`,source:sourceId,target:_this.nodeProperty}
            }
          ]);
          cy.$(":selected").unselect();
          let newNode = cy.getElementById(_this.nodeProperty);
          newNode.select();
          newNode.emit("tap");
          //对新拆分的点调用扩线查询接口，将其有关系的点连接起来
          this.$http.request({
            method: 'post',
            params: {
              edgeLabel: "",
              nodes: _this.nodeProperty,
              nodeLabel:_this.nodeType,
              startL: "",
              endL: "",
              code: 205
            },
            url:URL.queryExpansionLine,
            success: (data) => {
              if(data.code === 200) {
                let nodesl = data.data.graphVo.nodes.length;
                let edgesl = data.data.graphVo.edges.length;
                if(nodesl == 0 && edgesl == 0) {
                  // this.$Message.info('没有可扩线的节点！');
                  console.log("没有可扩线的节点")
                } else {
                  let expansionData = data.data.graphVo;
                  _.each(expansionData.edges, function (edge) {
                    edge.group = "edges";
                    edge.data.flag = 9;
                  });
                  console.log(expansionData.edges)
                  cy.add(expansionData.edges);
                  cy.edges('[flag='+9+']').select();
                  _.each(cy.edges('[flag='+9+']'), function(edge){
                    edge.data().flag = 0;
                  });
                  this.store.state.currentGraphModel.data.nodes = cy.json().elements.nodes;
                  this.store.state.currentGraphModel.data.edges = cy.json().elements.edges;
                  this.store.commit("showStatisticsAndAnalyzeCon", true);
                }
              }
            },
            error: (data) => {
              // this.$Message.warning('扩线失败！');
            }
          });

          this.$store.commit("showNodeSplitModal", false);
          this.nodeProperty = "";
        } else {
          this.$store.commit("showNodeSplitModal", false);
          this.nodeProperty = "";
        }
      }
    }
  }
</script>

<style scoped>

</style>
