const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, mac, cmd } = req.query;
    
    // الرابط الجديد الذي زودتني به
    const PORTAL_URL = 'http://globaltv1.net:8080/portal.php';

    try {
        // بناء الرابط للأكشن المطلوب
        let targetUrl = `${PORTAL_URL}?type=itv&action=${action}`;
        if (cmd) targetUrl += `&cmd=${encodeURIComponent(cmd)}`;

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=Europe/Luxembourg;`,
                'Referer': 'http://globaltv1.net:8080/c/',
                'X-User-Agent': 'Model: MAG250; SW: 2.18-r14-pub-250'
            },
            timeout: 10000 
        });

        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        res.status(500).json({ error: "فشل الاتصال بسيرفر GlobalTV", details: error.message });
    }
};
