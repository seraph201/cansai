function random(){

  var year=new Date().getFullYear()
  var mouth=new Date().getMonth()+1
  var day=new Date().getDate()
  var seconds=new Date().getSeconds()
   
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 20;
  var randomstring = '';
for (var i=0; i<string_length; i++) {
var rnum = Math.floor(Math.random() * chars.length);
randomstring += chars.substring(rnum,rnum+1);
}
 
  return year.toString()+mouth.toString()+day.toString()+seconds.toString()+randomstring
}
 
module.exports = random()