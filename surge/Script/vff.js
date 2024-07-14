const $ = (() => {
    const isSurge = typeof $httpClient !== 'undefined';
    const isQuanX = typeof $task !== 'undefined';
    const isLoon = typeof $loon !== 'undefined';
    const isShadowrocket = typeof $rocket !== 'undefined';

    const getdata = (key) => {
        if (isSurge || isLoon) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
        if (isShadowrocket) return $rocket.getData(key);
    };

    const setdata = (val, key) => {
        if (isSurge || isLoon) return $persistentStore.write(val, key);
        if (isQuanX) return $prefs.setValueForKey(val, key);
        if (isShadowrocket) return $rocket.setData(val, key);
    };

    const msg = (title, subtitle, body, options) => {
        if (isSurge || isLoon) $notification.post(title, subtitle, body, options);
        if (isQuanX) $notify(title, subtitle, body, options);
        if (isShadowrocket) $rocket.notify(title, subtitle, body, options);
    };

    const log = (message) => console.log(message);
    const done = (value = {}) => {
        if (isQuanX) return $done(value);
        if (isSurge || isLoon || isShadowrocket) $done(value);
    };

    const http = {
        get: (options, callback) => {
            if (isQuanX) $task.fetch(options).then(resp => callback(null, resp, resp.body), reason => callback(reason.error, null, null));
            if (isSurge || isLoon) $httpClient.get(options, callback);
            if (isShadowrocket) $rocket.httpGet(options.url, options.headers, callback);
        },
        post: (options, callback) => {
            if (isQuanX) $task.fetch(options).then(resp => callback(null, resp, resp.body), reason => callback(reason.error, null, null));
            if (isSurge || isLoon) $httpClient.post(options, callback);
            if (isShadowrocket) $rocket.httpPost(options.url, options.headers, options.body, callback);
        }
    };

    return { isSurge, isQuanX, isLoon, isShadowrocket, getdata, setdata, msg, log, done, http };
})();

// 定义默认密码
const password = 'Eric1069';

// 从 BoxJS 中获取密码配置
const storedPassword = $.getdata('EricPassword');

// 验证密码函数
function verifyPassword(inputPassword) {
    return inputPassword === password;
}

// 如果 BoxJS 密码为空，则保存默认密码到 BoxJS
if (!storedPassword) {
    $.setdata(password, 'EricPassword');
}

