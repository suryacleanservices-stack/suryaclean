# 🚀 SuryaClean — Complete Deployment Guide
## How to take the website, backend, and mobile app LIVE

---

## Table of Contents
1. [Prerequisites & Accounts You Need](#1-prerequisites--accounts-you-need)
2. [Step 1: Buy Domain & Setup Email](#2-step-1-buy-domain--setup-email)
3. [Step 2: Setup Firebase (Google Login + Database)](#3-step-2-setup-firebase-google-login--database)
4. [Step 3: Setup Razorpay (UPI Payments)](#4-step-3-setup-razorpay-upi-payments)
5. [Step 4: Deploy Backend API to Production](#5-step-4-deploy-backend-api-to-production)
6. [Step 5: Deploy Website to Production](#6-step-5-deploy-website-to-production)
7. [Step 6: Connect Domain to Website](#7-step-6-connect-domain-to-website)
8. [Step 7: Deploy Flutter App to Play Store & App Store](#8-step-7-deploy-flutter-app-to-play-store--app-store)
9. [Step 8: Final Testing Checklist](#9-step-8-final-testing-checklist)
10. [Step 9: Environment Variables Master Sheet](#10-step-9-environment-variables-master-sheet)

---

## 1. Prerequisites & Accounts You Need

### Create These Accounts (ALL FREE to start)

| # | Account | Sign Up Link | Time to Setup | Cost |
|---|---------|-------------|---------------|------|
| 1 | **Google Account** (Gmail) | gmail.com | Already have one | Free |
| 2 | **Firebase** (Google's backend) | console.firebase.google.com | 10 minutes | Free (Spark plan) |
| 3 | **Razorpay** (Payment Gateway) | dashboard.razorpay.com | 3-5 business days* | Free to sign up, 2% per transaction |
| 4 | **Vercel** (Website hosting) | vercel.com | 5 minutes | Free (Hobby plan) |
| 5 | **Render or Railway** (Backend hosting) | render.com or railway.app | 10 minutes | Free tier available |
| 6 | **Google Play Console** | play.google.com/console | 1-2 days* | ₹1,500 one-time (lifetime) |
| 7 | **Domain Registrar** | namecheap.com or godaddy.com | 10 minutes | ~₹800/year |

> *Razorpay & Play Console require KYC/business verification — plan for 3-5 business days.

---

## 2. Step 1: Buy Domain & Setup Email

### Buy the Domain
1. Go to **[Namecheap](https://namecheap.com)** or **[GoDaddy India](https://godaddy.com)**
2. Search for: `suryaclean.in`
3. If available, buy it (~₹599-₹899/year)
4. If `.in` is taken, try: `suryaclean.co.in`, `suryacleanindia.com`
5. **Also buy** similar domains to prevent brand squatting:
   - `suryaclean.com` (if available)
   - `suryaclean.co.in`

### Setup Professional Email (IMPORTANT for trust)
**Option A: Zoho Mail (FREE for up to 5 users)**
1. Go to [zoho.com/mail](https://zoho.com/mail)
2. Choose "Business Email" → Free plan
3. Add your domain `suryaclean.in`
4. Follow their DNS setup wizard (they guide you step by step)
5. Create emails: `hello@suryaclean.in`, `support@suryaclean.in`, `jobs@suryaclean.in`

**Option B: Google Workspace (₹125/user/month)**
1. Go to [workspace.google.com](https://workspace.google.com)
2. Start free trial, add domain, verify DNS

> **What you'll get**: A professional email that builds customer trust. `hello@suryaclean.in` looks 100x more professional than `suryaclean123@gmail.com`.

---

## 3. Step 2: Setup Firebase (Google Login + Database)

This is the backbone — handles **Google Sign-In**, user data, and real-time database.

### 3.1 Create Firebase Project
1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add Project"** or **"Create a Project"**
3. Project name: `suryaclean` (or `suryaclean-prod`)
4. Enable Google Analytics (optional but recommended — free)
5. Select "Default Account for Firebase" → Create

### 3.2 Enable Authentication (Google Sign-In)
1. In Firebase Console → Left sidebar → **Build** → **Authentication**
2. Click **"Get Started"**
3. **Sign-in method** tab → Click **Google**
4. Toggle **Enable** → Select your Gmail as project support email → **Save**
5. ✅ Google Sign-In is now enabled!

### 3.3 Enable Firestore Database
1. Left sidebar → **Build** → **Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (we'll lock it down later)
4. Select location: **`asia-south1` (Mumbai)** — closest to Faridabad, lowest latency
5. Click **Enable**

> **Firestore will store**: Users, bookings, AMC subscriptions, payment records, worker assignments.

### 3.4 Register Your Web App (for Website)
1. Project Overview → Click **Web icon** `</>`
2. App nickname: `SuryaClean Web`
3. Check "Also set up Firebase Hosting" (we'll use Vercel instead, but this gives us config)
4. Click **"Register App"**
5. Copy the `firebaseConfig` object — it looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "suryaclean.firebaseapp.com",
     projectId: "suryaclean",
     storageBucket: "suryaclean.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
6. **SAVE THESE VALUES** — you'll need them for the website and backend.

### 3.5 Register Your Android App (for Flutter)
1. Project Overview → Click **Android icon** 🤖
2. Android package name: `com.suryaclean.app`
3. App nickname: `SuryaClean Android`
4. Debug signing certificate SHA-1 (skip for now, add later before Play Store)
5. Click **"Register App"**
6. Download `google-services.json` — save it to `suryaclean-app/mobile/android/app/`

### 3.6 Register Your iOS App (for Flutter)
1. Project Overview → Click **iOS icon** 🍎
2. iOS bundle ID: `com.suryaclean.app`
3. App nickname: `SuryaClean iOS`
4. Click **"Register App"**
5. Download `GoogleService-Info.plist` — save it to `suryaclean-app/mobile/ios/Runner/`

### 3.7 Generate Admin SDK Key (for Backend)
1. Project Settings → **Service accounts** tab
2. Click **"Generate new private key"**
3. Download the JSON file
4. This file contains: `project_id`, `client_email`, `private_key`
5. **KEEP THIS FILE SECURE** — never commit to git!

---

## 4. Step 3: Setup Razorpay (UPI Payments)

### 4.1 Create Razorpay Account
1. Go to **[dashboard.razorpay.com](https://dashboard.razorpay.com)**
2. Click **"Sign Up"**
3. Use your professional email: `hello@suryaclean.in`
4. Fill in business details:
   - Business name: **SuryaClean**
   - Business type: **Service**
   - Category: **Cleaning Services / Solar Energy Services**
   - Website: `https://suryaclean.in`
   - Address: Your Faridabad office address

### 4.2 Complete KYC Verification (3-5 business days)
Razorpay will ask for:
- **PAN Card** (company or personal)
- **Aadhaar Card**
- **Bank account details** (for settlements — money goes here)
- **GST Certificate** (if registered; optional if <₹20L turnover)

Once verified, your account switches from **Test Mode** to **Live Mode**.

### 4.3 Get Your API Keys
1. Dashboard → **Settings** → **API Keys**
2. You'll see two key pairs:
   - **Test Mode** (starts with `rzp_test_`) — for development
   - **Live Mode** (starts with `rzp_live_`) — for production
3. **Key ID** (public) — safe to use in frontend code
4. **Key Secret** (private) — ONLY use in backend, NEVER expose publicly

### 4.4 Enable UPI as Payment Method
1. Dashboard → **Settings** → **Payment Methods**
2. Ensure **UPI** is enabled
3. Also enable: Cards, Netbanking, Wallets (optional)
4. Set your UPI ID if you have one (optional — Razorpay auto-generates UPI collect)

### 4.5 Setup Webhook (for payment confirmations)
1. Dashboard → **Settings** → **Webhooks**
2. Add webhook URL: `https://your-api-url.com/api/payments/webhook`
3. Events: `payment.captured`, `payment.failed`
4. Generate webhook secret, save it to backend `.env`

### 💰 Razorpay Pricing at a Glance
| Plan | Setup Fee | Transaction Fee | Settlement |
|------|-----------|----------------|------------|
| Standard | ₹0 | 2% per transaction | T+2 days |
| For UPI specifically | ₹0 | 0% (UPI is free on Razorpay!) | T+2 days |

---

## 5. Step 4: Deploy Backend API to Production

### 5.1 Choose a Hosting Platform

| Platform | Free Tier | Ease | Production-Ready | Recommendation |
|----------|-----------|------|-----------------|----------------|
| **Render** | ✅ Free (limited hours) | Very Easy | ✅ Yes | **⭐ Best for starting out** |
| **Railway** | $5 credit free | Very Easy | ✅ Yes | Good alternative |
| **DigitalOcean** | $200 credit (60 days) | Medium | ✅ Yes | Best long-term |
| **VPS (Linode/AWS)** | Free tier available | Hard | ✅ Yes | For experienced users |

### 5.2 Deploy on Render (RECOMMENDED — Easiest)

**Step-by-step:**

1. Push your code to GitHub:
   ```bash
   cd /home/jkaushik/Solar/suryaclean-app/backend
   git init
   git add .
   git commit -m "Initial SuryaClean backend"
   # Create repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/suryaclean-backend.git
   git push -u origin main
   ```

2. Go to **[render.com](https://render.com)** → Sign up with GitHub

3. Click **"New +"** → **"Web Service"**

4. Connect your GitHub repo `suryaclean-backend`

5. Configure:
   - **Name**: `suryaclean-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Free plan**: Choose free tier

6. **Add Environment Variables** (Render → Environment tab):
   ```
   FIREBASE_PROJECT_ID=suryaclean
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----
   FIREBASE_DATABASE_URL=https://suryaclean.firebaseio.com
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_razorpay_secret
   PORT=5000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://suryaclean.in,https://www.suryaclean.in
   ```

7. Click **"Create Web Service"** — Render deploys automatically!

8. Your API URL will be: `https://suryaclean-api.onrender.com`

9. Update your `.env.local` in the website:
   ```
   NEXT_PUBLIC_API_URL=https://suryaclean-api.onrender.com
   ```

> ⚠️ **Free tier note**: Render free tier sleeps after 15 min of inactivity. First request wakes it up (takes ~30 seconds). Upgrade to $7/month plan for always-on. Or use a **cron job ping service** like [cron-job.org](https://cron-job.org) (free) to ping every 10 minutes.

---

## 6. Step 5: Deploy Website to Production

### 6.1 Deploy on Vercel (RECOMMENDED — Built for Next.js)

**Step-by-step:**

1. Push website code to GitHub:
   ```bash
   cd /home/jkaushik/Solar/suryaclean-app/web
   git init
   git add .
   git commit -m "Initial SuryaClean website"
   git remote add origin https://github.com/YOUR_USERNAME/suryaclean-web.git
   git push -u origin main
   ```

2. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub

3. Click **"Add New"** → **"Project"**

4. Import your repo `suryaclean-web`

5. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Add Environment Variables** (CRITICAL — these make it work):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...       ← from Firebase web app config
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=suryaclean.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=suryaclean
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=suryaclean.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   NEXT_PUBLIC_API_URL=https://suryaclean-api.onrender.com
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   ```

7. Click **"Deploy"**

8. ✅ Your website is LIVE at: `https://suryaclean-web.vercel.app`

---

## 7. Step 6: Connect Domain to Website

### 7.1 Point Domain to Vercel
1. In Vercel Dashboard → Your project → **Settings** → **Domains**
2. Enter your domain: `suryaclean.in`
3. Vercel will give you DNS records to add

### 7.2 Update DNS at Your Registrar
1. Go to your domain registrar (Namecheap/GoDaddy)
2. Find **DNS Settings** / **Nameservers**
3. Add the records Vercel gave you (usually a CNAME or A record):
   - **Type**: `A` → **Name**: `@` → **Value**: `76.76.21.21` (Vercel's IP)
   - **Type**: `CNAME` → **Name**: `www` → **Value**: `cname.vercel-dns.com`
4. Wait 5-60 minutes for DNS to propagate
5. Go to `https://suryaclean.in` — it should show your website!

### 7.3 Add Custom Domain to Render Backend (Optional)
For a professional setup, put your backend on a subdomain:
- Backend: `api.suryaclean.in` → point to Render
- Then: `NEXT_PUBLIC_API_URL=https://api.suryaclean.in`

---

## 8. Step 7: Deploy Flutter App to Play Store & App Store

### 8.1 Finalize Flutter Code for Production

Edit `/home/jkaushik/Solar/suryaclean-app/mobile/lib/main.dart`:

```dart
// CHANGE THESE TWO LINES:
const String API_URL = 'https://suryaclean-api.onrender.com';  // Your live backend
const String RAZORPAY_KEY = 'rzp_live_xxxxxxxxxx';  // Your LIVE Razorpay key (not test key)
```

### 8.2 Add Firebase Config Files
1. Copy `google-services.json` (downloaded in Step 3.5) to:
   `suryaclean-app/mobile/android/app/google-services.json`

2. Copy `GoogleService-Info.plist` (downloaded in Step 3.6) to:
   `suryaclean-app/mobile/ios/Runner/GoogleService-Info.plist`

### 8.3 Android — Google Play Store (₹1,500 one-time)

**Create Play Console Account:**
1. Go to **[play.google.com/console](https://play.google.com/console)**
2. Sign up as Developer → Pay ₹1,500 (one-time, lifetime)
3. Complete identity verification (PAN + Aadhaar)
4. Wait 1-2 days for approval

**Prepare the App:**
```bash
cd /home/jkaushik/Solar/suryaclean-app/mobile
flutter build appbundle --release
# Creates: build/app/outputs/bundle/release/app-release.aab
```

**Upload to Play Store:**
1. Play Console → **Create App**
2. App name: **SuryaClean — Solar Panel Cleaning**
3. Category: **Business** or **Home & Garden**
4. Upload the `.aab` file
5. Fill in:
   - Short description (80 chars): "Solar panel cleaning in Faridabad. Book via UPI."
   - Full description (copy from your website About section)
   - Screenshots: Take 4-6 from the running app
   - Feature graphic (1024x500 px banner)
   - Privacy policy URL: `https://suryaclean.in/privacy`
   - Content rating questionnaire
6. Set pricing: **Free**
7. Countries: **India** (add more later)
8. Click **"Publish"** → Takes 1-7 days for review

### 8.4 iOS — Apple App Store ($99/year)

1. Go to **[appstoreconnect.apple.com](https://appstoreconnect.apple.com)**
2. Enroll in Apple Developer Program ($99/year)
3. Build for iOS (requires macOS):
   ```bash
   cd /home/jkaushik/Solar/suryaclean-app/mobile
   flutter build ipa --release
   ```
4. Upload via Xcode or Transporter app
5. Fill in App Store metadata (similar to Play Store)
6. Submit for review (1-3 days)

> 💡 **TIP**: You can skip iOS initially. 95% of your Faridabad customers will use Android. Add iOS in Year 2 when you have revenue.

---

## 8. Step 8: Final Testing Checklist

Before announcing your service, verify ALL of these work on the LIVE website:

### Authentication
- [ ] Open `https://suryaclean.in` → Click "Sign in with Google"
- [ ] Google popup appears → Select your Gmail
- [ ] After login, navbar shows your name + profile pic ✅
- [ ] Click "Logout" → returns to logged-out state ✅

### Booking Flow
- [ ] Go to `/book` → Fill in system size, address, city
- [ ] Continue → Select date, time slot
- [ ] Click "Pay ₹899 & Confirm"
- [ ] Razorpay checkout opens → Select UPI → Enter UPI ID
- [ ] Authenticate in your UPI app (GPay/PhonePe)
- [ ] Payment successful → Booking confirmed ✅
- [ ] Booking ID shown on screen ✅

### AMC Subscription
- [ ] Go to `/amc` → Select system size
- [ ] Enter address, city, start date
- [ ] Click "Subscribe" on Standard plan
- [ ] Razorpay opens → Pay via UPI
- [ ] AMC activated ✅
- [ ] Scheduled visits appear in dashboard ✅

### Dashboard
- [ ] Go to `/dashboard`
- [ ] "My Bookings" tab → Shows your booking with status "Paid" ✅
- [ ] "AMC Subscriptions" tab → Shows AMC with visit schedule ✅
- [ ] "Transactions" tab → Shows payment history ✅

### Mobile App (if deployed)
- [ ] Open SuryaClean app → Sign in with Google
- [ ] Same bookings/AMC visible as on website ✅
- [ ] Book a new cleaning from app → Pay via UPI ✅
- [ ] App and website data sync (same backend) ✅

### Admin Dashboard (Bonus)
- [ ] Access via web or dedicated admin panel
- [ ] See all bookings, assign workers, update statuses
- [ ] View revenue dashboard

---

## 9. Environment Variables Master Sheet

Copy this — fill in YOUR values and keep it safe:

```
# ========================================
# SURYACLEAN PRODUCTION CONFIG
# ========================================

# Firebase Web App Config (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=_________________________________
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=_____________________________.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=______________________________
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=__________________________.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=_____________________
NEXT_PUBLIC_FIREBASE_APP_ID=__________________________________

# Firebase Admin SDK (from downloaded JSON key file)
FIREBASE_PROJECT_ID=__________________________________________
FIREBASE_CLIENT_EMAIL=________________________________________
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
______________________________________________________________
-----END PRIVATE KEY-----
FIREBASE_DATABASE_URL=https://________________________________.firebaseio.com

# Razorpay Live Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_________________________
RAZORPAY_KEY_SECRET=_________________________________________

# API URL (from Render/Railway deployment)
NEXT_PUBLIC_API_URL=https://__________________________________

# Domain
DOMAIN=suryaclean.in
```

---

## 10. Quick Reference: File Paths Where Keys Go

| Key Goes To | File Path |
|-------------|-----------|
| Firebase web config | `web/.env.local` (dev) / Vercel env vars (prod) |
| Firebase admin SDK | `backend/.env` (dev) / Render env vars (prod) |
| Razorpay key ID | `web/.env.local` AND `mobile/lib/main.dart` |
| Razorpay key secret | `backend/.env` ONLY (NEVER expose public) |
| API URL | `web/.env.local` AND `mobile/lib/main.dart` |
| Firebase android config | `mobile/android/app/google-services.json` |
| Firebase iOS config | `mobile/ios/Runner/GoogleService-Info.plist` |

---

## 📊 Estimated Timeline to Go Live

| Milestone | Time | Cost |
|-----------|------|------|
| Buy domain | 10 min | ₹800 |
| Setup Firebase | 15 min | Free |
| Setup Razorpay (KYC pending) | 3-5 business days | Free to register |
| Deploy backend to Render | 15 min | Free |
| Deploy website to Vercel | 10 min | Free |
| Point domain to Vercel | 5 min + 1-60 min DNS | Free |
| Setup Google Play Console | 1-2 days (review) | ₹1,500 |
| Deploy Android app | 2-3 days (review) | Free |
| **TOTAL TO GO LIVE** | **~5-7 days** | **~₹2,300 total** |

---

### 🔥 Next Step After Going Live
1. Ask 5 friends to book a test cleaning (pay them back via UPI)
2. Get 10 Google reviews from real customers
3. Start Google Ads (₹200/day budget targeting Faridabad)
4. Post once a week on your Google Business Profile
5. Visit 5 local solar installers for referral partnerships

**You're ready to launch! ☀️**