# IEEE Xtreme — University Scoreboard (React + Node)

لوحة نتائج لمسابقة IEEE Xtreme الخاصة بجامعتك فقط.
الواجهة: **React (Vite)** — السيرفر: **Node.js بدون مكتبات** (يحفظ البيانات في data.json).

## بنية المشروع
    server/server.cjs      السيرفر: API + صلاحيات المنظّم + تحديث مباشر + تقديم الموقع
    src/App.jsx            الصفحة الرئيسية (تبديل بين لوحة المنظّم والشاشة العامة)
    src/store.jsx          حالة التطبيق: التحميل، الحفظ، التحديث المباشر، تسجيل الدخول
    src/Display.jsx        الشاشة العامة (الترتيب + التحدي الفعّال + النشاط المباشر)
    src/Organizer.jsx      لوحة المنظّم
    src/Teams.jsx          جدول الفرق + إضافة فريق
    src/MemberList.jsx     خانات أعضاء الفريق (خانة لكل عضو)
    src/Score.jsx          تسجيل نقاط المسائل + البونص + الخصم + قيم الصعوبة
    src/Challenges.jsx     التحديات (إنشاء / تفعيل / إنهاء / تتويج الفائز)
    src/Dialogs.jsx        النوافذ: تسجيل الدخول، السجل، التعديل
    src/lib.js             دوال مساعدة (الترتيب، النقاط، ...)
    src/styles.css         التصميم (كحلي + ألوان شعار IEEE Xtreme)
    dist/                  نسخة جاهزة مبنية من المشروع (تعمل مباشرة)

## التشغيل السريع (بدون بناء)
يحتاج Node.js 18 أو أحدث فقط:

Windows (PowerShell):
    $env:ORGANIZER_PASSWORD="كلمة-سر-قوية"; node server/server.cjs

Mac / Linux:
    ORGANIZER_PASSWORD="كلمة-سر-قوية" node server/server.cjs

ثم افتح http://localhost:3000 — واضغط "Organizer login" لدخول لوحة المنظّم.
الطلاب على نفس الشبكة يفتحون http://عنوان-جهازك:3000

## التطوير (تعديل الواجهة)
يحتاج Node.js 20.19+ (أو 22.12+):

    npm install
    # نافذة 1: السيرفر
    ORGANIZER_PASSWORD=secret npm run server
    # نافذة 2: الواجهة مع تحديث فوري
    npm run dev          # http://localhost:5173

## بناء نسخة للنشر
    npm install
    npm run build        # ينشئ مجلد dist/
    ORGANIZER_PASSWORD=secret npm start

## ملاحظات
- البيانات تُحفظ في server/data.json — انسخه احتياطاً قبل المسابقة (المتغير DATA_FILE لتغيير المكان، PORT لتغيير المنفذ).
- الطلاب لا يصلهم إلا: اسم الفريق + النقاط + التحدي الفعّال + النشاط. الأعضاء وسجل النقاط لا يخرجون من السيرفر لغير المنظّم.
- على الإنترنت شغّله خلف HTTPS، ومع nginx أضف لمسار /api/stream :  proxy_buffering off;
- منظّم واحد في كل مرة يُفضّل (آخر حفظ يفوز).
