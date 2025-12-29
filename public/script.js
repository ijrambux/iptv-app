const API_BASE = "/api/portal"; 

// دالة جلب القنوات المحدثة
async function fetchChannels(mac) {
    const list = document.getElementById('channel-list');
    list.innerHTML = "جاري الاتصال بالسيرفر...";
    
    try {
        const response = await fetch(`${API_BASE}?action=get_all_channels&mac=${mac}`);
        const data = await response.json();
        
        // إذا كان السيرفر يتطلب handshake أولاً، قد تحتاج لطلب إضافي هنا
        renderChannels(data.data || data);
    } catch (e) {
        list.innerHTML = "خطأ في جلب البيانات. قد يكون الماك محظوراً.";
    }
}
