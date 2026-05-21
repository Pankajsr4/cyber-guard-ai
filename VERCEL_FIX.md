# Fix Vercel Deployment - "No Next.js version detected"

## The Problem
Vercel can't find Next.js because it's looking in the wrong directory.

## Solution: Update Vercel Project Settings

### Option 1: Through Vercel Dashboard (Recommended)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project: `cyber-guard-ai`
3. Go to **Settings** (top navigation)
4. Click on **General** in the left sidebar
5. Scroll down to **Build & Development Settings**
6. Find **Root Directory** section
7. Click **Edit** next to Root Directory
8. Enter: `frontend`
9. Click **Save**
10. Go back to **Deployments** tab
11. Click **Redeploy** on the latest deployment

### Option 2: Cancel and Redeploy

If the above doesn't work:

1. **Cancel the current deployment**
2. Go back to Vercel homepage
3. Click **Add New...** → **Project**
4. Select your `cyber-guard-ai` repository again
5. **IMPORTANT**: Before clicking Deploy, configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" and type `frontend`
   - **Build Command**: Leave as default (`npm run build`)
   - **Output Directory**: Leave as default (`.next`)
   - **Install Command**: Leave as default (`npm install`)
6. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `http://localhost:8000` (temporary, will update after backend deployment)
7. Click **Deploy**

### Option 3: Use Vercel CLI (Alternative)

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to your project
cd C:\Users\ASUS\OneDrive\Desktop\CapeStone

# Deploy with specific directory
vercel --cwd frontend
```

## What Should Happen

After setting Root Directory to `frontend`:
- Vercel will look for `package.json` in `frontend/` folder
- It will find Next.js 14.0.4
- Build will proceed successfully
- You'll get a live URL like `https://cyber-guard-ai.vercel.app`

## Verification

Once deployed successfully, you should see:
- ✅ Build completed
- ✅ Deployment ready
- ✅ Live URL available

## Next Steps After Successful Deployment

1. Note your Vercel URL (e.g., `https://cyber-guard-ai.vercel.app`)
2. Deploy backend to Render
3. Update `NEXT_PUBLIC_API_URL` environment variable in Vercel with Render backend URL
4. Redeploy frontend

## Common Issues

### Issue: "Root Directory not found"
**Solution**: Make sure you typed `frontend` exactly (lowercase, no spaces)

### Issue: "Build still failing"
**Solution**: Check the build logs for specific errors. The TypeScript errors should be fixed now.

### Issue: "Can't find the Settings"
**Solution**: Make sure you're in the project dashboard, not the team dashboard.
