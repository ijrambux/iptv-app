const axios = require('axios');

module.exports = async (req, res) => {
    // تفعيل الـ CORS للسماح للمتصفح باستلام البيانات
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const { action, host, mac, cmd } = req.query;

    if (!host || !mac) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // تنظيف الرابط: إزالة /c أو أي زيادات في النهاية لضمان الوصول لـ portal.php
    let cleanHost = host.replace(/\/c\/?$/, "").replace(/\/stalker_portal\/?$/, "");
    
    // بناء الرابط النهائي بدقة
    const targetUrl = `${cleanHost}/portal.php?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 15000, // مهلة 15 ثانية للسيرفرات البطيئة
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=Europe/Luxembourg;`,
                'Referer': `${cleanHost}/c/`,
                'X-User-Agent': 'Model: MAG250; SW: 2.18-r14-pub-250'
            }
        });

        // إرسال البيانات (غالباً تكون داخل حقل js)
        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        console.error("Portal Error:", error.message);
        res.status(500).json({ error: "السيرفر لم يستجب"، details: error.message });
    }
};
