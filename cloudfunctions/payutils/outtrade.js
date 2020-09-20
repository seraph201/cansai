function random(){
  
   let s=Date.parse(new Date()).toString()
   let s1=Math.random().toString().substr(3,7)
  
  return s+s1
}

module.exports = random()