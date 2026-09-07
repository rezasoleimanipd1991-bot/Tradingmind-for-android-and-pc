---
name: ساخت خروجی Windows
description: محدودیت محیط Linux برای ساخت نهایی installer ویندوز
---

ساخت Vite و کامپایل TypeScript مربوط به Electron روی محیط Linux قابل انجام است، اما `electron-builder --win` هنگام ساخت NSIS برای اجرای ابزارهای Windows به `wine` نیاز دارد. نبودن wine باعث شکست مرحلهٔ نهایی installer می‌شود، حتی وقتی بسته‌بندی `win-unpacked` و دانلود Electron موفق شده باشند.

**Why:** محیط توسعهٔ Replit برای این پروژه Linux است و نمی‌تواند موفقیت واقعی `setup.exe` را صرفاً با عبور build وب تأیید کند.

**How to apply:** خطاهای انتهایی wine را با خطای کد یا dependency اشتباه نگیرید؛ تغییرات کد را با typecheck/کامپایل محلی بررسی کنید و ساخت/امضای نهایی setup.exe را در workflow ویندوزی GitHub اعتبارسنجی کنید.