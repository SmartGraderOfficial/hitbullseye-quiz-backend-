# 📦 Data Migration Guide - JSON to MongoDB Atlas

## 🎯 Goal
Move your local JSON data to MongoDB Atlas via your Railway API.

## 📋 Current Status

### ❌ What's Missing:
- **users.json** data is not in MongoDB Atlas
- **data.json** questions are not in MongoDB Atlas
- Chrome extension still uses local JSON files

### ✅ What's Ready:
- Railway API is connected to MongoDB Atlas
- API endpoints for adding users and questions exist
- Database models are correctly structured

---

## 🚀 Migration Steps

### Step 1: Update Railway URL in Migration Scripts

1. **Get your Railway URL** from Railway dashboard
2. **Edit these files** and replace `https://your-railway-url.up.railway.app`:
   - `migrate-users.js` (line 8)
   - `migrate-questions.js` (line 8)

### Step 2: Migrate Users (7 users)

```bash
cd ExtensionBackend/server
node migrate-users.js
```

**What this does:**
- Reads `SmartGrader/users.json`
- Uploads each user to MongoDB via `/api/auth/register`
- Creates user accounts in MongoDB Atlas

**Expected Output:**
```
🚀 Starting user migration to MongoDB Atlas...
📋 Found 7 users in users.json

✅ User uploaded: Suraj Singh (100032034)
✅ User uploaded: Chandini Gujju (100031928)
✅ User uploaded: Aditya Arya (100031904)
...

📊 Migration Summary:
✅ Successfully uploaded: 7 users
❌ Failed to upload: 0 users
📈 Success rate: 100.0%
```

### Step 3: Migrate Questions (~900 questions)

```bash
cd ExtensionBackend/server
node migrate-questions.js
```

**What this does:**
- Reads `SmartGrader/data.json`
- Uploads each question to MongoDB via `/api/questions`
- Creates question database in MongoDB Atlas

**Expected Output:**
```
🚀 Starting questions migration to MongoDB Atlas...
📋 Found 911 questions in data.json

✅ Question 1 uploaded: If a shopkeeper calculates his profit to be 20%...
✅ Question 2 uploaded: What is the next number in the series...
📊 Progress: 50/911 questions processed
...

📊 Migration Summary:
✅ Successfully uploaded: 911 questions
❌ Failed to upload: 0 questions  
📈 Success rate: 100.0%
```

---

## ✅ After Migration

### Verify Data in MongoDB:
1. Go to MongoDB Atlas dashboard
2. Browse Collections → `quiz_extension_db`
3. Check `users` collection (should have 7 documents)
4. Check `questions` collection (should have ~911 documents)

### Test API Endpoints:
```bash
# Test user verification
curl -X POST https://your-railway-url.up.railway.app/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"AccessKey": "1222262587654321"}'

# Test questions endpoint
curl https://your-railway-url.up.railway.app/api/questions?limit=5 \
  -H "Authorization: AccessKey 1222262587654321"
```

---

## 🔧 Chrome Extension Updates

### After successful migration, you can:

1. **Remove local JSON dependencies** from Chrome extension
2. **Update extension** to use only API calls
3. **Test extension** with real MongoDB data

### Optional: Clean up local files
After successful migration, you can:
- Keep `users.json` and `data.json` as backups
- Or remove them since data is now in MongoDB Atlas

---

## 🐛 Troubleshooting

### If migration fails:

1. **Check Railway URL**: Ensure it's correct and accessible
2. **Check API health**: Visit `https://your-url.up.railway.app/health`
3. **Check access key**: Use a valid access key from users.json
4. **Check rate limits**: Migration scripts have delays to avoid rate limiting
5. **Check MongoDB Atlas**: Ensure cluster is running and accessible

### Common Issues:
- **Network timeout**: Increase delay between requests
- **Duplicate users**: API prevents duplicate StuID/AccessKey
- **Invalid data format**: Check if JSON structure matches API expectations

---

## 📊 Migration Summary

| Component | Before | After |
|-----------|--------|-------|
| Users | Local users.json (7 users) | MongoDB Atlas via Railway API |
| Questions | Local data.json (911 questions) | MongoDB Atlas via Railway API |
| Extension | Local file access | API calls only |
| Database | No database | MongoDB Atlas cloud database |

---

## 🎉 Final Result

After migration:
- ✅ All user data in MongoDB Atlas
- ✅ All question data in MongoDB Atlas  
- ✅ Chrome extension uses live API
- ✅ Data accessible from anywhere
- ✅ Scalable and production-ready

**Your SmartGrader system will be fully cloud-based!** 🌐
