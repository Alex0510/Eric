var anye = JSON.parse($response.body);
const Eric = /users\/shadow/;
const Eric1 = /users\/.*\/basi/;
const Eric2 = /users\/.*is_living=.*/;
const Eric3 = /users\?extra_info=.*/;

if (Eric.test($request.url) && anye.data && anye.data.length > 0) {
    // 地图显示头像和影子功能
    anye.data[0].is_open_shadow = 1;
    anye.data[0].has_right = 1;
}
if (Eric1.test($request.url) && anye.data && anye.data.length > 0) {
    // 聊天界面查看会员隐藏的距离
    anye.data[0].is_hide_distance = 0;
}
if (Eric3.test($request.url) && anye.data && anye.data.length > 0) {
    // 地图找人试用到期
    anye.data[0].code = 200;
}
if (Eric2.test($request.url)) {
    // 查看最后登录时间而不是最后运行时间仅供参考不准
    let body = JSON.stringify(anye);
    body = body.replace(/"is_hide_last_operate":\d/, '"is_hide_last_operate":0').replace(/"last_login"/, '"last_operate"');
    $done({ body });
} else {
    $done({ body: JSON.stringify(anye) });
}