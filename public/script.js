let currentMac = document.getElementById('mac-selector').value;
const player = videojs('iptv-player');

function updateMac(val) {
    currentMac = val;
    fetchChannels();
}

async function fetchChannels() {
    const list = document.getElementById('channel-list');
    list.innerHTML = "جاري التحميل...";
    try {
        const res = await fetch(`/api/portal?action=get_all_channels&mac=${currentMac}`);
        const data = await res.json();
        const channels = data.data || data;
        
        list.innerHTML = "";
        channels.forEach(ch => {
            const div = document.createElement('div');
            div.className = 'channel-card';
            div.innerText = ch.name;
            div.onclick = () => playChannel(ch.cmd, ch.name);
            list.appendChild(div);
        });
    } catch (e) { list.innerHTML = "خطأ في جلب البيانات"; }
}

async function playChannel(cmd, name) {
    document.getElementById('status').innerText = "جاري تشغيل: " + name;
    try {
        const res = await fetch(`/api/portal?action=get_link&mac=${currentMac}&cmd=${encodeURIComponent(cmd)}`);
        const data = await res.json();
        const url = data.cmd || data;
        player.src({ src: url, type: 'application/x-mpegURL' });
        player.play();
    } catch (e) { alert("فشل تشغيل القناة"); }
}

fetchChannels();
