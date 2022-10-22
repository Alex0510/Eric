/***
Agenda永久解锁--Eric

[rewrite_local]
^https://accounts.agenda.com/users/.*/license url script-response-body https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/Agenda.js

[mitm] 
hostname = %APPEND% accounts.agenda.com

***/


let obj = JSON.parse($response.body);

obj = {
  "error": 0,
  "universalPurchaseAvailable": true,
  "informUserOfPendingBonus": true,
  "licenseStatus": 1,
  "isSubscribed": true,
  "unlockExpiry": 63114076800,
  "isSubscribedMobile": true,
  "licenseStatusMobile": 1,
  "unlockExpiryMobile": 63114076800
}
$done({body: JSON.stringify(obj)});
