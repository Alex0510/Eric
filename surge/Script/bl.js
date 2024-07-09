

// 获取传递的参数
const customLongitude = $argument.Longitude || '';
const customLatitude = $argument.Latitude || '';

// 添加日志输出以调试
console.log('Custom Longitude:', customLongitude);
console.log('Custom Latitude:', customLatitude);

// 修改 URL 中的参数
var modifiedUrl = $request.url.replace(/(longitude|lot)=\d+\.\d+|(latitude|lat)=\d+\.\d+/g, function(match, p1, p2) {
    if (p1) return 'longitude=' + customLongitude;
    if (p2) return 'latitude=' + customLatitude;
    return match; 
});

// 添加日志输出以调试
console.log('Modified URL:', modifiedUrl);

$done({url: modifiedUrl});