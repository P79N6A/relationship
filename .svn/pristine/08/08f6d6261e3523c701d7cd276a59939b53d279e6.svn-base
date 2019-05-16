<template>
  <div id="exportselectnodes">
  <Modal title="导出节点" class-name="vertical-center-modal"  v-model="getShowExprotSelectNodes" width="850">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <div style="width: 282px; border:1px solid #ace;height: 35px;border-radius: 5px;margin-bottom: 20px">
      <FormItem label="文件名称" prop="name" >
        <Input type="text" v-model="formValidate.name" placeholder="请输入文件名称" id="cls-filename" @on-blur="errorInfo" />
      </FormItem>
      </div>
    </Form>
    <div style="width: 282px; border:1px solid #ace;height: 35px;border-radius: 5px;margin-bottom: 20px" class="freelabels">
      <span style="width: 80px; height: 35px; display: inline-block;line-height: 35px;text-align: center;border-right: 1px solid #ace">自定义标记</span>
      <RadioGroup v-model="formCode" @on-change="getFreeLabelType">
        <Radio v-for="(item,index) in this.freeLabel" :label="item.dicName" :key="index" @click.native="getCode(item.dicCode)"></Radio>
        <Radio label=无></Radio>
      </RadioGroup>
    </div>
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
      <div class="checkalls"  @click="selectAll">
        <span v-if="isCheckall" style="display: inline-block">
          <Icon type="md-checkmark" />
          </span>
      </div>
      <span  class="checktitle">全选</span>
      <!--<Checkbox  @click.native="selectAll">全选</Checkbox>-->
    </div>
    <div id="GroupContener">
      <table>
        <tr v-for="(item,key) in this.basepropertylabel":key=key height="95px" width="850px">
          <td class="left-title">{{item.title}}</td>
          <td class="right-info" style="border-bottom:1px solid #ace;height: 92px">
            <li class="cls-label" v-for="(item1,key1) in item.data" :key="key1">
              <a  @click="getLabelDicCode(item1.dicCode,$event)">{{item1.dicName}}<span class="cls-code">{{item1.num}}</span></a>
              <i class="iconfont " @click="cancelSelect($event,item1.dicCode)"></i>
            </li>
          </td>
        </tr>
      </table>
    </div>
    <div slot="close" @click="closeModal"><Icon type="ios-close"></Icon></div>
    <div slot="footer">
      <Button type="text" @click="cancelExportSelectNodes">取消</Button>
      <Button type="text" @click="exportNodesInfo(formValidate)">导出</Button>
    </div>
  </Modal>
  </div>
