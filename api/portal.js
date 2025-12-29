const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, host, mac, cmd } = req.query;

    if (!host || !mac) {
        return res.status(200).json({ error: "Missing Host or MAC" });
    }

    // تنظيف الرابط لضمان الوصول إلى portal.php
    let cleanHost = host.replace(/\/c\/?$/, "").replace(/\/stalker_portal\/?$/, "").replace(/\/$/, "");
    const targetUrl = `${cleanHost}/portal.php?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'MAG250',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=Europe/Luxembourg;`,
                'Referer': `${cleanHost}/c/`
            }
        });
        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        res.status(200).json({ error: "Connection Failed", details: error.message });
    }
};
