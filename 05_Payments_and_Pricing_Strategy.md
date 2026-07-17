# Payments & Pricing Strategy

## 1. Pricing Model — Residential

### One-Time Cleaning
Pricing based on system size (kW) and number of panels. Tiered for fairness.

| System Size | Panels (approx.) | Price (₹) | Price/Panel |
|-------------|------------------|-----------|-------------|
| 1-2 kW (Small home) | 3-6 panels | ₹499 | ₹83-166 |
| 3-5 kW (Standard home) | 9-15 panels | ₹899 | ₹60-100 |
| 6-10 kW (Large home) | 18-30 panels | ₹1,499 | ₹50-83 |
| 10+ kW (Villa/Farmhouse) | 30+ panels | ₹2,499+ | Custom quote |

### AMC (Annual Maintenance Contract) Plans

| Plan | Visits/Year | Includes | Price/Year | Value vs One-Time |
|------|-------------|----------|------------|-------------------|
| **SuryaClean Basic** | 2 (pre-monsoon + post-monsoon) | Cleaning only | ₹1,599 (3-5 kW) / ₹2,499 (6-10 kW) | Save 11% |
| **SuryaClean Standard** ⭐ | 4 (quarterly) | Cleaning + visual inspection + basic efficiency check | ₹2,999 (3-5 kW) / ₹4,499 (6-10 kW) | Save 17% |
| **SuryaClean Premium** | 6 (bi-monthly) | Cleaning + thermal imaging (once/year) + detailed health report + priority support | ₹4,999 (3-5 kW) / ₹6,999 (6-10 kW) | Save 8% + Thermal imaging worth ₹2,000 |
| **SuryaClean Society** | Custom | Bulk rate for entire housing society (min 10 homes) | 15-20% discount on Standard plan | Negotiable for 50+ homes |

### Add-On Services
| Service | Price |
|---------|-------|
| Thermal Imaging / Hotspot Detection | ₹1,500 (standalone) / Free with Premium AMC |
| Inverter Health Check | ₹500 |
| Bird Mesh Installation (per panel area) | ₹200-₹400 per sq.ft. |
| Anti-Soiling Coating Application | ₹300 per panel |
| DIY Cleaning Kit (sold via app) | ₹1,299 |
| Emergency Same-Day Cleaning | +50% surcharge |

---

## 2. Pricing Model — Commercial & Industrial

### Commercial (Shops, Offices, Schools, Hospitals)
| System Size | Panels | One-Time Price (₹) | AMC (Quarterly) (₹/year) |
|-------------|--------|--------------------|--------------------------|
| 10-25 kW | 30-75 | ₹3,999 - ₹7,499 | ₹12,000 - ₹20,000 |
| 25-50 kW | 75-150 | ₹7,499 - ₹13,999 | ₹20,000 - ₹38,000 |
| 50-100 kW | 150-300 | ₹13,999 - ₹24,999 | ₹38,000 - ₹68,000 |

### Industrial (Factories, Warehouses, Solar Farms)
- **Site survey required** before quoting
- Pricing: ₹40-₹80 per panel (volume-dependent)
- Minimum order: ₹10,000
- Typical 100 kW industrial system (300 panels): ₹15,000 - ₹24,000 per clean
- AMC discount: 10-15% for annual contract

### Additional Charges
| Factor | Surcharge |
|--------|-----------|
| Height surcharge (>3 stories / involved roof access) | +20% |
| Heavy soiling (bird droppings, construction dust, industrial grime) | +25-50% |
| Water scarcity area (we bring our own water tank) | +₹200 per 500L tanker |
| Weekend/premium slot (Sunday 8 AM - 12 PM) | +15% |
| Distance surcharge (outside 25 km from Faridabad center) | +₹5/km beyond 25 km |

---

## 3. Discount & Promotional Strategy

### Launch Offers (First 3 Months)
| Offer | Detail |
|--------|--------|
| **First Clean Free*** | Free demo clean for first 25 customers (limited to 3-5 kW systems) |
| **Referral Discount** | Refer a friend → both get ₹100 off next clean |
| **Society Launch** | 30% off for first 5 RWA partnerships |
| **Google Review Bonus** | ₹50 off for leaving a Google review after service |

