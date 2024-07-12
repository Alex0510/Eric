const $ = new Env("Eric专属");

// 简单的 SHA-256 实现，用于密码哈希
function sha256(str) {
    const utf8 = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', utf8).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => ('00' + x.toString(16)).slice(-2)).join('');
    });
}

// 设置脚本密码
const scriptPassword = 'Eric1069';

// 从请求头中读取用户输入的密码
const userInputPassword = $request.headers["X-Script-Password"];

// 校验密码
async function validatePassword() {
    const userInputHashedPassword = await sha256(userInputPassword);
    const hashedPassword = await sha256(scriptPassword);

    if (userInputHashedPassword !== hashedPassword) {
        console.error("密码错误");
        $done({ response: { status: 403, body: "密码错误" } });
        return false;
    }
    return true;
}

(async () => {
    if (!(await validatePassword())) {
        return;
    }

    try {
        // 从 BoxJs 中读取设置
        const customCity = $.getdata("customCity") || "";
        const customLatitude = $.getdata("customLatitude") || "";
        const customLongitude = $.getdata("customLongitude") || "";
        const customSortBy = $.getdata("customSortBy") || "nearby"; // 获取sort_by的值，默认是nearby

        let latitude = customLatitude;
        let longitude = customLongitude;

        // 如果没有自定义经纬度，则通过自定义城市获取经纬度
        if (!customLatitude || !customLongitude) {
            const encodedCity = encodeURIComponent(customCity);

            const options = {
                url: `https://jingweidu.bmcx.com/web_system/bmcx_com_www/system/file/map/sou_suo/?ajaxtimestamp=${Date.now()}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "*/*",
                    "Origin": "https://jingweidu.bmcx.com",
                    "Referer": "https://jingweidu.bmcx.com/web_system/bmcx_com_www/system/file/jingweidu/api/?v=125b5a3c78f141a0_1754",
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1",
                    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br"
                },
                body: `keyword=${encodedCity}`,
                method: 'POST'
            };

            let response = await $.http.post(options).then(res => JSON.parse(res.body));
            latitude = response.lat;
            longitude = response.lng;
        }

        // 替换URL中的经纬度参数
        let modifiedUrl = $request.url.replace(/(lot|longitude|lon)=\d+\.\d+|(lat|latitude)=\d+\.\d+/g, function(match, p1, p2) {
            if (p1 === 'lot' || p1 === 'longitude' || p1 === 'lon') return p1 + '=' + longitude;
            if (p2 === 'lat' || p2 === 'latitude') return p2 + '=' + latitude;
            return match; 
        });

        // 替换URL中的sort_by参数
        modifiedUrl = modifiedUrl.replace(/sort_by=\w+/, `sort_by=${customSortBy}`);

        $done({ url: modifiedUrl });
    } catch (error) {
        console.error(error);
        $done({});
    }
})();