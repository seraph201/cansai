const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  const tasks = []
  let lat1=event.lat;lng1=event.lng; 
  /*计算集合总数，计算需分几次取**/
  const countResult = await db.collection('nearcommunity').count()
  const total = countResult.total 
  const batchTimes = Math.ceil(total / 100)  
  for (let i = 0; i < batchTimes; i++) {
    const promise = await db.collection('nearcommunity').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    for (let j = 0; j < promise.data.length; j++) {          
      let distance= await getFlatternDistance(lat1,lng1,promise.data[i].latitude,promise.data[i].longitude)
     
      if(distance<2000){ tasks.push(promise.data[i])}
    }
   
  }
  return (await Promise.all(tasks))
}


function getFlatternDistance(lat1,lng1,lat2,lng2){
  var radLat1 = (lat1)* Math.PI / 180.0;
  var radLat2 = (lat2)* Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1)* Math.PI / 180.0 - (lng2)* Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  // EARTH_RADIUS;
  return s = Math.round(s * 10000) / 10000;
}

