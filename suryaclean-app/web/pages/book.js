import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const TIER_PRICES = { '1-2kW': 499, '3-5kW': 899, '6-10kW': 1499, '10+kW': 2499 };
const TIME_SLOTS = [
  '07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM',
];

export default function BookPage() {
  const { user, token, login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    systemSize: '3-5kW',
    address: '',
    city: 'Faridabad',
    scheduledDate: '',
    scheduledTime: '09:00 AM - 10:00 AM',
    notes: '',
    amount: 899,
  });

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Please Login to Book</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Sign in with Google to book your solar panel cleaning slot.</p>
          <button onClick={login} className="btn-google" style={{ fontSize: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign in with Google
          </button>
        </div>
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { ...form, [name]: value };
    if (name === 'systemSize') {
      updates.amount = TIER_PRICES[value] || 899;
    }
    setForm(updates);
  };

  const handleCreateBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          serviceId: 'one-time',
          systemSize: form.systemSize,
          address: `${form.address}, ${form.city}`,
          scheduledDate: form.scheduledDate,
          scheduledTime: form.scheduledTime,
          notes: form.notes,
          amount: form.amount,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Create Razorpay order
      const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: form.amount, bookingId: data.booking.bookingId }),
      });
      const payData = await payRes.json();

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payData.amount,
        currency: 'INR',
        name: 'SuryaClean',
        description: `Solar Panel Cleaning - ${form.systemSize}`,
        order_id: payData.orderId,
        prefill: { name: user.displayName, email: user.email, contact: user.phoneNumber || '' },
        theme: { color: '#F5A623' },
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: data.booking.bookingId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Booking confirmed! Check your dashboard.');
            router.push('/dashboard');
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled. Your booking is saved as pending.') },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Booking failed. Please try again.');
    }
    setLoading(false);
  };

  const getMinDate = () => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <>
      <Head><title>Book Solar Panel Cleaning — SuryaClean</title></Head>
      <Navbar />
      <div className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2>Book Your Cleaning Slot</h2>
          <p className="subtitle">Fill in the details below. Payment via UPI, Card, or Netbanking.</p>

          <div className="card">
            {/* Step 1: System Details */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label>System Size</label>
                  <select name="systemSize" value={form.systemSize} onChange={handleChange}>
                    <option value="1-2kW">1-2 kW — Small Home (3-6 panels)</option>
                    <option value="3-5kW">3-5 kW — Standard Home (9-15 panels)</option>
                    <option value="6-10kW">6-10 kW — Large Home (18-30 panels)</option>
                    <option value="10+kW">10+ kW — Villa/Farmhouse</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Full Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} placeholder="House/Flat No., Street, Colony/Sector, Landmark" required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <select name="city" value={form.city} onChange={handleChange}>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Ballabgarh">Ballabgarh</option>
                    <option value="Palwal">Palwal</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Noida">Noida</option>
                    <option value="Delhi">South Delhi</option>
                  </select>
                </div>
                <button className="btn-primary" onClick={() => setStep(2)} disabled={!form.address} style={{ width: '100%' }}>
                  Continue — ₹{form.amount}
                </button>
              </>
            )}

            {/* Step 2: Schedule & Confirm */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} min={getMinDate()} required />
                </div>
                <div className="form-group">
                  <label>Preferred Time Slot</label>
                  <select name="scheduledTime" value={form.scheduledTime} onChange={handleChange}>
                    {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Special Instructions (Optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="E.g., Gate code, pet on premises, contact security guard..." />
                </div>

                <div className="card" style={{ background: '#f9fafb', marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '12px' }}>Booking Summary</h4>
                  <div style={{ fontSize: '14px', lineHeight: 2, color: '#555' }}>
                    <div><strong>Service:</strong> One-Time Solar Panel Cleaning</div>
                    <div><strong>System:</strong> {form.systemSize}</div>
                    <div><strong>Address:</strong> {form.address}, {form.city}</div>
                    <div><strong>Date & Time:</strong> {form.scheduledDate} at {form.scheduledTime}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#F5A623', marginTop: '8px' }}>Total: ₹{form.amount}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                  <button className="btn-primary" onClick={handleCreateBooking} disabled={loading || !form.scheduledDate} style={{ flex: 2 }}>
                    {loading ? 'Processing...' : 'Pay ₹' + form.amount + ' & Confirm'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </>
  );
}