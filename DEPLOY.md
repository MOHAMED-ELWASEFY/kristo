# الرفع على GitHub Pages

الموقع الحالي: <https://mohamed-elwasefy.github.io/kristo/>
يعني فيه ريبو اسمه **`kristo`** تحت حسابك `mohamed-elwasefy`.

---

## الطريقة الأسهل — من المتصفح (بدون أي أدوات)

### 1. افتح الريبو
<https://github.com/mohamed-elwasefy/kristo>

### 2. امسح الملف القديم
- اضغط على `index.html`
- اضغط أيقونة **سلة المهملات** (Delete file) فوق على اليمين
- تحت: `Commit changes`

> الملف القديم لازم يتمسح لأنه هو اللي فيه الصورة الـ2.7 ميجا.

### 3. ارفع الملفات الجديدة
- من صفحة الريبو الرئيسية: `Add file` ← **`Upload files`**
- افتح فولدر `kristo-landing` على جهازك
- **اسحب المحتويات كلها** (مش الفولدر نفسه — المحتويات):
  ```
  index.html
  manifest.json
  robots.txt
  sitemap.xml
  css/          ← الفولدر بالكامل
  js/           ← الفولدر بالكامل
  images/       ← الفولدر بالكامل
  assets/       ← الفولدر بالكامل
  ```
- GitHub بيحافظ على شكل الفولدرات لوحده لما تسحبهم
- في خانة الوصف اكتب: `تحسين الأداء والتتبع`
- اضغط **`Commit changes`**

> ملفات `README.md` و`GTM-SETUP.md` و`DEPLOY.md` **اختيارية** — ارفعها لو حابب توثيق، ما بتأثرش على الموقع.

### 4. استنى دقيقة–دقيقتين
GitHub Pages بياخد وقت بسيط عشان ينشر. تقدر تتابع في تبويب `Actions`.

### 5. تأكد إن التحديث نزل
افتح الرابط **بوضع خفي (Incognito)** عشان تتفادى الكاش:
<https://mohamed-elwasefy.github.io/kristo/>

**علامات إن النسخة الجديدة شغالة:**
- الصفحة بتفتح فوراً تقريباً
- عنوان التبويب بقى: «كريستو | اطلب الآن — عرض الفروج المشوي»
- النص تحت الأزرار بقى: «نستخدم أدوات تحليلات لتحسين الخدمة.»

---

## بعد الرفع مباشرة — 3 خطوات إلزامية

### ✅ 1. اعمل إعداد GTM
افتح **`GTM-SETUP.md`** ونفّذ الخطوات. **من غيرها مفيش أي تتبع هيشتغل** — الكود بيدفع الأحداث بس ومحدش بيستقبلها.

### ✅ 2. حط UTM في رابط الإعلان
في TikTok Ads Manager غيّر الـ Website URL من:
```
https://mohamed-elwasefy.github.io/kristo/
```
إلى:
```
https://mohamed-elwasefy.github.io/kristo/?utm_source=tiktok&utm_medium=cpc&utm_campaign=kristo_farrouj&utm_content=video_v1
```
غيّر `utm_content` مع كل فيديو مختلف (`video_v1` · `video_v2`...) عشان تعرف أنهي فيديو بيجيب طلبات.

### ✅ 3. اختبر من موبايلك فعلاً
افتح الرابط من تليفونك واضغط الزرين. تأكد إن:
- الصفحة بتفتح في أقل من ثانيتين
- زر كيتا بيفتح تطبيق كيتا (أو صفحة المتجر)
- زر هنقرستيشن بيفتح تطبيق هنقرستيشن

---

## لو حابب تستخدم Git بدل المتصفح

```bash
git clone https://github.com/mohamed-elwasefy/kristo.git
cd kristo
# امسح القديم وانسخ الجديد
rm -rf index.html css js images assets
cp -r "/c/Users/Owner/تحليل مواقع جيت هب/kristo-landing/"* .
git add -A
git commit -m "تحسين الأداء والتتبع: إزالة صورة base64، إضافة GTM/GA4/UTM"
git push
```

---

## ⚠️ ملاحظة عن رابط كيتا

رابط كيتا الحالي بيعدّي **3 تحويلات** وبينتهي عند صفحة تشغيل تطبيق (`openType=appLaunch`):

```
url.mykeeta.com/Utilj9zz
  → fooddelivery.mykeeta.com.hk/.../share-content   (تحويل بجافاسكربت — بطيء)
    → m.keeta-global.com/marketing/applaunch/       (shopId=1430272191)
```

**مشكلتان:**
1. اللي ماعندهوش تطبيق كيتا بيوصل لصفحة «نزّل التطبيق» مش للمنيو
2. الرابط مثبّت جواه `utm_source=organic` — يعني تحليلات كيتا بتسجّل ترافيكك المدفوع كأنه مجاني

**الحل:** اطلب من مسؤول حسابك في كيتا **رابط متجر ويب مباشر (direct store link)**، وبدّله في:
- `index.html` — السطر بتاع `data-platform="Keeta"`
- `index.html` — داخل بلوك البيانات المنظّمة (`OrderAction` → `target`)

رابط هنقرستيشن سليم (ديب لينك Adjust) — سيبه زي ما هو.
