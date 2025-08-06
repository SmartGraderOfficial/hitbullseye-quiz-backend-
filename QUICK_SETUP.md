# 🚀 Quick Migration Setup Guide

## ⚡ **Step 1: Get Your Railway URL**

1. Go to your Railway dashboard
2. Click "Generate Domain" if you haven't already
3. Copy your Railway URL (looks like: `https://hitbullseye-quiz-backend-production-xxxx.up.railway.app`)

## ⚡ **Step 2: Update Migration Scripts**

Replace `https://hitbullseye-quiz-backend-production-XXXX.up.railway.app` with your actual Railway URL in these files:

- `migrate-users.js` (line 15)
- `migrate-questions.js` (line 15)

## ⚡ **Step 3: Run Migration**

### Option A: Run All at Once (Recommended)
```bash
cd ExtensionBackend/server
node migrate-all.js
```

### Option B: Run Individually
```bash
# First migrate users
node migrate-users.js

# Then migrate questions (after users are successful)
node migrate-questions.js
```

## 📊 **What You'll See**

### Users Migration (7 users):
```
🚀 Starting user migration to MongoDB Atlas...
✅ User uploaded: Suraj Singh (100032034)
✅ User uploaded: Chandini Gujju (100031928)
...
📊 Migration Summary:
✅ Successfully uploaded: 7 users
```

### Questions Migration (~911 questions):
```
🚀 Starting questions migration to MongoDB Atlas...
✅ Question 1 uploaded: If a shopkeeper calculates his profit...
📊 Progress: 50/911 questions processed
...
📊 Migration Summary:
✅ Successfully uploaded: 911 questions
```

## ✅ **Verification**

After migration, verify in MongoDB Atlas:
1. Go to MongoDB Atlas → Collections
2. Check `users` collection (should have 7 documents)
3. Check `questions` collection (should have ~911 documents)

## 🧪 **Test API**

Test with your Railway URL:
```bash
# Test health
curl https://your-railway-url.up.railway.app/health

# Test user verification
curl -X POST https://your-railway-url.up.railway.app/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"AccessKey": "1222262587654321"}'
```

## 🎉 **Final Result**

After successful migration:
- ✅ All 7 users in MongoDB Atlas
- ✅ All ~911 questions in MongoDB Atlas
- ✅ Chrome extension ready for live API
- ✅ System fully cloud-based

---

**Ready to migrate? Share your Railway URL and let's get started!** 🚀