### Ongoing Discounts
| Discount | Applicability |
|----------|--------------|
| **Prepaid AMC** | 5% extra off if paid annually upfront vs quarterly |
| **Multi-year AMC** | 10% off on 2-year AMC, 15% off on 3-year AMC |
| **Festival Offers** | Diwali/New Year: 10-15% off one-time cleans |
| **Senior Citizen** | 10% off (age 60+) |
| **Government Employee** | 5% off (trusted, regular income segment) |
| **Group Booking** | 3+ neighbors book same day → 10% off each |

---

## 4. Payment Methods — Customer Side

### Payment Gateway: **Razorpay** (Recommended)

**Why Razorpay?**
- Most popular Indian payment gateway
- Supports UPI, cards, netbanking, wallets, EMI
- Subscription/recurring billing for AMC (via Razorpay Subscriptions)
- Direct integration with Flutter (app) and web
- Settlement: T+2 days (money hits bank account in 2 days)
- Pricing: 2% per transaction (standard plan)

### Payment Options Offered to Customers

| Method | Use Case | Notes |
|--------|----------|-------|
| **UPI** (GPay, PhonePe, Paytm) | Primary | 90% of Indian digital payments. Must-have. |
| **Credit/Debit Card** | Secondary | Standard via Razorpay |
| **Netbanking** | Secondary | All major banks |
| **Razorpay Auto-Debit (eMandate)** | AMC recurring | Auto-debit monthly/quarterly/yearly from bank account |
| **Cash on Service** | Optional | Accept cash, but incentivize digital (₹25 cash surcharge or ₹25 digital discount) |
| **Wallets** (Paytm, Mobikwik) | Optional | Lower priority for service business |
| **BNPL** (LazyPay, Simpl) | Optional | Could help convert price-sensitive customers |
| **WhatsApp Pay** | Future | When API becomes widely available |

### Payment Flow
1. Customer books on app/website → enters address, system size, date
2. System calculates price
3. Customer pays 50% advance (Razorpay) or full amount
4. Balance 50% auto-debited upon job completion (worker marks "Done" in app) or collected in cash
5. Invoice auto-generated and emailed/WhatsApp'd

### Refund Policy
- Full refund if cancelled 24+ hours before appointment
- 50% refund if cancelled 6-24 hours before
- No refund if cancelled <6 hours or no-show
- Quality complaint → re-clean free within 48 hours (no refund, service guarantee instead)

---

## 5. Payment Model — Worker Side

### Salary Disbursement
- All salaries paid via **NEFT/IMPS bank transfer** by 5th of each month
- Per-job bonus calculated automatically from app data
- Workers must have bank accounts (help open Jan Dhan accounts if needed)

### Expense Reimbursement
- Travel allowance: Paid with salary (fixed ₹1,500-₹2,000/month)
- Equipment damage replacement: Company bears cost if not negligence
- Mobile data: ₹200/month reimbursement with salary

### Incentive Payouts
- 5-star bonus: Tracked in app, paid monthly
- Referral bonus (worker refers new customer): ₹100 per converted referral
- Worker referral bonus (worker refers new hire): ₹500 after 3-month completion

---

## 6. Revenue Collection & Accounting

### Accounting Software
- **Zoho Books** (₹799/month) or **TallyPrime** (₹18,000 one-time + ₹5,400/year)
- Zoho Books recommended: GST-compliant, integrates with Razorpay, auto-reconciliation

### GST Considerations
- **GST Registration**: Mandatory if turnover > ₹20L (services)
- **GST Rate on Solar Panel Cleaning**: 18% (SAC 9985 — Cleaning Services)
- If input tax credit is available on equipment/consumables, effective tax burden is lower
- **GST Invoice**: Required for all B2B (commercial/industrial) clients. Optional for B2C (residential) if customer doesn't need it.
- **Composition Scheme** (if turnover <₹50L): 6% flat rate, no input credit. Simpler compliance.
  - **Recommendation**: Start with composition scheme for simplicity, switch to regular when turnover crosses ₹30L

### Invoice Template
```
SuryaClean | GSTIN: XXXXXXXXXX
Invoice #: SC-YYYYMMDD-001
Date: DD/MM/YYYY
Customer: [Name] | [Address] | [Phone]
Service: [One-Time / AMC Plan Name]
System Size: [X kW] | Panels: [N]
Amount: ₹X,XXX
GST @18%: ₹XXX
Total: ₹X,XXX
Payment Status: [Paid / Pending]
```

