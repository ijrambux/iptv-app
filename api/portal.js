const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, mac, cmd } = req.query;
    const PORTAL_URL = 'http://40935-kelkoo.cloud-ott.me:80/portal.php';

    try {
        const url = `${PORTAL_URL}?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=GMT;`
            }
        });
        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        res.status(500).json({ error: "Portal Error" });
    }
};
