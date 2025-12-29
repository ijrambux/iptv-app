const axios = require('axios');

module.exports = async (req, res) => {
    // إعدادات CORS للسماح بالوصول من المتصفح
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات OPTIONS (Preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // استخراج البيانات من الرابط (Query Parameters)
    const { action, mac, cmd } = req.query;
    const PORTAL_URL = 'http://40935-kelkoo.cloud-ott.me:80/portal.php';

    // التحقق من وجود البيانات الأساسية
    if (!action || !mac) {
        return res.status(400).json({ error: "Missing action or mac parameter" });
    }

    try {
        // بناء رابط الطلب للسيرفر الأصلي
        // إذا كان هناك cmd (مثل حالة get_link) نقوم بإضافته، وإلا نرسل الأكشن والنوع فقط
        let targetUrl = `${PORTAL_URL}?type=itv&action=${action}`;
        
        if (cmd) {
            targetUrl += `&cmd=${encodeURIComponent(cmd)}`;
        }

        // إرسال الطلب إلى سيرفر IPTV مع انتحال شخصية جهاز MAG
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=GMT;`,
                'Accept': '*/*',
                'Connection': 'keep-alive'
            },
            timeout: 10000 // مهلة 10 ثوانٍ للرد
        });

        // إرجاع البيانات المستلمة إلى تطبيق الويب الخاص بك
        // سيرفرات Stalker غالباً ما ترسل البيانات داخل كائن js
        const finalData = response.data.js || response.data;
        res.status(200).json(finalData);

    } catch (error) {
        console.error("Portal Proxy Error:", error.message);
        res.status(500).json({ 
            error: "Failed to communicate with IPTV Server",
            details: error.message 
        });
    }
};
