var anye = JSON.parse($response.body);
const Eric = /^https:\/\/.*\/users\/shadow/;
const Eric1 = /^https:\/\/.*\/users\/.*\/basi/;

if (Eric.test($request.url) && anye.data && anye.data.length > 0) {
    // 地图显示头像和影子功能
    anye.data[0].is_open_shadow = 1;
    anye.data[0].has_right = 1;
}
if (Eric1.test($request.url) && anye.data && anye.data.length > 0) {
    // 聊天界面查看会员隐藏的距离
    anye.data[0].is_hide_distance = 0;
}
$done({ body: JSON.stringify(anye) });