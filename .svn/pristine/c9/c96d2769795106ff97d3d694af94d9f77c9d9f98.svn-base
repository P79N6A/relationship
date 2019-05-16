import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Index from '@/pages/index/Index'
import axios from '@/utils/axios'
import store from  "@/vuex/store"
import mutations from  "@/vuex/mutations"
import {Message} from 'iview'
import * as urlApi from "@/../api/urlsConfig"

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children:[
        {
          path: '/',
          name: 'index',
          component:Index
        },
      ]
    }
  ]
})
//权限控制
router.beforeEach((to,from,next) => {
  let jurisdiction = {
    resendTask:false,
    manage:false,
    deletable:false,
    addable:false,
    exportable:false
  }
  if(to.path == "/"){
    axios.request({
      method: 'get',
      params:"",
      url: urlApi.URL.getPermissionsResource,
      success: (data) => {
        if (data.code === 200) {
          data.data.forEach(v => {
            if(v == "100106"){//任务重发
              jurisdiction.resendTask = true;
            }
            else if(v == "100111"){//权限管理
              jurisdiction.manage = true;
            }
            else if(v == "100101"){//任务删除，快照删除，分析模型删除
              jurisdiction.deletable = true;
            }
            else if(v == "100100"){//新增节点，新增任务，修改任务名称,新增模型，保存快照
              jurisdiction.addable = true;
            }
            else if(v == "100109"){//所有的导出和图片下载
              jurisdiction.exportable = true;
            }
          })
          store.commit("jurisdiction",jurisdiction);
          next();
        } else {
          console.log("权限控制接口请求异常");
          store.commit("jurisdiction",jurisdiction);
          next();
        }
      },
      error: (data) => {
        console.log("权限控制接口请求失败")
        store.commit("jurisdiction",jurisdiction);
        next();
      }
    })
  }
})


export default router;
