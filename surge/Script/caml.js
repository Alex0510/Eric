/*
caml解锁免费听
https://api.calm.com/(me|device|ios/receipt)
*/


const path1 = "/me";
const path2 = "/device";
const path3 = "/ios/receipt";

let key = {
    "is_refunded": false,
    "ios_details": {
      "id": "160000700663112",
      "began": "2020-03-13T03:20:31.000Z",
      "purchaser_platform": "ios",
      "is_free_trial": true,
      "is_renewable": true,
      "is_in_billing_retry_period": false,
      "will_renew": false,
      "expires": "2099-03-20T03:20:31.000Z",
      "is_canceled": true,
      "payment_processor": "itunes",
      "free_trial_began": "2020-03-13T03:20:31.000Z",
      "original_transaction_id": "160000700663112",
      "plan_duration": "year",
      "product_id": "com.calm.yearly.trial.one_week.usd_60",
      "free_trial_length_in_days": 7,
      "free_trial_ended": "2099-03-20T03:20:31.000Z"
    },
    "subscription_plan": "com.calm.yearly.trial.one_week.usd_60",
    "has_ever_had_android_subscription": false,
    "has_ever_done_free_trial": true,
    "user_id": "6pLV_HjP-",
    "plan_duration": "year",
    "free_trial_ended": "2099-03-20T03:20:31.000Z",
    "purchaser_platform": "ios",
    "is_in_billing_retry_period": false,
    "free_trial_began": "2020-03-13T03:20:31.000Z",
    "has_ever_had_ios_subscription": true,
    "is_canceled": true,
    "will_renew": false,
    "is_lifetime": false,
    "type": "ios",
    "free_trial_length_in_days": 7,
    "is_free": false,
    "id": "160000700663112",
    "expires": "2099-03-20T03:20:31.000Z",
    "valid": false,
    "payment_processor": "itunes",
    "began": "2020-03-13T03:20:31.000Z",
    "in_free_trial_window": false,
    "is_renewable": true
  };

let obj = JSON.parse($response.body);

if ($request.url.indexOf(path1) != -1){
obj["subscription"] = key;
}
if ($request.url.indexOf(path2) != -1){
obj["subscription"] = key;
}
if ($request.url.indexOf(path3) != -1){
obj = {
  ios_details": {
    "id": "160000700663112",
    "began": "2020-03-13T03:20:31.000Z",
    "purchaser_platform": "ios",
    "is_free_trial": true,
    "is_renewable": true,
    "is_in_billing_retry_period": false,
    "will_renew": false,
    "expires": "2099-03-20T03:20:31.000Z",
    "is_canceled": true,
    "payment_processor": "itunes",
    "free_trial_began": "2020-03-13T03:20:31.000Z",
    "original_transaction_id": "160000700663112",
    "plan_duration": "year",
    "product_id": "com.calm.yearly.trial.one_week.usd_60",
    "free_trial_length_in_days": 7,
    "free_trial_ended": "2099-03-20T03:20:31.000Z"
  },
  "subscription_plan": "com.calm.yearly.trial.one_week.usd_60",
  "has_ever_had_android_subscription": false,
  "has_ever_done_free_trial": true,
  "user_id": "6pLV_HjP-",
  "plan_duration": "year",
  "free_trial_ended": "2020-03-20T03:20:31.000Z",
  "purchaser_platform": "ios",
  "is_in_billing_retry_period": false,
  "free_trial_began": "2020-03-13T03:20:31.000Z",
  "has_ever_had_ios_subscription": true,
  "is_canceled": true,
  "will_renew": false,
  "is_lifetime": false,
  "type": "ios",
  "free_trial_length_in_days": 7,
  "is_free": false,
  "id": "160000700663112",
  "expires": "2099-03-20T03:20:31.000Z",
  "valid": false,
  "payment_processor": "itunes",
  "began": "2020-03-13T03:20:31.000Z",
  "in_free_trial_window": false,
  "is_renewable": true,
  "conversion_value": 0
};
}
$done({body:JSON.stringify(obj)});
