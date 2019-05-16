<template>
    <div id="product-introduction">
      <modal v-model="productModal" title="关于产品" width="800" id="product-introModal">
            <div>
              <Timeline>
                <TimelineItem>
                  <p class="time">产品介绍</p>
                  <p class="content">
                    <p>1.点的大小反应来联系人的多少，线的粗细反应两个人的紧密度，边的颜色，相同颜色为同一社团。</p>
                    <p>2.点的高亮代表已选中的点，多代表具有不同的关系，悬浮代表边的属性。</p>
                    <p>3.点的标签（悬浮）展示节点标签的内容。</p>
                    <p>4.两点间的距离：团体间远近无意义。</p>
                    <p>5.五边形表示输入点，圆形表示输出点。</p>
                    <p>6.根据团体的大小，从大到小排列，最多展示12种团体，超过12种团体的其他团体统一用一种颜色表示。</p>
                    <p>7.核心指标：不区分输入输出的前提下，值越高，表示内部联系越紧密。联络指标：区分输入输出的前提下，值越高，与输入号码的关系就越紧密。</p>
                  </p>
                </TimelineItem>
                <TimelineItem>
                  <p class="time">版本</p>
                  <p class="content">发布1.0版本</p>
                </TimelineItem>
                <TimelineItem>
                  <p class="time">主要功能</p>
                  <p class="content">
                    <div class="headTitle">个体分析</div>

                    <div class="mainTitle">单人关系</div>
                    <p>1.展现单个号码的一度关系人，以及一度直接联系人相互间的关系信息。并发现组织中不同人的重要程度，并以可视化的方式呈现社交网络。</p>

                    <div class="headTitle">群体分析</div>

                    <div class="mainTitle">社团扩展</div>
                    <p>1.对已知某社团中部分成员进行研判，深度挖掘发现这些号码在指定的分析时段内共同所在的同一社团中的其他成员。</p>
                    <div class="mainTitle">群组分析</div>
                    <p>2. 对大量目标中潜藏的不同群体组织进行挖掘发现，区分人群中不同属性的群体。对给定号码在指定的分析时段中存在的组织进行挖掘，发现各组织   内其他成员和组织中的重要节点。</p>

                    <div class="mainTitle">关联发现</div>
                    <p>3.给定两个不直接相关的号码发现其可能的关联路径，推荐共同好友数最多的最短路径，并发现整体的社交网络结构.</p>

                    <div class="mainTitle">关系呈现</div>
                    <p>4. 简单呈现输入号码群体间的直接联系和一度联系好友。其模型不具有关系挖掘功能。  旨在观察号码间的基础社交网络结构（查看哪些节点影响力  广，查看号码间的联系情况等）。</p>
                  </p>
                </TimelineItem>
              </Timeline>
            </div>
            <div slot="footer">

            </div>
      </modal>
    </div>
</template>

<script>
    export default {
      name: "product-introduction",
      data(){
          return{

          }
      },
      computed:{
        productModal:{
          get:function(){
            return this.$store.state.isProductModal
          },
          set:function(data){
            this.$store.commit("showProductModal",data);
          }
        },

      },
      methods:{

      },
      created(){

      },
      mounted(){

      }
    }
</script>

<style scoped>
  .mainTitle{
    color: #FF6699;
    height: 20px;
    line-height: 20px;
   /* margin-left: 10px;*/
  }
  .headTitle{
    color: #DB7172;
    font-size: 15px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 5px;
    /*margin-left: 5px;*/
  }
</style>
