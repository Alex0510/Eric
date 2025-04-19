/*
排班日历解锁vip等级
[mitm]
hostname = %APPEND% schedule-api.julanling.com
[script]
排班日历 = type=http-response,pattern=(http|s)://schedule-api.julanling.com/api/,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Alex0510/Eric/refs/heads/master/surge/Script/axworkschedule.js
*/
body = $response.body.replace(/\"grade\":\d/, "\"grade\":3")
$done({body});