//5
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
        const boxjsPassword = $.getdata('EricPassword');
        const scriptEnabled = $.getdata('scriptEnabled');

        // 验证密码函数
        function verifyPassword(inputPassword) {
            const encodedInputPassword = base64Encode(inputPassword);
            return encodedInputPassword === encryptedPassword;
        }

        // 如果 BoxJS 密码为空，则保存默认加密后的密码到 BoxJS
        if (!boxjsPassword) {
            $.setdata(encryptedPassword, 'EricPassword');
        }

        // 检查密码验证
        if (!verifyPassword(boxjsPassword)) {
            console.error('密码验证失败');
            $.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
            $.done({});
            return;
        }

        // 检查脚本是否启用
        if (scriptEnabled !== 'true') {
            console.log('Script is disabled via BoxJS.');
            $.done({});
            return;
        }

        // 从 BoxJS 中读取自定义城市和经纬度
        const customCity = $.getdata("customCity") || "";
        const customLatitude = $.getdata("customLatitude") || "";
        const customLongitude = $.getdata("customLongitude") || "";

        console.log(`Custom City: ${customCity}`);
        console.log(`Custom Latitude: ${customLatitude}`);
        console.log(`Custom Longitude: ${customLongitude}`);

        let latitude = customLatitude;
        let longitude = customLongitude;

        // 如果没有自定义经纬度，则通过自定义城市获取经纬度
        if (!customLatitude || !customLongitude) {
            if (!customCity) {
                console.error('未配置自定义城市或经纬度');
                $.msg("配置错误", "未配置自定义城市或经纬度，请在 BoxJS 中进行配置", "");
                $.done({});
                return;
            }

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

            try {
                let response = await new Promise((resolve, reject) => {
                    $httpClient.post(options, (error, response, body) => {
                        if (error) reject(error);
                        else resolve(body);
                    });
                });

                console.log("Response from coordinate API:", response);

                response = JSON.parse(response);

                if (response && response.lat && response.lng) {
                    latitude = response.lat;
                    longitude = response.lng;
                } else {
                    throw new Error('Failed to fetch coordinates for the city.');
                }
            } catch (error) {
                console.error("Error fetching coordinates:", error.message);
                $.msg("获取经纬度失败", error.message, "");
                $.done({});
                return;
            }
        }

        // 修改请求头中的 X-App-Location
        let headers = $request.headers || {};

        headers["X-App-Location"] = `${latitude},${longitude}`;
        console.log('Set X-App-Location:', headers["X-App-Location"]);

        // 打印修改后的请求信息
        console.log('Modified Request:', {
            url: $request.url,
            method: $request.method,
            headers: headers,
            body: $request.body
        });

        // 发送修改后的请求
        $done({
            url: $request.url,
            method: $request.method,
            headers: headers,
            body: $request.body
        });
    } catch (error) {
        console.error("Script execution failed:", error.message);
        $.msg("脚本执行失败", error.message, "");
        $.done({});
    }
})();