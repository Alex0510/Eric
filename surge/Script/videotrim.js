/*
video trim
https://videotrim.oracle.bendingspoonsapps.com/devices
*/

var obj = JSON.parse($response.body);

obj = {
  "me": {
    "id": "5e9ed64a2f5f4632143106c6",
    "subscriptions": [{
      "product_id": "com.reezo.ReezoTrimmerSept.weekly_6_free_7",
      "offer_id": "weekly6_free7",
      "features": ["unlock"],
      "expiry": 4588072706000,
      "expired": false,
      "kind": "weekly_offer_subscription"
    }],
    "is_subscribed": true,
    "device_id": "98DB9069-E609-4561-B558-BDF83924EFD9",
    "current_subscription_index": 8,
    "last_subscription_index": 8,
    "saves": 0,
    "tos": {
      "last_accepted_version": "0.1.0"
    },
    "privacy_notice": {
      "last_acknowledged_version": "1.0.0",
      "is_at_least_16": "unknown",
      "required_consents": []
    },
    "will_renew_subscription": false
  },
  "token": "7cfeab4b6fc944c48557dadc380c78c6"
}
$done({body: JSON.stringify(obj)});
