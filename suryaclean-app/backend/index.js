const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(express.json());

// ============================================================
// FIREBASE INIT
// ============================================================
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const auth = admin.auth();

// ============================================================
// RAZORPAY INIT
// ============================================================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================
// MIDDLEWARE: Verify Firebase Auth Token
// ============================================================
async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/google — Verify Google ID token, create/update user
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await auth.verifyIdToken(idToken);

    // Upsert user profile in Firestore
    const userRef = db.collection('users').doc(decoded.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid: decoded.uid,
        name: decoded.name || '',
        email: decoded.email || '',
        phone: decoded.phone_number || '',
        photoURL: decoded.picture || '',
        addresses: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.update({
        name: decoded.name || userDoc.data().name,
        photoURL: decoded.picture || userDoc.data().photoURL,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const userData = (await userRef.get()).data();
    res.json({ success: true, user: userData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/user/profile — Get current user profile
app.get('/api/user/profile', verifyAuth, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    res.json(userDoc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/user/profile — Update user profile
app.put('/api/user/profile', verifyAuth, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const updateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;

    await db.collection('users').doc(req.user.uid).update(updateData);
    const updated = await db.collection('users').doc(req.user.uid).get();
    res.json(updated.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// SERVICES / PRICING — Public
// ============================================================
app.get('/api/services', async (req, res) => {
  const services = [
    {
      id: 'one-time',
      name: 'One-Time Cleaning',
      nameHi: 'एक बार की सफाई',
      tiers: [
        { label: '1-2 kW (Small Home)', panels: '3-6', price: 499 },
        { label: '3-5 kW (Standard Home)', panels: '9-15', price: 899 },
        { label: '6-10 kW (Large Home)', panels: '18-30', price: 1499 },
        { label: '10+ kW (Villa/Farmhouse)', panels: '30+', price: 2499 },
      ],
    },
    {
      id: 'amc',
      name: 'AMC Plans',
      nameHi: 'वार्षिक अनुरक्षण अनुबंध',
      plans: [
        {
          id: 'amc-basic', name: 'Basic', nameHi: 'बेसिक',
          visits: 2, price3kw: 1599, price6kw: 2499,
          includes: '2 cleanings/year (Pre & Post Monsoon)',
        },
        {
          id: 'amc-standard', name: 'Standard ⭐', nameHi: 'स्टैंडर्ड',
          visits: 4, price3kw: 2999, price6kw: 4499,
          includes: '4 cleanings/year + Visual Inspection + Efficiency Check',
        },
        {
          id: 'amc-premium', name: 'Premium', nameHi: 'प्रीमियम',
          visits: 6, price3kw: 4999, price6kw: 6999,
          includes: '6 cleanings/year + Thermal Imaging + Priority Support + Detailed Report',
        },
      ],
    },
    {
      id: 'addons',
      name: 'Add-On Services',
      nameHi: 'अतिरिक्त सेवाएं',
      items: [
        { id: 'thermal', name: 'Thermal Imaging / Hotspot Detection', price: 1500 },
        { id: 'inverter', name: 'Inverter Health Check', price: 500 },
        { id: 'bird-mesh', name: 'Bird Mesh Installation (per sq.ft.)', price: 300 },
        { id: 'coating', name: 'Anti-Soiling Coating (per panel)', price: 300 },
      ],
    },
  ];
  res.json(services);
});

// ============================================================
// BOOKINGS
// ============================================================

// POST /api/bookings — Create a new booking
app.post('/api/bookings', verifyAuth, async (req, res) => {
  try {
    const { serviceId, planId, systemSize, address, scheduledDate, scheduledTime, notes, amount } = req.body;
    const bookingId = `SC-${Date.now().toString(36).toUpperCase()}`;

    const booking = {
      bookingId,
      uid: req.user.uid,
      userId: req.user.uid,
      customerName: req.user.name || '',
      customerPhone: req.user.phone_number || '',
      serviceId,
      planId: planId || null,
      systemSize,
      address,
      scheduledDate,
      scheduledTime,
      notes: notes || '',
      amount,
      status: 'pending', // pending | confirmed | in-progress | completed | cancelled
      paymentStatus: 'pending', // pending | partial | paid | refunded
      paymentId: null,
      orderId: null,
      assignedWorker: null,
      beforePhotos: [],
      afterPhotos: [],
      rating: null,
      review: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('bookings').doc(bookingId).set(booking);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings — List user's bookings
app.get('/api/bookings', verifyAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('bookings')
      .where('uid', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = [];
    snapshot.forEach(doc => bookings.push(doc.data()));
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:id — Get single booking
app.get('/api/bookings/:id', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('bookings').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Booking not found' });
    if (doc.data().uid !== req.user.uid) return res.status(403).json({ error: 'Access denied' });
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id/cancel — Cancel booking
app.put('/api/bookings/:id/cancel', verifyAuth, async (req, res) => {
  try {
    const doc = await db.collection('bookings').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Booking not found' });
    if (doc.data().uid !== req.user.uid) return res.status(403).json({ error: 'Access denied' });
    if (!['pending', 'confirmed'].includes(doc.data().status)) {
      return res.status(400).json({ error: 'Cannot cancel booking in current status' });
    }

    await db.collection('bookings').doc(req.params.id).update({
      status: 'cancelled',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// AMC SUBSCRIPTIONS
// ============================================================

// POST /api/amc/subscribe — Create AMC subscription
app.post('/api/amc/subscribe', verifyAuth, async (req, res) => {
  try {
    const { planId, systemSize, address, startDate, amount } = req.body;
    const amcId = `AMC-${Date.now().toString(36).toUpperCase()}`;

    const visitsPerYear = planId === 'amc-basic' ? 2 : planId === 'amc-standard' ? 4 : 6;
    const scheduledVisits = [];
    const start = new Date(startDate);
    const intervalMonths = 12 / visitsPerYear;

    for (let i = 0; i < visitsPerYear; i++) {
      const visitDate = new Date(start);
      visitDate.setMonth(visitDate.getMonth() + Math.round(i * intervalMonths));
      scheduledVisits.push({
        visitNumber: i + 1,
        scheduledDate: visitDate.toISOString().split('T')[0],
        status: 'scheduled',
      });
    }

    const amc = {
      amcId,
      uid: req.user.uid,
      planId,
      systemSize,
      address,
      startDate,
      endDate: new Date(start.getFullYear() + 1, start.getMonth(), start.getDate()).toISOString().split('T')[0],
      amount,
      paymentStatus: 'pending',
      paymentId: null,
      orderId: null,
      scheduledVisits,
      completedVisits: 0,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('amc_subscriptions').doc(amcId).set(amc);
    res.status(201).json({ success: true, amc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/amc — List user's AMC subscriptions
app.get('/api/amc', verifyAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('amc_subscriptions')
      .where('uid', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const amcs = [];
    snapshot.forEach(doc => amcs.push(doc.data()));
    res.json(amcs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PAYMENTS — Razorpay Integration
// ============================================================

// POST /api/payments/create-order — Create Razorpay order
app.post('/api/payments/create-order', verifyAuth, async (req, res) => {
  try {
    const { amount, bookingId, amcId, currency = 'INR' } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: bookingId || amcId || `rcpt_${uuidv4()}`,
      notes: {
        uid: req.user.uid,
        bookingId: bookingId || '',
        amcId: amcId || '',
      },
    };

    const order = await razorpay.orders.create(options);

    // Log order in Firestore
    await db.collection('payment_orders').doc(order.id).set({
      orderId: order.id,
      uid: req.user.uid,
      bookingId: bookingId || null,
      amcId: amcId || null,
      amount: order.amount / 100,
      currency: order.currency,
      status: order.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/verify — Verify Razorpay payment signature
app.post('/api/payments/verify', verifyAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amcId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment order
    await db.collection('payment_orders').doc(razorpay_order_id).update({
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'paid',
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update booking or AMC payment status
    if (bookingId) {
      await db.collection('bookings').doc(bookingId).update({
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'confirmed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    if (amcId) {
      await db.collection('amc_subscriptions').doc(amcId).update({
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'active',
      });
    }

    // Log transaction
    await db.collection('transactions').add({
      uid: req.user.uid,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      bookingId: bookingId || null,
      amcId: amcId || null,
      status: 'success',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// TRANSACTIONS / ORDER HISTORY
// ============================================================

// GET /api/transactions — List all user transactions
app.get('/api/transactions', verifyAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('transactions')
      .where('uid', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const transactions = [];
    for (const doc of snapshot.docs) {
      const tx = doc.data();
      // Enrich with booking/AMC details
      if (tx.bookingId) {
        const bookingDoc = await db.collection('bookings').doc(tx.bookingId).get();
        if (bookingDoc.exists) {
          tx.booking = bookingDoc.data();
        }
      }
      if (tx.amcId) {
        const amcDoc = await db.collection('amc_subscriptions').doc(tx.amcId).get();
        if (amcDoc.exists) {
          tx.amc = amcDoc.data();
        }
      }
      transactions.push(tx);
    }

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ADMIN ENDPOINTS — Protected
// ============================================================
async function verifyAdmin(req, res, next) {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/admin/bookings — All bookings (admin)
app.get('/api/admin/bookings', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = db.collection('bookings').orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);
    const snapshot = await query.limit(100).get();
    const bookings = [];
    snapshot.forEach(doc => bookings.push(doc.data()));
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/bookings/:id/assign — Assign worker to booking
app.put('/api/admin/bookings/:id/assign', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { workerId, workerName } = req.body;
    await db.collection('bookings').doc(req.params.id).update({
      assignedWorker: { workerId, workerName },
      status: 'confirmed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/bookings/:id/status — Update booking status
app.put('/api/admin/bookings/:id/status', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.collection('bookings').doc(req.params.id).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/dashboard — Dashboard stats
app.get('/api/admin/dashboard', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const [bookingsSnap, amcsSnap, txnsSnap, usersSnap] = await Promise.all([
      db.collection('bookings').get(),
      db.collection('amc_subscriptions').get(),
      db.collection('transactions').where('status', '==', 'success').get(),
      db.collection('users').get(),
    ]);

    let totalRevenue = 0;
    txnsSnap.forEach(doc => {
      const tx = doc.data();
      const bookingAmount = tx.booking?.amount || tx.amount || 0;
      totalRevenue += bookingAmount;
    });

    res.json({
      totalBookings: bookingsSnap.size,
      activeAMCs: amcsSnap.docs.filter(d => d.data().status === 'active').length,
      totalRevenue,
      totalUsers: usersSnap.size,
      pendingJobs: bookingsSnap.docs.filter(d => d.data().status === 'pending').length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'SuryaClean API v1.0' });
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`☀️ SuryaClean API running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;