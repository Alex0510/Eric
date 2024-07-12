const $ = new Env("ip替换");

(async () => {
    try {
        // 从 boxjs 中读取自定义城市、经纬度和sort_by
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

        // 替换URL中的经纬度参数和sort_by参数
        let url = $request.url;
        const modifiedUrl = url.replace(/sort_by=\w+/, `sort_by=${customSortBy}`)
            .replace(/(lot|longitude|lon)=\d+\.\d+|(lat|latitude)=\d+\.\d+/g, function(match, p1, p2) {
                if (p1 === 'lot' || p1 === 'longitude' || p1 === 'lon') return p1 + '=' + longitude;
                if (p2 === 'lat' || p2 === 'latitude') return p2 + '=' + latitude;
                return match;
            });

        $done({ url: modifiedUrl });
    } catch (error) {
        console.error(error);
        $done({});
    }
})();