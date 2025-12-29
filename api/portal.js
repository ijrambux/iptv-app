const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { action, stream } = req.query;

    if (action === 'proxy' && stream) {
        try {
            const response = await axios({
                method: 'get',
                url: stream,
                responseType: 'stream',
                timeout: 10000
            });
            // تمرير الفيديو مباشرة للمتصفح كأنه من موقعك
            response.data.pipe(res);
        } catch (e) {
            res.status(500).json({ error: "فشل الاتصال برابط البث" });
        }
    } else {
        res.status(400).send("طلب غير صحيح");
    }
};
