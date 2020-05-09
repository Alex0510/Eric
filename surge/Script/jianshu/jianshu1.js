/*
https?:\/\/links\.jianshu\.com\/go\?to=(.*)
*/

let srcUrl = $request.url;

let urlRegex = /^https?:\/\/links\.jianshu\.com\/go\?to=(.*)$/;
let encodeUrl = srcUrl.match(urlRegex)[1];
let dstUrl = decodeURIComponent(encodeUrl);

$done({
  response: {
    status: 302,
    headers: {
      Location: dstUrl,
    },
  },
});
