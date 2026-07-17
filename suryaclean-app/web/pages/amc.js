import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const AMC_PLANS = {
  '3-5kW': [
    { id: 'amc-basic', name: 'Basic', visits: 2, price: 1599, features: ['2 cleanings/year', 'Pre & Post Monsoon schedule', 'Standard purified water cleaning', 'WhatsApp reminders'] },
    { id: 'amc-standard', name: 'Standard ⭐', visits: 4, price: 2999, features: ['4 cleanings/year (quarterly)', 'Visual panel inspection', 'Basic efficiency check', 'Priority scheduling', 'Hinglish support'], featured: true },
    { id: 'amc-premium', name: 'Premium', visits: 6, price: 4999, features: ['6 cleanings/year (bi-monthly)', 'Thermal imaging (₹1,500 value)', 'Detailed system health report', 'Priority support (same-day callback)', 'Free bird mesh consultation'] },
  ],
  '6-10kW': [
    { id: 'amc-basic', name: 'Basic', visits: 2, price: 2499, features: ['2 cleanings/year', 'Standard cleaning'] },
    { id: 'amc-standard', name: 'Standard ⭐', visits: 4, price: 4499, features: ['4 cleanings/year', 'Visual inspection', 'Efficiency check'], featured: true },
    { id: 'amc-premium', name: 'Premium', visits: 6, price: 6999, features: ['6 cleanings/year', 'Thermal imaging', 'Detailed report'] },
  ],
};

export default function AMCPage() {
  const { user, token, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSystemSize, setSelectedSystemSize] = useState('3-5kW');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Faridabad');
  const [startDate, setStartDate] = useState('');

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Login to Subscribe</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Sign in with Google to view AMC plans and subscribe.</p>
          <button onClick={login} className="btn-google">Sign in with Google</button>
        </div>
      </>
    );
  }

  const startAMC = async (plan) => {
    if (!address || !startDate) {
      toast.error('Please enter your address and preferred start date.');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Create AMC subscription
      const res = await fetch(`${apiUrl}/api/amc/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          planId: plan.id,
          systemSize: selectedSystemSize,
          address: `${address}, ${city}`,
          startDate,
          amount: plan.price,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Subscription failed');

      // Create payment order
      const payRes = await fetch(`${apiUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: plan.price, amcId: data.amc.amcId }),
      });
      const payData = await payRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payData.amount,
        currency: 'INR',
        name: 'SuryaClean AMC',
        description: `${plan.name} AMC — ${selectedSystemSize}`,
        order_id: payData.orderId,
        prefill: { name: user.displayName, email: user.email },
        theme: { color: '#F5A623' },
        handler: async (response) => {
          const verifyRes = await fetch(`${apiUrl}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amcId: data.amc.amcId,
            }),
          });
          const v = await verifyRes.json();
          if (v.success) {
            toast.success('AMC activated! Welcome to SuryaClean family!');
            router.push('/dashboard');
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const plans = AMC_PLANS[selectedSystemSize] || AMC_PLANS['3-5kW'];

  return (
    <>
      <Head><title>AMC Plans — SuryaClean Solar Maintenance</title></Head>
      <Navbar />
      <div className="section">
        <div className="container">
          <h2>Annual Maintenance Contracts</h2>
          <p className="subtitle">Set it and forget it. Clean panels guaranteed, all year round.</p>

          <div style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
            <div className="form-group">
              <label>Select Your System Size</label>
              <select value={selectedSystemSize} onChange={(e) => setSelectedSystemSize(e.target.value)}>
                <option value="3-5kW">3-5 kW (9-15 panels)</option>
                <option value="6-10kW">6-10 kW (18-30 panels)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Service Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address for service visits" required />
            </div>
            <div className="form-group">
              <label>City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option>Faridabad</option><option>Ballabgarh</option><option>Palwal</option><option>Gurgaon</option><option>Noida</option><option>South Delhi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <h3>{plan.name}</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>{plan.visits} professional visits/year</p>
                <div className="price">₹{plan.price.toLocaleString()}<small>/year</small></div>
                <p style={{ color: '#666', fontSize: '13px', marginTop: '-8px' }}>₹{Math.round(plan.price / 12).toLocaleString()}/month</p>
                <ul>
                  {plan.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <button className="btn-primary" onClick={() => startAMC(plan)} disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Processing...' : `Subscribe — ₹${plan.price}`}
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px', padding: '24px', background: '#f9fafb', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '8px' }}>💰 Save More</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              <strong>2-year AMC:</strong> 10% off &nbsp;|&nbsp; <strong>3-year AMC:</strong> 15% off<br />
              <strong>Society Bulk (10+ homes):</strong> 15-20% off — contact us for custom quote.<br />
              <strong>Refer a friend:</strong> Both get ₹300 cashback on AMC signup.
            </p>
          </div>
        </div>
      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </>
  );
}