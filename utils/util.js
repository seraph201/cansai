function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var date = [year, month, day].map(formatNumber).join('-')
  var time = [hour, minute].map(formatNumber).join(':')
  var arr = [date, time]
  return arr
}
//判断头部是否为0，加0操作 
function formatNumber(n) {
  n = n.toString()//toString() 方法用于返回以一个字符串表示的 Number 对象值。
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}