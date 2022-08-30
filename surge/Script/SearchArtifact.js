

let obj = JSON.parse($response.body);

obj.data.vipType = 1024,


$done({body: JSON.stringify(obj)});
