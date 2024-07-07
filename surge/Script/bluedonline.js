// 假设 $response 是你从某个请求中获取的响应对象
let body = $response.body;

// 使用正则表达式替换第一个 "last_login" 为 "last_operate"
body = body.replace(/"is_hide_last_operate":\d/, '"is_hide_last_operate":0').replace(/"last_login"/, '"last_operate"');

// 完成修改并返回新的响应内容
$done({ body });