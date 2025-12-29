const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, host, mac, cmd } = req.query;

    // استخدام الماك الافتراضي من صورتك إذا لم يرسل المتصفح ماك محدد
    const finalMac = mac || "00:1A:79:4c:ca:58"; 
    const finalHost = host || "http://globaltv1.net:8080";

    let cleanHost = finalHost.replace(/\/c\/?$/, "");
    const targetUrl = `${cleanHost}/portal.php?type=itv&action=${action}${cmd ? '&cmd=' + encodeURIComponent(cmd) : ''}`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'MAG250',
                'Cookie': `mac=${encodeURIComponent(finalMac)}; stb_lang=en; timezone=GMT;`,
                'Referer': `${cleanHost}/c/`
            }
        });
        res.status(200).json(response.data.js || response.data);
    } catch (error) {
        res.status(200).json({ error: "فشل جلب البيانات", details: error.message });
    }
};
