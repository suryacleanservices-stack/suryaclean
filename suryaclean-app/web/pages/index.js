import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaBuilding, FaIndustry, FaLeaf, FaShieldAlt, FaMobileAlt, FaStar, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const { user, login } = useAuth();

  const stats = [
    { icon: <FaHome size={32} />, value: '15,000+', label: 'Solar Homes in Faridabad' },
    { icon: <FaLeaf size={32} />, value: '30%', label: 'Max Power Loss from Dust' },
    { icon: <FaStar size={32} />, value: '4.9/5', label: 'Google Rating' },
    { icon: <FaShieldAlt size={32} />, value: '100%', label: 'Insured Service' },
  ];

  const services = [
    { icon: <FaHome size={40} />, title: 'Residential', desc: 'Home rooftop solar cleaning from ₹499', link: '/book' },
    { icon: <FaBuilding size={40} />, title: 'Housing Societies', desc: 'Bulk AMC plans for RWAs with group discounts', link: '/amc' },
    { icon: <FaIndustry size={40} />, title: 'Commercial & Industrial', desc: 'Large-scale cleaning for factories and offices', link: '/book' },
    { icon: <FaLeaf size={40} />, title: 'Eco Cleaning', desc: 'Water-efficient, biodegradable solutions', link: '/book' },
  ];

  const amcPlans = [
    { name: 'Basic', visits: 2, price: 1599, features: ['2 cleanings/year', 'Pre & Post Monsoon', 'Standard cleaning', 'WhatsApp reminders'] },
    { name: 'Standard', visits: 4, price: 2999, features: ['4 cleanings/year', 'Quarterly visits', 'Visual inspection', 'Efficiency check', 'Priority scheduling'], featured: true },
    { name: 'Premium', visits: 6, price: 4999, features: ['6 cleanings/year', 'Bi-monthly visits', 'Thermal imaging included', 'Detailed health report', 'Priority support', 'Free bird mesh inspection'] },
  ];

  return (
    <>
      <Head>
        <title>SuryaClean — Solar Panel Cleaning in Faridabad | Book Online</title>
        <meta name="description" content="Professional solar panel cleaning service in Faridabad. Book online, pay via UPI. Increase solar output by 15-30%. Insured, trained workers. Free demo available." />
      </Head>

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1>Your Solar Panels Deserve <span>SuryaClean</span></h1>
          <p>
            Dirty panels lose 15-30% power. We make them shine — professional, insured, app-based cleaning for your home or business in Faridabad & NCR. Book in 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn-primary" style={{ fontSize: '18px', padding: '16px 36px' }}>
              Book Free Demo <FaArrowRight style={{ marginLeft: '8px', display: 'inline' }} />
            </Link>
            <a href="#pricing" className="btn-secondary" style={{ fontSize: '18px', padding: '16px 36px', color: 'white', borderColor: 'white' }}>
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '40px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: '20px' }}>
                <div style={{ color: '#F5A623', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#1B2A4A' }}>{s.value}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2>How It Works</h2>
          <p className="subtitle">From booking to a sparkling clean system — in 3 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { step: '1', icon: <FaMobileAlt size={48} />, title: 'Book in 60 Seconds', desc: 'Choose service, enter address, pick a time slot. Pay via UPI, card, or cash.' },
              { step: '2', icon: <FaShieldAlt size={48} />, title: 'We Clean Safely', desc: 'Trained, insured workers arrive with professional water-fed pole equipment. GPS-tracked visit.' },
              { step: '3', icon: <FaStar size={48} />, title: 'See the Difference', desc: 'Get before/after photos on WhatsApp. Watch your solar generation improve immediately.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: '#F5A623', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ background: '#F5A623', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 700 }}>{item.step}</div>
                <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services" style={{ background: '#f9fafb' }}>
        <div className="container">
          <h2>Our Services</h2>
          <p className="subtitle">Professional cleaning for every type of solar installation</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {services.map((s, i) => (
              <Link href={s.link} key={i} className="card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'transform 0.2s' }}>
                <div style={{ color: '#F5A623', marginBottom: '12px' }}>{s.icon}</div>
                <h3 style={{ marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING - AMC */}
      <section className="section" id="pricing">
        <div className="container">
          <h2>AMC Plans — Best Value</h2>
          <p className="subtitle">Save up to 17% vs one-time cleaning. Prices for 3-5 kW systems.</p>
          <div className="pricing-grid">
            {amcPlans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <h3>{plan.name}</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>{plan.visits} visits/year</p>
                <div className="price">₹{plan.price.toLocaleString()}<small>/year</small></div>
                <p style={{ color: '#666', fontSize: '13px', marginTop: '-8px' }}>₹{Math.round(plan.price/12).toLocaleString()}/month</p>
                <ul>
                  {plan.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <Link href={user ? '/amc' : '#'} onClick={!user ? login : undefined} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                  {user ? 'Subscribe Now' : 'Login to Subscribe'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONE-TIME PRICING */}
      <section className="section" style={{ background: '#f9fafb' }}>
        <div className="container">
          <h2>One-Time Cleaning</h2>
          <p className="subtitle">Need a single clean? We've got you covered.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: '1-2 kW (Small Home)', panels: '3-6 panels', price: 499 },
              { label: '3-5 kW (Standard)', panels: '9-15 panels', price: 899 },
              { label: '6-10 kW (Large Home)', panels: '18-30 panels', price: 1499 },
              { label: '10+ kW (Villa)', panels: '30+ panels', price: 2499 },
            ].map((tier, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{tier.label}</h4>
                <p style={{ color: '#888', fontSize: '13px' }}>{tier.panels}</p>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#F5A623', margin: '12px 0' }}>₹{tier.price}</div>
                <Link href="/book" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: '14px' }}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Why Trust SuryaClean?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {[
              { icon: <FaShieldAlt size={36} />, title: '100% Insured', desc: 'Full damage & liability coverage' },
              { icon: <FaMobileAlt size={36} />, title: 'App-Based', desc: 'Book, track, pay — all from your phone' },
              { icon: <FaLeaf size={36} />, title: 'Water-Efficient', desc: 'Uses 80% less water than traditional methods' },
              { icon: <FaStar size={36} />, title: 'Verified Workers', desc: 'Police-verified, trained, uniformed staff' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: '#F5A623', marginBottom: '12px' }}>{item.icon}</div>
                <h4 style={{ marginBottom: '6px' }}>{item.title}</h4>
                <p style={{ color: '#666', fontSize: '13px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #F5A623, #e8951a)', padding: '60px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Ready to Boost Your Solar Output?</h2>
          <p style={{ fontSize: '18px', marginBottom: '24px', opacity: 0.95 }}>First demo clean is FREE. No payment, no commitment.</p>
          <Link href="/book" style={{ background: 'white', color: '#F5A623', padding: '16px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
            Book Free Demo Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1B2A4A', color: 'white', padding: '48px 0 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ color: '#F5A623', marginBottom: '12px' }}>SuryaClean</h3>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>Professional solar panel cleaning in Faridabad, Ballabgarh, Palwal, and NCR. Insured, trained, tech-enabled.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '12px' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <Link href="/book" style={{ color: '#ccc', textDecoration: 'none' }}>Book Cleaning</Link>
                <Link href="/amc" style={{ color: '#ccc', textDecoration: 'none' }}>AMC Plans</Link>
                <Link href="/dashboard" style={{ color: '#ccc', textDecoration: 'none' }}>My Account</Link>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '12px' }}>Contact</h4>
              <div style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.8 }}>
                <p>📍 Faridabad, Haryana 121001</p>
                <p>📞 +91 98765 43210</p>
                <p>📧 hello@suryaclean.in</p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', textAlign: 'center', fontSize: '13px', opacity: 0.6 }}>
            © 2026 SuryaClean. All rights reserved. Made with ☀️ in Faridabad.
          </div>
        </div>
      </footer>
    </>
  );
}