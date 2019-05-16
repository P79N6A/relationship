import store from  "../../../vuex/store"
export function setSelectedStyle(e) {
  let _this = e;
  setTimeout(function () {
    let currentModel = _this.$store.state.currentGraphModel;
    let cy = currentModel.cy;
    let themeType = _this.$store.state.themeType;
    currentModel.cy.style()
      .selector('.neighborNodeColor')
      .css(
        {
          "background-color": "#A20808",
        }
      )
      .selector('.neighborEdgeColor')
      .css(
        {
          "line-color": "#A20808",
        }
      )
      .selector('.otherNodeColor')
      .css(
        {
          "background-color": "#cccccc",
        }
      )
      .selector('.otherEdgeColor')
      .css(
        {
          "line-color": "#cccccc",
        }
      )
      //线选中样式
      .selector("edge:selected")
      .css({
        'width': 4,
        'line-color':'#A20808'
      })

      .selector('.b-nodehightlight')
      .css(
        {
          "border-color": "#ccd5cf",
          "background-color": "#ccd5cf",
          "text-outline-color": "#ccd5cf",
        }
      )
      .selector('.b-edgehightlight')
      .css(
        {
          "line-color":"#ccd5cf"
        }
      )
      .selector('.a-nodehightlight')
      .css(
        {
          "border-color": "#302f32",
          "background-color": "#302f32",
          "text-outline-color": "#302f32",
        }
      )
      .selector('.a-edgehightlight')
      .css(
        {
          "line-color":"#302f32"
        }
      )
      //关联发现高亮推荐最短路径
      .selector("edge[?shortestFlag]")
      .css(
        {
          'width': 5,
          'opacity': 1,
          'line-color': themeType === 'a' ? '#b8c7b8' : '#101010'
        }
      )
      .selector(':selected')
      .css(
        {
          "border-width": "2px",
          "border-color": themeType === 'a' ? '#FFFFFF' : '#000000',
          "border-opacity": "1",
          "background-color": "#ff151a",
          "text-outline-color": "#ff151a",
          "box-shadow": '#98b1c6cc 1px 2px 2px 1px'
        }
      )
      .update();

    cy.nodes().filter(function (ele) {
      var gid = ele._private.data.gid;
      if(gid != undefined && gid != ""){
        var baseStr = getImageBaseStr(gid);
        cy.style()
          .selector(ele)
          // .style("background-color", 'transparent')
          .style("background-fit", 'cover cover')
          .style("background-image", 'url('+encodeURI(baseStr)+')')
          .update();
      }
    });

  },100)//延时大于点线渲染的延时
}
function getImageBaseStr(gid){
  var defaultNodeImgList = store.state.defaultNodeImgList;
  if(defaultNodeImgList.hasOwnProperty(gid)){
    return defaultNodeImgList[gid];
  }
}
