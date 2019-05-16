<template>
  <div id="create-statistics-model">
    <Modal v-model="showStatisticsModel" :title="titleName" width="500">
      <Form ref="formItem" :model="formItem" :label-width="110" :rules="ruleValidates" style="margin-right: 30px">
        <FormItem label="模型名称：" prop="modelName">
          <Input v-model="formItem.modelName" type="text" placeholder="模型名称" />
        </FormItem>

        <FormItem v-show="this.createType==='copy'" label="模型类型：" prop="modelType">
          <Select v-model="formItem.dicCode" label-in-value @on-change="changeModelType">
            <Option v-for="item in modelTypeList" :value="item.dicCode" :key="item.dicCode">{{item.dicName}}</Option>
          </Select>
        </FormItem>

        <FormItem label="时间范围：" prop="dateValue">
          <DatePicker type="daterange" :options="disableOpt" v-model="formItem.dateValue" :clearable="false" confirm split-panels placeholder="请选择要查看的时间范围" style="width: 100%">
          </DatePicker>
        </FormItem>

        <FormItem label="对象类型：" prop="nodeType">
          <Select v-model="formItem.nodeType" @on-change="changeNodePro">
            <Option v-for="item in nodeTypeList" :value="item.label" :key="item.label">{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="关系类型：" prop="edgeType">
          <Select v-model="formItem.edgeType" multiple>
            <Option v-show="item.dyFlag" v-for="item in edgeTypeList" :value="item.label" :key="item.label">{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="标签类型：" prop="labelType">
          <Select v-model="formItem.labelType" filterable multiple>
            <Option v-for="item in labelList" :disabled="formItem.labelType.length > 4" :value="item.dicCode" :key="item.dicCode">{{ item.dicName }}</Option>
          </Select>
        </FormItem>

        <FormItem label="对象名称：" prop="nodeNameList">
          <div class="createModel-node-content">
            <Input v-model="searchNodeNameContent" style="width:74%" class="statisticsSearch"
                    size="small" placeholder="搜索对象..." @click.native="searchNodeName">
            <Button slot="append" icon="ios-search" size="small" @click="searchNodeName"></Button>
            </Input>
            <!--<Icon style="position: absolute;left: 5px;top: 2px;" type="iso-refresh"></Icon>-->
            <span style="position: absolute;right: 5px;top: 2px;">共 {{ formItem.nodeNameList.length}} 个</span>
            <div class="createModel-node-tags">
              <Tag type="border" checkable :checked=false closable :class="item.search===true ?'createModel-searchNodeName' : ''"
                   v-for="(item,key) in formItem.nodeNameList" :key="key" :name="key" @on-close="deleteNodeName(item)" color="blue">
                {{item.name}}
              </Tag>
            </div>
          </div>
        </FormItem>

      </Form>
      <div slot="close" @click="closeCreateModel"><Icon type="ios-close"></Icon></div>
      <div slot="footer">
        <Button type="text" @click="closeCreateModel">取消</Button>
        <Button type="default" @click="okCreateModel">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {URL} from "../../../api/urlsConfig"
  export default {
    name: "create-statistics-model",
    data() {
      return {
        disableOpt:{
          disabledDate (date) {
            return date && date.valueOf() > new Date().getTime();
          },
          shortcuts: [
            {
              text: '一周',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '一个月',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '三个月',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            },
            {
              text: '六个月',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                return [start, end];
              }
            }
          ]
        },
        showStatisticsModel: false,
        edgePro: [],
        nodeTypeList: [],
        edgeTypeList: [],
        modelTypeList: [],
        titleName: "",
        statisticsModel: '',
        labelList: [],
        formItem: {
          dicCode:'',
          modelName:'',
          edgeType: [],
          nodeType: '',
          labelType: [],
          nodeNameList: [],
          dateValue: this.initDate(),
        },
        //创建类型  新建模型：'new'  复制模型：'copy'
        createType: '',

        //数据库获取模型最大分析对象个数
        maxStatisticNum: 0,
        searchNodeNameContent: '',
        ruleValidates:{
          modelName:[
            { required: true, message: '请输入模型名称！', trigger: 'blur' },
            {type: 'string', trigger:'change',validator:(rule,value,callback)=>{
                if(value.length>40){
                  callback('模型名称长度不能超过40个字节')
                }else {
                  callback()
                }
              }
            },
          ],
          nodeNameList: [
            {required:true, type:'array',validator:(rule,value,callback) => {
                switch (this.formItem.dicCode) {
                  case '201':
                    if (this.formItem.nodeNameList.length !== this.maxStatisticNum) {
                      callback('单人分析-请分析' + this.maxStatisticNum + '个对象');
                    }else{
                      callback();
                    }
                    break;
                  case '202':
                    if (this.formItem.nodeNameList.length < 2) {
                      callback('群组分析-请分析至少两个对象');
                    } else if (this.formItem.nodeNameList.length> this.maxStatisticNum) {
                      callback('群组分析-分析对象个数不能超过' + this.maxStatisticNum);
                    }else{
                      callback();
                    }
                    break;
                  case '203':
                    if (this.formItem.nodeNameList.length !== this.maxStatisticNum) {
                      callback('关联发现-请分析'+ this.maxStatisticNum +'个对象');
                    }else{
                      callback();
                    }
                    break;
                  case '204':
                    if (this.formItem.nodeNameList.length < 2) {
                      callback('社团扩展-请分析至少两个对象');
                    } else if (this.formItem.nodeNameList.length > this.maxStatisticNum) {
                      callback('社团扩展-分析对象个数不能超过' + this.maxStatisticNum);
                    }else{
                      callback()
                    }
                    break;
                  case '205':
                    if (this.formItem.nodeNameList.length > this.maxStatisticNum) {
                      callback('关系呈现-分析对象个数不能超过' + this.maxStatisticNum);
                    }else{
                      callback();
                    }
                    break;
                }
              }
            },

          ],
          nodeType: [
            { required: true,validator:(rule,value,callback) => {
                if(_.isEmpty(value)) {
                  callback("对象类型不能为空！")
                }else{
                  callback();
                }
              }
            },
          ],
          edgeType:[
           {required:true, type:'array',validator:(rule,value,callback) => {
               if(_.isEmpty(value)) {
                 callback("关系类型不能为空！")
               }else{
                 callback();
               }
             }},
          ],
          dateValue:[
            {required:true, type: 'array', message:"日期不能为空",trigger:"change"},
            {validator:(rule,value,callback) => {
                if(new Date(value[1]).getTime() -new Date(value[0]).getTime() >15552000000) {
                  callback("时间间隔不能超过六个月！")
                }else{
                  callback();
                }

              }}
          ],
        }
      }
    },
    inject:[
      "initDate"
    ],
    components: {

    },
    created() {

    },
    mounted() {

    },
    methods: {

      showModal(model, titleName, selectNodes, createType){
        this.createType = createType;
        this.formItem.selectNodes = selectNodes;
        // this.formItem.modelName = modelName;
        this.formItem.dicCode = model.dicCode;
        this.statisticsModel = model;
        let baseDictionData = this.$store.state.queryBaseDictionData;
        this.edgePro = baseDictionData.edgePro;
        this.labelList = baseDictionData.flagLabel;
        this.titleName = titleName;
        let nodePro = baseDictionData.nodePro;
        this.showStatisticsModel = true;

        if(this.createType === 'new'){
          //新建模型
          this.setMaxStatisticNum(model);
          //过滤取出所选节点类型
          let nodeLabelList = _.uniq(_.map(selectNodes, function (node) {
            return node.data('type')
          }));
          //字典翻译，区分可以使用分析模型的类型
          this.nodeTypeList = _.filter(nodePro, function (pro) {
            return _.includes(nodeLabelList, pro.label)
          });
          //默认显示第一种节点类型
          let defaultType = _.find(this.nodeTypeList, {'dyFlag': true});
          this.formItem.nodeType = _.isEmpty(defaultType) ? '' : defaultType.label;
          this.changeNodePro();
        }else {
          //复制模型
          this.formItem.modelName = model.rname;
          this.formItem.dicCode = model.rtype;
          let nodeLabelList = _.uniq(_.map(selectNodes, function (node) {
            return node.type
          }));
          //字典翻译，区分可以使用分析模型的类型
          this.nodeTypeList = _.filter(nodePro, function (pro) {
            return _.includes(nodeLabelList, pro.label)
          });
          //默认显示第一种节点类型
          let defaultType = _.find(this.nodeTypeList, {'dyFlag': true});
          this.formItem.nodeType = _.isEmpty(defaultType) ? '' : defaultType.label;
          if(!isNaN(parseInt(model.accountVo.startTime)) && !isNaN(parseInt(model.accountVo.endTime))){
            this.formItem.dateValue = [new Date(parseInt(model.accountVo.startTime)), new Date(parseInt(model.accountVo.endTime))];
          }
          //关系回填
          this.edgeTypeList = _.isEmpty(defaultType) ? '' : defaultType.edgeList;
          let edgeLabels = _.split(model.accountVo.edgeLabel, ',');
          let useEdgeType = _.filter(this.edgeTypeList, function (eType) {
            return _.find(edgeLabels, function (eLabel) {
              if(eType.name === eLabel){
                return eType
              }
            })
          });
          this.formItem.edgeType = _.map(useEdgeType, 'label');
          //标签回填
          this.formItem.labelType = _.split(model.accountVo.labels, ',');

          this.formItem.nodeNameList = selectNodes;
          //只有一个对象，选择个体分析
          if(selectNodes.length === 1){
            this.modelTypeList = baseDictionData.singlePro;
          }else if (selectNodes.length > 1){
            //多个对象，选择群体分析
            this.modelTypeList = baseDictionData.manyPro;
          }

          this.changeModelType();
        }
      },

      //根据节点类型动态联动关系
      changeNodePro() {

        let _this = this;
        let selectType = _.find(this.nodeTypeList, {'label': this.formItem.nodeType});
        this.edgeTypeList = _.isEmpty(selectType) ? [] : selectType.edgeList;
        let currentGraphModel = this.$store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let hidden = [];
        cy.nodes(":hidden").filter((item) => {
          hidden.push(item.data().id)
        });
        let selectNodeList = cy.filter(this.formItem.selectNodes, function (node) {
          return node.data('type') === _this.formItem.nodeType;
        });
        this.formItem.nodeNameList = _.map(selectNodeList, function (node) {
          return node.data();
        });
        this.formItem.nodeNameList = this.formItem.nodeNameList.filter((item) => {
          return hidden.indexOf(item.id) === -1
        });
        this.setModelName();
      },

      //复制模型，改变类型，改变名称
      changeModelType() {
        let baseDictionData = this.$store.state.queryBaseDictionData;
        let modelPro = _.flatten([baseDictionData.singlePro, baseDictionData.manyPro]);
        let currentModel = _.find(modelPro, {'dicCode': this.formItem.dicCode});
        this.statisticsModel.dicName = currentModel.dicName;
        this.setModelName();
        this.setMaxStatisticNum(currentModel);
      },

      //设置默认模型名称
      setModelName() {
        if(_.isEmpty(this.formItem.nodeNameList)){
          this.formItem.modelName = this.statisticsModel.dicName;
        }else {
          if(this.statisticsModel.dicCode === '201'){
            this.formItem.modelName = this.statisticsModel.dicName + "-" + this.formItem.nodeNameList[0].name;
          }else {
            this.formItem.modelName = this.statisticsModel.dicName + "-" + this.formItem.nodeNameList.length;
          }
        }
      },

      //数据库获取模型最大分析对象个数
      setMaxStatisticNum(model){
        this.maxStatisticNum = isNaN(parseInt(model.val1)) ? 0 : parseInt(model.val1);
      },

      closeCreateModel() {
        this.formItem.nodeType='';
        // this.formItem.dateValue=this.initDate();
        this.formItem.edgeType=[];
        this.edgeTypeList = [];
        this.nodeTypeList = [];
        this.formItem.nodeNameList = [];
        this.searchNodeNameContent = "";
        this.formItem.labelType = [];
        $(".createModel-searchNodeName").removeClass("createModel-searchNodeName");
        //对整个表单进行重置，将所有字段值重置为空并移除校验结果
        this.$refs.formItem.resetFields();
        this.showStatisticsModel = false;
      },

      //校验模型分析对象个数
      // validatorNodeList(){
      //   let validator = true;
      //   switch (this.formItem.dicCode) {
      //     case '201':
      //       if (this.formItem.nodeNameList.length !== 1) {
      //         this.$Message.warning('单人分析-请分析一个对象');
      //         validator = false
      //       }
      //       break;
      //     case '202':
      //       if (this.formItem.nodeNameList.length < 2) {
      //         this.$Message.warning('群组分析-请分析至少两个对象');
      //         validator = false
      //       } else if (this.formItem.nodeNameList.length> 1000) {
      //         this.$Message.warning('群组分析-分析对象个数不能超过1000');
      //         validator = false
      //       }
      //       break;
      //     case '203':
      //       if (this.formItem.nodeNameList.length !== 2) {
      //         this.$Message.warning('关联发现-请分析两个对象');
      //         validator = false
      //       }
      //       break;
      //     case '204':
      //       if (this.formItem.nodeNameList.length < 2) {
      //         this.$Message.warning('社团扩展-请分析至少两个对象');
      //         validator = false
      //       } else if (this.formItem.nodeNameList.length > 50) {
      //         this.$Message.warning('社团扩展-分析对象个数不能超过50');
      //         validator = false
      //       }
      //       break;
      //     case '205':
      //       if (this.formItem.nodeNameList.length > 500) {
      //         this.$Message.warning('关系呈现-分析对象个数不能超过500');
      //         validator = false
      //       }
      //       break;
      //   }
      //   return validator;
      // },

      okCreateModel() {
        let _this = this;
        this.$refs.formItem.validate((valid) => {
          if(valid){
            // if(!this.validatorNodeList()){
            //   return false
            // }
            let startTime = this.formItem.dateValue[0]===''? null: new Date(this.formItem.dateValue[0]).getTime();
            let endTime =   this.formItem.dateValue[1]===''? null:  new Date(this.formItem.dateValue[1]).getTime();
            let taskId = this.$store.state.currentGraphModel.taskId;
            //按类型分组
            // let nodeGroupByType =  _.groupBy(_.map(this.formItem.selectNodes, function(node){
            //   return node.data()
            // }), 'type');
            // let accountList = [];
            //如果存在没有id的点，传nameList+type+indexLabel
            //所有点存在id,传idList+type
            //图数据库查询需要
            // let nodeProBase = this.$store.state.queryBaseDictionData.nodePro;
            // _.each(nodeGroupByType, function (nodeNameList, type) {
            //   let nodePro = _.find(nodeProBase, {'label': type});
            //   let indexLabel = _.isEmpty(nodePro) ? '' : nodePro.indexLabel;
            //   accountList.push({type: type, indexLabel: indexLabel, value: _.join(_.map(nodeNameList, 'name'), '\n')})
            // });

            let accountList = [];
            let nodeProBase = this.$store.state.queryBaseDictionData.nodePro;
            let nodePro = _.find(nodeProBase, {'label': _this.formItem.nodeType});
            let indexLabel = _.isEmpty(nodePro) ? '' : nodePro.indexLabel;
            accountList.push({type: _this.formItem.nodeType, indexLabel: indexLabel, value: _.join(_.map(this.formItem.nodeNameList, 'name'), '\n')});
            this.$http.request({
              method: 'post',
              params:{
                edgeLabel: _.join(this.formItem.edgeType, ","),
                degree:1,
                startTime:startTime,
                endTime:endTime,
                labels: _.join(this.formItem.labelType, ','),
              },
              data: {
                accountList: accountList,
                rname: this.formItem.modelName,
                taskId: taskId,
                rtype: this.formItem.dicCode,
              },
              url:URL.saveOrUpdateTaskResultDatas,
              success: (data) => {
                if(data.code === 200) {
                  //右边功能区切换到任务页签
                  this.$store.commit("setRightConTabName", "task");
                  //刷新分析模型列表
                  this.$emit("refreshAnalyticalModelList");
                  //刷新模型统计
                  this.$emit("getModelUseInfo");
                  this.closeCreateModel();

                }else{
                  this.$Message.warning('新建模型异常');
                }
              },
              error: (data) => {
                this.$Message.warning('新建模型失败');
              }
            });
          }
        })
      },

      //搜索节点名称高亮显示
      searchNodeName(){
        let _this = this;
        _.each(this.formItem.nodeNameList, function (node) {
          node.search = false;
        });
        if(_.isEmpty(_this.searchNodeNameContent)){
          this.$forceUpdate();
          document.querySelector('.createModel-node-tags').scrollTop = 0;
          return false
        }

        //高亮显示
        _.each(this.formItem.nodeNameList, function (node) {
          if (_.includes(node.name, _this.searchNodeNameContent)) {
            node.search = true;
          }
        });
        this.$forceUpdate();
        //滚动条移动到第一个高亮tag
        this.$nextTick(function (o) {
          if(!_.isEmpty(document.querySelector('.createModel-searchNodeName'))) {
            let searchNodeNameTop = document.querySelector('.createModel-searchNodeName').offsetTop;
            let tagsTop = document.querySelector('.createModel-node-tags').offsetTop;
            document.querySelector('.createModel-node-tags').scrollTop = searchNodeNameTop - tagsTop
          }
        });
      },
      //删除节点名称
      deleteNodeName(node){
        this.formItem.nodeNameList = _.reject(this.formItem.nodeNameList, {'id': node.id});
        if(_.includes(this.formItem.modelName, node.name) || this.statisticsModel.dicCode !== '201'){
          this.setModelName();
        }
        this.$refs.formItem.validate()
      }
    },

  }
</script>

<style scoped>
  .createModel-node-tags{
    max-height: 130px;
    overflow: auto;
    min-height: 32px;
  }
  .createModel-node-content{
    border:1px solid #dddee1;
    padding:4px 7px;
  }
  .createModel-searchNodeName{
    background-color: #bebef0 !important;
  }

</style>
