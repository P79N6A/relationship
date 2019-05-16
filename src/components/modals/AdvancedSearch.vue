  <template>
    <div id="AdvancedSearch">
      <Modal v-model="getSearchModalState" title="高级搜索" width="650">
        <div class="SearchTypeList">
          <li>
            <Select  style="width:200px" v-model="typecode" @on-change="getOptionstype">
              <Option :value="item.dicCode" v-for="(item,key) in typelist" :key="key" >{{item.dicName}}</Option>
            </Select>
          </li>
          <li v-if="isShowModal">
            <Select  style="width:200px" v-model="Secondcode" @on-change="getSecondcode" v-if="ismenun">
            <Option :value="item.name" v-for="(item,key) in numtypelist" :key="key" @click.native="getOptionsCode(item.label)" v-if="ismenun">{{item.name}}</Option>
          </Select>
            <Select  style="width:200px" v-model="Secondcode" @on-change="getSecondcode" v-if="islas">
              <Option :value="item.dicName" v-for="(item,key) in numtypelist" :key="key" @click.native="getOptionsCode(item.dicCode)">{{item.dicName}}</Option>
            </Select>
          </li>
          <li><input type="text" v-model="formCode"  @keyup.enter.native="confirmSelect"/></li>
        </div>
        <div slot="close" @click="closeModal"><Icon type="ios-close"></Icon></div>
        <div slot="footer">
          <Button type="text" @click="cancelModel">取消</Button>
          <Button type="default" @click="confirmSelect">确定</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import store from  "../../vuex/store"
    export default {
        name: "advancedsearch",
        data() {
            return {
              codes:'',
              formCode:'',
              spotcodes:'',
              typecode:'点属性',
              Secondcode:'',
              numtypelist:'',
              alllabels:'',
              numlist:'',
              freeLabels:'',
              isShowModal:true,
              ismenun:true,
              islas:false,
              freeMark:'',
              newnodelabels:[],
              typelist:[
                {
                  dicName:'点属性',
                  dicCode:'点属性',
                },
                {
                  dicName:'标签',
                  dicCode:'标签',
                },
                {
                  dicName:'标记',
                  dicCode:'标记',
                },
              ],
            }
        },
        components: {},

      //搜索框弹窗显示
      computed:{
          getSearchModalState:{
            get:function () {
              if(this.$store.state.isAdvancedSearchModal==true){
                this.freeMark=this.$store.state.currentResultDefinedLabel;
              }
              return this.$store.state.isAdvancedSearchModal;
            },
            set:function () {
              this.$store.commit("ShowAdvancedSearchModal");
            }
          }
        },
        created() {

          //含服务号码类型列表
          let typelist = this.$store.state.queryBaseDictionData;
          //下拉列表数据
          this.numlist = typelist.nodePro;
          //获取所有自定义标记
          this.freeLabels=this.$store.state.currentResultDefinedLabel;
          //获取所有标签
          let baselabels=this.$store.state.queryBaseDictionData;
          this.alllabels =_.flatten([baselabels.flagLabel, baselabels.properLabel]);
        },
        mounted() {
          this.numtypelist= this.numlist;
          this.Secondcode=this.numtypelist[0].name;
          this.spotcodes = this.numtypelist[0].dicCode;
          //获取标记信息

        },
        methods: {
          selectedGraphNode: function (cy, selectedNode) {
            cy.$(cy.nodes()).unselect();
            if (selectedNode.length === 1) {
              cy.zoom(1);
            }
            cy.center(selectedNode);
            cy.$(selectedNode).select();
          },
          //确认搜索并在图上选中
          confirmSelect(){
            //获取图上所有点的labels
            let _this=this;
            let currentGraphModel = store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            cy.nodes().unselect();
            //使用点属性进行搜索
            if(this.typecode=='点属性'){
              this.ismenun=true;
                this.islas=false;
              if(_this.formCode==''){
                let selectedNode = cy.nodes().filter(function (node) {
                  if (_this.spotcodes === node.data('type')) {
                    return node
                  }
                });
                this.selectedGraphNode(cy, selectedNode)
                // cy.nodes().forEach(function (ele,i,eles) {
                //   let typelist=ele._private.data.type;
                //     if (typelist==_this.spotcodes){
                //       ele.select();
                //       cy.center(ele);
                //     }
                // })
              }
              if(_this.formCode!=''){
                // cy.nodes().forEach(function (ele,i,eles) {
                //   let typelist=ele._private.data.type;
                //   let namelist=ele._private.data.name;
                //   if (typelist==_this.spotcodes && _.includes(namelist,_this.formCode)){
                //     ele.select();
                //     cy.center(ele);
                //   }
                // })
                let selectedNode = cy.nodes().filter(function (node) {
                  if (_this.spotcodes === node.data('type') &&  _.includes(node.data('name'), _this.formCode)) {
                    return node
                  }
                });
                this.selectedGraphNode(cy, selectedNode)

              }
            }
            //使用标签去搜索
            if(this.typecode=='标签'){
              this.ismenun=false;
              this.islas=true;
            if(_this.formCode==''){
              cy.nodes().forEach(function (ele,i,eles) {
                let labelCodes=ele._private.data.labels
                if(labelCodes==undefined ||null){
                  _this.formCode='';
                  _this.$store.commit("ShowAdvancedSearchModal", false);
                }else {
                  let nodelist=Object.keys(labelCodes)
                  for (let i=0;i<nodelist.length;i++){
                    if(_.includes(nodelist[i],_this.codes)==true){
                      // console.log( ele)
                      ele.select();
                      cy.center(ele);
                    }
                  }
                }

              });
            }
            if(_this.formCode!=''){
              cy.nodes().forEach(function (ele,i,eles) {
                let labellist=ele._private.data.labels;
                if(labellist==''){
                  _this.formCode='';
                  _this.$store.commit("ShowAdvancedSearchModal", false);
                }else {
                  _.each(labellist,function (value,key) {
                    if(key==_this.codes &&_.includes(value,_this.formCode)){
                      ele.select();
                      cy.center(ele);
                    }
                  })
                }
              });
            }
            }
            //使用标记去搜索
            if(this.typecode=='标记'){
              if(_this.formCode==''){
                  _this.freeMark.forEach(function (el,k,els) {
                    _.filter(cy.nodes(),function (node) {
                      if(node.data().name==el.nodeId && el.labels!=''){
                        node.select();
                        cy.center(node);
                      }
                    })
                  })
              }
              if(_this.formCode!=''){
                _this.newnodelabels=[];
                _.filter(_this.freeMark,function (node) {
                   _.filter(node.labels,function (item) {
                     if(_.includes(item.labelName,_this.formCode)){
                       _this.newnodelabels.push(node);
                     }
                   })
                })
                _.filter(cy.nodes(),function (ele) {
                  _this.newnodelabels.forEach(function (vo,vk,vs) {
                    if(ele.data().name==vo.nodeId && vo.labels!=''){
                      ele.select();
                      cy.center(ele);

                    }
                  })
                })
              }

           }
              this.formCode='';
              this.defaultChose()
              this.$store.commit("ShowAdvancedSearchModal", false);
          },
          //左上角关闭按钮
          closeModal(){
              this.formCode='';
            this.defaultChose()
          },
          //取消按钮
          cancelModel(){
              this.formCode='';
              this.defaultChose()
              this.$store.commit("ShowAdvancedSearchModal", false);
          },
          //2级下拉选中
          getSecondcode(){

          },
          //默认
          defaultChose(){
              this.typecode='点属性';
              this.ismenun=true;
              this.islas=false;
              this.isShowModal=true;
              this.numtypelist=this.numlist;
              this.Secondcode='手机号码';
          },
          //根据一级选择的类别改变2级列表数据
          getOptionstype(){
            if(this.typecode=='标记'){
              this.isShowModal=false;
              this.Secondcode='当前用户';
            }if (this.typecode=='标签'){
                this.ismenun=false,
                this.islas=true,
              this.isShowModal=true;
              this.numtypelist=this.alllabels;
              this.Secondcode='人口流动状态'
            }if(this.typecode=='点属性'){
              this.ismenun=true,
                this.islas=false,
              this.isShowModal=true;
              this.numtypelist=this.numlist;

              // console.log(this.numlist)
              this.Secondcode='手机号码';
            }
          },
          //获取选中的标签的dicCode
          getOptionsCode(data){
            if (this.typecode=='标签') {
              this.codes=data;
              console.log(this.codes)
            }if(this.typecode=='点属性'){
              this.spotcodes=data;
              console.log(this.spotcodes)
            }
          },
        },

    }
</script>

<style scoped>
.SearchTypeList{
display: flex;
}
.SearchTypeList li{
  list-style: none;
  margin: 0px 5px;
}
.SearchTypeList li  input{
  width: 198px;
  display: block;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  transition: all .2s ease-in-out;
  text-align: center;

}
</style>
