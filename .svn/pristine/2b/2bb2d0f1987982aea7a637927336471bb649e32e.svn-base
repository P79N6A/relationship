 <template>
  <div id="bottomTaskBar">
    <transition name="open">
      <div class="behaviorOpen"  v-show="isActive" >
        <div id="behaviorHeader" >
          <div id="behaviorSel" style="height: 34px;line-height: 34px;">

            <span class="behaviorTitle">
               <span class="return" @click="showDetail" v-show="!isShowBehavior"><Icon type="ios-undo"></Icon></span>
              行为明细
            </span>

            <span v-show="isShowBehavior">
             <Select v-model="selType" style="width:200px" @on-change="changeColumns()">
                <Option v-for="item in edgeTypeList" :value="item.label" :key="item.label">{{ item.name }}</Option>
             </Select>

              <Input id="condition" v-model="searchVal" @on-keyup="changeData()" placeholder="搜索服务号码或对方号码..."></Input>
              <!--<DatePicker type="daterange" placement="bottom-end" style="width: 200px"></DatePicker>-->
          </span>

            <Button type="primary" id="exportData" size="small" @click="isExport = true">导出数据</Button>
            <Icon type="ios-keypad-outline" class="isClose" @click.native="changeshow"></Icon>
          </div>
        </div>

        <div >
          <div id="behaviorInfo">
            <Table :columns="behaviorColumns" :data="behaviorPageData"  class="transform" :class="rotate ? 'rotate180': 'rotate0'" size="small" height="125" @on-row-dblclick="showDetail" @on-row-click="selEdge"></Table>
            <Table :columns="detailColumns" :data="behaviorPageData"  class="transform" :class="rotate ? 'rotate0': 'rotate180'" size="small" height="125" @on-row-dblclick="showDetail"></Table>
          </div>
          <Page :total="totalCount" size="small" :page-size="pageSize" show-total style="float: right"
                :current="currentPage" @on-change="changePage" class="page-box"></Page>
        </div>

      </div>
    </transition>
    <transition name="close">
      <div class="behaviorClose" v-show="!isActive">
      <span class="isClose" @click="changeshow">
         <Icon type="ios-keypad-outline"></Icon>
      </span>
      </div>
    </transition>
    <Modal title="导出数据" v-model="isExport" :styles="{top: '160px',width:'630px'}">
      <Form ref='fileForm' :label-width="110" :model="file" :rules="ruleValidates">
        <FormItem label="导出文件名称："prop="fileName">
          <Input v-model="file.fileName" placeholder="请输入文件名称"  @keyup.enter.native='exportOk' style="width:487px;"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelExport">取消</Button>
        <Button type="primary" @click="exportOk">确定</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
  import {URL} from "../../../api/urlsConfig"
  import * as SelectManage from "../../pages/graph/js/selectManage"
  export default {
    name: "bottom-taskbar",
    data() {
      const fileNamedatePass=(rule,value,callback)=>{
        if(value.length>20){
          callback(new Error('文件名称长度不能超过20个字节'))
        }else {
          callback()
        }
      }
      return {
        behaviorColumns: [],
        searchVal: "",
        isActive: false,
        selType: '',
        edgeTypeList: [],
        columns: [
          /*{
            title: "序号",
            width: 60,
            align: 'center',
            render:(h,params) => {
              return h('div',[
                h('span',(params.index+1)+this.pageSize*(this.currentPage-1))
              ])
            }
          },
          {"title": "服务号码", "key": "serviceNum", "align":"center","width": 110},
          {"title": "服务号码姓名", "key": "serviceName", "align":"center","width": 115},
          {"title": "服务号码来源地", "key": "serviceOrigin", "align":"center","width": 120},
          {"title": "对方号码", "key": "oppositeNum", "align":"center","width": 115},
          {"title": "对方号码姓名", "key": "oppositeName", "align":"center","width": 115},
          {"title": "对方号码来源地", "key": "oppositeOrigin", "align":"center","width": 120},
          {"title": "通联总次数（次）", "key": "callFrequency", "align":"center"},
          {"title": "通联总时长（s）", "key": "callTime", "align":"center"},
           {"title": "上传类型", "key": "uploadType", "align":"center","width": 85},
           {"title": "上传时间", "key": "uploadTime", "align":"center","width": 100},
           {"title": "上传用户", "key": "uploadUser", "align":"center","width": 85}*/
        ],
        totalCount:0,
        currentPage:1,
        pageSize:5,
        behaviorData: [],//表格所有数据
        behaviorPageData:[],//表格每页的数据,
        detailColumns:[
          /*{
            title: "序号",
            width: 60,
            align: 'center',
            render:(h,params) => {
              return h('div',[
                h('span',(params.index+1)+this.pageSize*(this.currentPage-1))
              ])
            }
          },
          {"title": "服务号码", "key": "serviceNum", "align":"center"},
          {"title": "对方号码", "key": "oppositeNum", "align":"center"},
          {"title": "通信时长", "key": "duration", "align":"center"},
          {"title": "通信时间", "key": "relationTime", "align":"center"},*/
        ],
        detailData:[],//详单表格数据,
        detailPageData:[],
        isShowBehavior:true,
        isShowDetail:false,
        isExport:false,
        file:{
          fileName:'',
        },
        ruleValidates:{
          fileName:[
            {required:true,trigger:'change',validator:fileNamedatePass},
          ]
        },
        rotate:false,
        timer:null
      }
    },
    created() {

    },

    computed:{

    },

    mounted() {
      this.initTable();
    },

    methods: {
      cancelExport() {
        this.file.fileName = "";
        this.isExport = false;
      },

      exportOk() {
        let exportColumns = [];
        exportColumns = this.isShowBehavior ? this.behaviorColumns : this.detailColumns;
        let isDetail = this.isShowBehavior ? 0 : 1;
        let columnsName = [];
        exportColumns.forEach(function (item) {
          if(item.key) {
            columnsName.push(item.key);
          }

        });
        this.$refs.fileForm.validate((valid) => {
          if(valid){
            let exportColumnData = this.behaviorData;
            let currentTimeCode=new Date().getTime()+"excel";
            this.$http.request({
              method: 'post',
              url: URL.saveFilterParams,
              data: {
                type:this.selType,
                fileName:this.file.fileName,
                exportData:JSON.stringify(exportColumnData),
                columns:columnsName.join(","),
                isDetail:isDetail,
                currentTimeCode:currentTimeCode
              },
              success: (data) => {
                if(data.code == '200') {
                  window.location.href = URL.exportData + `?currentTimeCode=${currentTimeCode}`;
                }
              }
            });
            this.file.fileName = "";
            this.isExport = false;
          }
        })
      },

      getEdgeType() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let edges = cy.edges();
        let baseDictionData = this.$store.state.queryBaseDictionData;
        let edgePro = baseDictionData.edgePro;
        let edgeTypeGroup = _.groupBy(edges, function (edge) {
          return edge.data('type')
        });
        if(!edgeTypeGroup) {
          this.selType = "";
          this.edgeTypeList = [];
        } else {
          this.edgeTypeList = [];
          let _this = this;
          _.each(edgeTypeGroup, function (edgeElementS, edgeType) {
            let edgeVo = _.find(edgePro, {'label' : edgeType});
            let name = _.isEmpty(edgeVo) ? edgeType: edgeVo.name;
            _this.edgeTypeList.push({name: name, label: edgeType});
          });
          this.selType = this.edgeTypeList[0] ? this.edgeTypeList[0].label : "";
        }

      },

      changeshow() {
        this.isActive = !this.isActive;
        if(this.isActive){
          this.isShowBehavior = true;
          this.initTable();

          //图形指标关闭，数值初始化
          this.$store.state.isshowSlider=false;
          this.$store.commit("showSliderModel", this.$store.state.isshowSlider);
        }

      },

      initTable() {
        this.isShowBehavior = true;
        this.rotate = false;
        this.currentPage = 1;
        this.getEdgeType();
        this.changeColumns();
      },


      changeColumns() {
        const _this = this;
        this.behaviorColumns = [];
        this.detailColumns = [];
        let edgePro = this.$store.state.queryBaseDictionData.edgePro;
        for(let i=0; i<edgePro.length;i++) {
          if(edgePro[i].label == this.selType) {
            this.behaviorColumns = edgePro[i].properties;
            this.detailColumns = edgePro[i].propertyDe;
          }
        }


        for(let i=0; i<this.behaviorColumns.length; i++) {
          let bColumnItem = this.behaviorColumns[i];
          if(bColumnItem.key == "source") {
            this.$set(bColumnItem,'render', (h,params) => {
              const _this = this;
              let sourceId = params.row.source;
              return h('span',{
                style:{
                  borderBottom:"1px solid #c8c5ec"
                },
                on:{
                  click:function (e) {
                    e.stopPropagation();
                    _this.graphNodeSelect(params.row.sourceId);
                  }
                }
              },params.row.source)
            })

          } else if(bColumnItem.key == "target") {
            this.$set(bColumnItem,'render', (h,params) => {
              const _this = this;
              return h('span',{
                style:{
                  borderBottom:"1px solid #c8c5ec"
                },
                on:{
                  click:function (e) {
                    e.stopPropagation();
                    _this.graphNodeSelect(params.row.targetId);
                  }
                }
              },params.row.target)
            })
          }

        }


        let number = {
          title: "序号",
          width: 60,
          align: 'center',
          render:(h,params) => {
            return h('div',[
              h('span',(params.index+1)+_this.pageSize*(_this.currentPage-1))
            ])
          }
        };

        if(this.behaviorColumns.length>0) {
          if(this.behaviorColumns[0].title == "序号") {
            this.behaviorColumns.splice(0,1);
          }
          this.behaviorColumns.unshift(number)
        }

        if(this.detailColumns.length > 0) {
          if(this.detailColumns[0].title == "序号") {
            this.detailColumns.splice(0,1);
          }
          this.detailColumns.unshift(number)
        }
       this.changeData();

      },


      changeData() {
        let currentGraphModel = this.$store.state.currentGraphModel;
        var cy = currentGraphModel.cy;

        let allEdges = cy.edges();
        this.behaviorData = [];
        this.detailData = [];
        this.currentPage = 1;

        var columnsData = [];
        if(this.isShowBehavior) {//行为明细
          columnsData = this.behaviorColumns;
        } else {//详单
          columnsData = this.detailColumns;
        }


        for (let i = 0; i < allEdges.length; i++)   {

          if (allEdges[i].data().type == this.selType) {

            let behaviorDataItem = {};
            behaviorDataItem['sourceEdgeId'] = allEdges[i].data().source;
            behaviorDataItem['targetEdgeId'] = allEdges[i].data().target;
            behaviorDataItem['edgeId'] = allEdges[i].data('id');
            behaviorDataItem['startT'] = allEdges[i].data().startT;
            behaviorDataItem['endT'] =  allEdges[i].data().endT;

            for(let j=1; j<columnsData.length; j++) {

              if(columnsData[j].key == "source") {

                behaviorDataItem[columnsData[j].key] = allEdges[i].source().data("name");
                behaviorDataItem.sourceId = allEdges[i].source().data("id");
                var serviceMatchFlag = behaviorDataItem[columnsData[j].key].indexOf(this.searchVal);

              } else if(columnsData[j].key == "target") {

                behaviorDataItem[columnsData[j].key] = allEdges[i].target().data("name");
                behaviorDataItem.targetId = allEdges[i].target().data("id");
                var oppositeMatchFlag = behaviorDataItem[columnsData[j].key].indexOf(this.searchVal);

              } else if(columnsData[j].key.indexOf("source") != -1) {

                let sourceLabels = allEdges[i].source().data().labels;
                if(sourceLabels) {
                  let sourceVal = allEdges[i].source().data().labels[columnsData[j].labelCode];
                  behaviorDataItem[columnsData[j].key] = sourceVal ? sourceVal : "";
                } else {
                  behaviorDataItem[columnsData[j].key] = "";
                }

              } else if(columnsData[j].key.indexOf("target") != -1) {

                let targetLabel = allEdges[i].target().data().labels;
                if(targetLabel) {
                  let targetVal = allEdges[i].target().data().labels[columnsData[j].labelCode];
                  behaviorDataItem[columnsData[j].key] = targetVal ? targetVal : "";
                } else {
                  behaviorDataItem[columnsData[j].key] = "";
                }

              } else {

                let attr =  allEdges[i].data().attr;
                if(attr) {
                  let attrVal = allEdges[i].data().attr[columnsData[j].key];
                  behaviorDataItem[columnsData[j].key] = attrVal ? attrVal : "";
                } else {
                  behaviorDataItem[columnsData[j].key] = "";
                }

              }

            }

            if(this.searchVal == "" || (serviceMatchFlag != -1 || oppositeMatchFlag != -1)) { //搜索条件为空
              this.behaviorData.push(behaviorDataItem);
            } else {  //没匹配上
              continue;
            }
          }
        }

        this.totalCount = this.behaviorData.length;
        this.changePage(this.currentPage);
      },


      changePage(currentPage) {
        this.currentPage = currentPage;
        let currentNum = currentPage * this.pageSize;


        if(this.isShowBehavior) {
          this.behaviorPageData = [];
          for(let i = this.pageSize*(currentPage - 1); i < (currentNum > this.totalCount ? this.totalCount : currentNum); i++){
            this.behaviorPageData.push(this.behaviorData[i]);
          }
        }else {
          this.behaviorPageData = [];
          for(let i = this.pageSize*(currentPage - 1); i < (currentNum > this.totalCount ? this.totalCount : currentNum); i++){
            this.behaviorPageData.push(this.detailData[i]);
          }
        }
      },

      showDetail(dataItem) {
        clearTimeout(this.timer);
        this.rotate = !this.rotate;
        this.isShowBehavior = !this.isShowBehavior;

        if(this.isShowBehavior) {//行为明细
          this.changeData();

        } else {//详情

          var rowItem = dataItem;
          this.getDetailData(rowItem);

        }
      },

      getDetailData(rowData) {
        let edgeId = rowData.sourceEdgeId+","+rowData.targetEdgeId;
        let startTime = rowData.startT;
        let endTime = rowData.endT;
        let edgeLabel = this.selType;
        let _this = this;
        this.$http.request({
          method: 'get',
          url: URL.queryEdgeDetail,
          params: {edgeIdString:edgeId,edgeLabel:edgeLabel,startL:startTime,endL:endTime},
          success: (data) => {
            if (data.code === 200){
              _this.detailData=data.data;
              _this.totalCount =  _this.detailData.length;
              _this.changePage(1);
            }
          }
        });
      },

      // //选中边graph中边轨迹
      // graphEdgeSelect(selectEdge, event){
      //   let currentGraphModel = this.$store.state.currentGraphModel;
      //   let cy = currentGraphModel.cy;
      //   let eId = selectEdge.id;
      //   let curEdge = cy.$(`#${eId}`);
      //   if(curEdge && !curEdge.hidden()){
      //     if(!_.isEmpty(document.querySelector('.node-group-select-span'))) {
      //       document.querySelector('.node-group-select-span').classList.remove('node-group-select-span');
      //     }
      //     if(!_.isEmpty(document.querySelector('.edge-group-select-span'))) {
      //       document.querySelector('.edge-group-select-span').classList.remove('edge-group-select-span');
      //     }
      //     event.target.setAttribute('class', 'edge-group-select-span');
      //     SelectManage.drawEdgeTrack(selectEdge, event)
      //   }
      // },

      //选中点或者类型高亮graph图显示
      graphNodeSelect(nodeId) {
        if(!_.isEmpty(document.querySelector('.node-group-select-span'))) {
          document.querySelector('.node-group-select-span').classList.remove('node-group-select-span');
        }
        if(!_.isEmpty(document.querySelector('.edge-group-select-span'))) {
          document.querySelector('.edge-group-select-span').classList.remove('edge-group-select-span');
        }
        SelectManage.selectNodeOnGraph(nodeId);
      },

      graphEdgeSelect(selectEdgeId){
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        // let eId = selectEdge.id;
        let curEdge = cy.$(`#${selectEdgeId}`);
        if(curEdge && !curEdge.hidden()){
          if(!_.isEmpty(document.querySelector('.node-group-select-span'))) {
            document.querySelector('.node-group-select-span').classList.remove('node-group-select-span');
          }
          if(!_.isEmpty(document.querySelector('.edge-group-select-span'))) {
            document.querySelector('.edge-group-select-span').classList.remove('edge-group-select-span');
          }
          SelectManage.drawEdgeTrack(selectEdgeId, event)
        }else {
          this.$Message.warning('该关系处于隐藏状态')
        }
      },

      selEdge(row) {
        let _this = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          let source = row.source;
          let target = row.target;
          if(source == target) {
            return;
          }
          let edgeId = row.edgeId;
          _this.graphEdgeSelect(edgeId);
        },300);

      }

    },

    beforeDestroy() {
      clearTimeout(this.timer);
    }
  }
