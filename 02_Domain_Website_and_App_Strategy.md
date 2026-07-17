# Domain, Website & App Strategy

## Domain Name Recommendations

### Primary Domain
| Option | Status | Annual Cost | Notes |
|--------|--------|-------------|-------|
| `suryaclean.in` | **Best pick** | ~₹599-₹899/yr | .in TLD is trusted in India, short, brand-matching |
| `suryaclean.com` | Check availability | ~₹999-₹1,499/yr | Premium if available; may need to buy from reseller |
| `suryaclean.co.in` | Good alternative | ~₹399-₹699/yr | Second choice if .in taken |

### Where to Buy
| Registrar | Why |
|-----------|-----|
| **Namecheap** | Free WHOIS privacy, good renewal rates, easy DNS management |
| **GoDaddy India** | Local payment options (UPI, Netbanking), 24/7 Indian support |
| **BigRock** | Indian registrar, competitive .in pricing, Hindi support |
| **Google Domains** | Simplest UI, integrates with Google Workspace seamlessly |

### Domain Strategy
- **Buy all three TLDs** (.in, .com, .co.in) and redirect to primary — prevents brand squatting. Total: ~₹2,000-₹3,000/year.
- Setup **professional email**: `hello@suryaclean.in`, `support@suryaclean.in`, `jobs@suryaclean.in` via Google Workspace (₹125/user/month) or Zoho Mail (free up to 5 users).

---

## Website Architecture

### Platform Choice: **Next.js + Vercel** (or WordPress for faster launch)

#### Option A — Next.js (Recommended for App-Synced Business)
- **Hosting**: Vercel (free tier sufficient for initial traffic)
- **Headless CMS**: Sanity.io or Strapi for blog/service pages
- **Cost**: ₹0 hosting + ~₹500/mo CMS (optional initially)
- **Pros**: Blazing fast, SEO optimized, API-ready for app integration, PWA capable
- **Cons**: Needs a developer for initial setup

#### Option B — WordPress (Faster to Launch)
- **Hosting**: Hostinger India (~₹149/mo, includes free .in domain)
- **Theme**: Astra Pro or GeneratePress (₹4,999 one-time)
- **Plugins**: WPForms, Yoast SEO, WooCommerce (for service bookings)
- **Pros**: No-code, ₹200/mo all-in, huge plugin ecosystem
- **Cons**: Slower, less flexible for app integration

### Website Pages (Sitemap)

```
Home (/)
├── Hero: "Your Solar Panels Deserve SuryaClean"
├── ROI Calculator Widget (interactive — enter kW, see savings)
├── How It Works (3-step graphic: Book → Clean → Save)
├── Trust Badges (insured, trained, 5-star reviews)
├── Service Areas (Faridabad, Ballabgarh, Palwal, Gurgaon, Noida, Delhi NCR)
└── CTA: "Book Free Inspection"

Services (/services)
├── Residential Panel Cleaning
├── Commercial & Industrial Cleaning
├── AMC Plans (Quarterly/Monthly)
├── Waterless/Eco Cleaning
└── Inspection & Diagnostics

Pricing (/pricing)
├── Pricing Calculator
├── One-Time vs AMC comparison
├── Discount for society bulk booking
└── Transparent rate card (₹/panel or ₹/kW)

About (/about)
├── Our Story
├── Team
├── Certifications & Insurance
└── CSR / Water Conservation Pledge

Blog (/blog)
├── "How Dirty Panels Cost You ₹X per Month"
├── "Monsoon Care for Solar Panels"
├── "5 Signs Your Panels Need Professional Cleaning"
├── "Faridabad Solar Policy Updates"
└── Case Studies with before/after photos

Book Now (/book)
├── Service selection
├── Date/time picker + address
├── Instant price estimate
├── Payment integration
└── Confirmation & tracking

Contact (/contact)
├── Phone, WhatsApp, Email
├── Office address (Faridabad)
└── Contact form
```

### SEO Strategy for Website
- **Local Keywords**: "solar panel cleaning Faridabad", "solar safai service near me", "best solar cleaner Ballabgarh", "solar maintenance company NCR"
- **Google Business Profile**: Create and optimize — will drive 60%+ of local leads
- **Schema Markup**: LocalBusiness, Service, FAQ, Review schema
- **Backlinks**: Partner with solar installers for referral links, list on Justdial/Sulekha/IndiaMart
- **Google Ads**: ₹5,000-₹10,000/month targeting "solar cleaning near me" in Faridabad + 50km radius

---

## App Strategy

### App Name: **SuryaClean** (same as brand, on Play Store & App Store)

### Platform: **Flutter** (single codebase for Android + iOS)

