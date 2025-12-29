const player = videojs('vid');
let allChannels = [];

// 1. قنوات Mo3ad و Rakuten المباشرة
const priorityChannels = [
    { name: "MisterAI Live 1", url: "http://185.226.172.11:8080/mo3ad/mo3ad1.m3u8" },
    { name: "MisterAI Live 2", url: "http://185.226.172.11:8080/mo3ad/mo3ad2.m3u8" },
    { name: "MisterAI Live 3", url: "http://185.226.172.11:8080/mo3ad/mo3ad3.m3u8" },
    { name: "MisterAI Live 4", url: "http://185.226.172.11:8080/mo3ad/mo3ad4.m3u8" },
    { name: "Rakuten Top Movies UK", url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8" },
    { name: "Rakuten Action Germany", url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8" },
    { name: "Rakuten Comedy Spain", url: "https://71db867f03ce4d71a29e92155f07ab87.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6180/master.m3u8" },
    { name: "Rakuten Drama Italy", url: "https://f84e0b1628464fab846160df957f269e.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8" },
    { name: "BEK Prime WOWZA", url: "https://cdn3.wowza.com/5/ZWQ1K2NYTmpFbGsr/BEK-WOWZA-1/smil:BEKPRIMEW.smil/playlist.m3u8" }
];

// 2. الروابط العالمية الضخمة
const remotePlaylists = [
    "https://iptv-org.github.io/iptv/index.m3u",
    "https://iptv-org.github.io/iptv/index.m3u?fbclid=IwY2xjawO-iLJleHRuA2FlbQIxMABicmlkETBvRlpxM0ZJRXNURG5lZGlQc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHiB3fgMioWgT2eRk-Aj3aVIlOAz0qfP9vr-YP3nHVxHQHUsQcWZuMRsNBDbu_aem_a5Eji-B5SwiAgaUElwjcnQ"
];

async function startApp() {
    document.getElementById('welcome').style.display = 'none';
    
    // إظهار القنوات الأساسية فوراً
    allChannels = [...priorityChannels];
    renderList(allChannels);

    // جلب القنوات من الروابط الضخمة في الخلفية
    document.getElementById('loading').style.display = 'block';
    for (let url of remotePlaylists) {
        try {
            const res = await fetch(url);
            const text = await res.text();
            const parsed = parseM3U(text);
            allChannels = [...allChannels, ...parsed];
            renderList(allChannels); // تحديث القائمة تدريجياً
        } catch (e) { console.error("خطأ في جلب القائمة"); }
    }
    document.getElementById('loading').style.display = 'none';
}

function parseM3U(data) {
    const lines = data.split('\n');
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
            const nameMatch = lines[i].split(',')[1];
            const url = lines[i+1]?.trim();
            if (url && url.startsWith('http')) {
                result.push({ name: nameMatch ? nameMatch.trim() : "Channel", url: url });
            }
        }
    }
    return result;
}

function renderList(array) {
    const listDiv = document.getElementById('list');
    listDiv.innerHTML = '';
    // عرض أول 300 قناة فقط للأداء العالي (الباقي يظهر بالبحث)
    const displayArray = array.length > 300 ? array.slice(0, 300) : array;
    displayArray.forEach(ch => {
        const d = document.createElement('div');
        d.className = 'item';
        d.innerHTML = `<i class="fas fa-play-circle" style="margin-left:10px; color:var(--main)"></i> ${ch.name}`;
        d.onclick = () => playChannel(ch.url);
        listDiv.appendChild(d);
    });
}

function filterChannels() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allChannels.filter(c => c.name.toLowerCase().includes(query));
    renderList(filtered);
}

function playChannel(url) {
    let finalUrl = url;
    // نظام البروكسي لقنوات HTTP لتعمل على Vercel
    if (url.startsWith('http:')) {
        finalUrl = `/api/portal?action=proxy&stream=${encodeURIComponent(url)}`;
    }
    player.src({ src: finalUrl, type: 'application/x-mpegURL' });
    player.play();
}
