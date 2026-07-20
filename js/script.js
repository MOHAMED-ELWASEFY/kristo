/* ==========================================================================
   Kristo Landing Page — Tracking & UTM
   --------------------------------------------------------------------------
   مسؤوليات الملف:
   1. حفظ معاملات UTM القادمة من الإعلان وتمريرها لروابط الطلب الخارجية.
   2. دفع أحداث dataLayer عشان GTM يقدر يربطها بـ GA4 و TikTok Pixel.

   ملاحظة مهمة: مفيش أي Pixel ID أو Measurement ID مكتوب هنا بشكل مباشر.
   كل الربط بيتم من واجهة Google Tag Manager — راجع GTM-SETUP.md.
   ========================================================================== */

(function () {
  "use strict";

  /* dataLayer لازم يكون موجود حتى لو GTM اتأخر أو اتحجب */
  window.dataLayer = window.dataLayer || [];

  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
  ];

  /* معاملات إضافية بيبعتها تيك توك ومفيدة للربط */
  var EXTRA_KEYS = ["ttclid", "gclid", "fbclid"];

  var STORAGE_KEY = "kristo_attribution";

  /* ----------------------------------------------------------------------
     1) الإسناد (Attribution)
     بنقرا المعاملات من الرابط أول ما الصفحة تفتح ونخزنها في sessionStorage.
     السبب: لو المستخدم رجع للصفحة من غير معاملات (back button مثلاً)
     نفضل عارفين إنه أصلاً جه من الإعلان.
     --------------------------------------------------------------------- */
  function readAttribution() {
    var params = new URLSearchParams(window.location.search);
    var fresh = {};
    var hasFresh = false;

    UTM_KEYS.concat(EXTRA_KEYS).forEach(function (key) {
      var value = params.get(key);
      if (value) {
        fresh[key] = value;
        hasFresh = true;
      }
    });

    if (hasFresh) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      } catch (e) {
        /* الوضع الخاص / التصفح المتخفي — نكمل عادي بدون تخزين */
      }
      return fresh;
    }

    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  var attribution = readAttribution();

  /* ----------------------------------------------------------------------
     2) إلحاق المعاملات بالروابط الخارجية
     مُتحقَّق منه: رابط كيتا المختصر بيمرّر المعاملات للوجهة النهائية،
     ورابط هنقرستيشن (Adjust go.link) بيتجاهل المعاملات غير المعروفة بأمان.
     القاعدة: ممنوع حذف أو تعديل أي معامل موجود أصلاً في الرابط.
     --------------------------------------------------------------------- */
  function decorateUrl(rawUrl) {
    var keys = Object.keys(attribution);
    if (!keys.length) return rawUrl;

    try {
      var url = new URL(rawUrl);
      keys.forEach(function (key) {
        if (!url.searchParams.has(key)) {
          url.searchParams.set(key, attribution[key]);
        }
      });
      return url.toString();
    } catch (e) {
      return rawUrl; /* رابط غير صالح — نسيبه زي ما هو */
    }
  }

  /* ----------------------------------------------------------------------
     3) الحمولة المشتركة لكل حدث
     --------------------------------------------------------------------- */
  function basePayload(extra) {
    var payload = {
      page_title: document.title,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    };

    Object.keys(attribution).forEach(function (key) {
      payload[key] = attribution[key];
    });

    Object.keys(extra || {}).forEach(function (key) {
      payload[key] = extra[key];
    });

    return payload;
  }

  function push(eventName, extra) {
    var payload = basePayload(extra);
    payload.event = eventName;
    window.dataLayer.push(payload);
  }

  /* ----------------------------------------------------------------------
     4) أحداث تحميل الصفحة
     - page_view_ready: إشارة إن بيانات الإسناد جاهزة (GA4 بيسجّل
       page_view لوحده، ده للأحداث اللي محتاجة الإسناد).
     - view_content: مُجهّز لربطه بـ TikTok ViewContent من GTM.
     --------------------------------------------------------------------- */
  push("page_view_ready", { has_attribution: Object.keys(attribution).length > 0 });

  push("view_content", {
    content_type: "product",
    content_name: "عرض الفروج المشوي",
    content_id: "kristo-farrouj-offer",
    currency: "SAR"
  });

  /* ----------------------------------------------------------------------
     5) تتبع ضغطات أزرار الطلب
     كل زر بيدفع 3 أحداث:
       أ) حدث خاص بالمنصة   → click_keeta / click_hungerstation
       ب) حدث عام           → outbound_click
       ج) حدث تيك توك جاهز  → click_button + initiate_checkout
     ترتيب الأحداث مقصود: بندفع الأحداث الأول وبعدين نسيب المتصفح
     يكمّل التنقل طبيعي (الروابط target="_blank" فما فيش سباق).
     --------------------------------------------------------------------- */
  var PLATFORM_EVENTS = {
    Keeta: "click_keeta",
    HungerStation: "click_hungerstation"
  };

  function handleOrderClick(link) {
    var platform = link.dataset.platform;
    var destination = link.href;

    var details = {
      button_name: platform,
      destination: destination,
      platform: platform
    };

    /* أ) الحدث الخاص بالمنصة */
    push(PLATFORM_EVENTS[platform] || "click_order", details);

    /* ب) حدث الروابط الخارجية العام */
    push("outbound_click", details);

    /* ج) أحداث جاهزة لـ TikTok Pixel (تتفعّل من GTM) */
    push("click_button", {
      content_name: platform,
      content_id: "order-btn-" + platform.toLowerCase()
    });

    push("initiate_checkout", {
      content_type: "product",
      content_name: "عرض الفروج المشوي",
      content_id: "kristo-farrouj-offer",
      currency: "SAR",
      platform: platform
    });
  }

  var orderLinks = document.querySelectorAll("[data-platform]");

  Array.prototype.forEach.call(orderLinks, function (link) {
    /* نلحق معاملات الإسناد مرة واحدة عند التحميل */
    link.href = decorateUrl(link.href);

    link.addEventListener("click", function () {
      handleOrderClick(link);
    });

    /* الضغط بالكيبورد (Enter) بيطلق click تلقائياً فمفيش كود إضافي */
  });

  /* ----------------------------------------------------------------------
     6) روابط داخلية (زر «اطلب الآن» في الهيدر)
     --------------------------------------------------------------------- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  Array.prototype.forEach.call(anchorLinks, function (link) {
    link.addEventListener("click", function () {
      push("cta_scroll", {
        button_name: link.textContent.trim(),
        destination: link.getAttribute("href")
      });
    });
  });

  /* ----------------------------------------------------------------------
     7) سنة الفوتر — تتحدّث لوحدها كل سنة
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
