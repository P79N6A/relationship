export function getUUID(tabName) {
  var str = [];
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  for (var i = 0; i < 36; i++) {
    str[i] = chars.substr(Math.floor(Math.random() * 16), 1)
  }
  str[0] = str[8] = str[13] = str[18] = str[23] = '-';
  return tabName + str.join("");
}
