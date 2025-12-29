const player = videojs('vid');

const channels = [
    { name: "MisterAI Live 1", url: "http://185.226.172.11:8080/mo3ad/mo3ad1.m3u8" },
    { name: "MisterAI Live 2", url: "http://185.226.172.11:8080/mo3ad/mo3ad2.m3u8" },
    { name: "MisterAI Live 3", url: "http://185.226.172.11:8080/mo3ad/mo3ad3.m3u8" },
    { name: "MisterAI Live 4", url: "http://185.226.172.11:8080/mo3ad/mo3ad4.m3u8" },
    { name: "Global Index IPTV", url: "https://iptv-org.github.io/iptv/index.m3u" },
    { name: "BEK Prime WOWZA", url: "https://cdn3.wowza.com/5/ZWQ1K2NYTmpFbGsr/BEK-WOWZA-1/smil:BEKPRIMEW.smil/playlist.m3u8" },
    { name: "Rakuten Top Movies UK", url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8" },
    { name: "Rakuten Action Finland", url: "https://bca5a421a70c46ad911efd0a4767c4bf.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/master.m3u8" },
    { name: "Rakuten Action Germany", url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8" },
    { name: "Rakuten Action Italy", url: "https://87f2e2e5e7624e3bad85da1ca2ed31a7.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6067/master.m3u8" },
    { name: "Rakuten Action Spain", url: "https://a9c57ec7ec5e4b7daeacc6316a0bb404.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6069/master.m3u8" },
    { name: "Rakuten Action UK", url: "https://54045f0c40fd442c8b06df076aaf1e85.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8" },
    { name: "Rakuten Comedy Finland", url: "https://a300af98e00746e2acf2346f43e47bd1.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6191/master.m3u8" },
    { name: "Rakuten Comedy Germany", url: "https://ecac08c9e2214375b907d6825aaf9a01.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6182/master.m3u8" },
    { name: "Rakuten Comedy Italy", url: "https://b8bc6c4b9be64bd6aeb3b92aa8521ed4.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6184/master.m3u8" },
    { name: "Rakuten Comedy Spain", url: "https://71db867f03ce4d71a29e92155f07ab87.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6180/master.m3u8" },
    { name: "Rakuten Comedy UK", url: "https://9be783d652cd4b099cf63e1dc134c4a3.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6181/master.m3u8" },
    { name: "Rakuten Drama Finland", url: "https://d7e8ee3c924d4305a0c1840fe94c5d36.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6102/master.m3u8" },
    { name: "Rakuten Drama Germany", url: "https://968754c2483045c1a9a7f677caec35b6.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6096/master.m3u8" },
    { name: "Rakuten Drama Italy", url: "https://f84e0b1628464fab846160df957f269e.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8" },
    { name: "Rakuten Drama Spain", url: "https://a7089c89d85f453d850c4a1518b43076.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6092/master.m3u8" },
    { name: "Rakuten Drama UK", url: "https://fee09fd665814f51b939b6d106cf5f66.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6093/master.m3u8" },
    { name: "Rakuten Nordic Films", url: "https://4aa9ef08b70d4b0c8f3519c5950b1930.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6303/master.m3u8" },
    { name: "Rakuten Top Finland", url: "https://1d1b0d4cb6ae4c31985d13221795695b.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6057/master.m3u8" },
    { name: "Rakuten Top Germany", url: "https://cbb622b29f5d43b598991f3fa19de291.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5985/master.m3u8" }
];

function start() {
    document.getElementById('welcome').style.display = 'none';
    const listDiv = document.getElementById('list');
    channels.forEach(ch => {
        const d = document.createElement('div');
        d.className = 'item';
        d.innerHTML = `<i class="fas fa-play-circle"></i> ${ch.name}`;
        d.onclick = () => {
            // حل ذكي لقنوات HTTP المرفوضة من المتصفح
            let finalUrl = ch.url;
            if (ch.url.startsWith('http:')) {
                finalUrl = `/api/portal?action=proxy&stream=${encodeURIComponent(ch.url)}`;
            }
            player.src({ src: finalUrl, type: 'application/x-mpegURL' });
            player.play();
        };
        listDiv.appendChild(d);
    });
}
