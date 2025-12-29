const player = videojs('main-video');

const channels = [
    { name: "MisterAI Live 1", url: "http://185.226.172.11:8080/mo3ad/mo3ad1.m3u8" },
    { name: "MisterAI Live 2", url: "http://185.226.172.11:8080/mo3ad/mo3ad2.m3u8" },
    { name: "MisterAI Live 3", url: "http://185.226.172.11:8080/mo3ad/mo3ad3.m3u8" },
    { name: "MisterAI Live 4", url: "http://185.226.172.11:8080/mo3ad/mo3ad4.m3u8" },
    { name: "Rakuten Movies UK", url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8" },
    { name: "Rakuten Action Germany", url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8" },
    { name: "BEK Prime", url: "https://cdn3.wowza.com/5/ZWQ1K2NYTmpFbGsr/BEK-WOWZA-1/smil:BEKPRIMEW.smil/playlist.m3u8" }
];

function enterApp() {
    const overlay = document.getElementById('welcome-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        renderChannels(channels);
    }, 800);
}

function renderChannels(list) {
    const container = document.getElementById('channel-list');
    container.innerHTML = '';
    list.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'channel-card';
        div.innerHTML = `<i class="fas fa-play-circle"></i> <span>${ch.name}</span>`;
        div.onclick = () => playChannel(ch.url);
        container.appendChild(div);
    });
}

function playChannel(url) {
    let finalUrl = url;
    // إذا كان الرابط http، نستخدم البروكسي لتجنب حظر المتصفح
    if (url.startsWith('http:')) {
        finalUrl = `/api/portal?action=proxy_stream&streamUrl=${encodeURIComponent(url)}`;
    }
    
    player.src({ src: finalUrl, type: 'application/x-mpegURL' });
    player.play().catch(e => console.log("خطأ في التشغيل"));
}

function filterChannels() {
    const q = document.getElementById('search').value.toLowerCase();
    const filtered = channels.filter(c => c.name.toLowerCase().includes(q));
    renderChannels(filtered);
}
