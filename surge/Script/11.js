// 定义密码
const password = 'Eric1069';

// 从持久化存储获取密码配置
const boxjsPassword = getPersistentStore('EricPassword');

// 验证密码函数
function verifyPassword(inputPassword) {
  return inputPassword === password;
}

// 如果持久化存储的密码为空，则保存默认密码到持久化存储
if (!boxjsPassword) {
  setPersistentStore('EricPassword', password);
}

// 获取当前响应的body
let body = getResponseBody();
let obj = JSON.parse(body);

console.log('Original response body:', JSON.stringify(obj, null, 2));

// 使用正则表达式提取当前请求URL中的用户ID
const userIdRegex = /users\/(\d+)/;
const matchCurrentUrl = getRequestUrl().match(userIdRegex);

const Eric = /users\/shadow/;
const Eric3 = /users\?extra_info=.*/;

// 检查密码验证
if (!verifyPassword(boxjsPassword)) {
  console.error('密码验证失败');
  done({ body: JSON.stringify({ error: '密码验证失败，请检查持久化存储配置' }) });
} else {
  if (matchCurrentUrl) {
    const userId = matchCurrentUrl[1];
    const url1 = `https://argo.blued.cn/users/${userId}/basic`;

    console.log('User ID:', userId);
    console.log('Fetching URL:', url1);

    // 从当前请求头部中提取authorization值
    const authorization = getRequestHeader('authorization');
    console.log('Authorization header:', authorization);

    // 设置请求头
    const headers = {
      'authority': 'argo.blued.cn',
      'accept': '*/*',
      'x-client-color': 'light',
      'content-type': 'application/json',
      'accept-encoding': 'gzip, deflate, br',
      'user-agent': 'Mozilla/5.0 (iPhone; iOS 16.1.1; Scale/3.00) iOS/300907_0.9.7_6972_0921 (Asia/Shanghai) app/1',
      'accept-language': 'zh-CN',
      'authorization': authorization // 使用提取到的authorization值
    };

    // 使用get方法获取另一个URL的响应
    get({ url: url1, headers: headers }, function(error, response, data) {
      if (error) {
        console.error('Error fetching data:', error);
        handleResponseError(obj); // 处理响应错误
      } else {
        try {
          // 解析另一个URL的响应数据
          let dataObj = JSON.parse(data);

          console.log('Fetched data:', JSON.stringify(dataObj, null, 2));

          // 确保dataObj包含data.last_operate和data.distance
          if (dataObj && dataObj.data && dataObj.data.length > 0) {
            const fetchedData = dataObj.data[0];

            if (fetchedData.last_operate !== undefined && fetchedData.distance !== undefined) {
              console.log('Fetched data contains required fields');

              // 提取并重命名数据
              const newLastOperate = fetchedData.last_operate;
              const newDistance = parseFloat(fetchedData.distance).toFixed(2) + 'km';

              // 替换目标URL响应内容中的值
              if (obj.data && obj.data.length > 0) {
                const targetData = obj.data[0];

                console.log('Original last_operate:', targetData.last_operate);
                console.log('Original distance:', targetData.distance);

                // 替换值
                targetData.last_operate = newLastOperate;
                targetData.location = newDistance;

                // 设置is_hide_distance和is_hide_last_operate为0
                targetData.is_hide_distance = 0;
                targetData.is_hide_last_operate = 0;

                // 查看隐藏头像
                targetData.avatar = targetData.latest_avatar;

                console.log('Updated last_operate:', targetData.last_operate);
                console.log('Updated distance:', targetData.location);
                console.log('Updated avatar:', targetData.avatar);
              } else {
                console.error('Original response does not contain required data fields');
              }

              // 修改来自 https://argo.blued.cn/users/${userId}/basic 的数据
              fetchedData.is_hide_distance = 0;
              fetchedData.is_hide_last_operate = 0;

              console.log('Modified fetched data:', JSON.stringify(fetchedData, null, 2));
            } else {
              console.error('Fetched data does not contain required fields');
            }

            // 输出修改后的响应数据
            console.log('Modified response body:', JSON.stringify(obj, null, 2));
            done({ body: JSON.stringify(obj) });
          } else {
            console.error('Fetched data does not contain required fields');
            handleResponseError(obj); // 处理数据缺少必需字段的情况
          }
        } catch (parseError) {
          console.error('Error parsing data:', parseError);
          handleResponseError(obj); // 处理数据解析错误
        }
      }
    });
  } else {
    if (Eric.test(getRequestUrl()) && obj.data && obj.data.length > 0) {
      // 地图显示头像和影子功能
      obj.data[0].is_open_shadow = 1;
      obj.data[0].has_right = 1;
    }
    if (Eric3.test(getRequestUrl()) && obj.data && obj.data.length > 0) {
      // 地图找人试用到期
      obj.data[0].code = 200;
    } else {
      done({ body: JSON.stringify(obj) });
    }
  }

  function handleResponseError(obj) {
    // 请求失败时，返回原始响应并修改is_hide_distance和is_hide_last_operate
    if (obj.data && obj.data.length > 0) {
      obj.data[0].is_hide_distance = 0;
      obj.data[0].is_hide_last_operate = 0;
      // 查看隐藏头像
      obj.data[0].avatar = obj.data[0].latest_avatar;
      // 删除 distance
      delete obj.data[0].distance;
    }
    done({ body: JSON.stringify(obj) });
  }
}

// 获取持久存储数据
function getPersistentStore(key) {
  if (typeof $persistentStore !== 'undefined') {
    return $persistentStore.read(key);
  } else if (typeof $prefs !== 'undefined') {
    return $prefs.valueForKey(key);
  } else if (typeof $persistent !== 'undefined') {
    return $persistent.read(key);
  } else {
    return null;
  }
}

// 设置持久存储数据
function setPersistentStore(key, value) {
  if (typeof $persistentStore !== 'undefined') {
    $persistentStore.write(value, key);
  } else if (typeof $prefs !== 'undefined') {
    $prefs.setValueForKey(value, key);
  } else if (typeof $persistent !== 'undefined') {
    $persistent.write(value, key);
  }
}

// 获取响应体
function getResponseBody() {
  if (typeof $response !== 'undefined') {
    return $response.body;
  } else if (typeof $httpResponse !== 'undefined') {
    return $httpResponse.body;
  } else {
    return null;
  }
}

// 获取请求URL
function getRequestUrl() {
  if (typeof $request !== 'undefined') {
    return $request.url;
  } else if (typeof $httpRequest !== 'undefined') {
    return $httpRequest.url;
  } else {
    return null;
  }
}

// 获取请求头
function getRequestHeader(header) {
  if (typeof $request !== 'undefined') {
    return $request.headers[header];
  } else if (typeof $httpRequest !== 'undefined') {
    return $httpRequest.headers[header];
  } else {
    return null;
  }
}

// HTTP GET请求
function get(options, callback) {
  if (typeof $httpClient !== 'undefined') {
    $httpClient.get(options, callback);
  } else if (typeof $http !== 'undefined') {
    $http.get(options, callback);
  } else {
    callback(new Error('HTTP client not available'));
  }
}

// 结束脚本执行
function done(response) {
  if (typeof $done !== 'undefined') {
    $done(response);
  } else if (typeof $http !== 'undefined') {
    $http.done(response);
  }
}
