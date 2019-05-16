 <template>
  <div id="statistics-tree">
    <ul>
      <li v-for="group in treeData" class="group-li">
        <span style="cursor: pointer;width: 12px;text-align: center;display: inline-block;">
          <Icon type="ios-arrow-forward" :class="!!group.show?'isUnfold':''"
                @click="nodeGroupUnfold(group)"></Icon>
        </span>
        <div style="display:inline-block;width: 100%;">
          <span class="f-csp" @mouseenter="addHighlight" @mouseleave="cancelHighlight" @click="graphSelect(group)">{{group.name}}</span>
          <div class="progress-content">
            <span style="margin-right: 10px; font-size: 12px">{{group.children.length}}</span>
            <div class="ivu-progress ivu-progress-normal">
              <div class="ivu-progress-outer">
                <div class="ivu-progress-inner" style="background-color: #afabaa73">
                  <div class="ivu-progress-bg" :style="{width:getPercent(group.children), height:'5px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="!!group.show">
          <ul style="margin-left: 20px">
            <li style="list-style: none;margin: 8px 4px ;padding: 0;white-space: nowrap;outline: 0;"
                v-for="node in group.children">
              <span class="f-csp" @mouseenter="addHighlight" @mouseleave="cancelHighlight" @click="graphSelect(node)">{{node.id}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "statistics-tree",
    data() {
      return {}
    },
    props: ['treeData', 'treeNum'],

    components: {},

    created() {
    },

    mounted() {
    },

    methods: {
      selectNodeUnfold(node) {
        _.each(this.treeData, function (groupTree) {
            groupTree.show = false
        });
        _.each(this.treeData, function (groupTree) {
          // if (node.type === groupTree.name) {
          if (node.type === "user") {
            groupTree.show = true
          }
        });
        this.$forceUpdate()
      },

      nodeGroupUnfold(group) {
        _.each(this.treeData, function (groupTree) {
          if (group.name === groupTree.name) {
            groupTree.show = !group.show
          }
        });
        this.$forceUpdate()
      },

      getPercent(childrenNode) {
        //todo
        return Math.floor(childrenNode.length / 5 / this.treeNum * 100) + '%'
      },

      addHighlight(e) {
        e.target.style.color = '#2d8cf0'
      },

      cancelHighlight(e) {
        e.target.style.color = ''
      },

      graphSelect(item) {
        let currentModel = this.$store.state.currentGraphModel;
        let cy = currentModel.cy;
        let node = cy.nodes("[id='" + item.id + "']");
        node.select();
        cy.center(node);
      }
    }
  }
</script>

<style scoped>
  .progress-content {
    width: 80px;
    float: right;
    margin-right: 80px
  }

  .group-li {
    list-style: none;
    margin: 8px 0;
    padding: 0;
    white-space: nowrap;
    outline: 0;
  }

  .isUnfold {
    transform: rotate(90deg);
  }
</style>
