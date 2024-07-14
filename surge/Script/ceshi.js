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

// 获取当前响应的body
let body = $response.body;
let obj = JSON.parse(body);

console.log('原始响应 body:', JSON.stringify(obj, null, 2));

// 使用正则表达式提取当前请求URL中的用户ID
const userIdRegex = /users\/(\d+)/;
const matchCurrentUrl = $request.url.match(userIdRegex);

const Eric = /users\/shadow/;
const Eric3 = /users\?extra_info=.*/;

// 检查密码验证
if (!verifyPassword(boxjsPassword)) {
  console.error('密码验证失败');
  $done({ body: JSON.stringify({ error: '密码验证失败，请检查 BoxJS 配置' }) });
} else {
  if (matchCurrentUrl) {
    const userId = matchCurrentUrl[1];
    const url1 = `https://argo.blued.cn/users/${userId}/basic`;

    console.log('用户ID:', userId);
    console.log('获取URL:', url1);

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
    $.http.get({ url: url1, headers: headers }).then(response => {
      if (response.error) {
        console.error('获取数据错误:', response.error);
        handleResponseError(obj); // 处理响应错误
      } else {
        try {
          // 解析另一个URL的响应数据
          let dataObj = JSON.parse(response.body);

          console.log('获取的数据:', JSON.stringify(dataObj, null, 2));

          // 确保dataObj包含data.last_operate和data.distance
          if (dataObj && dataObj.data && dataObj.data.length > 0) {
            const fetchedData = dataObj.data[0];

            if (fetchedData.last_operate !== undefined && fetchedData.distance !== undefined) {
              console.log('获取的数据包含所需字段');

              // 提取并重命名数据
              const newLastOperate = fetchedData.last_operate;
              const newDistance = parseFloat(fetchedData.distance).toFixed(2) + 'km';

              // 替换目标URL响应内容中的值
              if (obj.data && obj.data.length > 0) {
                const targetData = obj.data[0];

                console.log('原始 last_operate:', targetData.last_operate);
                console.log('原始 distance:', targetData.distance);

                // 替换值
                targetData.last_operate = newLastOperate;
                targetData.location = newDistance;

                // 设置is_hide_distance和is_hide_last_operate为0
                targetData.is_hide_distance = 0;
                targetData.is_hide_last_operate = 0;

                // 查看隐藏头像
                targetData.avatar = targetData.latest_avatar;

                console.log('更新后的 last_operate:', targetData.last_operate);
                console.log('更新后的 distance:', targetData.location);
                console.log('更新后的 avatar:', targetData.avatar);
              } else {
                console.error('原始响应不包含所需数据字段');
              }

              // 修改来自 https://argo.blued.cn/users/${userId}/basic 的数据
              fetchedData.is_hide_distance = 0;
              fetchedData.is_hide_last_operate = 0;

              console.log('修改后的获取数据:', JSON.stringify(fetchedData, null, 2));
            } else {
              console.error('获取的数据不包含所需字段');
            }

            // 输出修改后的响应数据
            console.log('修改后的响应 body:', JSON.stringify(obj, null, 2));
            $done({ body: JSON.stringify(obj) });
          } else {
            console.error('获取的数据不包含所需字段');
            handleResponseError(obj); // 处理数据缺少必需字段的情况
          }
        } catch (parseError) {
          console.error('解析数据错误:', parseError);
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
    if (Eric3.test($request.url) && obj.data && obj.data.length > 0) {
      // 地图找人试用到期
      obj.data[0].code = 200;
    } else {
      $done({ body: JSON.stringify(obj) });
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
    $done({ body: JSON.stringify(obj) });
  }
}

// Helper function for Surge, Quantumult X, Loon, and Shadowrocket
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
    get: function (options) {
      return new Promise((resolve, reject) => {
        if (typeof $httpClient !== 'undefined') {
          $httpClient.get(options, (err, resp, body) => {
            if (err) reject(err);
            else resolve({ status: resp.status, body });
          });
        } else if (typeof $task !== 'undefined') {
          options.method = 'GET';
          $task.fetch(options).then(response => {
            resolve({ status: response.statusCode, body: response.body });
          }, reason => reject(reason.error));
        } else if (typeof $loon !== 'undefined') {
          $httpClient.get(options, (err, resp, body) => {
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