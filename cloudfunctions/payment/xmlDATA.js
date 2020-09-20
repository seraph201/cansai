function xmlData(xml){
  let data = "<xml>"
  data += "<appid>"+xml.appid+"</appid>"
  data += "<mch_id>"+xml.mch_id+"</mch_id>"
  data += "<nonce_str>"+xml.nonce_str+"</nonce_str>"
  data += "<sign>"+xml.sign+"</sign>"
  data += "<body>"+xml.body+"</body>"
  data += "<out_trade_no>"+xml.out_trade_no+"</out_trade_no>"
  data += "<total_fee>"+xml.total_fee+"</total_fee>"
  data += "<spbill_create_ip>"+xml.spbill_create_ip+"</spbill_create_ip>"
  data += "<notify_url>"+xml.notify_url+"</notify_url>"
  data += "<trade_type>"+xml.trade_type+"</trade_type>"
  data += "<openid>"+xml.openid+"</openid>"
  data += "</xml>"
  return data
}

module.exports = xmlData