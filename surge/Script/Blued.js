// 获取请求的URL
let url = $request.url;

// 从 Surge 传递的参数中获取自定义经纬度值
let customLongitude = $arguments.customLongitude || "111.619512";
let customLatitude = $arguments.customLatitude || "40.815888";

// 打印日志以调试参数读取
console.log(`Custom Longitude: ${customLongitude}`);
console.log(`Custom Latitude: ${customLatitude}`);

// 使用正则表达式同时匹配并替换 longitude 和 latitude 的值
let rewrittenURL = url.replace(/(latitude|lat|longitude|lot)=\d+\.\d+/g, (match) => {
    if (match.startsWith('latitude') || match.startsWith('lat')) {
        return match.split('=')[0] + '=' + customLatitude;
    } else if (match.startsWith('longitude') || match.startsWith('lot')) {
        return match.split('=')[0] + '=' + customLongitude;
    }
    return match;
});

// 打印日志以调试 URL 修改
console.log(`Original URL: ${url}`);
console.log(`Rewritten URL: ${rewrittenURL}`);

// 直接替换URL中的 sort_by=nearby 为 sort_by=online
rewrittenURL = rewrittenURL.replace('sort_by=nearby', 'sort_by=online');

// 设置重写后的URL
$done({ url: rewrittenURL });