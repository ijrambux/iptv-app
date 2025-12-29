const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, streamUrl, host, mac, cmd } = req.query;

    // جزء البروكسي لتشغيل روابط Mo3ad
    if (action === 'proxy_stream' && streamUrl) {
        try {
            const response = await axios({
                method: 'get',
                url: streamUrl,
                responseType: 'stream',
                timeout: 15000
            });
            response.data.pipe(res);
            return;
        } catch (e) {
            return res.status(500).json({ error: "Proxy Failed" });
        }
    }

    // جزء الـ Stalker Portal (للسيرفرات التي تحتاج ماك)
    if (host && mac) {
        let cleanHost = host.replace(/\/c$/, "").replace(/\/$/, "");
        const targetUrl = `${cleanHost}/portal.php?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;

        try {
            const response = await axios.get(targetUrl, {
                headers: {
                    'User-Agent': 'MAG250',
                    'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en;`
                }
            });
            return res.status(200).json(response.data.js || response.data);
        } catch (e) {
            return res.status(500).json({ error: "Portal Offline" });
        }
    }

    res.status(400).send("Bad Request");
};
