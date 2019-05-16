<template>
  <div id="RightaddTask">
    <Modal title="新建任务" v-model="getRightTaskModalState" :styles="{top: '160px',width:'630px'}">
      <Form ref="rightTaskForm" :label-width="110" :model="rightTaskName" :rules="ruleValidates">
        <FormItem label="任务名称：" prop="TaskName">
          <Input v-model="rightTaskName.TaskName" placeholder="请输入任务名称" style="width:487px;"></Input>
        </FormItem>
        <FormItem label="案件名称：" prop="formSend">
          <Select v-model="rightTaskName.formSend" @on-change="getNewNumType">
            <Option  :value="item.value" v-for="(item,key) in this.Tasklists" :key="key">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="close" @click="closeModel"><Icon type="ios-close"></Icon></div>
      <div slot="footer">
        <Button type="text" @click="closeModel">取消</Button>
        <Button type="primary" @click="addChildrenTask">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import * as CanvasManage from '../../pages/graph/js/canvasManage'
  import {URL} from "../../../api/urlsConfig"
  export default {
    name: "rightaddtask",
    data() {
      const righttaskPass=(rule,value,callback)=>{
        if(value.length>20){
          callback(new Error('任务名称长度不能超过20个字节'))
        }
        if(value.length==0){
          callback(new Error('任务名称不能为空'))
        }
        else {
          callback()
        }
      }
      return {
        rightTaskName:{
          TaskName: '',
          formSend:'',
        },
        Tasklists:'',
        caseID:'',
        ruleValidates:{
          TaskName:[
            {required:true,trigger:'change',validator:righttaskPass},
          ],
          formSend: [
            { required: true, message: '请选择案件名称', trigger: 'change' }
          ],
        }
      }

    },
    props: {
    },
    created() {
    },
    mounted(){

    },
    computed: {
      getRightTaskModalState: {
        get: function () {

          return this.$store.state.isRightAddTaskModal
        },
        set: function () {
          this.$store.commit("showRightAddTaskModel");
        }
      },
    },

    mounted() {
      this.getQueryCaseData();
    },
    methods: {
      //获取添加的案件类型
      getNewNumType(){
        this.caseID = this.rightTaskName.formSend;
      },

      //取消添加
      closeModel() {
        this.$store.commit("showRightAddTaskModel", false);
        this.$refs.rightTaskForm.resetFields();
        this.rightTaskName.TaskName='';
      },
      //提交添加
      addChildrenTask() {
        this.$refs.rightTaskForm.validate((valid) => {
          if(valid){
            this.$emit('sendTaskInfo', this.rightTaskName.TaskName,this.caseID);
            this.rightTaskName.TaskName='';
          }
        })
      },
      //获取案件列表
      getQueryCaseData(){
        this.$http.request({
          method: 'post',
          url:URL.queryCaseData,
          params: {},
          success: (data) => {
            if (data.code === 200){
              this.Tasklists=data.data
            }
          }
        });
      },
    },
  }
</script>

<style scoped>

</style>
