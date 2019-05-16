export function formatDate(date) {
  var y = date.getFullYear(),
    m = date.getMonth()+1,
    d = date.getDate(),
    h = date.getHours(),
    mm = date.getMinutes(),
    s = date.getSeconds();
  return y+'-'+timeFormatter(m)+'-'+timeFormatter(d)+' '+timeFormatter(h)+':'+timeFormatter(mm)+':'+timeFormatter(s);
}

function timeFormatter(m){
  return m < 10? '0'+m:m;
}
