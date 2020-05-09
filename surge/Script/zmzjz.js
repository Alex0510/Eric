/*
自行在规则[General]添加
force-http-engine-hosts = *.camera360.com:443
最美证件照
https://idphoto-api.camera360.com/settings
hostname=idphoto-api.camera360.com
*/


let obj = JSON.parse($response.body);
obj.iap.is_iap = true,
obj.iap.expired_at = 4444444444
$done({body: JSON.stringify(obj)});
