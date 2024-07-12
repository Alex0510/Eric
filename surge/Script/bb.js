// verifyPassword.js
const crypto = require('crypto');

// 密码的SHA256哈希值
const storedPasswordHash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd8be41d1d4f1d6b224";

// 从持久化存储中读取用户输入的密码
const inputPassword = $persistentStore.read("inputPassword");

// 计算输入密码的哈希值
const inputPasswordHash = crypto.createHash('sha256').update(inputPassword).digest('hex');

if (inputPasswordHash === storedPasswordHash) {
    $notify("密码验证", "成功", "密码验证成功，可以继续添加链接。");
    $done({ pass: true });
} else {
    $notify("密码验证", "失败", "密码验证失败，无法添加链接。");
    $done({ pass: false });
}