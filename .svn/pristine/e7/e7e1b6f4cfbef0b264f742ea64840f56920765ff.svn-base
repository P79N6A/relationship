<template>
  <modal v-model="getLabelState" title="新增标记" width="480" id="addLableModal">
    <div class="cls-min">
      <div>
        <Row style="height:20px;line-height:20px;position:relative">
          <div id="warnLength" class = "label-length-tip"  v-show="!isPass">自定义标记名称长度不能超过20个字节</div>
        </Row>
        <Row>
        <!--<Input type="text" v-model="labelName.dicName" style=" height:35px;width: 200px"/>-->
          <Col span="22">
            <Select id = "selectedData" v-model="selectLabelData" label-in-value filterable multiple @on-change="changeHandler" ref="setSelect">
              <Option v-for="item in selectLabelListData" :key="item.labelCode" :value="item.labelCode">{{ item.labelName }}</Option>
            </Select>
          </Col>
          <Col span="1" style="line-height: 31px;">
            <Button type="primary" shape="circle" size="small" icon="md-add"  @click="addLabelData"></Button>
          </Col>
        </Row>
      </div>
      <div id="label">
        <Tag  type="border" v-for="(item,index) in addedLabelDataView" :key="index"  color ="blue" @click.native="selectLabel(item)" closable @on-close="handleClose(item,index)">
          {{item.label}}
        </Tag>
      </div>
    </div>
    <div slot="close" @click="closeModal"><Icon type="ios-close"></Icon></div>
    <div slot="footer">
      <Button type="text" @click="cancelAddLabel">取消</Button>
      <Button type="text" @click="saveLabelData">确定</Button>
    </div>
  </modal>
</template>

<script>
  import {URL} from "../../../api/urlsConfig";

