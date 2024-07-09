// 获取传递的参数
const customLongitude = $argument.Longitude || '116.40133452594137';
const customLatitude = $argument.Latitude || '39.89503534593025';

// 修改 URL 中的参数
var modifiedUrl = $request.url.replace(/(longitude|lot)=\d+\.\d+|(latitude|lat)=\d+\.\d+/g, function(match, p1, p2) {
    if (p1) return 'longitude=' + customLongitude;
    if (p2) return 'latitude=' + customLatitude;
    return match; 
});

$done({url: modifiedUrl});