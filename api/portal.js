const axios = require('axios');

module.exports = async (req, res) => {
    const { action, host, mac, cmd } = req.query;
    
    // تنظيف الرابط من /c أو /stalker_portal/c لضمان العمل مع portal.php
    const cleanHost = host.replace(/\/c$/, '').replace(/\/stalker_portal\/c$/, '');
    const targetUrl = `${cleanHost}/portal.php?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'MAG250',
                'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=Europe/Luxembourg;`,
                'Referer': `${cleanHost}/c/`,
                'Connection': 'Keep-Alive'
            }
        });

        // السماح بالوصول من أي مكان (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Portal Error", message: error.message });
    }
};
