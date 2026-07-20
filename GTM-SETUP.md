# إعداد Google Tag Manager — خطوة بخطوة

> ⚠️ **الجزء ده لازم يتعمل بإيدك في واجهة GTM.** الكود اللي في الموقع بيدفع الأحداث للـ`dataLayer` بس، وGTM هو اللي بيوصّلها لـGA4 وتيك توك. من غير الخطوات دي **مش هتشوف أي بيانات**.

- **حاوية GTM:** `GTM-KQ4663FC`
- **معرّف GA4:** `G-QNNRG5D658`
- الرابط: <https://tagmanager.google.com>

---

## الأحداث اللي الموقع بيدفعها

الموقع بيدفع الأحداث دي تلقائياً — انت بس بتربطها:

| الحدث | إمتى بيتطلق | المعاملات |
|---|---|---|
| `page_view_ready` | أول ما الصفحة تفتح | `has_attribution` + كل الـUTM |
| `view_content` | أول ما الصفحة تفتح | `content_type` · `content_name` · `content_id` · `currency` |
| `click_keeta` | ضغط زر كيتا | `button_name` · `destination` · `platform` |
| `click_hungerstation` | ضغط زر هنقرستيشن | نفس المعاملات |
| `outbound_click` | أي ضغط على زر طلب | نفس المعاملات |
| `click_button` | أي ضغط على زر طلب | `content_name` · `content_id` |
| `initiate_checkout` | أي ضغط على زر طلب | `content_type` · `content_name` · `content_id` · `currency` · `platform` |
| `cta_scroll` | ضغط زر «اطلب الآن» في الهيدر | `button_name` · `destination` |

**كل حدث كمان بيحمل:** `page_title` · `page_location` · `timestamp` · `utm_source` · `utm_medium` · `utm_campaign` · `utm_content` · `utm_term` · `ttclid`

---

## الخطوة 1 — متغيّرات Data Layer

`Variables` ← `User-Defined Variables` ← `New` ← `Data Layer Variable`

اعمل متغيّر لكل واحد من دول (اسم المتغيّر = اسم الـData Layer Variable Name بالظبط):

```
button_name
destination
platform
content_name
content_id
content_type
currency
page_title
page_location
timestamp
utm_source
utm_medium
utm_campaign
utm_content
utm_term
ttclid
has_attribution
```

> سمّي كل واحد `DLV - <الاسم>` عشان تلاقيهم بسهولة.

---

## الخطوة 2 — تفعيل المتغيّرات المدمجة

`Variables` ← `Configure` ← فعّل:

`Page URL` · `Page Path` · `Page Hostname` · `Referrer` · `Click URL` · `Click Text` · `Event`

---

## الخطوة 3 — وسم GA4 الأساسي

`Tags` ← `New` ← `Google Analytics: GA4 Configuration`

| الحقل | القيمة |
|---|---|
| Measurement ID | `G-QNNRG5D658` |
| Trigger | `Initialization - All Pages` |

سمّيه: **`GA4 - Config`**

---

## الخطوة 4 — المشغّلات (Triggers)

`Triggers` ← `New` ← `Custom Event` لكل واحد:

| اسم المشغّل | Event name |
|---|---|
| `CE - click_keeta` | `click_keeta` |
| `CE - click_hungerstation` | `click_hungerstation` |
| `CE - outbound_click` | `outbound_click` |
| `CE - view_content` | `view_content` |
| `CE - initiate_checkout` | `initiate_checkout` |
| `CE - click_button` | `click_button` |
| `CE - cta_scroll` | `cta_scroll` |

---

## الخطوة 5 — وسوم أحداث GA4

`Tags` ← `New` ← `Google Analytics: GA4 Event`

### وسم 1: ضغط كيتا
| الحقل | القيمة |
|---|---|
| Configuration Tag | `GA4 - Config` |
| Event Name | `click_keeta` |
| Trigger | `CE - click_keeta` |

**Event Parameters:**
```
button_name    → {{DLV - button_name}}
destination    → {{DLV - destination}}
platform       → {{DLV - platform}}
utm_source     → {{DLV - utm_source}}
utm_medium     → {{DLV - utm_medium}}
utm_campaign   → {{DLV - utm_campaign}}
utm_content    → {{DLV - utm_content}}
ttclid         → {{DLV - ttclid}}
```

