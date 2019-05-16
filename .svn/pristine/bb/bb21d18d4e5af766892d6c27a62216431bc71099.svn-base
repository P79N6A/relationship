<template>
    <div id="setcasename">
      <Modal id="casename" v-model="getCaseModal"  title="编辑任务名称" :styles="{top: '160px',width:'630px'}" >
        <Form ref="createcasename" :label-width="83" :model="tasknames" :rules="ruleValidates">
          <FormItem label="任务名称：" prop="newTaskName">
            <Input v-model="tasknames.newTaskName" placeholder="请输入任务名称" @keyup.enter.native="upCaseName" style="width:450px;"></Input>
          </FormItem>
        </Form>
        <div slot="close" @click="closeCaseNameModal"><Icon type="ios-close"></Icon></div>
        <div slot="footer">
          <Button type="text" @click="CloseModel">取消</Button>
          <Button type="primary" @click="upCaseName">确定</Button>
        </div>
      </Modal>
    </div>
</template>
<script>
    export default {
        name: "setcasename",
        data() {
          const tasknamePass=(rule,value,callback)=>{
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
              caseNameModal:false,
              oldtaskid:'',
              caseID:'',
              tasknames:{
                newTaskName:'',
              },
              ruleValidates:{
                newTaskName:[
                  {required:true,trigger:'change',validator:tasknamePass},
                ]
              }
            }
        },
        components: {},
        created() {
        },
      computed:{
        //弹窗状态标识计算
        getCaseModal: {
          get: function () {
            return this.$store.state.caseNameModal
          },
          set: function () {
            this.$store.commit("caseNameModal");
          }
        },
      },
        mounted() {
        },
        methods: {
          //模态框开启
          openCaseNameModel(data){
            this.$store.commit("caseNameModal", true);
            this.tasknames.newTaskName=data.taskName;
            this.oldtaskid=data.taskId;
            this.caseID=data.caseId;
          },
          //右上角关闭
          closeCaseNameModal(){
            this.tasknames.newTaskName = '';
            this.$store.commit("caseNameModal", false);
          },
          //取消
          CloseModel(){
            this.tasknames.newTaskName = '';
            this.$store.commit("caseNameModal", false);
          },
          upCaseName(){
            this.$refs.createcasename.validate((valid) => {
              if(valid){
                this.$emit('changeTaskname',this.tasknames.newTaskName,this.oldtaskid,this.caseID)

              }
            })

          },
        },

    }
</script>

<style scoped>

</style>
