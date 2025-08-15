/*
脚本名称：12123 Token 获取 + 面板显示（增强版）
用途：抓取交管12123 token并在 Surge 面板显示车辆/驾驶证详细信息
作者:Mr.Eric
更新时间：2025-08-15
*/

const API_PARAMS = {
  infoURL: 'https://miniappcsfw.122.gov.cn:8443/openapi/invokeApi/business/biz',
  api1: 'biz.vio.unhandledVioCount.query',
  api2: 'biz.user.integration.query',
  productId: 'p10000000000000000001'
};

// ---------- 使用 API 类封装 ----------
const $ = new API('12123', true);

if (typeof $request !== 'undefined') {
  GetCookie();
} else {
  ShowPanel();
}

// =================== 抓 token ===================
function GetCookie() {
  if ($request.url.includes('openapi/invokeApi/business/biz')) {
    const cookie = $request.body;
    if (cookie.includes('unhandledVioCount') && cookie.includes('authToken')) {
      $.write(cookie, '#wx_12123');
      $.notify('交管 12123', 'Token 写入成功');
    }
  }
  $.done();
}

// =================== 面板显示 ===================
async function ShowPanel() {
  const tokenStr = $.read('#wx_12123');
  let panel = {
    title: '交管 12123',
    content: '尚未获取 token',
    icon: 'car',
    'icon-color': '#2581f2'
  };

  if (!tokenStr) return $done(panel);

  try {
    const body = JSON.parse(decodeURIComponent(tokenStr.replace('params=', '')));
    const params = { sign: body.sign, verifyToken: body.verifyToken };

    const data = {
      plateNumber: '未获取',
      vehicleName: '未获取',
      plateTypeAddress: '—',
      organizationAddress: '—',
      forceScrapTime: '—',
      validPeriodEnd: '—',
      firtsRegDate: '—',
      drivingName: '—',
      issueOrganizationName: '—',
      cumulativePoint: 0,
      inspectionValidityEnd: '—',
      validityEnd: '—',
      reaccDate: '—',
      inspectionDate: '—',
      updateDate: '--:--',
      unhandledCount: 0
    };

    // ---------- 获取未处理违法数量 ----------
    const res1 = await $.http.post({
      url: API_PARAMS.infoURL,
      body: `params=${encodeURIComponent(JSON.stringify({
        api: API_PARAMS.api1,
        productId: API_PARAMS.productId,
        ...params
      }))}`
    });

    if (res1.body && res1.body.success) {
      const list = res1.body.data?.list || [];
      if (list.length > 0) {
        data.unhandledCount = parseInt(list[0].count) || 0;
      }
    }

    // ---------- 获取驾驶证和车辆信息 ----------
    const res2 = await $.http.post({
      url: API_PARAMS.infoURL,
      body: `params=${encodeURIComponent(JSON.stringify({
        api: API_PARAMS.api2,
        productId: API_PARAMS.productId,
        ...params
      }))}`
    });

    if (res2.body && res2.body.success) {
      const drivingLicense = res2.body.data?.drivingLicense || {};
      const othersVehicles = res2.body.data?.othersVehicles || [];

      // 车辆信息
      if (othersVehicles.length) {
        const vehicle = othersVehicles[0];
        data.plateNumber = vehicle.plateNumber || '未获取';
        data.vehicleName = vehicle.name || '未获取';
        data.plateTypeAddress = vehicle.plateTypeAddress || '—';
        data.organizationAddress = vehicle.organizationAddress || '—';
        data.forceScrapTime = vehicle.forceScrapTime || '—';
        data.validPeriodEnd = vehicle.validPeriodEnd || '—';
        data.firtsRegDate = vehicle.firtsRegDate || '—';
      }

      // 驾驶证信息
      if (drivingLicense) {
        data.drivingName = drivingLicense.name || '—';
        data.issueOrganizationName = drivingLicense.issueOrganizationName || '—';
        data.cumulativePoint = drivingLicense.cumulativePoint || 0;
        data.inspectionValidityEnd = drivingLicense.inspectionValidityEnd || '—';
        data.validityEnd = drivingLicense.validityEnd || '—';
        data.reaccDate = drivingLicense.reaccDate || '—';
        data.inspectionDate = drivingLicense.inspectionDate || '—';
        data.updateDate = drivingLicense.updateDate || '--:--';
      }

      const date = new Date();
      data.lastUpdate = `${format(date.getHours())}:${format(date.getMinutes())}`;
    }

    // ---------- 构建面板内容，每行显示一个信息 ----------
    panel.content = `
车辆信息:
车牌号: ${data.plateNumber}
车辆名称: ${data.vehicleName}
车型: ${data.plateTypeAddress}
车辆管理属地: ${data.organizationAddress}
首次登记时间: ${data.firtsRegDate}
下次检验时间: ${data.validPeriodEnd}
强制报废时间: ${data.forceScrapTime}
未处理违法: ${data.unhandledCount} 条

驾驶员信息:
驾驶证姓名: ${data.drivingName}
驾驶证发放地: ${data.issueOrganizationName}
累计扣分: ${data.cumulativePoint}
驾驶证有效期: ${data.inspectionValidityEnd}
审验有效期: ${data.validityEnd}
下次清分时间: ${data.reaccDate}
下次体检时间: ${data.inspectionDate}
数据更新时间: ${data.updateDate}
面板更新时间: ${data.lastUpdate}
`.trim();

  } catch (e) {
    panel.content = '获取数据失败';
    console.log(e);
  }

  $done(panel);
}

function format(str) {
  return parseInt(str) >= 10 ? str : `0${str}`;
}

// =================== API 类（Surge/Quantumult X通用） ===================
function ENV() {
  return {
    isQX: typeof $task !== 'undefined',
    isLoon: typeof $loon !== 'undefined',
    isSurge: typeof $httpClient !== 'undefined' && typeof $utils !== 'undefined',
    isNode: typeof require == 'function'
  };
}

function HTTP() {
  const { isQX, isLoon, isSurge } = ENV();
  const methods = ['GET', 'POST'];
  const http = {};
  methods.forEach(method => {
    http[method.toLowerCase()] = (options) => {
      if (isQX) return $task.fetch({ method, ...options });
      if (isSurge || isLoon) {
        return new Promise((resolve) =>
          $httpClient[method.toLowerCase()](options, (err, resp, body) =>
            resolve({
              statusCode: resp?.status || resp?.statusCode,
              headers: resp?.headers,
              body: (() => { try { return JSON.parse(body || '{}'); } catch(e){ return {}; } })()
            })
          )
        );
      }
    };
  });
  return http;
}

function API(name, debug = false) {
  const self = this;
  self.debug = debug;
  self.http = HTTP();
  self.write = (data, key) => { if (ENV().isSurge || ENV().isLoon) return $persistentStore.write(data, key.replace('#','')); };
  self.read = (key) => { if (ENV().isSurge || ENV().isLoon) return $persistentStore.read(key.replace('#','')); };
  self.notify = (title, subtitle) => { if (ENV().isSurge) $notification.post(title, subtitle); };
  self.log = (msg) => { if(debug) console.log(msg); };
  self.done = (value={}) => $done(value);
}