const $ = new Env("Eric捕获");

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

// 检查密码验证
if (!verifyPassword(boxjsPassword)) {
  console.error('密码验证失败');
  $.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
  $.done({});
} else {
  const url = $request.url;
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

  $.done({});
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
  this.msg = function (title, subtitle, body, options) {
    if (typeof $notification !== 'undefined') {
      $notification.post(title, subtitle, body, options);
    } else if (typeof $notify !== 'undefined') {
      $notify(title, subtitle, body, options);
    } else if (typeof $loon !== 'undefined') {
      $notification.post(title, subtitle, body, options);
    }
  };
  this.log = function (message) {
    console.log(message);
  };
  this.logErr = function (err) {
    console.error(err);
  };
  this.done = function (value) {
    if (typeof $done !== 'undefined') {
      $done(value);
    } else if (typeof $loon !== 'undefined') {
      $done(value);
    }
  };
}