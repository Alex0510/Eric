
(async () => {
    try {
        // Base64 encode/decode functions
        function base64Encode(text) {
            return btoa(text);
        }

        function base64Decode(base64) {
            return atob(base64);
        }

        // Encrypted password
        const encryptedPassword = 'RXJpYzEwNjk=';

        // Fetch password and script status from BoxJS
        const boxjsPassword = $persistentStore.read('EricPassword');
        const scriptEnabled = $persistentStore.read('scriptEnabled');

        // Password verification function
        function verifyPassword(inputPassword) {
            const encodedInputPassword = base64Encode(inputPassword);
            return encodedInputPassword === encryptedPassword;
        }

        // Save default encrypted password to BoxJS if not already set
        if (!boxjsPassword) {
            $persistentStore.write(encryptedPassword, 'EricPassword');
        }

        // Verify password
        if (!verifyPassword(boxjsPassword)) {
            console.error('密码验证失败');
            $notification.post("密码验证失败", "请检查 BoxJS 配置中的密码", "");
            $done({});
            return;
        }

        // Check if the script is enabled
        if (scriptEnabled !== 'true') {
            console.log('Script is disabled via BoxJS.');
            $done({});
            return;
        }

        // Fetch custom city and coordinates from BoxJS
        const customCity = $persistentStore.read("customCity") || "";
        const customLatitude = $persistentStore.read("customLatitude") || "";
        const customLongitude = $persistentStore.read("customLongitude") || "";

        console.log(`Custom City: ${customCity}`);
        console.log(`Custom Latitude: ${customLatitude}`);
        console.log(`Custom Longitude: ${customLongitude}`);

        let latitude = customLatitude;
        let longitude = customLongitude;

        // If no custom coordinates, fetch them based on the custom city
        if (!customLatitude || !customLongitude) {
            if (!customCity) {
                console.error('未配置自定义城市或经纬度');
                $done({});
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
                $done({});
                return;
            }
        }

       // Modify request headers with coordinates
       let headers = $request.headers || {};
        
       headers["X-App-Location"] = `${latitude},${longitude}`;
       headers["x-app-location"] = `${latitude},${longitude}`;
        
       console.log('Set X-App-Location:', headers["X-App-Location"]);
       console.log('Set x-app-location:', headers["x-app-location"]);

       // Modify request body parameters
       let body = $request.body || "";
        
       console.log('Original Body:', body);

       // Ensure body is a string
       if (typeof body !== 'string') {
           body = String(body);
       }

       // Replace parameters using regex
       body = body.replace(/(count=)[0-9]+/, `$19999`);
       body = body.replace(/(latitude=)[0-9.]+/, `$1${latitude}`);
       body = body.replace(/(longitude=)[0-9.]+/, `$1${longitude}`);

        
      console.log('Modified Body:', body);

      // Log modified request info
      console.log('Modified Request:', {
          url: $request.url,
          method: $request.method,
          headers: headers,
          body: body
      });

      // Send modified request
      $done({
          url: $request.url,
          method: $request.method,
          headers: headers,
          body: body
      });
    } catch (error) {
      console.error("Script execution failed:", error.message);
      $notification.post("脚本执行失败", error.message, "");
      $done({});
    }
})();

// Response processing logic
try {
    let responseBody = JSON.parse($response.body);

    if (responseBody.data) {
        // Modify findCount
        responseBody.data.findCount = 99999;

        // Set hide to false in list items
        if (responseBody.data.list && Array.isArray(responseBody.data.list)) {
            responseBody.data.list.forEach(item => {
                if (item.hide) {
                    item.hide = false;
                }
            });
        }
    }

    $done({ body: JSON.stringify(responseBody) });
} catch (error) {
    console.error('Error parsing or modifying response:', error);
    $done({ body: $response.body });
}