### Why Flutter?
- Single codebase → 40% lower development cost
- Hot reload → faster iteration
- Rich widget library → polished UI quickly
- Firebase integration → real-time booking, notifications, analytics

### Development Approach
| Phase | Approach | Estimated Cost | Timeline |
|-------|----------|----------------|----------|
| **MVP** | Freelancer (Upwork/Fiverr) or Indian dev agency | ₹80,000 - ₹1,50,000 | 6-8 weeks |
| **V1** | In-house junior dev + senior part-time | ₹2,50,000 - ₹4,00,000 | 3-4 months |
| **V2** | Full in-house team of 2-3 | ₹8-12L/year | Ongoing |

### MVP App Features (Phase 1)

#### User Side
- **Onboarding**: 3-screen walkthrough (Book → Clean → Save), phone OTP login
- **Book a Clean**: Select service type → auto-detect location → choose date/time → instant price → pay
- **Real-time Tracking**: See cleaner en-route on map (like Uber/Swiggy)
- **Service History**: Past bookings, invoices, payment receipts
- **Profile**: Addresses saved, payment methods (UPI, Card, Netbanking, Cash)
- **Rate & Review**: Post-service rating + photo upload
- **Referral Program**: Share code → earn ₹100 off next clean
- **Push Notifications**: Booking confirmed, cleaner arriving, service done, AMC renewal reminder

#### Worker Side (SuryaClean Partner App)
- **Job Queue**: Today's assigned jobs with route optimization
- **Job Details**: Address, panel count, special instructions, customer contact
- **Check-in/Check-out**: GPS-verified attendance at job site
- **Before/After Photo Upload**: Mandatory photo capture for QA
- **Earnings Dashboard**: Daily/weekly earnings, pending payments
- **Availability Toggle**: Mark self available/unavailable

#### Admin Dashboard (Web-based, not in app)
- **Booking Management**: View/edit/cancel all bookings
- **Worker Assignment**: Auto-assign or manual assign based on location
- **Analytics**: Revenue, bookings per day, customer acquisition cost, churn rate
- **Inventory Tracking**: Equipment usage, consumable levels
- **Customer Support**: Chat/WhatsApp integration, ticket management
- **Payout Management**: Worker payment processing

### Tech Stack Summary
| Component | Technology | Cost |
|-----------|------------|------|
| Frontend (App) | Flutter | ₹1,50,000 (MVP) |
| Backend | Node.js + Express / Firebase | ₹80,000 |
| Database | Firebase Firestore or PostgreSQL (Supabase) | Free tier to start |
| Auth | Firebase Auth (OTP login) | Free up to 10K users |
| Payments | Razorpay / Cashfree | 2% per transaction |
| Maps | Google Maps API | ₹15,000/year (after free credits) |
| Push Notifications | Firebase Cloud Messaging | Free |
| Analytics | Firebase Analytics + Google Analytics | Free |
| Hosting | Firebase / Vercel | Free tier |
| SMS | MSG91 / Twilio | ₹0.25/SMS |

### App Monetization Features (Upsell Potential)
- **SuryaSmart Add-on**: In-app purchase for IoT solar monitoring (future hardware product)
- **Premium AMC**: Recurring subscription billing via app
- **Referral Credits**: Viral growth mechanic
- **Marketplace**: In-app store for solar accessories (cleaning kits, bird mesh, etc.)

### App Development Timeline
| Milestone | Duration | Deliverable |
|-----------|----------|-------------|
| UI/UX Design | 2 weeks | Figma prototypes for all screens |
| Backend Setup | 2 weeks | Database, auth, API endpoints |
| User App (MVP) | 4 weeks | Booking flow, payments, tracking |
| Worker App (MVP) | 3 weeks | Job management, check-in/out |
| Testing + QA | 2 weeks | Bug fixes, UAT with 10 beta users |
| Launch | 1 week | Play Store listing, App Store submission |
| **Total** | **14 weeks** | **MVP ready to launch** |

### App Store Optimization (ASO)
- **Title**: "SuryaClean - Solar Panel Cleaning & AMC"
- **Keywords**: solar cleaning, panel safai, solar maintenance, panel wash, solar care
- **Screenshots**: Before/after cleaning, booking flow, price transparency
- **Reviews Strategy**: In-app prompt after 3rd completed job, incentivize with ₹50 off

---

## Integration: Website ↔ App
- **Single Backend**: Both website and app hit the same API/database
- **Deep Links**: Website booking links open in app if installed
- **PWA Fallback**: Website works as a Progressive Web App for users who don't install the app
- **Shared Auth**: Single login works on both platforms

---

*This strategy prioritizes a fast, lean launch with MVP app in 3.5 months, while the website can go live in 2-4 weeks to start capturing leads immediately.*