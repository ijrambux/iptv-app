// إعدادات الاتصال - نستخدم المسار النسبي ليعمل على Vercel
const API_BASE = "/api/portal"; 
const MAC = "00:1A:79:4c:ca:58"; // يمكنك تغيير الماك هنا لتجربة الماكات الأخرى

// تهيئة مشغل الفيديو (Video.js)
const player = videojs('iptv-player', {
    fluid: true,
    controls: true,
    autoplay: false,
    preload: 'auto'
});

// دالة جلب القنوات عند تحميل الصفحة
async function fetchChannels() {
    const listContainer = document.getElementById('channel-list');
    listContainer.innerHTML = '<div style="padding:20px;">جاري الاتصال بالسيرفر...</div>';

    try {
        // نرسل الأكشن والماك إلى ملف api/portal.js
        const response = await fetch(`${API_BASE}?action=get_all_channels&mac=${encodeURIComponent(MAC)}`);
        
        if (!response.ok) {
            throw new Error("السيرفر لا يستجيب (Error 500/404)");
        }

        const data = await response.json();
        
        // سيرفرات Stalker تعيد البيانات غالباً في مصفوفة مباشرة أو داخل حقل data
        const channels = data.js || data.data || data;

        if (Array.isArray(channels) && channels.length > 0) {
            renderChannels(channels);
        } else {
            listContainer.innerHTML = '<div style="padding:20px;">لا توجد قنوات متاحة لهذا الماك حالياً.</div>';
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        listContainer.innerHTML = `<div style="padding:20px; color:#ff4444;">خطأ في الاتصال: ${e.message}</div>`;
    }
}

// دالة عرض القنوات في القائمة
function renderChannels(channels) {
    const list = document.getElementById('channel-list');
    list.innerHTML = "";

    channels.forEach(ch => {
        // نتأكد من وجود اسم وقيمة cmd للقناة
        if (ch.name && ch.cmd) {
            const div = document.createElement('div');
            div.className = 'channel-card';
            div.innerText = ch.name;
            div.onclick = () => playStream(ch.cmd, ch.name);
            list.appendChild(div);
        }
    });
}

// دالة جلب رابط البث وتشغيله
async function playStream(cmd, name) {
    const statusText = document.getElementById('status') || { innerText: "" };
    statusText.innerText = "جاري جلب رابط: " + name;

    try {
        // نطلب الرابط الحقيقي (Tokenized URL) باستخدام الأكشن get_link
        const response = await fetch(`${API_BASE}?action=get_link&mac=${encodeURIComponent(MAC)}&cmd=${encodeURIComponent(cmd)}`);
        const data = await response.json();
        
        // الرابط المسترجع من السيرفر
        const streamUrl = data.cmd || data; 

        if (streamUrl && streamUrl.startsWith('http')) {
            player.src({
                src: streamUrl,
                type: 'application/x-mpegURL' // صيغة HLS المعتادة لهذه السيرفرات
            });
            player.play();
            statusText.innerText = "أنت تشاهد الآن: " + name;
        } else {
            alert("عذراً، رابط البث غير متوفر لهذه القناة.");
        }
    } catch (e) {
        console.error("Play Error:", e);
        alert("حدث خطأ أثناء محاولة تشغيل القناة.");
    }
}

// تشغيل جلب القنوات فور تحميل الملف
document.addEventListener('DOMContentLoaded', fetchChannels);
