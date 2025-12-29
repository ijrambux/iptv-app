const player = videojs('main-video');

// قائمة القنوات المباشرة التي أرسلتها
const directChannels = [
    { name: "MisterAI Live 1", url: "http://185.226.172.11:8080/mo3ad/mo3ad1.m3u8" },
    { name: "MisterAI Live 2", url: "http://185.226.172.11:8080/mo3ad/mo3ad2.m3u8" },
    { name: "MisterAI Live 3", url: "http://185.226.172.11:8080/mo3ad/mo3ad3.m3u8" },
    { name: "MisterAI Live 4", url: "http://185.226.172.11:8080/mo3ad/mo3ad4.m3u8" },
    { name: "Global IPTV Index", url: "https://iptv-org.github.io/iptv/index.m3u" },
    { name: "BEK Prime Live", url: "https://cdn3.wowza.com/5/ZWQ1K2NYTmpFbGsr/BEK-WOWZA-1/smil:BEKPRIMEW.smil/playlist.m3u8" },
    { name: "Rakuten Top Movies UK", url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8" },
    { name: "Rakuten Action Finland", url: "https://bca5a421a70c46ad911efd0a4767c4bf.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/master.m3u8" },
    { name: "Rakuten Action Germany", url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8" },
    { name: "Rakuten Action Italy", url: "https://87f2e2e5e7624e3bad85da1ca2ed31a7.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6067/master.m3u8" },
    { name: "Rakuten Action Spain", url: "https://a9c57ec7ec5e4b7daeacc6316a0bb404.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6069/master.m3u8" },
    { name: "Rakuten Comedy UK", url: "https://9be783d652cd4b099cf63e1dc134c4a3.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6181/master.m3u8" },
    { name: "Rakuten Drama Italy", url: "https://f84e0b1628464fab846160df957f269e.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8" }
];

function enterApp() {
    document.getElementById('welcome-overlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('welcome-overlay').style.display = 'none';
        renderChannels(directChannels);
    }, 500);
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
    player.src({ src: url, type: 'application/x-mpegURL' });
    player.play();
}

function filterChannels() {
    const q = document.getElementById('search').value.toLowerCase();
    const filtered = directChannels.filter(c => c.name.toLowerCase().includes(q));
    renderChannels(filtered);
}
