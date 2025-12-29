const API_BASE = "/api/portal"; 
const MAC = "00:1A:79:25:06:93"; // الماك الجديد الشغال

const player = videojs('iptv-player', {
    fluid: true,
    controls: true,
    autoplay: false,
    preload: 'auto'
});

async function fetchChannels() {
    const listContainer = document.getElementById('channel-list');
    listContainer.innerHTML = '<div style="padding:20px;">جاري جلب 14,000 قناة...</div>';

    try {
        const response = await fetch(`${API_BASE}?action=get_all_channels&mac=${encodeURIComponent(MAC)}`);
        const data = await response.json();
        
        // السيرفر الجديد يرسل مصفوفة قنوات ضخمة
        const channels = data.js || data.data || data;

        if (Array.isArray(channels) && channels.length > 0) {
            renderChannels(channels);
        } else {
            listContainer.innerHTML = '<div style="padding:20px;">الماك يعمل ولكن لم يرسل قنوات. جرب تحديث الصفحة.</div>';
        }
    } catch (e) {
        listContainer.innerHTML = '<div style="padding:20px; color:red;">خطأ في الاتصال بالسيرفر الجديد.</div>';
    }
}

function renderChannels(channels) {
    const list = document.getElementById('channel-list');
    list.innerHTML = "";
    channels.forEach(ch => {
        if (ch.name) {
            const div = document.createElement('div');
            div.className = 'channel-card';
            div.innerText = ch.name;
            div.onclick = () => playStream(ch.cmd, ch.name);
            list.appendChild(div);
        }
    });
}

async function playStream(cmd, name) {
    try {
        const response = await fetch(`${API_BASE}?action=get_link&mac=${encodeURIComponent(MAC)}&cmd=${encodeURIComponent(cmd)}`);
        const data = await response.json();
        const streamUrl = data.cmd || data; 
        if (streamUrl && streamUrl.startsWith('http')) {
            player.src({ src: streamUrl, type: 'application/x-mpegURL' });
            player.play();
        }
    } catch (e) { alert("فشل تشغيل القناة"); }
}

document.addEventListener('DOMContentLoaded', fetchChannels);
