const MAC = "00:1A:79:4c:ca:58"; // يمكنك تغيير الماك هنا
const API_BASE = "http://localhost:3000";
const player = videojs('iptv-player');

async function fetchChannels() {
    try {
        const response = await fetch(`${API_BASE}/channels?mac=${MAC}`);
        const data = await response.json();
        renderChannels(data.data);
    } catch (e) {
        document.getElementById('channel-list').innerText = "فشل الاتصال بالسيرفر";
    }
}

function renderChannels(channels) {
    const list = document.getElementById('channel-list');
    list.innerHTML = "";
    channels.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'channel-card';
        div.innerText = ch.name;
        div.onclick = () => playStream(ch.cmd, ch.name);
        list.appendChild(div);
    });
}

async function playStream(cmd, name) {
    document.getElementById('current-channel').innerText = "جاري فتح: " + name;
    try {
        const response = await fetch(`${API_BASE}/play?mac=${MAC}&cmd=${encodeURIComponent(cmd)}`);
        const data = await response.json();
        
        // جلب الرابط الحقيقي من رد السيرفر
        const streamUrl = data.cmd || data; 
        
        player.src({
            src: streamUrl,
            type: 'application/x-mpegURL'
        });
        player.play();
    } catch (e) {
        alert("خطأ في تشغيل القناة");
    }
}

fetchChannels();
