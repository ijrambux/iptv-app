// تأكد أن هذا السطر هو الوحيد المسؤول عن العنوان
const API_BASE = "/api/portal"; 
const MAC = "00:1A:79:4c:ca:58"; 

const player = videojs('iptv-player');

async function fetchChannels() {
    const list = document.getElementById('channel-list');
    try {
        // نرسل طلب للـ API الخاص بنا على Vercel
        const response = await fetch(`${API_BASE}?action=get_all_channels&mac=${MAC}`);
        
        if (!response.ok) throw new Error("السيرفر لا يستجيب");

        const data = await response.json();
        const channels = data.data || data;

        if (!channels || channels.length === 0) {
            list.innerHTML = "الماك لا يحتوي على قنوات حالياً";
            return;
        }

        list.innerHTML = "";
        channels.forEach(ch => {
            const div = document.createElement('div');
            div.className = 'channel-card';
            div.innerText = ch.name;
            div.onclick = () => playStream(ch.cmd, ch.name);
            list.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        list.innerHTML = "خطأ في الاتصال: " + e.message;
    }
}

async function playStream(cmd, name) {
    try {
        const response = await fetch(`${API_BASE}?action=get_link&mac=${MAC}&cmd=${encodeURIComponent(cmd)}`);
        const data = await response.json();
        const streamUrl = data.cmd || data; 

        player.src({ src: streamUrl, type: 'application/x-mpegURL' });
        player.play();
    } catch (e) {
        alert("فشل تشغيل القناة");
    }
}

fetchChannels();
