

//定义一些常量
var piObj={
    x_PI:3.14159265358979324*3000.0/180.0,
    PIs:3.1415926535897932384626,
    a:6378245.0,
    ee:0.00669342162296594323
  };
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function DbToGc(lat,lng){
  var x = lng - 0.0065;
  var y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * piObj.x_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * piObj.x_PI);
  return {lat:z * Math.sin(theta),lng:z * Math.cos(theta)}
}
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcToDb(lat,lng){
  var z=Math.sqrt(lng*lng+lat*lat)+0.00002*Math.sin(lat*piObj.x_PI);
  var theta=Math.atan2(lat,lng)+0.000003*Math.cos(lng*piObj.x_PI);
  return {lat:z*Math.sin(theta)+0.006,lng:z*Math.cos(theta)+0.0065}
}
function getDistance(lat1,lng1,lat2,lng2){
  lat1=lat1||0;
  lng1=lng1||0;
  lat2=lat2||0;
  lng2=lng2||0;
  var rad1=lat1*Math.PI/180.0;
  var rad2=lat2*Math.PI/180.0;
  var a=rad1-rad2;
  var b=lng1*Math.PI/180.0-lng2*Math.PI/180.0;
  var r=6378137;
  return (r*2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(rad1)*Math.cos(rad2)*Math.pow(Math.sin(b/2),2)))/1000).toFixed(2)
}
function geocoder(map,f){
  uni.request({
    url:'http://apis.map.qq.com/ws/geocoder/v1',
    data:{
      location:map.lat+','+map.lng,
      key:'3GYBZ-TU3Y4-RYWUN-DWINO-V7OA2-ICFM4',
      get_poi:1
    },
    method:'get', 
    success(r){
      if(r.statusCode==200&&r.data.status==0&&r.data.result) f(r.data)
    }
  })
}
module.exports={
  DbToGc:DbToGc,
  gcToDb:gcToDb,
  getDistance:getDistance,
  geocoder:geocoder
}