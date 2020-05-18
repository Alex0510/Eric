/*
photocync解锁premium--Eric转载注明出处
photosync.js = type=http-response,pattern=https://api.revenuecat.com/v1/receipts,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/photosync.js,script-update-interval=0
hostname:api.revenuecat.com
*/


var obj = JSON.parse($response.body);
obj = {"request_date":"2020-05-18T13:55:53Z","request_date_ms":1589810153144,"subscriber":{"entitlements":{"premium":{"expires_date":"2029-06-01T13:49:38Z","product_identifier":"com.touchbyte.PhotoSync.PremiumYearly","purchase_date":"2020-05-18T13:49:38Z"}},"first_seen":"2020-05-18T13:46:53Z","last_seen":"2020-05-18T13:46:53Z","management_url":"itms-apps://apps.apple.com/account/subscriptions","non_subscriptions":{},"original_app_user_id":"791CC13A-DC04-47AF-9FC6-FA8D3684110F","original_application_version":"305","original_purchase_date":"2020-05-18T13:16:26Z","other_purchases":{},"subscriptions":{"com.touchbyte.PhotoSync.PremiumYearly":{"billing_issues_detected_at":null,"expires_date":"2029-06-01T13:49:38Z","is_sandbox":false,"original_purchase_date":"2020-05-18T13:49:41Z","period_type":"trial","purchase_date":"2020-05-18T13:49:38Z","store":"app_store","unsubscribe_detected_at":null}}}}
$done({body: JSON.stringify(obj)});
