# 🎯 كيف تحصل على GitHub Personal Access Token

## الخطوات (Step by step):

### 1. ذهب إلى GitHub Settings
```
https://github.com/settings/tokens/new
```

### 2. في الصفحة الجديدة:
- **Note**: اكتب "Vercel Deployment"
- **Expiration**: اختر "No expiration" (بدون انتهاء)
- **Select scopes**: اختر فقط:
  - ☑️ repo (الكل)
  - ☑️ admin:repo_hook

### 3. اضغط "Generate token"

### 4. **نسخ التوكن فوراً** ⚠️
- التوكن سيظهر مرة واحدة فقط
- انسخه في مكان آمن
- إذا نسيته، كرر الخطوات

### 5. استخدمه في AUTO_DEPLOY.bat
- عندما يطلب منك: "Enter your GitHub Personal Access Token"
- الصق التوكن

---

## Summary:
```
GitHub Username: your-username
Email: your-email@example.com
Token: ghp_xxxxxxxxxxxxxxxxxxxxx
```

ثم اتبع الخطوات في AUTO_DEPLOY.bat 🚀
