<template>
  <div id="addEdge">
    <Modal v-model="getAddEdgeModalState" title="新增关系" :mask-closable="false" :closable="false" :styles="{top: '160px'}">
      <Form ref="formItem" :label-width="110">
        <FormItem label="关系类型：">
          <Select v-model="edgeType">
            <Option v-for="(item,index) in edgePro" :value="item.label" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAddEdge">取消</Button>
        <Button type="default" @click="okAddEdge">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: "add-edge",
    data() {
      return {
        isAddEdge: false,
        edgeType: '',
        edgePro: []
      }

    },
    created() {
      this.initEdgePro();
    },
    computed:{
      getAddEdgeModalState:{
        get:function () {
          return this.$store.state.isAddEdgeModal
        },
        set:function () {
          this.$store.commit("showAddEdgeModal");
        }
      },


    },
    mounted() {

    },

    methods: {
      initEdgePro() {
        let baseDictionData = this.$store.state.queryBaseDictionData;
        this.edgePro = baseDictionData.edgePro;
        this.initEdgeType();
      },

      cancelAddEdge() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let edgeData = this.$store.state.addEdgeData;
        cy.edges("[id='" + edgeData.id + "']").remove();
        this.$store.commit("showAddEdgeModal",false);
        this.initEdgeType();
      },

      okAddEdge() {
        let edgeData = this.$store.state.addEdgeData;
        edgeData.type = this.edgeType;
        let addEdge = {data: edgeData};
        let currentGraphModel = this.$store.state.currentGraphModel;
        this.$store.commit("showStatisticsAndAnalyzeCon", false);
        setTimeout(() => {
          currentGraphModel.data.edges = _.flatten([addEdge, currentGraphModel.data.edges]);
          this.$store.commit("showStatisticsAndAnalyzeCon", true);
        }, 10);
        this.$store.commit("showAddEdgeModal",false);
        this.initEdgeType();
      },
      initEdgeType(){
        this.edgeType = this.edgePro[0].label;
      }
    },

  }
</script>

<style scoped>

</style>
