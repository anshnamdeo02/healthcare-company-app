import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Curelex</span>
            </div>
            <p className="text-sm leading-relaxed">
              Delivering quality healthcare solutions powered by technology. Making healthcare accessible, affordable, and efficient for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="/#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><Link to="/patient/signup" className="hover:text-primary transition-colors">Patient Registration</Link></li>
              <li><Link to="/doctor/signup" className="hover:text-primary transition-colors">Doctor Registration</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
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
            <div className="mt-4 text-sm">
              <p>📧 info.curelex@gmail.com</p>
              <p>📞 +91-7880-894345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HealthCare Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
