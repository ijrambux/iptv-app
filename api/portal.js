const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, mac, cmd } = req.query;
    const PORTAL_URL = 'http://40935-kelkoo.cloud-ott.me:80/portal.php';

    try {
        // خطوة إضافية: Handshake لضمان قبول السيرفر للطلب
        await axios.get(`${PORTAL_URL}?type=stb&action=handshake`, {
            headers: { 'User-Agent': 'MAG250' }
        });

        // الطلب الأساسي
        let targetUrl = `${PORTAL_URL}?type=itv&action=${action}`;
        if (cmd) targetUrl += `&cmd=${encodeURIComponent(cmd)}`;

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=GMT;`,
                'Referer': 'http://40935-kelkoo.cloud-ott.me/c/'
            }
        });

        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        res.status(500).json({ error: "Portal Offline", details: error.message });
    }
};