export default {
  name: "addLabel",

  created(){

  },
  mounted(){
    this.labelNamePass();
  },
  data(){
    return {
      basepropertylabel: [],//查询出的已有标记
      newLabelData:[],//存储新增的标记(保存参数1)
      addSelectData:[],//存储下拉框已选的标记

      othersLabel:[],//所有的自定义标记
      selectLabelListData:[],
      selectLabelData:[],//下拉框已选的标记
      addedLabelDataView:[],//显示到下面的标记(新增的)，
      currentSelectData:[],//当前下拉框选中的标记
      addedLabelData:[],//显示到下面的标记（选择的）保存参数2
      addSelectedLabel:[],//新增的已选标记
      //labelsData:[]//替换currentResultDefinedLabel里面的labels使用
      isPass:true//标记名字长度校验是否通过
    }
  },

  computed :{
    getLabelState:{
      get:function () {
        return this.$store.state.isAddLabelModal;
      },
      set:function () {
        this.$store.commit("showAddLabelModal");
      }
    }
  },

  methods: {
    resetLabel(){
      this.selectLabelListData=  [];
      this.selectLabelData = [];
      this.addedLabelDataView = [];
      this.currentSelectData = [];
      this.addedLabelData = [];
      this.newLabelData = []
      this.isPass = true;
      this.$refs['setSelect'].$data.query='';
    },

    queryAllDefinedLabel() {
      // this.resetLabel();
      let _this = this;
      this.$http.request({
        method: 'get',
        params: '',
        url: URL.queryAllDefinedLabel,
        success: (data) => {
          if (data.code === 200) {
            let currentGraphModel = this.$store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            let basepropertylabel =data.data.otherUsersLabel;//下拉框所有的标记
            _this.othersLabel = data.data.otherUsersLabel;
            let currentResultDefinedLabel = this.$store.state.currentResultDefinedLabel;
            let list = _.filter(currentResultDefinedLabel, ['nodeId', cy._private.curNode._private.data.name]);
            if (!_.isEmpty(list)){
              let selectLabelList = [];
              let labels = list[0].labels;
              labels.forEach(function (e) {
                //已有标记添加到后台保存参数中（后台先删关系，然后重新新增关系）
                _this.addedLabelData.push(e.labelCode);
                //已有标记添加到下面的展示数据内
                _this.addedLabelDataView.push({
                  label:e.labelName,
                  value:e.labelCode
                });
              });
              //已选的不包含在下拉框内
              basepropertylabel.forEach(function (e) {
                if (!(_this.addedLabelData.indexOf(e.labelCode) > -1)) {
                  selectLabelList.push(e);
                }
              })
              _this.selectLabelListData = selectLabelList;
            }else{
              _this.selectLabelListData = basepropertylabel;
            }
            this.$store.commit("showAddLabelModal", true)
          }
        },
        error: (data) => {
          this.$Message.warning('请求数据失败！');
        }
      });
    },

    //右上关闭按钮
    closeModal() {
      this.$store.commit("showAddLabelModal", false);
      this.resetLabel();
    },

    //新增标签
    addLabelData() {
      //标记超长,不允许添加
      if(this.isPass == false){
        return
      }
      //手动输入的(下拉框未匹配到)标签
      var newLabel = $('#selectedData').children().find('.ivu-select-input').val();

      let _this = this;
      //新增标记，去重
      if (!_.isEmpty(newLabel)) {
        //this.addedLabelDataView.push({"label": newLabel});
        let flag = _.find(this.newLabelData,function (e) {
          return e==newLabel;
        })
        if(_.isEmpty(flag)){
          this.newLabelData.push(newLabel);//存储所有新增的标记（保存用）
          this.addedLabelDataView.push({"label": newLabel});
        }else {
          this.$Message.warning("标记已存在！")
        }
      }
      this.currentSelectData.forEach(function (e) {
        //从下拉框中移除已选的选项
        _this.selectLabelListData = _.reject(_this.selectLabelListData,function (data) {
          return e.value==data.labelCode
        })

        _this.addSelectedLabel.push(e);
        if (!(_this.addedLabelData.indexOf(e.value) > -1)) {//已有的不再添加
          _this.addedLabelData.push(e.value);//存储所有已选择的标记（保存用）
          _this.addedLabelDataView.push(e);
        }
      })
      this.$refs['setSelect'].$data.query='';//清空搜索条件
      _this.selectLabelData = [];

    },
    //校验标记长度
    labelNamePass(){
      const _this = this;
      var el = $('#selectedData').children().find('.ivu-select-input');
      el.keyup(function(){
        var labelName = el.val();
        if(labelName.length >20){
          _this.isPass = false;
        }else{
          _this.isPass = true;
        }
      })
    },
    //取消
    cancelAddLabel() {
      this.$store.commit("showAddLabelModal", false);
      this.resetLabel();
    },

    //刷新右侧自定义标记统计
    refreshCustomTag(){
      this.$emit("refreshCustomTag");
    },

    //删除当前节点的所有自定义标记
    deleteLabels() {
      this.$Modal.confirm({
        title: '是否删除所有标记',
        okText: '确认',
        cancelText: '取消',
        onOk:()=>{
          let currentGraphModel = this.$store.state.currentGraphModel;
          let cy = currentGraphModel.cy;
          let curNode = cy._private.curNode;
          let serverNum = curNode._private.data.name;
          this.$http.request({
            method: 'post',
            params: {
              serverNum:serverNum
            },
            url: URL.deleteUserDefinedLabel,
            success: (data) => {
              if (data.code === 200){
                let currentResultDefinedLabel = this.$store.state.currentResultDefinedLabel;
                let list = _.filter(currentResultDefinedLabel, ['nodeId', serverNum]);
                if(list.length >0 && list[0].nodeId== serverNum) {
                  list[0].labels = [];//从currentResultDefinedLabel中清空对应节点的自定义标记
                  this.$store.commit("setCurrentResultDefinedLabel", currentResultDefinedLabel);
                }
                this.$Message.success('删除成功！');
                this.refreshCustomTag();
                //无自定义标记时清除小对号样式
                //curNode._private['classes'] = new Set([]);
                curNode._private['classes'].delete('l1');
                curNode._private['classes'].delete('l2');
                let el = document.getElementById(`${serverNum}_label`);
                el.parentNode.className = "cy-none-title";
              }
            },
            error: (data) => {
              this.$Message.warning("请求数据失败！")
            }
          })
        },
      })
    },

    //保存自定义标记
    saveLabelData() {
      let currentGraphModel = this.$store.state.currentGraphModel;
      let cy = currentGraphModel.cy;
      let curNode = cy._private.curNode;
      let nodeId = curNode._private.data.name;
      let labelIds = "";
      let label = "";
      let labelsData=[];//替换currentResultDefinedLabel中的labels使用
      let _this = this;
      //新增参数处理为用,隔开的字符串
      this.addedLabelData.forEach(function (e) {
        labelIds +=e+",";

        var addLabel = _.find(_this.othersLabel,function (data) {
          return data.labelCode == e;
        });
        labelsData.push({
          labelCode: addLabel.labelCode,
          labelName:addLabel.labelName,
          userName: ""
        })
      })
      this.newLabelData.forEach(function (e) {
        label +=e+",";
      })
      labelIds = labelIds.substring(0,labelIds.length-1);
      label = label.substring(0,label.length-1);
      let param = {
        nodes:nodeId,
        label:label,
        labelIds:labelIds
      };
      this.$http.request({
        method: 'post',
        params:  param,
        url: URL.saveOrUpdateUserDefinedLabel,
        success: (data) => {
          if (data.code === 200) {
            let labels = data.data;//返回的新增标记list，包含labelCode
            let currentResultDefinedLabel = this.$store.state.currentResultDefinedLabel;
            let list = _.filter(currentResultDefinedLabel, ['nodeId', nodeId]);

            if(list.length ==0){//保存成功，但标记里没有，说明是新增节点添加标记
                var sublabel = {
                  labels:[],
                  nodeId: nodeId
                }
              currentResultDefinedLabel.push(sublabel);
              list.push(sublabel);//加入到list
            }

            if(list.length >0 && list[0].nodeId== nodeId){
              //新增标记拼接到currentResultDefinedLabel
              for(var i=0;i<labels.length;i++){
                labelsData.push(labels[i]);
              }
              list[0].labels = labelsData;//替换currentResultDefinedLabel中对应节点的labels
              this.$store.commit("setCurrentResultDefinedLabel", currentResultDefinedLabel);
              this.$Message.success('保存成功！');
              this.$store.commit("showAddLabelModal", false);
              this.resetLabel();
              //let elements = cy.nodes();
              let elements = cy.nodes("[name='"+nodeId+"']")

              //为元素添加l1类，用于筛选带自定义标记的点
              if(!_.isEmpty(label)|| !_.isEmpty(labelIds)){
                let groups = currentGraphModel.data.groups;

                elements.forEach(function (e) {
                  let nodeGroup = _.find(groups,function (v) {
                    if(e.data().group == v.groupId){
                      return v
                    }
                  })
                  let name = e._private.data.name;
                  if(nodeId == name){//后续改为批量需要修改-----------------------------
                    let flag = false;//表示不存在高亮群组
                    for(let i=0;i<groups.length;i++){
                      if(groups[i].isLighted == false){
                        flag = true;
                        break;
                      }
                    }
                    //每次添加前清除之前的id,className
                    let el = document.getElementById(`${nodeId}_label`);
                    if(el){
                      el.parentNode.className = "";
                      el.id = "";
                    }

                    if(nodeGroup != undefined && nodeGroup.isLighted == true && flag){
                      e.addClass('l2')
                      cy.nodeHtmlLabel(
                        [
                          {
                            query:"node[name='"+name+"']",
                            halign:'bottom',
                            valign:'right',
                            cssClass:'cy-title_dark',
                            tpl:function (data) {
                              return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
                            }
                          }
                        ]
                      )
                    }else{
                      e.addClass('l1')
                      cy.nodeHtmlLabel(
                        [
                          {
                            query:"node[name='"+name+"']",
                            halign:'bottom',
                            valign:'right',
                            cssClass:'cy-title',
                            tpl:function (data) {
                              return `<div id=${data.name}_label></div>`; //div添加id，用于清除节点右下小对号样式
                            }
                          }
                        ]
                      )
                    }
                  }
                });
                //每次添加前清除之前的id,className
                // let el = document.getElementById(`${nodeId}_label`);
                // if(el){
                //   el.parentNode.className = "";
                //   el.id = "";
                // }
                //有自定义标记的点添加小对号
                // cy.nodeHtmlLabel(
                //   [
                //     {
                //       query:'.l1',
                //       halign:'bottom',
                //       valign:'right',
                //       cssClass:'cy-title',
                //       tpl:function (data) {
                //         return `<div id=${data.name}_label></div>`;
                //       }
                //     },
                //     {
                //       query:'.l2',
                //       halign:'bottom',
                //       valign:'right',
                //       cssClass:'locked-node',
                //       tpl:function (data) {
                //         return `<div id=${data.name}_label></div>`;
                //       }
                //     }
                //   ]
                // );
                //触发样式更新，每次颜色设置不一样，样式一样不会触发更新
                let colorVal = cy._private.curNode.style().textOutlineColor;
                if(colorVal == 'rgb(255,255,255)'){
                  colorVal = 'rgb(255,250,250)';
                  console.log(colorVal)
                }else{
                  colorVal = 'rgb(255,255,255)';
                  console.log(colorVal)
                }
                cy.style()
                  .selector(cy._private.curNode)
                  .style("text-outline-color", colorVal)
                  .update();
               }else {
                //保存时无自定义标记时清空小对号样式
                //curNode._private['classes'] = new Set([])
                curNode._private['classes'].delete('l1');
                curNode._private['classes'].delete('l2');
                let el = document.getElementById(`${nodeId}_label`);
                el.parentNode.className = "cy-none-title";
              }
              this.refreshCustomTag();
              this.resetLabel();
            }else{
              this.$store.commit("setCurrentResultDefinedLabel", currentResultDefinedLabel);
              this.$Message.error('保存失败！');
              this.$store.commit("showAddLabelModal", false);
              this.resetLabel();
            }
          }
        },
        error: (data) => {
          this.$Message.warning("请求数据失败！")
        }
      })
    },

    //标记下拉选择
    changeHandler(data) {
      this.currentSelectData = data;
      console.log(this.currentSelectData)
    },

    //去除已选标记
    handleClose(data, index) {
      //新增的从newLabelData移除
      if(_.isEmpty(data.value)){
        this.newLabelData = _.reject(this.newLabelData,function (e) {
          return e==data.label
        })
      }else{//已选择的从addedLabelData移除
        this.addedLabelData = _.reject(this.addedLabelData,function (e) {
          return e==data.value;
        });

        //去除的重新添加到下拉框
        this.selectLabelListData.push({
          labelCode:data.value,
          labelName:data.label
        });
      }
      this.addedLabelDataView.splice(index, 1);
    }
  }
}
</script>
<style scoped>
  .cls-min{
    width: 100%;
  }
  #label{
    width: 100%;
    height: 180px;
  }
  .label-length-tip {
    position: absolute;
    left: 0;
    line-height: 1;
    padding-top: 5px;
    color: #ed4014;
  }
</style>
<style>
  #addLableModal .ivu-modal-body{
    padding-top:0px;
  }
</style>
