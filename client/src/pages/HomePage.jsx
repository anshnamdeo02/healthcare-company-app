import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import iiita from './images/iiita.png';
import united from './images/united.png';
import asian from './images/asian.png';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bg-light via-white to-emerald-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Trusted Healthcare Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
                Your Health,{' '}
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="mt-4 text-lg text-text-secondary leading-relaxed max-w-lg">
                Experience seamless healthcare with our integrated platform connecting patients with verified doctors. Book consultations, track prescriptions, and manage your health journey — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/patient/signup" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                  Register as Patient
                </Link>
                <Link to="/doctor/signup" className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                  Register as Doctor
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>24/7 Access</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary to-teal-400 rounded-full opacity-20 blur-3xl absolute -top-4 -left-4" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Health Dashboard</p>
                      <p className="text-xs text-text-secondary">Track your wellness journey</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Heart Rate</span>
                      <span className="text-sm font-semibold text-success">72 bpm</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Blood Pressure</span>
                      <span className="text-sm font-semibold text-blue-600">120/80</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Next Follow-up</span>
                      <span className="text-sm font-semibold text-purple-600">Mar 10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
              Transforming Healthcare with Technology
            </h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              We are a healthcare technology company committed to bridging the gap between patients and quality medical care through innovative digital solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-bg-light to-white border border-teal-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Who We Are</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                A pioneering healthcare startup leveraging cutting-edge technology to deliver comprehensive healthcare services. Our platform connects patients with verified, experienced doctors, ensuring quality care is accessible to all.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Our Vision</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                To become the leading digital healthcare platform in India, making quality healthcare universally accessible regardless of geography, economic status, or social standing. We envision a world where every individual can access timely and effective medical care.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Our Mission</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                To empower patients with digital tools for managing their health journey, to provide doctors with a secure platform for delivering care, and to ensure the highest standards of data privacy and medical ethics in every interaction.
              </p>
            </div>
          </div>
          {/* Healthcare Services Overview */}
          <div className="mt-14 bg-gradient-to-r from-primary to-teal-500 rounded-2xl p-8 sm:p-10 text-white">
            <h3 className="text-2xl font-bold mb-6">Healthcare Services Overview</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🏥', title: 'Online Consultations', desc: 'Connect with specialists from the comfort of your home' },
                { icon: '📋', title: 'Digital Prescriptions', desc: 'Access and manage all your prescriptions digitally' },
                { icon: '📊', title: 'Health Tracking', desc: 'Monitor symptoms, follow-ups, and progress over time' },
                { icon: '🔒', title: 'Secure Records', desc: 'AES-encrypted data with role-based access control' },
              ].map((service) => (
                <div key={service.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h4 className="font-semibold mb-1">{service.title}</h4>
                  <p className="text-sm text-white/80">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
              Comprehensive Healthcare Solutions
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🩺', title: 'General Medicine', desc: 'Comprehensive primary care and routine health checkups by experienced physicians.' },
              { icon: '🫀', title: 'Cardiology', desc: 'Heart health monitoring, diagnostics, and specialized cardiac care services.' },
              { icon: '🧠', title: 'Neurology', desc: 'Expert neurological assessments, treatments, and ongoing care management.' },
              { icon: '🦴', title: 'Orthopedics', desc: 'Musculoskeletal care, rehabilitation programs, and surgical consultations.' },
              { icon: '👶', title: 'Pediatrics', desc: 'Dedicated child healthcare with growth tracking and developmental assessments.' },
              { icon: '🧬', title: 'Diagnostics', desc: 'Advanced lab tests, imaging services, and AI-assisted diagnostic reports.' },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported By Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Supported By</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
              Our Trusted Partners & Supporters
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Indian Institute of Information Technology, Allahabad', img: iiita, desc: 'Premier institution for IT and research excellence', color: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
              { name: 'Startup & Incubation Cell, United University', img: united, desc: 'Fostering innovation and entrepreneurship', color: 'from-amber-50 to-orange-50', border: 'border-amber-100' },
              { name: 'Asian Institute of Technology', img: asian, desc: 'International center for technology education', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-100' },
            ].map((partner) => (
              <div key={partner.name} className={`bg-gradient-to-br ${partner.color} border ${partner.border} rounded-2xl p-8 text-center hover:shadow-lg transition-shadow`}>
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-5">
                  <img src={partner.img} alt={partner.name} className="w-14 h-14 object-contain" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{partner.name}</h3>
                <p className="text-text-secondary text-sm">{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contact Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
              Get in Touch
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-text-primary mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Office Address</p>
                      <p className="text-text-secondary text-sm">IIIT Allahabad Incubation Centre (IIIC),<br />Devghat, Jhalwa,<br />Prayagraj, Uttar Pradesh — 211015, India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Email</p>
                      <p className="text-text-secondary text-sm">info.curelex@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Phone</p>
                      <p className="text-text-secondary text-sm">+91-7880-894345</p>
                    </div>
                  </div>
                </div>
                {/* Social Media Handles */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-semibold text-text-primary text-sm mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    <a href="https://www.linkedin.com/company/curelex-healthtech/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://www.youtube.com/@curelexofficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C15.9 5 12 5 12 5h0s-3.9 0-6 .1c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S3 9.6 3 11.3v1.4C3 14.4 3.1 16 3.1 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.1 5.7.1 5.7.1s3.9 0 6-.1c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.1-1.6.1-3.3v-1.4C22 9.6 21.8 8 21.8 8zM10 14.7V9.3l5 2.7-5 2.7z"/></svg>
                    </a>
                    <a href="https://www.instagram.com/curelexofficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href="https://whatsapp.com/channel/0029Vb6h5rD90x2oWxVpiF1N" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.98.52 3.91 1.52 5.6L2 22l4.63-1.61a9.86 9.86 0 0 0 5.41 1.57h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.77 14.23c-.24.68-1.39 1.3-1.92 1.36-.49.06-1.1.09-1.77-.13-.41-.13-.94-.31-1.62-.6-2.86-1.23-4.73-4.12-4.88-4.32-.15-.2-1.16-1.55-1.16-2.96 0-1.41.74-2.1 1-2.39.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.66.51.24.59.81 2.04.88 2.19.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.17-.32.38-.46.51-.15.15-.31.31-.13.6.18.29.8 1.32 1.72 2.13 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.2.78-.91.99-1.22.21-.31.42-.26.7-.16.29.1 1.83.86 2.14 1.01.31.15.52.23.6.36.08.13.08.75-.16 1.43z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps?q=IIIT+Allahabad+Incubation+Centre,+Devghat,+Jhalwa,+Prayagraj,+Uttar+Pradesh+211015,+India&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}