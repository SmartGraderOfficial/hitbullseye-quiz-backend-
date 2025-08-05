# Railway + MongoDB Atlas Deployment Guide

## Prerequisites
1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com](https://cloud.mongodb.com)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Step 1: Set up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new project: "Quiz Extension"
3. Build a cluster:
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred region
   - Name: `quiz-extension-cluster`

### 1.2 Configure Network Access
1. Go to "Network Access" in your Atlas dashboard
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0)
   - For production, restrict to Railway's IP ranges if available

### 1.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create a user:
   - Username: `quiz-user`
   - Password: Generate a strong password
   - Database User Privileges: "Read and write to any database"

### 1.4 Get Connection String
1. Go to "Clusters" → Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string, it looks like:
   ```
   mongodb+srv://quiz-user:<password>@quiz-extension-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2: Deploy to Railway

### 2.1 Connect Your Repository
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `server` folder if it's not in the root

### 2.2 Configure Environment Variables
In Railway dashboard, go to your service → Variables tab and add:

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://quiz-user:YOUR_PASSWORD@quiz-extension-cluster.xxxxx.mongodb.net/quiz_extension_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_32_character_secret_key_here_change_this
ALLOWED_ORIGINS=https://your-app-name.up.railway.app,https://onlinetest.hitbullseye.com,chrome-extension://your-extension-id
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your MongoDB Atlas password
- Replace `your_super_secure_32_character_secret_key_here_change_this` with a strong secret
- Replace `your-app-name` with your actual Railway app name
- Add your Chrome extension IDs to ALLOWED_ORIGINS

### 2.3 Deploy
1. Railway will automatically deploy your app
2. Monitor the build logs in the Railway dashboard
3. Once deployed, you'll get a URL like: `https://your-app-name.up.railway.app`

## Step 3: Initialize Database

### 3.1 Import Data (One-time setup)
After successful deployment, you need to populate your database:

1. **Option A**: Use Railway's terminal feature
   - Go to your Railway service
   - Open the terminal tab
   - Run: `npm run import` (if you have data files)

2. **Option B**: Use your local setup script
   - Update your local `.env` to point to the Atlas database
   - Run: `node setup.js` locally
   - Run: `node utils/importData.js` locally

## Step 4: Update Chrome Extension

Update your Chrome extension's API endpoint to point to Railway:

```javascript
// In your extension files, replace localhost with Railway URL
const API_BASE_URL = 'https://your-app-name.up.railway.app/api';
```

## Step 5: Test Your Deployment

### 5.1 Health Check
Visit: `https://your-app-name.up.railway.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-08-05T...",
  "environment": "production"
}
```

### 5.2 Test API Endpoints
```bash
# Test authentication
curl -X POST https://your-app-name.up.railway.app/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"accessKey": "your_test_key"}'

# Test question endpoint
curl -X POST https://your-app-name.up.railway.app/api/quiz/get-answer \
  -H "Content-Type: application/json" \
  -d '{
    "accessKey": "your_test_key",
    "questionText": "Sample question?",
    "options": ["A", "B", "C", "D"]
  }'
```

## Security Checklist for Production

- [ ] Strong JWT_SECRET (32+ characters, random)
- [ ] MongoDB Atlas user with minimal required permissions
- [ ] Network access properly configured
- [ ] CORS origins restricted to your domains only
- [ ] SSL/HTTPS enabled (Railway provides this automatically)
- [ ] Environment variables secured in Railway dashboard
- [ ] No sensitive data in code repository
- [ ] Regular security updates scheduled

## Monitoring and Maintenance

### Railway Features
- **Logs**: Monitor application logs in Railway dashboard
- **Metrics**: View CPU, memory, and network usage
- **Auto-deploys**: Enable automatic deployments on git push
- **Custom domains**: Add your own domain if needed

### MongoDB Atlas Features
- **Performance Advisor**: Monitor database performance
- **Real-time monitoring**: Track database metrics
- **Automated backups**: Enabled by default
- **Alerts**: Set up alerts for issues

## Troubleshooting

### Common Issues
1. **Connection timeouts**: Check MongoDB Atlas network access
2. **Authentication errors**: Verify MongoDB credentials
3. **CORS errors**: Update ALLOWED_ORIGINS environment variable
4. **Build failures**: Check Node.js version compatibility

### Support Resources
- Railway Documentation: https://docs.railway.app
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Your application health check: `https://your-app-name.up.railway.app/health`

## Cost Information

### MongoDB Atlas
- M0 Sandbox: **Free** (512 MB storage, shared CPU)
- Suitable for development and small production workloads

### Railway
- Hobby Plan: **$5/month** per service
- Includes 500 hours of usage, $0.01 per additional hour
- Pro Plan: **$20/month** for unlimited usage

---

**Next Steps**: Follow this guide step by step, and your Quiz Extension backend will be live on Railway with MongoDB Atlas!
