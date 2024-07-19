//1
(async () => {
    try {
        // Base64 编码/解码函数
        function base64Encode(text) {
            return btoa(text);
        }

        function base64Decode(base64) {
            return atob(base64);
        }

        // 加密后的密码
        const encryptedPassword = 'RXJpYzEwNjk=';

        // 从 BoxJS 获取密码和脚本启用状态
        const boxjsPassword = $persistentStore.read('EricPassword');
        const scriptEnabled = $persistentStore.read('scriptEnabled');

        // 密码验证函数
        function verifyPassword(inputPassword) {
            const encodedInputPassword = base64Encode(inputPassword);
            return encodedInputPassword === encryptedPassword;
        }

        // 如果 BoxJS 密码为空，则保存默认加密后的密码到 BoxJS
        if (!boxjsPassword) {
            $persistentStore.write(encryptedPassword, 'EricPassword');
        }

        // 验证密码
        if (!verifyPassword(boxjsPassword)) {
            console.error('密码验证失败');
            $notification.post("密码验证失败", "请检查 BoxJS 配置中的密码", "");
            $done({});
            return;
        }

        // 检查脚本是否启用
        if (scriptEnabled !== 'true') {
            console.log('脚本通过 BoxJS 被禁用。');
            $done({});
            return;
        }

        // 从 BoxJS 中读取自定义城市和经纬度
        const customCity = $persistentStore.read("customCity") || "";
        const customLatitude = $persistentStore.read("customLatitude") || "";
        const customLongitude = $persistentStore.read("customLongitude") || "";

        console.log(`自定义城市: ${customCity}`);
        console.log(`自定义纬度: ${customLatitude}`);
        console.log(`自定义经度: ${customLongitude}`);

        let latitude = customLatitude;
        let longitude = customLongitude;

        // 如果没有自定义经纬度，则通过自定义城市获取经纬度
        if (!customLatitude || !customLongitude) {
            if (!customCity) {
                console.error('未配置自定义城市或经纬度');
                // 继续执行，不返回
            } else {
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

                    console.log("从坐标 API 获取的响应:", response);

                    response = JSON.parse(response);

                    if (response && response.lat && response.lng) {
                        latitude = response.lat;
                        longitude = response.lng;
                    } else {
                        throw new Error('无法获取城市的坐标。');
                    }
                } catch (error) {
                    console.error("获取坐标时出错:", error.message);
                    // 继续执行，不返回
                }
            }
        }

       // 修改请求头中的 X-App-Location
       let headers = $request.headers || {};
        
       headers["X-App-Location"] = `${latitude},${longitude}`;
       headers["x-app-location"] = `${latitude},${longitude}`;
        
       console.log('设置 X-App-Location:', headers["X-App-Location"]);
       console.log('设置 x-app-location:', headers["x-app-location"]);

       // 修改请求体中的参数
       let body = $request.body || "";
        
       console.log('原始请求体:', body);

       // 确保 body 是字符串格式
       if (typeof body !== 'string') {
           body = String(body);
       }

       // 使用正则表达式匹配并替换参数
       body = body.replace(/(count=)[0-9]+/, `$19999`);
       body = body.replace(/(latitude=)[0-9.]+/, `$1${latitude}`);
       body = body.replace(/(longitude=)[0-9.]+/, `$1${longitude}`);

        
      console.log('修改后的请求体:', body);

      // 打印修改后的请求信息
      console.log('修改后的请求:', {
          url: $request.url,
          method: $request.method,
          headers: headers,
          body: body
      });

      // 发送修改后的请求
      $done({
          url: $request.url,
          method: $request.method,
          headers: headers,
          body: body
      });
    } catch (error) {
      console.error("脚本执行失败:", error.message);
      $notification.post("脚本执行失败", error.message, "");
      $done({});
    }
})();

// 响应处理逻辑
try {
    let responseBody = JSON.parse($response.body);

    console.log('原始响应体:', responseBody);

    if (responseBody.data) {
        // 修改 findCount
        responseBody.data.findCount = 99999;

        // 将 list 中的 hide 设置为 false
        if (responseBody.data.list && Array.isArray(responseBody.data.list)) {
            responseBody.data.list.forEach(item => {
                if (item.hide) {
                    item.hide = false;
                }
            });
        }
    }

    console.log('修改后的响应体:', responseBody);

    $done({ body: JSON.stringify(responseBody) });
} catch (error) {
    console.error('解析或修改响应时出错:', error);
    let originalResponseBody;

    try {
         originalResponseBody = JSON.parse($response.body);
         originalResponseBody.data.findCount = 99999;
         if (originalResponseBody.data.list && Array.isArray(originalResponseBody.data.list)) {
             originalResponseBody.data.list.forEach(item => { item.hide=false; });
         }
         $done({body:JSON.stringify(originalResponseBody)});
     } catch(e){
         $done({body:$response.body});
     }
}