### وسم 2: ضغط هنقرستيشن
نفس الوسم بالظبط، بس:
- Event Name: `click_hungerstation`
- Trigger: `CE - click_hungerstation`

### وسم 3 (اختياري): الروابط الخارجية
- Event Name: `outbound_click` · Trigger: `CE - outbound_click`

---

## الخطوة 6 — تحديد التحويلات في GA4

في **GA4** (مش GTM): `Admin` ← `Events` ← علّم دول كـ **Key events**:

- ✅ `click_keeta`
- ✅ `click_hungerstation`

> بعدها تقدر تعمل **Audiences** و**Attribution** على الطلبات الحقيقية.

كمان فعّل `Admin` ← `Data Streams` ← `Enhanced measurement`:
`page_view` · `scroll` · `outbound clicks` · `site search` · `form interactions` — دي بتتجمع تلقائي من غير أي كود.

---

## الخطوة 7 — تيك توك بيكسل (لما تجهّزه)

الموقع **جاهز** ومستنّي البيكسل بس. لما تاخد الـPixel ID من TikTok Ads Manager:

1. `Tags` ← `New` ← `Custom HTML`
2. حط كود التثبيت الرسمي من تيك توك (`ttq.load('YOUR_PIXEL_ID')`)
3. Trigger: `Initialization - All Pages`
4. سمّيه `TikTok - Base Pixel`

بعدها اعمل `Custom HTML` tags للأحداث:

| حدث تيك توك | المشغّل | الكود |
|---|---|---|
| `ViewContent` | `CE - view_content` | `ttq.track('ViewContent', {content_id:'{{DLV - content_id}}', content_type:'product', currency:'SAR'})` |
| `ClickButton` | `CE - click_button` | `ttq.track('ClickButton', {content_name:'{{DLV - content_name}}'})` |
| `InitiateCheckout` | `CE - initiate_checkout` | `ttq.track('InitiateCheckout', {content_id:'{{DLV - content_id}}', currency:'SAR'})` |

> **مهم:** `InitiateCheckout` هو أقرب حدث للطلب الفعلي — اجعله **هدف التحسين (Optimization Event)** في حملة تيك توك بدل Traffic. ده اللي هيخلي الخوارزمية تدوّر على ناس بتطلب مش ناس بتضغط.

---

## الخطوة 8 — الاختبار قبل النشر

1. في GTM اضغط **`Preview`** وحط رابط الصفحة.
2. افتح الصفحة **بمعاملات UTM**:
   ```
   https://mohamed-elwasefy.github.io/kristo/?utm_source=tiktok&utm_medium=cpc&utm_campaign=test
   ```
3. في نافذة Tag Assistant تأكد إن:
   - `page_view_ready` و`view_content` ظهروا فوراً
   - وسم `GA4 - Config` اشتغل (Fired)
4. اضغط زر كيتا → لازم تشوف `click_keeta` + `outbound_click` + `click_button` + `initiate_checkout`
5. اضغط على الحدث وشوف تبويب `Variables` — تأكد إن `utm_source` = `tiktok`
6. في **GA4** ← `Reports` ← `Realtime` تأكد إن الأحداث بتوصل (ممكن تاخد دقيقة)
7. لو كله تمام: ارجع GTM واضغط **`Submit`** ← **`Publish`**

> ❌ **من غير Publish مفيش حاجة هتشتغل على الموقع الحقيقي.** الـPreview بيشتغل لك انت بس.

---

## استكشاف الأخطاء

| المشكلة | السبب الغالب |
|---|---|
| مفيش أحداث خالص في Preview | الحاوية مش منشورة (Publish)، أو مانع إعلانات شغال في متصفحك |
| الأحداث بتظهر بس المعاملات فاضية | متغيّرات Data Layer مش متعملة أو الاسم مكتوب غلط |
| `utm_source` فاضي | فتحت الصفحة من غير معاملات في الرابط |
| GA4 Realtime فاضي | الـMeasurement ID غلط، أو الوسم مربوط بمشغّل غلط |
| الأحداث بتتكرر مرتين | فيه وسم متعمل مرتين، أو GA4 متثبت في الـHTML كمان (مش المفروض) |