</script>

<style lang="less">
  .behaviorClose{
    z-index: 999;
    width: calc(100% - 232px);
    height: 34px;
    line-height: 34px;
    background: #10143f;
    position: absolute;
    bottom: 0px;
    cursor: pointer;
    /* transition:bottom .8s linear;*/
  }
  .behaviorOpen{
    z-index: 9999;
    background: #fff;
    width: calc(100% - 232px);
    height: 188px;
    overflow: hidden;
    position: absolute;
    bottom: 0px;
    cursor: pointer;
    /*transition:bottom .8s linear;*/
  }

  #exportData{
    position: absolute;
    right: 36px;
    margin-top: 5px;
  }
  .isClose{
    font-size: 20px;
    position: absolute;
    right: 6px;
    line-height: 34px;
    z-index: 99999;
  }
  .return{
    font-weight: 600;
    font-size: 12px;
    padding:5px;
  }
  .behaviorTitle{
    font-weight: 600;
    padding: 5px 30px 5px 15px;
  }
  #condition{
    width:180px;
  }
  .open-enter-active ,.open-leave-active{
    transition: all 1s;
  }
  .open-enter,.open-leave-to{
    height:34px;
  }
  .open-enter-to,.open-leave{
    height:188px;
  }
  .close-enter-active ,.close-leave-active{
    transition: all 1s;
  }
  .close-enter,.close-leave-to{
    height:0px;
  }
  .close-enter-to,.close-leave{
    height:34px;
  }
  #behaviorInfo{
    position:relative;
  }
  .transform{
    width: 100%;
    transition: all .5s;
    position: absolute;
    top: 0px;
    left: 0px;
    backface-visibility: hidden;
  }
  .rotate0{
    transform:rotateY(0deg);
  }
  .rotate180{
    transform:rotateY(180deg);
    /*direction: rtl;
    unicode-bidi: bidi-override;*/
  }
  .page-box{
    position: absolute;
    right: 0px;
    bottom: 0px;
  }

</style>
<style>

  #behaviorInfo .ivu-table-small th {
     height: 30px;
   }
  #behaviorInfo .ivu-table-small td {
    height: 30px;
  }
  #detailTable .ivu-table-small th {
    height: 30px;
  }
  #detailTable .ivu-table-small td {
    height: 30px;
  }
  #behaviorInfo .ivu-table-cell{
    padding:0px;
  }
  #behaviorInfo .ivu-table-column-center{
    padding:0px;
  }
  #detailTable .ivu-table-cell{
    padding:0px;
  }
  #detailTable .ivu-table-column-center{
    padding:0px;
  }

</style>