### Financial Dashboard (Admin)
- Daily revenue
- Pending payments (cash collection due)
- Monthly GST liability
- Worker payout due
- Profit margin per job
- Revenue by segment (residential vs commercial vs AMC)

---

## 7. Pricing Psychology & Strategy

### Anchoring Strategy
- **Show "Regular Price" crossed out** next to AMC price to show savings
- Example: "One-Time × 4 visits = ₹3,596 → AMC Standard = ₹2,999 (Save ₹597)"
- **Thermal Imaging** priced at ₹1,500 standalone → makes Premium AMC at ₹4,999 feel like a deal (includes ₹1,500 value)

### Decoy Pricing
- **Basic (₹1,599)**: Anchor low, makes Standard look reasonable
- **Standard (₹2,999)** ⭐: Target plan — best value, most popular badge
- **Premium (₹4,999)**: Makes Standard look like the smart choice (decoy effect)

### Price Communication
- Never say "₹3,000" — say "₹2,999" (left-digit effect)
- Quote per-year for AMC, but show per-month breakdown: "Just ₹250/month for peace of mind"
- For commercial: Quote per-panel to show unit economics: "Only ₹49/panel per clean"

### Loss Framing
- "Dirty panels lose 15-30% output. On a 5 kW system, that's ₹750-₹1,500 lost every month."
- "One cleaning = ₹899. Potential monthly loss without cleaning = ₹1,000+. The math is simple."
- Use the ROI calculator on website to personalize this.

---

## 8. Competitive Price Comparison (Faridabad Market)

| Service Provider | 5 kW One-Time | AMC (Quarterly) | Notes |
|-----------------|---------------|-----------------|-------|
| **SuryaClean** | ₹899 | ₹2,999/year | Insured, app-based, trained workers |
| Local cleaner (unorganized) | ₹200-₹500 | ₹1,000-₹2,000 (verbal) | No insurance, no training, risk of damage |
| Solar installer AMC | Not offered separately | ₹8,000-₹15,000/year | Bundled with electrical maintenance |
| Facility management co. | ₹1,500-₹2,500 | ₹5,000-₹8,000/year | Professional but expensive, residential unfocused |
| DIY (self) | ₹0 + time + risk | ₹2,000 (DIY kit) | Safety risk, inconsistent quality |

**Our positioning**: Premium quality at mid-market price. Not the cheapest, not the most expensive. Best value.

---

## 9. Financial Projections by Payment Type

| Payment Type | % of Transactions | Avg. Ticket | Annual Volume (Yr 1) | Revenue |
|-------------|-------------------|-------------|---------------------|---------|
| One-Time UPI/Card | 40% | ₹800 | 560 jobs | ₹4,48,000 |
| One-Time Cash | 20% | ₹850 | 280 jobs | ₹2,38,000 |
| AMC Subscription | 30% | ₹3,600/year avg | 50 subs | ₹1,80,000 |
| Commercial Invoice (B2B) | 10% | ₹8,000 | 17 jobs | ₹1,36,000 |
| **Total** | **100%** | - | **~1,407** | **₹10,02,000** |

*(Adjusts earlier business plan revenue: ~₹10L Year 1 including commercial)*

---

## 10. Payment Tech Stack Summary

| Layer | Tool | Monthly Cost |
|-------|------|-------------|
| Payment Gateway | Razorpay Standard | 2% per txn (no fixed fee) |
| Recurring Billing | Razorpay Subscriptions | Included in standard |
| Invoicing | Zoho Books | ₹799/mo |
| GST Filing | Zoho Books + CA | ₹2,000-₹3,000/mo (CA) |
| Bank Account | Current Account (HDFC/ICICI/Kotak) | ₹500-₹1,500/mo (MAB) |
| POS/Swipe Machine (optional) | Paytm/PineLabs | ₹300-₹500/mo |
| Payment Links (WhatsApp) | Razorpay Payment Links | Included |

---

*Pricing should be revisited quarterly based on demand elasticity, competitor moves, and cost changes. The goal is to be the "premium affordable" choice — quality that justifies the price, but not so high that customers default to the unorganized sector.*