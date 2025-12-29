const axios = require('axios');

module.exports = async (req, res) => {
    // إعدادات الوصول (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { action, host, mac, cmd } = req.query;

    if (!host || !mac) {
        return res.status(200).json({ error: "البيانات ناقصة" });
    }

    // تنظيف الرابط
    let cleanHost = host.trim().replace(/\/c$/, "").replace(/\/$/, "");
    const targetUrl = `${cleanHost}/portal.php?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'MAG250',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=GMT;`,
                'Referer': `${cleanHost}/c/`
            }
        });

        // إرجاع البيانات للواجهة
        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        res.status(200).json({ error: "فشل السيرفر في جلب البيانات", message: error.message });
    }
};
