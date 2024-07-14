const $ = new Env("ip替换");

// 定义密码
const password = 'Eric1069';

// 从 BoxJS 获取密码配置
const boxjsPassword = $.getdata('EricPassword');

// 验证密码函数
function verifyPassword(inputPassword) {
    return inputPassword === password;
}

// 如果 BoxJS 密码为空，则保存默认密码到 BoxJS
if (!boxjsPassword) {
    $.setdata(password, 'EricPassword');
}

// 检查密码验证
if (!verifyPassword(boxjsPassword)) {
    console.error('密码验证失败');
    $.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
    $done({});
} else {
    (async () => {
        try {
            // 从 BoxJS 中读取 sort_by 参数
            const sortBy = $.getdata("sortBy") || "online"; // 默认值为 "online"

            // 获取当前请求的URL
            let url = $request.url;

            // 打印原始URL以供调试
            console.log('原始 URL:', url);

            // 使用正则表达式将 sort_by 的值替换为从 BoxJS 读取的值
            url = url.replace(/sort_by=[^&]*/, `sort_by=${sortBy}`);

            // 打印修改后的URL以供调试
            console.log('修改后的 URL:', url);

            // 从 BoxJS 中读取自定义城市和经纬度
            const customCity = $.getdata("customCity") || "";
            const customLatitude = $.getdata("customLatitude") || "";
            const customLongitude = $.getdata("customLongitude") || "";

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
            const modifiedUrl = url.replace(/(lot|longitude|lon)=\d+\.\d+|(lat|latitude)=\d+\.\d+/g, function(match, p1, p2) {
                if (p1 === 'lot' || p1 === 'longitude' || p1 === 'lon') return p1 + '=' + longitude;
                if (p2 === 'lat' || p2 === 'latitude') return p2 + '=' + latitude;
                return match;
            });

            // 打印最终修改后的URL以供调试
            console.log('最终修改后的 URL:', modifiedUrl);

            // 发送修改后的请求
            $done({ url: modifiedUrl });
        } catch (error) {
            console.error(error);
            $done({});
        }
    })();
}

// 辅助函数，适用于 Surge, Quantumult X, Loon, 和 Shadowrocket
function Env(name) {
    this.name = name;
    this.getdata = function (key) {
        if (typeof $persistentStore !== 'undefined') {
            return $persistentStore.read(key);
        } else if (typeof $prefs !== 'undefined') {
            return $prefs.valueForKey(key);
        } else if (typeof $loon !== 'undefined') {
            return $persistentStore.read(key);
        }
    };
    this.setdata = function (value, key) {
        if (typeof $persistentStore !== 'undefined') {
            return $persistentStore.write(value, key);
        } else if (typeof $prefs !== 'undefined') {
            return $prefs.setValueForKey(value, key);
        } else if (typeof $loon !== 'undefined') {
            return $persistentStore.write(value, key);
        }
    };
    this.msg = function (title, subtitle, body) {
        if (typeof $notification !== 'undefined') {
            $notification.post(title, subtitle, body);
        } else if (typeof $notify !== 'undefined') {
            $notify(title, subtitle, body);
        } else if (typeof $loon !== 'undefined') {
            $notification.post(title, subtitle, body);
        }
    };
    this.http = {
        post: function (options) {
            return new Promise((resolve, reject) => {
                if (typeof $httpClient !== 'undefined') {
                    $httpClient.post(options, (err, resp, body) => {
                        if (err) reject(err);
                        else resolve({ status: resp.status, body });
                    });
                } else if (typeof $task !== 'undefined') {
                    options.method = 'POST';
                    $task.fetch(options).then(response => {
                        resolve({ status: response.statusCode, body: response.body });
                    }, reason => reject(reason.error));
                } else if (typeof $loon !== 'undefined') {
                    $httpClient.post(options, (err, resp, body) => {
                        if (err) reject(err);
                        else resolve({ status: resp.status, body });
                    });
                }
            });
        }
    };
    this.log = function (message) {
        console.log(message);
    };
}