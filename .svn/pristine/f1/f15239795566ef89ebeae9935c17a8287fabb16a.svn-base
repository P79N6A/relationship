<template>
  <div class="menuModel" v-show="getSliderModel">
    <li>
      <span class="sliderTitle">节点指标：</span>
      <Slider v-model="nodequota" :step="1" :max="10" :min="0" @on-change="handlenodes"></Slider>
    </li>
    <li>
      <span class="sliderTitle">标签指标：</span>
      <Slider v-model="labelquota" @on-change="handlelabels":step="1" :max="10" :min="0"></Slider>
    </li>
    <li v-if="getShowMoreSlider">
      <span class="sliderTitle">核心指标：</span>
      <Slider v-model="minquota" :tip-format="handlemins" :max=maxkshell :min=minkshell :step="coreStep"></Slider>
    </li>
    <li v-if="getShowMoreSlider">
      <span class="sliderTitle">联络指标：</span>
      <Slider v-model="connectquota" :tip-format="handleconnect":step="0.1" :max="1" :min="0"></Slider>
    </li>
  </div>
</template>

<script>
  import store from  "../../vuex/store"
    export default {
        name: "graphicalquota",
        data() {
            return {
              maxkshell:0,
              minkshell:5,
              nodequota: 5,
              labelquota: 0,
              connectquota:0,
              minquota:0,
              coreStep:0.1,
            }
        },
        components: {},
        created() {
        },
        update(){

        },
      watch:{

      },
        computed:{
          //滑块弹窗
          getSliderModel: {
            get: function () {
              if(this.$store.state.isshowsliderModel==false){
                this.nodequota= 5;
                this.labelquota= 0;
                store.commit("Sliderlvl",this.labelquota);
                this.connectquota=0;
              }
              return this.$store.state.isshowsliderModel;
            },
            set: function () {
              this.$store.commit("showSliderModel");
            }

          },

          //核心，联络指标显示
          getShowMoreSlider: {
            get: function () {
              return this.$store.state.isshowMoreSlider
            },
            set: function () {
              this.$store.commit("showMoreSlider");
            }
          },
        },
       watch:{

      },
        mounted() {
          this.watchData();
        },
        methods: {
          //监听开启右侧标签点击
          watchLabel(){
            this.labelquota=10;
            store.commit("Sliderlvl",this.labelquota);
          },
          //监听核心指标
          watchData(){
            this.$store.watch(() =>{
              return this.$store.state.resultJsons;
            },() => {
              if(this.$store.state.isshowMoreSlider==true){
                let data=this.$store.state.resultJsons
                let max=data.maxKshell;
                let min=data.minKshell;
                // this.maxkshell=parseInt(max);
                // this.minkshell=parseInt(min);
                this.minkshell=0;
                this.maxkshell=parseInt(max)- parseInt(min) + 1;
                this.coreStep = (parseInt(max)- parseInt(min) + 1)/10;

              }
              if(this.$store.state.isshowsliderModel){}
            })

          },
          //初始化各个指标
          setSliderLvL(){
                this.nodequota=5;
                this.labelquota=0;
                this.minquota=0;
                this.connectquota=0;
          },
          //节点指标
          handlenodes(){
            let currentGraphModel = store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            let _this = this;
            let zoom = _this.$store.state.currentZoom;

            if (this.nodequota === 5) {
              cy.style()
                .selector(cy.nodes())
                .style("width", function (e) {
                  return e.data('width1')
                })
                .style("height", function (e) {
                  return e.data('height1')
                })
                .style("font-size", 5);
              cy.style()
                .selector(cy.edges())
                .style("width", function (e) {
                  return e.data('edgewidth')
                })
                .update()
            } else {
              cy.style()
                .selector(cy.nodes())
                .style("width", function (e) {
                  return e.data('width1') * _this.nodequota / 5 * 1.8
                })
                .style("height", function (e) {
                  return e.data('height1') * _this.nodequota / 5 * 1.8
                })
                .style("font-size", function (e) {
                  let fontSize = _.replace(e.style('font-size'), 'px', '');
                  let setFontSize = fontSize * _this.nodequota / 5 * 1.01;
                  setFontSize = setFontSize > 32 || setFontSize < 5 ? fontSize : setFontSize;
                  return setFontSize + 'px'
                });
              cy.style()
                .selector(cy.edges())
                .style("width", function (e) {
                  return e.data('edgewidth') * _this.nodequota / 5 * 1.8
                })
                .update()
            }
            cy.nodes().noOverlap({padding: _this.nodequota * 2});

            //preset
            if (cy._private.layoutName === 'preset') {
              cy.zoom(this.$store.state.currentZoom);
            }
            cy.center();
            return '当前指标' + this.nodequota;
          },
          //标签指标
          handlelabels(){
            this.$store.commit("Sliderlvl",this.labelquota);
            // store.state.Sliderlvl=this.labelquota;
            return '当前指标'+ this.labelquota;
          },
          //核心指标
          handlemins(val){
            let currentGraphModel = store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            let _this =this;
            if(cy!=undefined){
              cy.nodes().forEach(function (ele,i,eles) {
                if(ele.data().kshell>=val && ele.data().ratios >= _this.connectquota)
                {
                  ele.show();
                  _this.setLabelCss(ele,'show');
                  // if(val!=_this.maxkshell&&val!= _this.minkshell){
                  //   _this.setEdgeLabel(ele,'show');
                  // }

                }else {
                  ele.hide();
                  _this.setLabelCss(ele,'hide');
                  // if(val!=_this.maxkshell&&val!= _this.minkshell){
                  //   _this.setEdgeLabel(ele,'hide');
                  // }

                }
              })
            }

            return '当前指标'+ val;
          },
          //联络指标
          handleconnect(val){
            let currentGraphModel = store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            let _this =this;
            if(cy!=undefined){
              cy.nodes().forEach(function (ele,i,eles) {
                if(ele.data().ratios>=val && ele.data().kshell >= _this.minquota)
                {
                  ele.show();
                  _this.setLabelCss(ele,'show');
                  // _this.setEdgeLabel(ele,'show')
                }else {
                  ele.hide();
                  _this.setLabelCss(ele,'hide');
                  // _this.setEdgeLabel(ele,'hide')
                }
              })
            }
            return '当前指标'+ val;
          },
          //边上的标签隐藏
          setEdgeLabel(ele,type){
            let currentGraphModel = store.state.currentGraphModel;
            let cy = currentGraphModel.cy;
            let _this =this
            if(type=='show'){
              cy.style()
                .selector(ele)
                .style('label','data(name)')
                .update();
            }else {
              cy.style()
                .selector(ele)
                .style('label','')
                .update();
            }
          },
          //自定义标记隐藏
          setLabelCss(ele,type){
            var name = ele.data().name;
            let el = document.getElementById(`${name}_label`);
            if (el) {
              if(type=='show'){
                el.parentNode.style.display = "block";
              }else{
                el.parentNode.style.display = "none";
              }
            }
          }
        },

    }
</script>

<style scoped lang="less">
  .menuModel{
    width: 200px;
    z-index: 999;
    position: absolute;
    padding-left: 10px;
    padding-right: 10px;
    bottom: 103px;
    left: 87px;
    transition: all .3s;
  >li{
    list-style: none;
    display: flex;
    transition: all .3s;
  >.ivu-slider{
    width: 100%;
  }
  }
  }
  .sliderTitle{
    display: inline-block;
    font-size: 12px;
    width: 94px;
    margin-top: 10px;
  }
  .ivu-slider-bar{
    background: none;
  }
</style>
