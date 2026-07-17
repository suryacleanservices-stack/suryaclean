import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FaCalendarCheck, FaMoneyBillWave, FaClipboardList, FaTimes } from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const { user, token, login } = useAuth();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/api/amc`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([b, a, t]) => {
        setBookings(Array.isArray(b) ? b : []);
        setAmcs(Array.isArray(a) ? a : []);
        setTransactions(Array.isArray(t) ? t : []);
      })
      .catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>My Account</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Login to view your bookings, AMC subscriptions, and payment history.</p>
          <button onClick={login} className="btn-google">Sign in with Google</button>
        </div>
      </>
    );
  }

  const statusBadge = (status) => {
    const map = {
      pending: 'badge-pending',
      confirmed: 'badge-info',
      'in-progress': 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge-danger',
      active: 'badge-success',
    };
    return <span className={`badge ${map[status] || 'badge-pending'}`}>{status}</span>;
  };

  const getStatusBadge = (paymentStatus) => {
    return paymentStatus === 'paid' ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Pending</span>;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b));
      }
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  return (
    <>
      <Head><title>My Account — SuryaClean</title></Head>
      <Navbar />
      <div className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            {user.photoURL && <img src={user.photoURL} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />}
            <div>
              <h2 style={{ margin: 0 }}>Welcome, {user.displayName}</h2>
              <p style={{ color: '#666', fontSize: '14px' }}>{user.email}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #eee', paddingBottom: '0' }}>
            {[
              { key: 'bookings', icon: <FaCalendarCheck />, label: 'My Bookings', count: bookings.length },
              { key: 'amc', icon: <FaClipboardList />, label: 'AMC Subscriptions', count: amcs.length },
              { key: 'transactions', icon: <FaMoneyBillWave />, label: 'Transactions', count: transactions.length },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '12px 24px', border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: tab === t.key ? '3px solid #F5A623' : '3px solid transparent',
                  color: tab === t.key ? '#F5A623' : '#666', fontWeight: 600, fontSize: '14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                {t.icon} {t.label}
                {t.count > 0 && <span style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{t.count}</span>}
              </button>
            ))}
          </div>

          {loading && <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Loading your data...</p>}

          {/* BOOKINGS TAB */}
          {!loading && tab === 'bookings' && (
            <div>
              {bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                  <p style={{ color: '#999', marginBottom: '16px' }}>No bookings yet.</p>
                  <Link href="/book" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Book Your First Clean</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookings.map(b => (
                    <div key={b.bookingId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '14px', color: '#1B2A4A' }}>{b.bookingId}</strong>
                          {statusBadge(b.status)}
                          {getStatusBadge(b.paymentStatus)}
                        </div>
                        <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}><strong>Address:</strong> {b.address}</p>
                        <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                          <strong>System:</strong> {b.systemSize} &nbsp;|&nbsp; <strong>Date:</strong> {b.scheduledDate} &nbsp;|&nbsp; <strong>Time:</strong> {b.scheduledTime}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#F5A623', margin: '4px 0' }}>₹{b.amount}</p>
                        {b.notes && <p style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>Notes: {b.notes}</p>}
                        {b.assignedWorker && <p style={{ fontSize: '12px', color: '#27AE60' }}>👷 Assigned: {b.assignedWorker.workerName}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {b.status === 'pending' && (
                          <button className="btn-secondary" onClick={() => handleCancelBooking(b.bookingId)} style={{ fontSize: '12px', padding: '6px 12px' }}>
                            <FaTimes /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AMC TAB */}
          {!loading && tab === 'amc' && (
            <div>
              {amcs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                  <p style={{ color: '#999', marginBottom: '16px' }}>No active AMC subscriptions.</p>
                  <Link href="/amc" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>View AMC Plans</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {amcs.map(a => (
                    <div key={a.amcId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <strong>{a.amcId}</strong>
                          {statusBadge(a.status)}
                          {getStatusBadge(a.paymentStatus)}
                        </div>
                        <p style={{ fontSize: '13px', color: '#666' }}>
                          <strong>Plan:</strong> {a.planId} &nbsp;|&nbsp; <strong>System:</strong> {a.systemSize}<br />
                          <strong>Period:</strong> {a.startDate} — {a.endDate}<br />
                          <strong>Visits completed:</strong> {a.completedVisits || 0}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#F5A623' }}>₹{a.amount}/year</p>

                        {/* Scheduled visits */}
                        {a.scheduledVisits && a.scheduledVisits.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <strong style={{ fontSize: '12px' }}>Upcoming Visits:</strong>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                              {a.scheduledVisits.map((v, i) => (
                                <span key={i} className={`badge ${v.status === 'completed' ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '11px' }}>
                                  {v.scheduledDate} — Visit #{v.visitNumber}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {!loading && tab === 'transactions' && (
            <div>
              {transactions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                  <p style={{ color: '#999' }}>No transactions yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {transactions.map((tx, i) => (
                    <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13px' }}>Payment ID: {tx.paymentId?.slice(0, 16)}...</strong>
                          <span className="badge badge-success">Success</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#666' }}>
                          {tx.bookingId && <span><strong>Booking:</strong> {tx.bookingId} &nbsp;</span>}
                          {tx.amcId && <span><strong>AMC:</strong> {tx.amcId} &nbsp;</span>}
                          {tx.booking && <span><strong>Service:</strong> {tx.booking.systemSize} &nbsp;</span>}
                          {tx.amc && <span><strong>Plan:</strong> {tx.amc.planId}</span>}
                        </p>
                        <p style={{ fontSize: '12px', color: '#999' }}>
                          {tx.createdAt ? new Date(tx.createdAt.seconds ? tx.createdAt.seconds * 1000 : tx.createdAt).toLocaleString('en-IN') : ''}
                        </p>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#27AE60' }}>
                        {tx.booking ? `₹${tx.booking.amount}` : tx.amc ? `₹${tx.amc.amount}` : '₹—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}