const PASSWORD = "Eric1069";

const queryString = $request.url.split('?')[1];
const params = new URLSearchParams(queryString);
const userPassword = params.get('password');

if (userPassword !== PASSWORD) {
  $done({ response: { status: 403, body: "Forbidden: Incorrect Password" } });
  return;
}
// 获取响应体
let body = $response.body;
let anye = JSON.parse(body);

const Eric = /users\/shadow/;
const Eric1 = /users\/.*\/basic/;
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
    anye.data[0].is_hide_last_operate = 0;
}
if (Eric3.test($request.url) && anye.data && anye.data.length > 0) {
    // 地图找人试用到期
    anye.data[0].code = 200;
}
if (Eric2.test($request.url)) {
   
    // 查看隐藏头像
    anye.data.forEach(user => {
        user.avatar = user.latest_avatar;
    });
    // 查看最后登录时间而不是最后运行时间仅供参考不准
    let modifiedBody = JSON.stringify(anye);
    modifiedBody = modifiedBody.replace(/"is_hide_last_operate":\d/, '"is_hide_last_operate":0').replace(/"last_login"/, '"last_operate"');
    $done({ body: modifiedBody });
} else {
    $done({ body: JSON.stringify(anye) });
}