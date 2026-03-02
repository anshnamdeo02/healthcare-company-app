# Deployment Guide - Healthcare Platform

---

## 🚀 Quick Start (Deploy in 15 minutes)

**FREE hosting stack that never expires:**
- 🌐 **Frontend**: [Vercel](https://vercel.com) (unlimited bandwidth, no sleep)
- ⚙️ **Backend**: [Render](https://render.com) (sleeps after 15min, free)
- 🗄️ **Database**: [Neon](https://neon.tech) (3GB PostgreSQL, forever free)

**Already have a GitHub repo? Deploy now:**

1. **Database (2 min)**: [neon.tech](https://neon.tech) → New Project → Copy connection string
2. **Backend (5 min)**: [render.com](https://render.com) → New Web Service → Connect repo → Set env vars
3. **Frontend (3 min)**: [vercel.com](https://vercel.com) → Import repo → Set `VITE_API_URL` → Deploy
4. **Done!** Visit your live site ✨

**Detailed steps below ⬇️**

---

## Free Hosting Stack
- **Frontend**: Vercel (never sleeps, fast global CDN)
- **Backend**: Render (free tier, sleeps after 15min inactivity)
- **Database**: Neon PostgreSQL (free 3GB forever)

**Architecture:**
```
User Browser
    ↓
Vercel (Frontend) → https://your-app.vercel.app
    ↓
Render (Backend) → https://your-api.onrender.com
    ↓
Neon (Database) → PostgreSQL
```

---

## Prerequisites

Before starting, you need:
- ✅ GitHub account (push your code there)
- ✅ Gmail account (for SMTP email notifications)
- ✅ All code committed and pushed to GitHub

**First time? Run this check:**
```bash
node check-deploy.js
```

---

## Step 1: Setup Database (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project: "healthcare-db"
4. Select region closest to you
5. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/healthcare_db?sslmode=require
   ```
6. **Save this** - you'll need it for backend deployment

---

## Step 2: Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `healthcare-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Environment Variables** (click "Advanced" → Add):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-neon-connection-string-from-step-1>
   JWT_SECRET=<generate-random-32-char-string>
   AES_ENCRYPTION_KEY=<generate-64-hex-characters>
   JWT_EXPIRES_IN=7d
   JWT_RESET_EXPIRES_IN=15m
   CLIENT_URL=<leave-empty-for-now-will-add-after-frontend-deploy>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your-gmail>
   SMTP_PASS=<your-gmail-app-password>
   COMPANY_EMAIL=<your-company-email>
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Generate secrets:**
   - JWT_SECRET: `openssl rand -base64 32` or use [RandomKeygen](https://randomkeygen.com/)
   - AES_ENCRYPTION_KEY: `openssl rand -hex 32` (must be 64 hex chars)

7. Click **"Create Web Service"**
8. Wait for deployment (5-10 min)
9. After successful deploy, **run database migration**:
   - Go to your service → **Shell** tab
   - Run: `npx prisma migrate deploy`
   - Run: `npx prisma db seed` (optional - creates admin account)

10. **Copy your backend URL**: `https://healthcare-backend-xxxx.onrender.com`

---

## Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Environment Variables**:
   ```
   VITE_API_URL=https://healthcare-backend-xxxx.onrender.com/api/v1
   ```
   (Use the backend URL from Step 2)

7. Click **"Deploy"**
8. Wait 2-3 minutes
9. **Copy your frontend URL**: `https://healthcare-app-xxxx.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to **Render** dashboard → your backend service
2. Go to **"Environment"** tab
3. Update `CLIENT_URL` variable:
   ```
   CLIENT_URL=https://healthcare-app-xxxx.vercel.app
   ```
4. Save → Service will auto-redeploy

---

## Step 5: Test Your Deployment

1. Visit your frontend URL: `https://healthcare-app-xxxx.vercel.app`
2. Try registering a new patient/doctor
3. Check database in Neon dashboard to verify data

---

## Important Notes

### Free Tier Limitations

**Render Backend:**
- Sleeps after 15 minutes of inactivity
- First request after sleep takes ~30-60 seconds
- 750 free hours/month (enough for 24/7)

**Neon Database:**
- 3GB storage
- 1 concurrent connection for free tier
- Auto-suspends after 5 min inactivity (wakes instantly)

**Vercel Frontend:**
- 100GB bandwidth/month
- No sleep time
- Fast global CDN

### Cost Optimization

To avoid sleep delays on Render:
- Upgrade to paid ($7/month keeps it awake)
- Or use a cron job to ping every 14 minutes: [cron-job.org](https://cron-job.org)

### Database Migration

For future schema changes:
1. Update `server/prisma/schema.prisma`
2. Run locally: `npx prisma migrate dev --name your_migration_name`
3. Push to GitHub
4. In Render Shell: `npx prisma migrate deploy`

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Run `npx prisma generate` in Render Shell

### Frontend can't connect to backend
- Check VITE_API_URL in Vercel
- Verify CLIENT_URL in Render matches your Vercel URL
- Check browser console for CORS errors

### Database connection errors
- Verify Neon connection string includes `?sslmode=require`
- Check Neon dashboard - database should be active

---

## Alternative Free Options

### Option 2: Railway (All-in-one)
- Frontend + Backend + DB in one place
- $5 free credit/month (~500 hours)
- Go to [railway.app](https://railway.app)

### Option 3: Render Only
- Deploy both frontend & backend on Render
- Add PostgreSQL service ($7/month after 90 days)

---

## Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render:
1. Go to Service Settings → Custom Domain
2. Add domain and update DNS

---

## Production Checklist

- [ ] Database deployed on Neon
- [ ] Database migrated (`prisma migrate deploy`)
- [ ] Backend deployed on Render
- [ ] All environment variables set
- [ ] Frontend deployed on Vercel
- [ ] `CLIENT_URL` updated in backend
- [ ] Test patient registration
- [ ] Test doctor registration
- [ ] Test admin login (if seeded)
- [ ] Test consultation flow
- [ ] Monitor Render logs for errors

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Deploy: https://www.prisma.io/docs/guides/deployment