</template>
<script>

  import * as AllOperation from '../../pages/graph/js/allOperation'

  import store from  "../../vuex/store"
  import {URL} from "../../../api/urlsConfig";

  export default {
    name: "exportselectnodes",
    data() {
      return {
        formCode:"无",
        infoCode:"",
        checklabelcode:'',
        errorinfo:false,
        isAllSelect:false,
        isCheckall:false,
        freeLabel:"",
        basepropertylabel:[],
        currentFreeCode:"",
        labelLength:"",
        formValidate: {
          name: '',
        },
        arryCode:['00022'],
        labelcode:'',
        checknowdatas:'',
        checklabeldata:'',
        indeterminate: true,
        checkAll: false,
        checkAllGroup:['人口流动状态'],
        ruleValidate: {
          name: [
            { required: true, message: '文件名不能为空', trigger: 'blur' },
            {max:20,message:'文件名长度不能超过20个字节',trigger:'change'}
          ],
          }
        }
      },

    components: {},

    mounted() {

    },
    created(){
     // this.tacitlyChecked()
    },
    update(){

    },
    computed:{

      //弹窗显示
      getShowExprotSelectNodes: {
        get: function () {
          return this.$store.state.isExportSelectNodes
        },
        set: function () {
          this.$store.commit("ShowExprotSelectNodes");
        }
      }
    },
    methods: {
      getCode(codes){
        this.infoCode=codes;
      },
      //自定义标记获取
      getFreeLabelType(){
        console.log( this.formCode)
      this.formCode;
      },
      //全选
      selectAll(){
       this.isCheckall=!this.isCheckall
        if(this.isCheckall==true){
          this.isAllSelect=false;
          $(".checkalls").addClass('checkallsCurrent')
        }else {
          this.isAllSelect=true;
          $(".checkalls").removeClass('checkallsCurrent')
        }
        if(this.isAllSelect==false){
          $(".right-info li").addClass("current");
          $(".right-info i").addClass("icon-chushaixuanxiang");
          this.arryCode= this.checklabelcode;
        }
        if(this.isAllSelect==true){
          $(".right-info li").removeClass("current");
          $(".right-info i").removeClass("icon-chushaixuanxiang");
          this.arryCode=['00022'];
        }
      },
      //取消选中
      cancelSelect(e,code){
        if(e.target.localName=='i'){
          this.arryCode=_.pull( this.arryCode, code);
          e.target.parentNode.classList.remove("current");
          e.target.classList.remove("icon-chushaixuanxiang");
          this.isCheckall=false;
          $(".checkalls").removeClass('checkallsCurrent')

        }
      },
      //文件名为空提示
      errorInfo(){
        $("#cls-filename").css({border:'',borderRadius:''});
      },
      //右上关闭按钮
      closeModal() {
        $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
        this.formValidate.name='';
        $(".right-info li").removeClass("current");
        $(".right-info i").removeClass("icon-chushaixuanxiang");
        this.isAllSelect=false;
        this.isCheckall=false;
        $(".checkalls").removeClass('checkallsCurrent')
        this.arryCode=["00022"];
      },

      //获取当前点击的标签的dicCode,添加选中
      getLabelDicCode(code,e){
        if(e.target.localName!="span"){
          e.target.parentNode.classList.add("current");
          e.target.nextElementSibling.classList.add("icon-chushaixuanxiang");
          this.arryCode.push(code);
          let ele=document.getElementsByClassName("current")
          if(ele.length==this.labelLength){
            this.isCheckall=true;
            $(".checkalls").addClass('checkallsCurrent')

          }
        }else {
          e.target.parentNode.classList.add("currenta");
        }

      },
     //导出节点信息
      exportNodesInfo(name){
        if(this.formValidate.name =='请输入文件名称'){
         $("#cls-filename .ivu-input").css({border:'1px solid red',borderRadius:'3px'});
        }else {
          this.$refs.formValidate.validate((valid) => {
            if(valid){
              this.getSelectNodesInfo();
              $(".right-info li").removeClass("current");
              $(".right-info i").removeClass("icon-chushaixuanxiang");
              this.arryCode=["00022"];
              $("#cls-filename .ivu-input").css({border:'',borderRadius:''});
              this.formValidate.name ='请输入文件名称';
               this.formCode='无';
              this.$store.commit("ShowExprotSelectNodes",false);
              $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
              this.isCheckall=false;
              $(".checkalls").removeClass('checkallsCurrent');
            }else {
              this.$Message.error()
            }
          })

        }
      },
      //获取被选中的节点信息
      getSelectNodesInfo(){
        let currentGraphModel = store.state.currentGraphModel;
        let cy = currentGraphModel.cy;
        let nodes =cy.nodes(":selected");
        //自定义标记集合
        let freeLabelCode=this.formCode;
        let infoCode=this.infoCode;
        if(freeLabelCode!="无"){
          this.currentFreeCode=infoCode;

        }else {
          this.currentFreeCode="";
        }
        //节点property集合
        var propertys=[];
        let propertydata=_.map(_.map(nodes, function(node){return node.data()}));
         for(let i=0;i<propertydata.length;i++){
           propertys.push(_.pick(propertydata[i],['type','name','labels']));
         }
        let property=JSON.stringify(propertys);
         console.log(property)
        //去重
        let labelcodes= new Set(this.arryCode);
        this.labelcode=Array.from(labelcodes);
        let labelcode=JSON.stringify(this.labelcode);
         let _this = this;
  let currentTimeCode=new Date().getTime()+"excel";
               this.$http.request({
                       method: 'post',
                       data:
               {
                   fileName: _this.formValidate.name,
                    dicCodeJson:labelcode,
                       property:property ,
                      freeLabel:_this.currentFreeCode,
                 type:this.infoCode,
                 currentTimeCode:currentTimeCode
               },
               url:URL.saveExcelSesion,
                       success: (data) => {
                   if(data.code === 200){
          window.location.href = URL.exportNodeLabel + `?currentTimeCode=${currentTimeCode}`;
        }
               },
               error: (data) => {
                   this.$Message.warning('请求数据失败！');
               }
               });

      },

      //获取默认所有标签
      getBaseAllLabel(){
        //每次加载前置为空
        this.basepropertylabel =[];
        //统计所有标签的数量
        let currentGraphModel = this.$store.state.currentGraphModel;
        let baselabels=this.$store.state.queryBaseDictionData;
        let alllabels = _.flatten([baselabels.flagLabel, baselabels.properLabel]);
        this.labelLength=alllabels.length;
        let labelTypes=baselabels.labelType;
        this.freeLabel=baselabels.freeLabel;
        _.each(alllabels, function (label) {
          if(!_.has(currentGraphModel.countByLabel,label.dicCode)){
            label.num='0';
          }else {
            _.each(currentGraphModel.countByLabel, function (value, key) {
              if(label.dicCode === key){
                label.num = value;
              }
            })
          }
        })
        let labelData=_.groupBy(alllabels,'parentId');
        //标签数据集合
        this.basepropertylabel.push(
          {title:'基本属性', data: labelData['021']},
          {title:'公共管理', data: labelData['022']},
          {title:'涉恐涉暴', data: labelData['023']}
        );
        //基础属性标签
        let baseproperty=_.map((labelData)['021'],'dicName');
        //公共标签
        let publicmanage=_.map((labelData)['022'],'dicName');
        //涉恐涉暴标签
        let terrorlist=_.map((labelData)['023'],'dicName');
        //基础属性code
        let basecode=_.map((labelData)['021'],'dicCode');
        //公共标签code
        let publiccode=_.map((labelData)['022'],'dicCode');
        //涉恐涉暴code
        let terrorcode=_.map((labelData)['023'],'dicCode');
        //选中标签Code集合
        this.checklabelcode=publiccode.concat(basecode,terrorcode);
        //选中标签集合
        this.checklabeldata=publicmanage.concat(baseproperty,terrorlist);
        //默认选中
        setTimeout(function () {
          let startli=$(".right-info li").eq(0);
          startli.addClass("current");
          startli.children().eq(1).addClass("icon-chushaixuanxiang");
        },100)

      },


      //弹窗显示/关闭
     cancelExportSelectNodes(){
       this.$store.commit("ShowExprotSelectNodes",false);
       $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
       $(".right-info li").removeClass("current");
       $(".right-info i").removeClass("icon-chushaixuanxiang");
       let startli=$(".right-info li").eq(0);
       startli.addClass("current");
       startli.children().eq(1).addClass("icon-chushaixuanxiang");
       this.arryCode=['00022'];
       this.isCheckall=false;
       this.formValidate.name ='';
       $(".checkalls").removeClass('checkallsCurrent')
     },
    }

  }
