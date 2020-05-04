/*
卧龙影视去广告
http://(w001.tgmmvip.com|api.wolong.tv)/wolong/ad/(splash|banner)
*/

let obj = JSON.parse($response.body);
delete obj.data
$done({body: JSON.stringify(obj)});
