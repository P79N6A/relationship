<template>
  <div id="addSnapshot">
    <Modal title="添加快照" v-model="getAddSnapshotModalState" :styles="{top: '160px'}">
      <Form ref="snapshotForm" :label-width="110" :model="SnapshotName" :rules="ruleValidates">
        <FormItem label="快照名称：" prop="addSnapshotName">
          <Input v-model="SnapshotName.addSnapshotName" placeholder="请输入快照名称" @keyup.enter.native="addNewSnapshot" style="width:260px;" ></Input>
        </FormItem>
      </Form>
      <div slot="close" @click="closeModal"><Icon type="ios-close"></Icon></div>
      <div slot="footer">
        <Button type="text" @click="closeModal">取消</Button>
        <Button type="primary" @click="addNewSnapshot">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import * as snapshotManage from '../../pages/graph/js/snapshotManage'
  import {URL} from "../../../api/urlsConfig"

  export default {
    name: "add-snapshot",
    data() {
      const snapshotdatePass=(rule,value,callback)=>{
        if(value.length>20){
          callback(new Error('快照名称长度不能超过20个字节'))
        }
        else if(value === ""){
          callback(new Error('快照名称不能为空'))
        }
        else {
          callback()
        }
      }
      return {
        SnapshotName:{
          addSnapshotName:'',
        },
        ruleValidates:{
          addSnapshotName:[
            {required:true,trigger:'change',validator:snapshotdatePass},
          ]
        }
      }

    },
    porps: {
      // isShowSnapshot: Boolean,
    },
    created() {

    },
    computed: {
      getAddSnapshotModalState: {
        get: function () {
          return this.$store.state.isAddSnapshotModal
        },
        set: function () {
          this.$store.commit("showAddSnapshotModal");
        }
      },


    },
    mounted() {
    },
    methods: {

      closeModal() {
        this.$refs.snapshotForm.resetFields();
        this.$store.commit("showAddSnapshotModal", false);
        this.SnapshotName.addSnapshotName='';
        $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
      },
      addNewSnapshot() {
      /*  snapshotManage.createSnapshot(this.addSnapshotName);
        this.$store.commit("showAddSnapshotModal", false)
        $('#toolbar span').css({backgroundColor:'',boxShadow: ''})*/
    /*    let snapshotName = this.addSnapshotName;*/
        let currentGraphModel = this.$store.state.currentGraphModel;
        $('#createSnapshotSpan').css("pointer-events", "none");
        if(_.isEmpty(currentGraphModel.data)){
          this.$Message.warning('不能保存快照！');
          $('#createSnapshotSpan').css("pointer-events", "auto");
        }

        let snapshot = snapshotManage.createSnapshot(this.SnapshotName.addSnapshotName, currentGraphModel);
        this.$refs.snapshotForm.validate((valid) => {
          if(valid){
            //保存json留下有用字段
            this.$http.request({
              method: 'post',
              url:URL.saveSnapshot,
              data:snapshot ,
              success: (data) => {
                if(data.code === 200){
                  currentGraphModel.rid = data.data;
                  this.$store.commit('setCurrentGraphModel', currentGraphModel);
                  this.$Message.success('保存成功！');
                  this.$store.commit("showAddSnapshotModal", false);
                  this.SnapshotName.addSnapshotName='';
                  this.$emit("refreshSnapshotList");
                  $('#toolbar span').css({backgroundColor:'',boxShadow: ''});
                  $('#createSnapshotSpan').css("pointer-events", "auto");
                }else {
                  this.$Message.success('保存快照失败！');
                  $('#createSnapshotSpan').css("pointer-events", "auto");
                }
              },
              error: (data) => {
                this.$Message.warning('保存快照失败！');
                $('#toolbar span').css({backgroundColor:'',boxShadow: ''})
                $('#createSnapshotSpan').css("pointer-events", "auto");
              }
            });
          }
        })
      }

    },
  }
</script>

<style scoped>

</style>
