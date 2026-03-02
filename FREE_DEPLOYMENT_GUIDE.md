# 🚀 Free Deployment Guide - Cyber Guard AI

## Overview

Deploy your complete Cyber Guard AI platform for **FREE** using:
- **Vercel** - Frontend (Next.js)
- **Render** - Backend (Python/FastAPI)

Both platforms offer generous free tiers perfect for demos and portfolios!

---

## 📋 Prerequisites

Before deploying, you need:
1. GitHub account (free)
2. Vercel account (free) - https://vercel.com
3. Render account (free) - https://render.com
4. Git installed on your computer

---

## Part 1: Prepare Your Code for Deployment

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone
git init

# Create .gitignore file
echo "node_modules/" > .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo ".env" >> .gitignore
echo ".next/" >> .gitignore
echo "*.pyc" >> .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cyber Guard AI"

# Create repository on GitHub.com
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/cyber-guard-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Update API URL for Production

Create a new file: `frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## Part 2: Deploy Backend to Render (FREE)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect Repository
1. Select your GitHub repository
2. Choose the root directory (not frontend)
3. Configure:
   - **Name**: cyber-guard-ai-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Environment Variables
Add these in Render dashboard:
```
PYTHON_VERSION=3.11
PORT=8000
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your backend URL: `https://cyber-guard-ai-backend.onrender.com`

### Step 5: Test Backend
```bash
curl https://cyber-guard-ai-backend.onrender.com/health
```

---

## Part 3: Deploy Frontend to Vercel (FREE)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### Step 2: Import Repository
1. Select your GitHub repository
2. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables
Add in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://cyber-guard-ai-backend.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your frontend URL: `https://cyber-guard-ai.vercel.app`

---

## Part 4: Update Backend CORS

Update `app/main.py` to allow your Vercel domain:

```python
# Add your Vercel URL to allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cyber-guard-ai.vercel.app",  # Add this
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push changes:
```bash
git add app/main.py
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the update!

---

## 🎉 Your Website is Now Live!

### Access Your Deployed Website:
```
Frontend: https://cyber-guard-ai.vercel.app
Backend: https://cyber-guard-ai-backend.onrender.com
API Docs: https://cyber-guard-ai-backend.onrender.com/docs
```

### Admin Login:
```
Email: kumarpankaj9982@gmail.com
Password: Pankaj@2003
```

---

## 📊 Free Tier Limits

### Vercel (Frontend):
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Preview deployments for PRs

### Render (Backend):
- ✅ 750 hours/month (enough for 24/7)
- ✅ 512 MB RAM
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ⚠️ Spins down after 15 min inactivity (free tier)
- ⚠️ Cold start: 30-60 seconds

---

## 🔧 Alternative: Deploy Both on Vercel

If you want everything on Vercel:

### Option 1: Vercel Serverless Functions

1. Move backend to `api/` folder in frontend
2. Convert FastAPI routes to Vercel serverless functions
3. Deploy as single Next.js app

### Option 2: Use Vercel + Railway

- Frontend: Vercel (free)
- Backend: Railway (free tier: $5 credit/month)

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your domain (e.g., cyberguardai.com)
5. Update DNS records as instructed

### Add Custom Domain to Render:
1. Go to Render dashboard
2. Select your service
3. Settings → Custom Domain
4. Add domain and update DNS

---

## 🔄 Continuous Deployment

Both platforms auto-deploy when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel and Render will automatically deploy!
```

---

## 📱 Mobile App (Bonus)

Convert to mobile app using:
- **Capacitor** (iOS/Android)
- **PWA** (Progressive Web App)

---

## 🎯 Quick Deployment Checklist

### Before Deployment:
- [ ] Code pushed to GitHub
- [ ] .gitignore configured
- [ ] Environment variables identified
- [ ] CORS settings updated

### Backend Deployment (Render):
- [ ] Render account created
- [ ] Repository connected
- [ ] Build/Start commands configured
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Health endpoint tested

### Frontend Deployment (Vercel):
- [ ] Vercel account created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Website accessible

### Post-Deployment:
- [ ] Test login functionality
- [ ] Test admin access
- [ ] Test content analysis
- [ ] Test all pages
- [ ] Share URL with others!

---

## 🐛 Troubleshooting

### Backend Issues:

**Problem**: Backend not starting
```bash
# Check Render logs
# Common issues:
- Missing dependencies in requirements.txt
- Wrong Python version
- Port configuration
```

**Solution**:
```bash
# Ensure requirements.txt has all dependencies
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

**Problem**: CORS errors
```bash
# Add your Vercel URL to CORS origins in app/main.py
```

### Frontend Issues:

**Problem**: API calls failing
```bash
# Check environment variable
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**Problem**: Build failing
```bash
# Check Vercel build logs
# Common issues:
- TypeScript errors
- Missing dependencies
- Environment variables
```

---

## 💰 Cost Breakdown

### Completely Free Setup:
- **Vercel**: $0/month (free tier)
- **Render**: $0/month (free tier)
- **Total**: $0/month

### Paid Upgrade (Optional):
- **Vercel Pro**: $20/month (more bandwidth)
- **Render Starter**: $7/month (no cold starts)
- **Total**: $27/month

---

## 🚀 Step-by-Step Deployment Commands

### 1. Prepare Repository
```bash
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/cyber-guard-ai.git
git push -u origin main
```

### 2. Deploy Backend (Render)
```
1. Go to render.com
2. New Web Service
3. Connect GitHub repo
4. Configure:
   - Build: pip install -r requirements.txt
   - Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
5. Deploy
6. Copy URL: https://your-app.onrender.com
```

### 3. Deploy Frontend (Vercel)
```
1. Go to vercel.com
2. New Project
3. Import GitHub repo
4. Root Directory: frontend
5. Add env var: NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
6. Deploy
7. Your site: https://your-app.vercel.app
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Frontend loads: https://your-app.vercel.app
- [ ] Backend health: https://your-backend.onrender.com/health
- [ ] API docs: https://your-backend.onrender.com/docs
- [ ] Login works
- [ ] Signup works
- [ ] Admin panel accessible
- [ ] Content analysis works
- [ ] All pages load correctly

---

## 🎊 Congratulations!

Your Cyber Guard AI platform is now:
- ✅ Deployed and accessible worldwide
- ✅ Running on free tier (no cost!)
- ✅ Auto-deploying from GitHub
- ✅ HTTPS enabled
- ✅ Production-ready

**Share your live URL:**
```
https://cyber-guard-ai.vercel.app
```

**Perfect for:**
- Portfolio showcase
- Client demos
- Job applications
- Academic projects
- Proof of concept

---

## 📚 Additional Resources

### Documentation:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

### Video Tutorials:
- Deploying Next.js to Vercel
- Deploying FastAPI to Render
- Custom domain setup

### Support:
- Vercel Discord: https://vercel.com/discord
- Render Community: https://community.render.com

---

## 🎯 Next Steps

1. **Deploy Now**: Follow the guide above
2. **Test Everything**: Verify all features work
3. **Share URL**: Add to resume/portfolio
4. **Monitor**: Check Vercel/Render dashboards
5. **Iterate**: Push updates via GitHub

**Your AI moderation platform is ready for the world!** 🌍
