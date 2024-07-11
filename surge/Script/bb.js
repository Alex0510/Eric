// 模块链接
const moduleUrl = "https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Module/blued.sgmodule";

// 预设密码
const correctPassword = "123456";

// 弹出密码输入框
const enteredPassword = prompt("请输入密码以添加模块链接：");

// 验证密码
if (enteredPassword === correctPassword) {
  // 密码正确，添加模块链接
  $httpClient.get(moduleUrl, function(error, response, data) {
    if (error) {
      $notification.post("模块添加失败", "无法获取模块链接", error);
    } else {
      // 解析模块内容并添加到 Surge 配置中
      const moduleConfig = JSON.parse(data);
      // 假设你有一个函数可以将模块内容添加到 Surge 配置中
      addModuleToSurgeConfig(moduleConfig);
      $notification.post("模块添加成功", "模块已成功添加到 Surge 配置中", "");
    }
  });
} else {
  // 密码错误，显示错误通知
  $notification.post("密码错误", "无法添加模块链接", "请检查密码后重试");
}

// 假设你有一个函数可以将模块内容添加到 Surge 配置中
function addModuleToSurgeConfig(moduleConfig) {
  // 这里添加你的逻辑，将模块内容添加到 Surge 配置中
}
