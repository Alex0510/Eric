/*
https?:\/\/www\.jianshu\.com\/go-wild\?ac=2&url=(.*)
*/

let srcUrl = $request.url;

let urlRegex = /^https?:\/\/www\.jianshu\.com\/go-wild\?ac=2&url=(.*)$/;
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

