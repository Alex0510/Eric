

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

        // 从 boxjs 中读取自定义城市和经纬度
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

            let response = await $httpClient.post(options);
            response = JSON.parse(response.body);
            
            if (response && response.lat && response.lng) {
                latitude = response.lat;
                longitude = response.lng;
            } else {
                console.error('Failed to fetch coordinates for the city.');
                $.done({});
                return;
            }
        }

        // 修改请求头中的 X-App-Location
        let headers = $request.headers;
        
        if (headers["X-App-Location"]) {
            headers["X-App-Location"] = `${latitude},${longitude}`;
            console.log('Modified X-App-Location:', headers["X-App-Location"]);
        }

        // 发送修改后的请求
        $done({
            url: $request.url,
            method: $request.method,
            headers: headers,
            body: $request.body
        });
    } catch (error) {
        console.error(error);
        $done({});
    }
})();