// 检查密码验证
if (!verifyPassword(storedPassword)) {
    console.error('密码验证失败');
    $.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
    $.done({});
} else {
    (async () => {
        try {
            // 功能1: URL参数替换与自定义经纬度处理
            const sortBy = $.getdata("sortBy") || "online"; // 默认值为 "online"
            let url = $request.url;

            console.log('Original URL:', url);

            url = url.replace(/sort_by=[^&]*/, `sort_by=${sortBy}`);

            console.log('Modified URL:', url);

            const customCity = $.getdata("customCity") || "";
            const customLatitude = $.getdata("customLatitude") || "";
            const customLongitude = $.getdata("customLongitude") || "";

            let latitude = customLatitude;
            let longitude = customLongitude;

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

            const modifiedUrl = url.replace(/(lot|longitude|lon)=\d+\.\d+|(lat|latitude)=\d+\.\d+/g, function(match, p1, p2) {
                if (p1 === 'lot' || p1 === 'longitude' || p1 === 'lon') return p1 + '=' + longitude;
                if (p2 === 'lat' || p2 === 'latitude') return p2 + '=' + latitude;
                return match;
            });

            console.log('Final Modified URL:', modifiedUrl);

            $done({ url: modifiedUrl });

            // 功能2: 捕获并通知特定URL
            const headers = $request.headers;

            if (headers["user-agent"] && (headers["user-agent"].indexOf("Blued") !== -1 || headers["user-agent"].indexOf("Blued") !== -1)) {
                try {
                    const notify = $.getdata("pngUrl");
                    if (!notify || notify !== url) {
                        $.setdata(url, "pngUrl");
                        $.msg("Eric已成功捕获baby密照", "点击此通知查看PNG", "", { 'open-url': url, 'media-url': url });
                    }
                } catch (e) {
                    $.logErr(e);
                    $.msg("代码执行出错", "", e.message);
                }
            }

            // 功能3: 修改响应数据
            let body = $response.body;
            let obj = JSON.parse(body);

            console.log('Original response body:', JSON.stringify(obj, null, 2));

            const userIdRegex = /users\/(\d+)/;
            const matchCurrentUrl = $request.url.match(userIdRegex);

            const Eric = /users\/shadow/;
            const Eric3 = /users\?extra_info=.*/;

            if (matchCurrentUrl) {
                const userId = matchCurrentUrl[1];
                const url1 = `https://argo.blued.cn/users/${userId}/basic`;

                console.log('User ID:', userId);
                console.log('Fetching URL:', url1);

                const authorization = $request.headers['authorization'];
                console.log('Authorization header:', authorization);

                const headers = {
                    'authority': 'argo.blued.cn',
                    'accept': '*/*',
                    'x-client-color': 'light',
                    'content-type': 'application/json',
                    'accept-encoding': 'gzip, deflate, br',
                    'user-agent': 'Mozilla/5.0 (iPhone; iOS 16.1.1; Scale/3.00) iOS/300907_0.9.7_6972_0921 (Asia/Shanghai) app/1',
                  'accept-language': 'zh-CN',
                    'authorization': authorization
                };

                $.http.get({ url: url1, headers: headers }, function (error, response, data) {
                    if (error) {
                        console.error('Error fetching data:', error);
                        handleResponseError(obj);
                    } else {
                        try {
                            let dataObj = JSON.parse(data);

                            console.log('Fetched data:', JSON.stringify(dataObj, null, 2));

                            if (dataObj && dataObj.data && dataObj.data.length > 0) {
                                const fetchedData = dataObj.data[0];

                                if (fetchedData.last_operate !== undefined && fetchedData.distance !== undefined) {
                                    console.log('Fetched data contains required fields');

                                    const newLastOperate = fetchedData.last_operate;
                                    const newDistance = parseFloat(fetchedData.distance).toFixed(2) + 'km';

                                    if (obj.data && obj.data.length > 0) {
                                        const targetData = obj.data[0];

                                        console.log('Original last_operate:', targetData.last_operate);
                                        console.log('Original distance:', targetData.distance);

                                        targetData.last_operate = newLastOperate;
                                        targetData.location = newDistance;

                                        targetData.is_hide_distance = 0;
                                        targetData.is_hide_last_operate = 0;

                                        targetData.avatar = targetData.latest_avatar;

                                        console.log('Updated last_operate:', targetData.last_operate);
                                        console.log('Updated distance:', targetData.location);
                                        console.log('Updated avatar:', targetData.avatar);
                                    } else {
                                        console.error('Original response does not contain required data fields');
                                    }

                                    fetchedData.is_hide_distance = 0;
                                    fetchedData.is_hide_last_operate = 0;

                                    console.log('Modified fetched data:', JSON.stringify(fetchedData, null, 2));
                                } else {
                                    console.error('Fetched data does not contain required fields');
                                }

                                console.log('Modified response body:', JSON.stringify(obj, null, 2));
                                $done({ body: JSON.stringify(obj) });
                            } else {
                                console.error('Fetched data does not contain required fields');
                                handleResponseError(obj);
                            }
                        } catch (parseError) {
                            console.error('Error parsing data:', parseError);
                            handleResponseError(obj);
                        }
                    }
                });
            } else {
                if (Eric.test($request.url) && obj.data && obj.data.length > 0) {
                    obj.data[0].is_open_shadow = 1;
                    obj.data[0].has_right = 1;
                }
                if (Eric3.test($request.url) && obj.data && obj.data.length > 0) {
                    obj.data[0].code = 200;
                }
                $done({ body: JSON.stringify(obj) });
            }

            function handleResponseError(obj) {
                if (obj.data && obj.data.length > 0) {
                    obj.data[0].is_hide_distance = 0;
                    obj.data[0].is_hide_last_operate = 0;
                    obj.data[0].avatar = obj.data[0].latest_avatar;
                    delete obj.data[0].distance;
                }
                $done({ body: JSON.stringify(obj) });
            }
        } catch (error) {
            console.error(error);
            $done({});
        }
    })();
}