</script>

<style scoped lang="less">
 .checktitle{
   display: inline-block;
   position: relative;
   width: 25px;
   left:10px;
   top:0px;
 }
  .ivu-checkbox-inner{
    display: inline-block;
    width: 14px;
    height: 14px;
    position: relative;
    top: 0px;
    left: 0px;
    border: 1px solid #dcdee2;
    border-radius: 2px;
    transition: border-color .2s ease-in-out,background-color .2s ease-in-out,box-shadow .2s ease-in-out;
  }
  .checkalls{
    float: left;
    width: 18px;
    height: 18px;
    boder:1px solid #ace;
    background:#d0d8eb;
    border-radius: 2px;
  }
  .checkallsCurrent{
    float: left;
    width: 18px;
    height: 18px;
    boder:1px solid #ace;
    background: #2d8cf0;
    border-radius: 2px;
  }
  .checkalls .ivu-icon{
    font-size: 20px;
    font-weight: 700;
    color: white;

  }

  .cls-names{
   width: 200px;
   border-left: 1px solid #ace;
  }

  .currenta{
    color: #333333;
  }
  .current{
    width: auto;
    list-style: none;
    height: 24px;
    float: left;
    margin: 5px 5px;
    padding:0px 8px;
    position: relative;
    cursor: pointer;
    border:1px solid #284689;
    z-index: 9999;
    line-height: 24px;
    >a{
      color: #333333;
      margin:0px 5px;
      span{
        display: inline-block;
        width: auto;
        height: 15px;
        padding: 0px 5px;
        border-radius: 3px;
        line-height: 15px;
        background: #FFE0B2;
        text-align: center;
        color: #333;
        margin-right: 5px;
      }
    }
    >i{
      background: none;
      color: #284689;
      font-size: 14px;
      font-weight: 700;
      position: absolute;
      right: 4px;
      top: 0px;
    }
  }
  .cls-label{
    line-height: 24px;
    z-index: 9999;
    width: auto;
    list-style: none;
    height: 24px;
    float: left;
    margin: 5px 5px;
    padding:0px 8px;
    position: relative;
    cursor: pointer;
    >a{
      color: #333333;
      /*margin-right: 3px;*/
      margin:0px 5px;
      span{
        display: inline-block;
        width: auto;
        height: 15px;
        padding: 0px 5px;
        border-radius: 3px;
        line-height: 15px;
        background: #FFE0B2;
        text-align: center;
        color: #333;
        margin-right: 5px;
      }
    }
    >i{
      background: none;
      color: #284689;
      font-size: 14px;
      font-weight: 700;
      position: absolute;
      right: 4px;
      top: 0px;
    }
  }
#GroupContener{
  width: 100%;
  display: flex;
  align-items: center;
  .baseGroup{
    width: 100px;
    background: powderblue;
    text-align: center;
    margin-right: 10px;
  }
  .filterTable{
  display: table;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: grey;
  }
}
#publicContener{
  width: 100%;
  display: flex;
  align-items: center;
 .publicGroup{
   height: 100%;
   width: 100px;
   background: powderblue;
   text-align: center;
   margin-right: 10px;
 }
}
.left-title{
  width: 100px;
  border-right:1px solid #ace;
  background: darkgray;
  text-align: center
}
.right-info{

}
</style>
<style>
  #cls-filename .ivu-input{
    width: 200px;
    border-radius:0px 3px 3px 0px;
    border-top: none;
    border-bottom: none;
    border-left: 1px solid #ace;
    border-right: 1px solid #ace;
    /*border-right: 1px solid #ace;  */
  }
</style>
