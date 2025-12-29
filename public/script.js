// إعدادات الاتصال
const API_BASE = "/api/portal"; 
const MAC = "00:1A:79:4c:ca:58"; // يمكنك تغيير الماك هنا أو جعله متغيراً

// تهيئة مشغل الفيديو (Video.js)
const player = videojs('iptv-player', {
    fluid: true,
    html5: {
        vhs: { overrideNative: true },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
    }
});

// دالة جلب القنوات عند تحميل الصفحة
async function fetchChannels() {
    const listContainer = document.getElementById('channel-list');
    listContainer.innerHTML = '<div style="padding:20px;">جاري تحميل القنوات...</div>';

    try {
        // نطلب الأكشن get_all_channels من الـ API الخاص بنا
        const response = await fetch(`${API_BASE}?action=get_all_channels&mac=${encodeURIComponent(MAC)}`);
        const data = await response.json();

        // السيرفر عادة يرسل البيانات داخل data أو مباشرة
        const channels = data.data || data;
        renderChannels(channels);
    } catch (e) {
        console.error("Fetch Error:", e);
        listContainer.innerHTML = '<div style="padding:20px; color:red;">فشل الاتصال بالسيرفر. تأكد من تشغيل الـ API</div>';
    }
}

// دالة عرض القنوات في القائمة الجانبية
function renderChannels(channels) {
    const list = document.getElementById('channel-list');
    list.innerHTML = "";

    if (!Array.isArray(channels)) {
        list.innerHTML = '<div style="padding:20px;">لا توجد قنوات متاحة لهذا الماك</div>';
        return;
    }

    channels.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'channel-card';
        div.innerText = ch.name;
        // عند الضغط، نرسل الـ cmd الخاص بالقناة لجلب رابط البث
        div.onclick = () => playStream(ch.cmd, ch.name);
        list.appendChild(div);
    });
}

// دالة جلب رابط البث وتشغيله
async function playStream(cmd, name) {
    const statusText = document.getElementById('current-channel');
    statusText.innerText = "جاري جلب رابط: " + name;

    try {
        // نطلب get_link للحصول على رابط m3u8 الحقيقي
        const response = await fetch(`${API_BASE}?action=get_link&mac=${encodeURIComponent(MAC)}&cmd=${encodeURIComponent(cmd)}`);
        const data = await response.json();
        
        // الرابط يكون عادة في حقل cmd أو الرابط مباشرة
        const streamUrl = data.cmd || data; 

        if (streamUrl && streamUrl.includes('http')) {
            player.src({
                src: streamUrl,
                type: 'application/x-mpegURL'
            });
            player.play();
            statusText.innerText = "أنت تشاهد الآن: " + name;
        } else {
            alert("هذه القناة غير متاحة حالياً أو الماك ادرس منتهي.");
        }
    } catch (e) {
        console.error("Play Error:", e);
        alert("خطأ في تشغيل القناة");
    }
}

// تشغيل جلب القنوات فور فتح الصفحة
fetchChannels();
