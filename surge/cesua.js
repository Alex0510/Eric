// 获取当前响应的body
let body = $response.body;
let obj = JSON.parse(body);

console.log('Original response body:', JSON.stringify(obj, null, 2));

// 预定义密码
const predefinedPassword = "Eric1069";
const inputPassword = $request.headers['password'];

if (inputPassword !== predefinedPassword) {
  // 如果密码不匹配，返回错误信息
  $done({ body: JSON.stringify({ error: "Unauthorized" }) });
  return;
}

// 使用正则表达式提取当前请求URL中的用户ID
const userIdRegex = /users\/(\d+)/;
const matchCurrentUrl = $request.url.match(userIdRegex);

const Eric = /users\/shadow/;
const Eric1 = /users\/.*\/basic/;
const Eric2 = /users\/.*is_living=.*/;
const Eric3 = /users\?extra_info=.*/;

if (matchCurrentUrl) {
  const userId = matchCurrentUrl[1];
  const url1 = `https://argo.blued.cn/users/${userId}/basic`;

  console.log('User ID:', userId);
  console.log('Fetching URL:', url1);

  // 从当前请求头部中提取authorization值
  const authorization = $request.headers['authorization'];
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

  // 使用$httpClient.get方法获取另一个URL的响应
  $httpClient.get({ url: url1, headers: headers }, function(error, response, data) {
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

              console.log('Updated last_operate:', targetData.last_operate);
              console.log('Updated distance:', targetData.location);
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
          $done({ body: JSON.stringify(obj) });
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
  if (Eric.test($request.url) && obj.data && obj.data.length > 0) {
    // 地图显示头像和影子功能
    obj.data[0].is_open_shadow = 1;
    obj.data[0].has_right = 1;
  }
  if (Eric1.test($request.url) && obj.data && obj.data.length > 0) {
    // 聊天界面查看会员隐藏的距离
    obj.data[0].is_hide_distance = 0;
    obj.data[0].is_hide_last_operate = 0;
  }
  if (Eric3.test($request.url) && obj.data && obj.data.length > 0) {
    // 地图找人试用到期
    obj.data[0].code = 200;
  }
  if (Eric2.test($request.url)) {
    // 查看隐藏头像
    obj.data.forEach(user => {
      user.avatar = user.latest_avatar;
    });
    // 查看最后登录时间而不是最后运行时间仅供参考不准
    let modifiedBody = JSON.stringify(obj);
    modifiedBody = modifiedBody.replace(/"is_hide_last_operate":\d/, '"is_hide_last_operate":0').replace(/"last_login"/, '"last_operate"');
    $done({ body: modifiedBody });
  } else {
    $done({ body: JSON.stringify(obj) });
  }
}

function handleResponseError(obj) {
  // 请求失败时，返回原始响应并修改is_hide_distance和is_hide_last_operate
  if (obj.data && obj.data.length > 0) {
    obj.data[0].is_hide_distance = 0;
    obj.data[0].is_hide_last_operate = 0;
  }
  $done({ body: JSON.stringify(obj) });
}