const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORTAL_URL = 'http://40935-kelkoo.cloud-ott.me:80/portal.php';

// دالة لجلب البيانات من السيرفر بـ MAC Address معين
async function stalkerRequest(action, mac, additionalParams = '') {
    const url = `${PORTAL_URL}?type=itv&action=${action}${additionalParams}`;
    return axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 sb.713 Safari/533.3',
            'Cookie': `mac=${encodeURIComponent(mac)}; stb_lang=en; timezone=GMT;`
        }
    });
}

// 1. مسار جلب القنوات
app.get('/channels', async (req, res) => {
    try {
        const { mac } = req.query;
        const response = await stalkerRequest('get_all_channels', mac);
        res.json(response.data.js || response.data);
    } catch (error) {
        res.status(500).json({ error: "فشل جلب القنوات" });
    }
});

// 2. مسار جلب رابط البث المباشر (Token)
app.get('/play', async (req, res) => {
    try {
        const { mac, cmd } = req.query;
        const response = await stalkerRequest('get_link', mac, `&cmd=${encodeURIComponent(cmd)}`);
        res.json(response.data.js || response.data);
    } catch (error) {
        res.status(500).json({ error: "فشل جلب رابط البث" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
