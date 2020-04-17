/*
水印精灵VIP
https://api1.dobenge.cn/api/user/getuserinfo
*/


var obj = JSON.parse($response.body);

obj = {
  "status": 200,
  "msg": "获取成功",
  "data": {
    "nick_name": "我是你爸爸",
    "gender": 0,
    "mobile": "",
    "is_vip": 1,
    "vip_end_time": "2099-12-15 12:15:12",
    "user_id": 888888,
    "head_img": "https://img2.woyaogexing.com/2017/12/28/2faa32ef81d9d6dc!400x400_big.jpg"
  }
}
$done({body: JSON.stringify(obj)});
