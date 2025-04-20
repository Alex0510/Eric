#!name=东方Pro获取节点
#!desc=Mr.Eric转载注明出处


[MITM]
hostname = %APPEND% 47.238.34.149

[Script]
东方Pro = type=http-response,pattern=http://47.238.34.149/v2/(user|node).php,requires-body=1,max-size=0,binary-body-mode=0,script-path=https://raw.githubusercontent.com/Alex0510/Eric/refs/heads/master/surge/Script/dfvpn.js,script-update-interval=0