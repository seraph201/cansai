function noncestr(){
  var result = ''
  const wordList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2',
  '3', '4', '5', '6', '7', '8', '9', '0']
  for(let i=0;i<31;i++){
    result += wordList[Math.round(Math.random()*8)]
  }
  return result
}

module.exports = noncestr()