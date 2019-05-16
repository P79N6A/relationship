<template>
  <div id="addTask">
    <Modal title="新建任务" v-model="getAddTaskModalState" :styles="{top: '160px',width:'630px'}">
      <Form ref="createTaskForm" :label-width="110" :model="taskName" :rules="ruleValidates">
        <FormItem label="任务名称：" prop="addTaskName">
          <Input v-model="taskName.addTaskName" placeholder="请输入任务名称" style="width:487px;" @keyup.enter.native="addChildrenTask"></Input>
        </FormItem>
        <!--<FormItem label="案件类型：">-->
          <!--<Select v-model="formSend" @on-change="getNewNumType">-->
            <!--<Option  :value="item.dicCode" v-for="(item,key) in this.tasklist" :key="key">{{item.dicName}}</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
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

  export default {
    name: "add-task",
    data() {
      const taskdatePass=(rule,value,callback)=>{
        if(value.length>20){
          callback(new Error('任务名称长度不能超过20个字节'))
        }if(value.length==0){
          callback(new Error('任务名称不能为空'))
        }
        else {
          callback()
        }
      }
      return {
        taskName:{
          addTaskName: '',
        },
        ruleValidates:{
          addTaskName:[
            {required:true,trigger:'change',validator:taskdatePass},
          ]
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
      getAddTaskModalState: {
        get: function () {

          return this.$store.state.isAddTaskModal
        },
        set: function () {
          this.$store.commit("showAddTaskModal");
        }
      },
    },

    mounted() {
    },
    methods: {
      //左上角关闭
      closeModel(){
        this.$store.commit("showAddTaskModal", false);
        //对整个表单进行重置，将所有字段值重置为空并移除校验结果
        this.$refs.createTaskForm.resetFields();
        this.taskName.addTaskName = '';
      },
      addChildrenTask() {
        this.$refs.createTaskForm.validate((valid) => {
           if(valid){
             this.$emit('addNewTask', this.taskName.addTaskName);
             this.taskName.addTaskName = '';
           }
        })

      }
    },
  }
</script>

<style scoped>

</style>
