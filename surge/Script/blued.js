var anye = JSON.parse($response.body);
const Eric = /users\/shadow/;
const Eric1 = /users\/.*\/basi/;
const Eric2 = /users\/.*is_living=false\&from=online.*/;

if (Eric.test($request.url) && anye.data && anye.data.length > 0) {
    // 地图显示头像和影子功能
    anye.data[0].is_open_shadow = 1;
    anye.data[0].has_right = 1;
}
if (Eric1.test($request.url) && anye.data && anye.data.length > 0) {
    // 聊天界面查看会员隐藏的距离
    anye.data[0].is_hide_distance = 0;
}
if (Eric2.test($request.url)) {
    // 查看最后登录时间而不是最后运行时间仅供参考
    let body = JSON.stringify(anye);

    // 使用正则表达式替换第一个 "last_login" 为 "last_operate"
    body = body.replace(/"is_hide_last_operate":\d/, '"is_hide_last_operate":0').replace(/"last_login"/, '"last_operate"');

    anye = JSON.parse(body);
}

$done({ body: JSON.stringify(anye) });