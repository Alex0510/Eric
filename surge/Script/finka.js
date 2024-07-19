(async () => {
    try {
        // Base64 编码函数
        function base64Encode(text) {
            return btoa(text);
        }

        // Base64 解码函数
        function base64Decode(base64) {
            return atob(base64);
        }

        // Base64编码
        const encryptedPassword = 'RXJpYzEwNjk='; 

        // 从 BoxJS 获取密码配置
        const boxjsPassword = typeof $ !== 'undefined' ? $.getdata('EricPassword') : null;
        const scriptEnabled = typeof $ !== 'undefined' ? $.getdata('scriptEnabled') : 'false';

        // 验证密码函数
        function verifyPassword(inputPassword) {
            const encodedInputPassword = base64Encode(inputPassword);
            return encodedInputPassword === encryptedPassword;
        }

        // 如果 BoxJS 密码为空，则保存默认加密后的密码到 BoxJS
        if (!boxjsPassword) {
            if (typeof $ !== 'undefined') {
                $.setdata(encryptedPassword, 'EricPassword');
            }
        }

        // 检查密码验证
        if (!verifyPassword(boxjsPassword)) {
            console.error('密码验证失败');
            if (typeof $ !== 'undefined') {
                $.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
                $.done({});
            }
            return;
        }

        // 检查脚本是否启用
        if (scriptEnabled !== 'true') {
            console.log('Script is disabled via BoxJS.');
            if (typeof $ !== 'undefined') {
                $.done({});
            }
            return;
        }

        // 从 boxjs 中读取自定义城市和经纬度
        const customCity = typeof $ !== 'undefined' ? $.getdata("customCity") || "" : "";
        const customLatitude = typeof $ !== 'undefined' ? $.getdata("customLatitude") || "" : "";
        const customLongitude = typeof $ !== 'undefined' ? $.getdata("customLongitude") || "" : "";

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

            let response = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body
            }).then(res => res.json());
            
            if (response && response.lat && response.lng) {
                latitude = response.lat;
                longitude = response.lng;
            } else {
                console.error('Failed to fetch coordinates for the city.');
                if (typeof $ !== 'undefined') {
                    $.done({});
                }
                return;
            }
        }

        // 修改请求头中的 X-App-Location
        let headers = typeof $request !== 'undefined' ? $request.headers || {} : {};
        
        headers["X-App-Location"] = `${latitude},${longitude}`;
        headers["x-app-location"] = `${latitude},${longitude}`;
        
        console.log('Set X-App-Location:', headers["X-App-Location"]);
        console.log('Set x-app-location:', headers["x-app-location"]);

        // 修改请求体中的参数
        let body = typeof $request !== 'undefined' ? $request.body || "" : "";
        
        console.log('Original Body:', body);

        // 确保body是字符串格式
        if (typeof body !== 'string') {
            body = String(body);
        }

        // 使用正则表达式匹配并替换参数
        body = body.replace(/(count=)[0-9]+/, `$19999`);
        body = body.replace(/(latitude=)[0-9.]+/, `$1${latitude}`);
        body = body.replace(/(longitude=)[0-9.]+/, `$1${longitude}`);

        
        console.log('Modified Body:', body);

        // 打印修改后的请求信息
        console.log('Modified Request:', {
            url: typeof $request !== 'undefined' ? $request.url : '',
            method: typeof $request !== 'undefined' ? $request.method : '',
            headers: headers,
            body: body
        });

        // 发送修改后的请求
        if (typeof $done !== 'undefined') {
            $done({
                url: typeof $request !== 'undefined' ? $request.url : '',
                method: typeof $request !== 'undefined' ? $request.method : '',
                headers: headers,
                body: body
            });
        }
    } catch (error) {
        console.error("Script execution failed:", error.message);
        if (typeof $notification !== 'undefined') {
            $notification.post("脚本执行失败", error.message, "");
        }
        if (typeof $done !== 'undefined') {
            $done({});
        }
    }
})();

// 响应体处理逻辑
try {
    let responseBody = JSON.parse(typeof $response !== 'undefined' ? $response.body : '{}');

    if (responseBody.data) {
        // 修改 findCount
        responseBody.data.findCount = 99999;

        // 修改 list 中的 hide 为 false
        if (responseBody.data.list && Array.isArray(responseBody.data.list)) {
            responseBody.data.list.forEach(item => {
                if (item.hide) {
                    item.hide = false;
                }
            });
        }
    }

    if (typeof $done !== 'undefined') {
        $done({ body: JSON.stringify(responseBody) });
    }
} catch (error) {
    console.error('Error parsing or modifying response:', error);
    if (typeof $done !== 'undefined') {
        $done({ body: typeof $response !== 'undefined' ? $response.body : '{}' });
    }
}