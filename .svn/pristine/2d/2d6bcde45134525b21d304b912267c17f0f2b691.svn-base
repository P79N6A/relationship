<template>
<div id="setcasetree">
 <Modal id="caseTreeSet" v-model="treeModal"  title="案件设置" width="350" >
  <li class="cls-row">
    <span>一级：</span>
    <Select v-model="formcodes" clearable @on-change="getTypeRow1">
      <Option  :value="item.typeCode" v-for="(item,key) in typeList" :key="key" @click.native="getOptionstypes(item.typeCode)">{{item.typeName}}</Option>
    </Select>
  </li>
  <li class="cls-row" style="margin:15px 0px">
    <span>二级：</span>
    <Select v-model="formcodes2" :disabled="row2" clearable @on-change="getTypeRow2">
      <Option  :value="item.typeCode" v-for="(item,key) in typeList2" :key="key"@click.native="getOptionstypes2(item.typeCode)" >{{item.typeName}}</Option>
    </Select>
  </li>
  <li class="cls-row">
    <span>三级：</span>
    <Select v-model="formcodes3":disabled="row3" clearable @on-change="getTypeRow3">
      <Option  :value="item.typeName" v-for="(item,key) in typeList3" :key="key" @click.native="getOptionstypes3(item.typeCode)">{{item.typeName}}</Option>
    </Select>
  </li>
  <div slot="close" @click="closeTreeModal"><Icon type="ios-close"></Icon></div>
  <div slot="footer">
    <Button type="text" @click="cancelTreeModal">取消</Button>
    <Button type="primary" @click="upCaseTree">确定</Button>
  </div>
 </Modal>
</div>
</template>
<script>
  import {URL} from "../../../api/urlsConfig"
  export default {
    name: "setcasetree",
    data() {
      return {
        treeModal:false,
        typeArray:[],
        typeList :[
          {
            "typeName":'状态',
            "typeCode":'状态'
          },
          {
            "typeName":'部门',
            "typeCode":'部门'
          },
          {
            "typeName":'类型',
            "typeCode":'类型'

          },
        ],
        typeList2:'',
        typeList3:'',
        formcodes:'',
        formcodes2:'',
        formcodes3:'',
        rowType1:'',
        rowType2:'',
        rowType3:'',
        row2:true,
        row3:true,
        newList:'',
      }
    },
    components: {},
    created() {
      this.getTypeRow1
    },
    mounted() {

    },
    methods: {
      //案件树设置等级获取(1级)
      getOptionstypes(code){
        this.formcodes2='';
        this.formcodes3='';
      },
      //案件树设置等级获取(2级)
      getOptionstypes2(code){

      },
      //案件树设置等级获取(3级)
      getOptionstypes3(code){

      },
      //获取一级等级选项
      getTypeRow1(){
        if(this.formcodes!=''&& this.formcodes!=undefined){
          this.row2=false;
          if(this.formcodes=='状态'){
            this.rowType1='status';
          }
          if(this.formcodes=='部门'){
            this.rowType1='dep';
          }
          if(this.formcodes=='类型'){
            this.rowType1='casetype';
          }
          this.typeList2=_.reject(this.typeList,{'typeName':this.formcodes});
        }else {
          this.row2=true;
          this.row3=true;
          this.formcodes2='';
          this.formcodes3='';
          this.newList=''
        }
        console.log(this.formcodes)
      },
      //获取二级等级选项
      getTypeRow2(){
        if(this.formcodes2!='' && this.formcodes2!=undefined){
          this.row3=false;
          if(this.formcodes2=='状态'){
            this.rowType2='status';
          }
          if(this.formcodes2=='部门'){
            this.rowType2='dep';
          }
          if(this.formcodes2=='类型'){
            this.rowType2='casetype';
          }
          this.typeList3=_.reject(this.typeList2,{'typeName':this.formcodes2});
        }else {
          this.row3=true;
        }
      },
      //获取三级级等级选项
      getTypeRow3(){
        if(this.formcodes3=='状态'){
          this.rowType3='status';
        }
        if(this.formcodes3=='部门'){
          this.rowType3='dep';
        }
        if(this.formcodes3=='类型'){
          this.rowType3='casetype';
        }
      },
      //案件设置左上角关闭
      closeTreeModal(){
        this.treeModal=false;
      },
      //案件设置
      treeSets(){
        this.treeModal=true;
        this.$http.request({
          method: 'get',
          url: URL.queryTreeDeepByUserId,
          params: {},
          success: (data) => {
            if (data.code === 200){
              this.typeArray=data.data
            }
          }
        });
      },
      //案件树设置提交
      upCaseTree(){
        let _this=this;
        let TypeList=[];
        if(this.rowType1!=''&& this.rowType2!='' && this.rowType3=='' ||this.rowType1!=''&& this.rowType2 =='' && this.rowType3==''||this.rowType1!=''&& this.rowType2!=''&& this.rowType3!=''){
          TypeList.push(this.rowType1,this.rowType2,this.rowType3)
        }
        let labelcodes= new Set(TypeList);
        let codes=Array.from(labelcodes);
        //去除空
        let newDataArr=codes.filter(function (item) {
          return  item && item.trim();
        })
        let newList=newDataArr.join(',')
        _this.newList={deepName:newList}
        this.$http.request({
          method: 'post',
          url: URL.queryTreeDeepByUserId,
          data:{},
          success: (data) => {
            if (data.code === 200){
              this.$emit('intCaseTree',_this.newList)
              this.treeModal=false;
            }
          }
        });
      },
      //取消
      cancelTreeModal(){
        this.treeModal=false;
      },

    },

  }
</script>

<style scoped>

</style>
<style>
  /*#setcasetree*/
</style>
