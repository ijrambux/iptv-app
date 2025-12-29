const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const { action, mac, cmd } = req.query;
    // الرابط الأساسي الذي زودتني به
    const PORTAL_BASE = 'http://40935-kelkoo.cloud-ott.me/portal.php';

    if (!action || !mac) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        // 1. إعداد الرابط بناءً على الأكشن (get_all_channels أو get_link)
        let targetUrl = `${PORTAL_BASE}?type=itv&action=${action}`;
        if (cmd) targetUrl += `&cmd=${encodeURIComponent(cmd)}`;

        // 2. إرسال الطلب مع الهيدرز اللازمة لربط الماك بالسيرفر
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=GMT;`,
                'Referer': 'http://40935-kelkoo.cloud-ott.me/c/',
                'X-User-Agent': 'Model: MAG250; SW: 2.18-r14-pub-250'
            },
            timeout: 15000 
        });

        // 3. إرسال البيانات للواجهة
        const finalData = response.data.js || response.data;
        res.status(200).json(finalData);

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "فشل الاتصال بالسيرفر، تأكد من صلاحية الماك" });
    }
};
