const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, streamUrl } = req.query;

    // إذا كان الطلب تشغيل رابط مباشر (مثل قنوات Mo3ad)
    if (action === 'proxy_stream' && streamUrl) {
        try {
            const response = await axios({
                method: 'get',
                url: streamUrl,
                responseType: 'stream'
            });
            response.data.pipe(res);
            return;
        } catch (e) {
            return res.status(500).send("خطأ في جلب البث");
        }
    }
    
    // ... (باقي كود الـ Stalker Portal القديم يظل كما هو هنا)
};
