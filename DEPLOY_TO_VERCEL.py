#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
دليل رفع البرنامج على Vercel للحصول على رابط دائم
Deploy to Vercel - Get Permanent Live URL
"""

print("""
╔═════════════════════════════════════════════════════════════════════════════════╗
║                     🌐 رفع البرنامج على الويب - Vercel                       ║
║                Deploy to Web - Get Permanent Live URL                          ║
╚═════════════════════════════════════════════════════════════════════════════════╝

⭐ الفوائد:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ رابط دائم: https://your-name.vercel.app
✅ يعمل 24/7 بدون توقف
✅ سريع جداً (CDN عالمي)
✅ مجاني تماماً للمشاريع العامة
✅ لا يحتاج لتثبيت على الجهاز
✅ يعمل من أي متصفح
✅ يدعم Next.js تماماً
✅ نسخ احتياطية تلقائية


📋 الخطوات (5 دقائق فقط):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

الخطوة 1️⃣: إنشاء حساب Vercel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. اذهب إلى: https://vercel.com
2. اضغط "Sign Up"
3. اختر "GitHub" (الأسهل)
4. سيطلب ربط حسابك GitHub

الخطوة 2️⃣: رفع المشروع على GitHub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
اتبع التعليمات أدناه (نسخ والصق الأوامر):

# في Terminal/PowerShell:

# 1. إذهب لمجلد المشروع
cd "C:\\Users\\imiss\\Desktop\\DDoS-BSO-Thesis"

# 2. إنشاء git repository
git init
git add .
git commit -m "DDoS BSO Thesis - Academic Project"

# 3. إنشاء repository على GitHub
# - اذهب إلى: https://github.com/new
# - اسم الريبو: DDoS-BSO-Thesis
# - اختر: Public (مهم)
# - اضغط Create repository

# 4. ربط المشروع (استبدل YOUR_USERNAME بـ اسم GitHub)
git remote add origin https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis.git
git branch -M main
git push -u origin main

# 5. انتظر قليلاً ثم الرابط يظهر على GitHub

الخطوة 3️⃣: ربط Vercel بـ GitHub
━━━━━━━━━━━━━━━━━━━━━━━
1. اذهب إلى: https://vercel.com/dashboard
2. اضغط "New Project" (جديد)
3. اختر "Import from GitHub"
4. ابحث عن: DDoS-BSO-Thesis
5. اختره واضغط "Import"
6. اضغط "Deploy" (نشر)
7. انتظر 30 ثانية...

✨ تم! الرابط جاهز:
━━━━━━━━━━━━━━━━

بعد الانتهاء ستحصل على رابط مثل:
👉 https://ddos-bso-thesis-[random].vercel.app

هذا الرابط:
✅ يعمل دائماً
✅ لا يتطلب npm install
✅ يعمل من أي متصفح
✅ يمكن مشاركته مع أي شخص
✅ لا يحتاج إلى الحفاظ على الجهاز مشغول


🎯 ملخص الخطوات المختصر:
━━━━━━━━━━━━━━━━━━━━━━━━━

1. Vercel.com → Sign Up بـ GitHub
2. GitHub.com/new → Create repo "DDoS-BSO-Thesis"
3. Terminal → git init && git add . && git commit && git push
4. Vercel.com/dashboard → Import from GitHub → Deploy
5. انتظر 30 ثانية... تم! 🎉


📝 ملفات مهمة للتأكد منها:
━━━━━━━━━━━━━━━━━━━━━━━━

✅ التحقق من:
  • package.json موجود؟
  • next.config.js موجود؟ (تأكد من الاسم الصحيح)
  • .gitignore يستبعد node_modules؟


⚙️ إذا حدثت مشاكل:
━━━━━━━━━━━━━━━━━━━━

❌ الخطأ: "Build failed"
✅ الحل: تأكد من أن package.json صحيح

❌ الخطأ: "Cannot find module"
✅ الحل: تأكد من npm install قبل الـ commit

❌ الخطأ: الرابط لا يعمل
✅ الحل: انتظر 2-3 دقائق، أحياناً يحتاج وقت


🌍 البدائل الأخرى (إذا لم تفضل Vercel):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Netlify: similar to Vercel (أيضاً جيد)
• Replit: أسهل للمتابعين (بدون GitHub)
• Railway: بديل حديث جداً


📊 مقارنة الخيارات:
━━━━━━━━━━━━━━━━━━

                    Vercel    Netlify   Replit
─────────────────────────────────────────────
السهولة             ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐
السرعة              ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐   ⭐⭐⭐
الموثوقية           ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐⭐  ⭐⭐⭐
الدعم              ⭐⭐⭐⭐   ⭐⭐⭐⭐   ⭐⭐⭐⭐
المجاني            ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐
─────────────────────────────────────────────
الأفضل عام: Vercel


✨ بعد الرفع:
━━━━━━━━━━━━

1. الرابط النهائي: https://ddos-bso-thesis-xxx.vercel.app
2. شارك هذا الرابط مع الجامعة
3. يعمل دائماً بدون توقف
4. لا تحتاج لتشغيل الجهاز


💡 نصيحة إضافية:
━━━━━━━━━━━━━━━

إذا حدّثت الكود:
  git add .
  git commit -m "Update"
  git push

Vercel سيحدث الرابط تلقائياً! 🔄


🎉 تم! الآن لديك:
━━━━━━━━━━━━━━━━

✅ ملف ZIP للتسليم المحلي
✅ رابط ويب دائم للمشاهدة الفورية
✅ GitHub repository للعرض الأكاديمي
✅ توثيق شامل با التركية والإنجليزية

كل شيء جاهز للدفاع الأكاديمي! 🚀
""")

print("\n" + "="*80)
print("اختر الطريقة المفضلة:")
print("="*80)
print("""
أسرع طريقة (Vercel - الموصى به):
  1. vercel.com → Sign Up
  2. GitHub.com/new → Create repo
  3. Terminal → git push
  4. Vercel → Deploy
  
النتيجة: رابط دائم مثل https://your-project.vercel.app ✨
""")
