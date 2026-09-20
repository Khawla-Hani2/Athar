# أَثَر (ATHAR)

تطبيق ويب لإدارة المهام والمذكرات باللغة العربية (RTL)، مبني بـ React + Vite ويعتمد على Firebase (Authentication و Firestore) كخلفية.

## المميزات

- **المهام**: إنشاء وتعديل وحذف المهام مع أولوية وحالة وتواريخ استحقاق وروابط ومهام فرعية.
- **المذكرات**: ملاحظات نصية مرتبطة بحساب المستخدم.
- **لوحة التحكم والإحصائيات**: نظرة عامة على المهام ورسوم بيانية (Recharts).
- **التقويم**: عرض المهام في تقويم شهري، مع **مزامنة اختيارية مع Google Calendar** (ربط مباشر من المتصفح عبر OAuth، بدون خادم خلفي إضافي).
- **المصادقة**: تسجيل دخول/تسجيل حساب/استرجاع كلمة المرور عبر Firebase Auth.
- **تقارير بريدية مجدولة** (حزمة `functions/` منفصلة): ملخصات يومية/أسبوعية، تذكير بالمواعيد النهائية، وتنظيف شهري للبيانات.

## التقنيات المستخدمة

- React 18 + TypeScript + Vite 7
- Tailwind CSS
- Firebase JS SDK 12 (Auth + Firestore)
- React Router 7
- Recharts (الرسوم البيانية)
- Firebase Cloud Functions (في مجلد `functions/` — مهام مجدولة بالبريد الإلكتروني)

## هيكل المشروع

```
src/
  components/   عناصر واجهة قابلة لإعادة الاستخدام (ui, layout, tasks, notes, stats, calendar)
  hooks/        منطق الحالة والاشتراكات (useTasks, useNotes, useSettings, useGoogleCalendar...)
  pages/        صفحات التطبيق (Dashboard, AllTasks, Notes, Calendar, Statistics, Settings, Login...)
  services/     التواصل مع Firestore وخدمات خارجية (googleCalendarService)
  firebase/      إعداد اتصال Firebase (config.ts)
  lib/          نصوص الواجهة بالعربية (messages.ts) والتحقق من المدخلات (validation.ts)
  types/        تعريفات TypeScript المشتركة
functions/       دوال Firebase المجدولة (تنبيهات بريدية، تنظيف شهري) — حزمة Node مستقلة
```

## البدء السريع

### المتطلبات

- Node.js (نسخة حديثة تدعم Vite 7)
- مشروع Firebase به Authentication (Email/Password، واختياريًا Google) و Firestore مُفعّلين

### التثبيت

```bash
npm install
```

### إعداد متغيرات البيئة

انسخ `.env.example` إلى `.env` واملأ القيم من:
Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

للتطوير المحلي عبر Firebase Emulator Suite بدون مشروع حقيقي، أضف في `.env.local`:

```
VITE_USE_FIREBASE_EMULATOR=true
```

ثم شغّل الإيميوليتور:

```bash
firebase emulators:start --only auth,firestore
```

> مشروع الإيميوليتور الافتراضي `demo-athar` (مطابق لـ `.firebaserc`) — لا تغيّره في مكان واحد فقط.

### تشغيل بيئة التطوير

```bash
npm run dev
```

### البناء للإنتاج

```bash
npm run build
```

### أوامر أخرى

```bash
npm run preview   # معاينة نسخة الإنتاج محليًا
npm run lint       # فحص الكود بـ ESLint
```

## مزامنة Google Calendar

الميزة اختيارية وتعمل بالكامل من المتصفح دون أي خادم أو أسرار إضافية:

1. تفعيل مزوّد تسجيل الدخول "Google" من Firebase Console → Authentication.
2. تفعيل Google Calendar API على مشروع GCP المرتبط بمشروع Firebase.
3. من داخل التطبيق (صفحة الإعدادات أو التقويم)، اضغط لربط الحساب — سيُطلب إذن الوصول لصلاحية `calendar.events` فقط.

رمز الوصول صالح لمدة تقارب 50 دقيقة، وبعدها يجب الضغط على "إعادة الربط" لإعادة فتح نافذة الموافقة (لا يمكن أن يتم ذلك تلقائيًا لأن التطبيق لا يخزّن refresh token).

## دوال Firebase المجدولة (functions/)

حزمة Node مستقلة (`firebase-admin` + `firebase-functions` + `nodemailer`) لإرسال:

- ملخصات بريدية يومية/أسبوعية عن المهام
- تذكيرات بالمواعيد النهائية القريبة
- تنظيف شهري للبيانات القديمة

راجع `functions/.env.example` لمتغيرات البيئة الخاصة بالبريد، ونفّذ `npm install` و `npm run build` داخل `functions/` بشكل مستقل.

## قواعد الأمان (Firestore)

`firestore.rules` مقسّمة لكل مجموعة بيانات (tasks/notes/meta/monthlyHistory) بدون أي قاعدة عامة تسمح بالوصول الكامل، وتفرض حدودًا على عدد الحقول وحجم النصوص/القوائم في كل عملية كتابة.

## ملاحظات

- لا توجد حزمة اختبارات (test suite) حاليًا؛ التحقق من صحة البناء يتم عبر `npm run build` في الجذر وداخل `functions/`.
- إذا ظهر خطأ بناء غريب متعلق بـ `vite:html-inline-proxy`، جرّب حذف الكاش: `rm -rf node_modules/.vite dist` ثم أعد البناء.
