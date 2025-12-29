const axios = require('axios');

module.exports = async (req, res) => {
    const { action, mac, cmd } = req.query;
    const TARGET = 'http://globaltv1.net:8080/portal.php';

    try {
        let url = `${TARGET}?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'MAG250',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=Europe/Luxembourg;`,
                'Referer': 'http://globaltv1.net:8080/c/'
            }
        });
        res.status(200).json(response.data.js || response.data);
    } catch (e) {
        res.status(500).json({ error: "Server Offline" });
    }
};
