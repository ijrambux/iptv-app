let allChannels = [];
const player = videojs('iptv-player');

async function loadChannels() {
    const listDiv = document.getElementById('channel-list');
    const [host, mac] = document.getElementById('server-select').value.split('|');
    
    listDiv.innerHTML = '<div class="loading">جاري جلب آلاف القنوات...</div>';

    try {
        const response = await fetch(`/api/portal?action=get_all_channels&host=${encodeURIComponent(host)}&mac=${mac}`);
        const data = await response.json();
        
        allChannels = data.js || data;
        displayChannels(allChannels);
    } catch (e) {
        listDiv.innerHTML = '<div class="loading" style="color:red;">فشل الاتصال بهذا السيرفر.</div>';
    }
}

function displayChannels(channels) {
    const listDiv = document.getElementById('channel-list');
    listDiv.innerHTML = '';
    
    if (!Array.isArray(channels)) return;

    channels.forEach(ch => {
        if (ch.name) {
            const div = document.createElement('div');
            div.className = 'channel-item';
            div.innerText = ch.name;
            div.onclick = () => playStream(ch.cmd);
            listDiv.appendChild(div);
        }
    });
}

function filterChannels() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = allChannels.filter(c => c.name.toLowerCase().includes(query));
    displayChannels(filtered);
}

async function playStream(cmd) {
    const [host, mac] = document.getElementById('server-select').value.split('|');
    try {
        const res = await fetch(`/api/portal?action=get_link&host=${encodeURIComponent(host)}&mac=${mac}&cmd=${encodeURIComponent(cmd)}`);
        const data = await res.json();
        const url = data.cmd || data;
        
        if (url && url.startsWith('http')) {
            player.src({ src: url, type: 'application/x-mpegURL' });
            player.play();
        }
    } catch (e) { alert("خطأ في تشغيل الرابط"); }
}

// تشغيل السيرفر الأول تلقائياً عند الفتح
window.onload = loadChannels;
