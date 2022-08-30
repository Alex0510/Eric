

let obj = JSON.parse($response.body);

obj.data.vipType = 1,
obj.data.vipPastDueTime = 2222222222222,
obj.data.vipLabelLevel = 3,
obj.data.vitalityVipPastDueTime = 2222222222222,
    

$done({body: JSON.stringify(obj)});
