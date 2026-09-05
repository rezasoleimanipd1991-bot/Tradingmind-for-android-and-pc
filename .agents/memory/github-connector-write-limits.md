---
name: GitHub connector write limits
description: محدودیت‌های مشاهده‌شده در نوشتن مستقیم فایل‌های Workflow و خواندن لاگ خام Actions از اتصال GitHub مدیریت‌شده
---

اتصال GitHub مدیریت‌شده برای خواندن مخزن، خواندن Actions و ساخت commit کدی کار می‌کند، اما در این پروژه نوشتن فایل‌های `.github/workflows` از مسیر Contents API و GraphQL مجوز کافی نداشت و خواندن لاگ خام Job نیز 403 شد.

**Why:** اصلاح Workflowهای CI باید با مجوزی انجام شود که نوشتن فایل Workflow و مشاهدهٔ لاگ Actions را اجازه دهد؛ صرفاً دسترسی `repo` فعلی برای این دو عملیات کافی نبود.

**How to apply:** اگر buildهای Windows یا Android شکست خوردند، ابتدا دسترسی اتصال GitHub را برای Workflowها بررسی کن. تا پیش از آن، علت را از annotations و stepهای شکست استخراج کن و تغییرات برنامه را مستقل از Workflow در شاخهٔ اصلی ثبت نگه دار.